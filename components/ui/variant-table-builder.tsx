"use client"

import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {Switch} from "@/components/ui/switch"
import {Plus, Trash2, Wand2} from "lucide-react"
import {ProductOptionData} from "./product-option-builder"

export interface VariantData {
    sku: string
    price: string
    stock: number
    inStock: boolean
    optionValues: Record<string, string>
}

interface VariantTableBuilderProps {
    value: VariantData[]
    onChange: (value: VariantData[]) => void
    options: ProductOptionData[]
}

function generateCombinations(options: ProductOptionData[]): Record<string, string>[] {
    const validOptions = options.filter(o => o.name && o.values.length > 0)
    if (validOptions.length === 0) return [{}]

    const result: Record<string, string>[] = []

    function recurse(index: number, current: Record<string, string>) {
        if (index === validOptions.length) {
            result.push({...current})
            return
        }
        const option = validOptions[index]
        for (const val of option.values) {
            recurse(index + 1, {...current, [option.name]: val})
        }
    }

    recurse(0, {})
    return result
}

function getVariantLabel(optionValues: Record<string, string>): string {
    const values = Object.values(optionValues)
    return values.length > 0 ? values.join(" / ") : "Default"
}

export default function VariantTableBuilder({value, onChange, options}: VariantTableBuilderProps) {
    const validOptions = options.filter(o => o.name && o.values.length > 0)
    const hasOptions = validOptions.length > 0

    const handleGenerateAll = () => {
        const combos = generateCombinations(options)
        const newVariants: VariantData[] = combos.map(optionValues => {
            // Try to preserve existing variant data if option values match
            const existing = value.find(v =>
                JSON.stringify(v.optionValues) === JSON.stringify(optionValues)
            )
            if (existing) return existing
            return {
                sku: "",
                price: "",
                stock: 0,
                inStock: true,
                optionValues,
            }
        })
        onChange(newVariants)
    }

    const addVariant = () => {
        const optionValues: Record<string, string> = {}
        validOptions.forEach(o => {
            optionValues[o.name] = o.values[0] || ""
        })
        onChange([...value, {
            sku: "",
            price: "",
            stock: 0,
            inStock: true,
            optionValues,
        }])
    }

    const removeVariant = (index: number) => {
        if (value.length <= 1) return // Must have at least 1 variant
        onChange(value.filter((_, i) => i !== index))
    }

    const updateVariant = (index: number, field: keyof VariantData, val: unknown) => {
        const updated = [...value]
        updated[index] = {...updated[index], [field]: val}
        onChange(updated)
    }

    const updateOptionValue = (variantIndex: number, optionName: string, optionValue: string) => {
        const updated = [...value]
        updated[variantIndex] = {
            ...updated[variantIndex],
            optionValues: {...updated[variantIndex].optionValues, [optionName]: optionValue}
        }
        onChange(updated)
    }

    const handleBulkPrice = () => {
        const price = prompt("Enter price to apply to all variants:")
        if (!price) return
        onChange(value.map(v => ({...v, price})))
    }

    // If no variants exist, add a default one
    if (value.length === 0) {
        const defaultVariant: VariantData = {
            sku: "",
            price: "",
            stock: 0,
            inStock: true,
            optionValues: {},
        }
        onChange([defaultVariant])
        return null
    }

    return (
        <div className="space-y-3">
            {/* Action bar */}
            <div className="flex items-center gap-2 flex-wrap">
                {hasOptions && (
                    <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={handleGenerateAll}>
                        <Wand2 className="w-3.5 h-3.5"/>
                        Generate All Combinations
                    </Button>
                )}
                <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={handleBulkPrice}>
                    Bulk Set Price
                </Button>
                <span className="text-xs text-muted-foreground ml-auto">
                    {value.length} variant{value.length !== 1 ? "s" : ""}
                </span>
            </div>

            {/* Variant rows */}
            <div className="border rounded-lg overflow-hidden">
                {/* Header */}
                <div className="grid gap-2 px-3 py-2 bg-muted/50 text-xs font-medium text-muted-foreground"
                     style={{
                         gridTemplateColumns: `${hasOptions ? validOptions.map(() => "1fr").join(" ") + " " : ""}minmax(100px,1fr) 80px 80px 50px 32px`
                     }}>
                    {validOptions.map(o => (
                        <div key={o.name}>{o.name}</div>
                    ))}
                    <div>Price (৳)</div>
                    <div>Stock</div>
                    <div>SKU</div>
                    <div>Active</div>
                    <div></div>
                </div>

                {/* Rows */}
                {value.map((variant, index) => (
                    <div key={index}
                         className="grid gap-2 px-3 py-2 border-t items-center"
                         style={{
                             gridTemplateColumns: `${hasOptions ? validOptions.map(() => "1fr").join(" ") + " " : ""}minmax(100px,1fr) 80px 80px 50px 32px`
                         }}>
                        {/* Option value selects */}
                        {validOptions.map(o => (
                            <select
                                key={o.name}
                                value={variant.optionValues[o.name] || ""}
                                onChange={(e) => updateOptionValue(index, o.name, e.target.value)}
                                className="h-8 rounded-md border border-input bg-background px-2 text-sm"
                            >
                                {o.values.map(v => (
                                    <option key={v} value={v}>{v}</option>
                                ))}
                            </select>
                        ))}

                        {/* Price */}
                        <Input
                            type="text"
                            value={variant.price}
                            onChange={(e) => updateVariant(index, "price", e.target.value)}
                            placeholder="0.00"
                            className="h-8 text-sm"
                        />

                        {/* Stock */}
                        <Input
                            type="number"
                            value={variant.stock}
                            onChange={(e) => updateVariant(index, "stock", parseInt(e.target.value) || 0)}
                            placeholder="0"
                            className="h-8 text-sm"
                        />

                        {/* SKU */}
                        <Input
                            type="text"
                            value={variant.sku}
                            onChange={(e) => updateVariant(index, "sku", e.target.value)}
                            placeholder="SKU"
                            className="h-8 text-sm"
                        />

                        {/* In Stock toggle */}
                        <div className="flex justify-center">
                            <Switch
                                checked={variant.inStock}
                                onCheckedChange={(checked) => updateVariant(index, "inStock", checked)}
                            />
                        </div>

                        {/* Remove */}
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => removeVariant(index)}
                            disabled={value.length <= 1}
                        >
                            <Trash2 className="w-3.5 h-3.5"/>
                        </Button>
                    </div>
                ))}
            </div>

            {/* Add variant button */}
            <Button type="button" variant="outline" size="sm" className="w-full gap-1.5" onClick={addVariant}>
                <Plus className="w-4 h-4"/>
                Add Variant
            </Button>
        </div>
    )
}
