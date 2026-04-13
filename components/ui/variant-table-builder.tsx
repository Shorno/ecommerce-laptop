"use client"

import {useState, useCallback} from "react"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {Switch} from "@/components/ui/switch"
import {Label} from "@/components/ui/label"
import {Plus, Trash2, Wand2, RotateCcw} from "lucide-react"
import {ProductOptionData} from "./product-option-builder"

export interface VariantData {
    sku: string
    price: string
    stock: number
    inStock: boolean
    optionValues: Record<string, string>
    priceOverridden?: boolean
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

/**
 * Get the "price group key" for a variant — built from only price-affecting option values.
 * Variants in the same price group share the same price.
 */
function getPriceGroupKey(optionValues: Record<string, string>, options: ProductOptionData[]): string {
    const priceAffectingOptions = options.filter(o => o.affectsPrice && o.name)
    if (priceAffectingOptions.length === 0) return "__all__"
    return priceAffectingOptions
        .map(o => `${o.name}=${optionValues[o.name] || ""}`)
        .sort()
        .join("|")
}

export default function VariantTableBuilder({value, onChange, options}: VariantTableBuilderProps) {
    const validOptions = options.filter(o => o.name && o.values.length > 0)
    const hasOptions = validOptions.length > 0
    const hasNonPricingOptions = options.some(o => !o.affectsPrice && o.name && o.values.length > 0)

    // Base price & stock
    const [basePrice, setBasePrice] = useState<string>(() => {
        if (value.length === 0) return ""
        const priceCounts: Record<string, number> = {}
        value.forEach(v => { if (v.price) priceCounts[v.price] = (priceCounts[v.price] || 0) + 1 })
        const sorted = Object.entries(priceCounts).sort((a, b) => b[1] - a[1])
        return sorted.length > 0 ? sorted[0][0] : ""
    })

    const [baseStock, setBaseStock] = useState<number>(() => {
        if (value.length === 0) return 0
        const stockCounts: Record<number, number> = {}
        value.forEach(v => { stockCounts[v.stock] = (stockCounts[v.stock] || 0) + 1 })
        const sorted = Object.entries(stockCounts).sort((a, b) => Number(b[1]) - Number(a[1]))
        return sorted.length > 0 ? Number(sorted[0][0]) : 0
    })

    const handleBasePriceChange = useCallback((newPrice: string) => {
        setBasePrice(newPrice)
        if (value.length > 0) {
            onChange(value.map(v => v.priceOverridden ? v : {...v, price: newPrice}))
        }
    }, [value, onChange])

    const handleBaseStockChange = useCallback((newStock: number) => {
        const oldBaseStock = baseStock
        setBaseStock(newStock)
        if (value.length > 0) {
            onChange(value.map(v => v.stock === oldBaseStock ? {...v, stock: newStock} : v))
        }
    }, [value, onChange, baseStock])

    const handleGenerateAll = () => {
        const combos = generateCombinations(options)
        const newVariants: VariantData[] = combos.map(optionValues => {
            const existing = value.find(v =>
                JSON.stringify(v.optionValues) === JSON.stringify(optionValues)
            )
            if (existing) return existing
            return {
                sku: "",
                price: basePrice,
                stock: baseStock,
                inStock: true,
                optionValues,
                priceOverridden: false,
            }
        })
        onChange(newVariants)
    }

    const addVariant = () => {
        const optionValues: Record<string, string> = {}
        validOptions.forEach(o => { optionValues[o.name] = o.values[0] || "" })
        onChange([...value, {
            sku: "",
            price: basePrice,
            stock: baseStock,
            inStock: true,
            optionValues,
            priceOverridden: false,
        }])
    }

    const removeVariant = (index: number) => {
        if (value.length <= 1) return
        onChange(value.filter((_, i) => i !== index))
    }

    const updateVariant = (index: number, field: keyof VariantData, val: unknown) => {
        const updated = [...value]

        if (field === "price") {
            const newPrice = val as string
            updated[index] = {...updated[index], price: newPrice, priceOverridden: true}

            // Auto-sync price to all variants in the same price group
            if (hasNonPricingOptions) {
                const editedVariant = updated[index]
                const editedGroupKey = getPriceGroupKey(editedVariant.optionValues, options)

                for (let i = 0; i < updated.length; i++) {
                    if (i === index) continue
                    const groupKey = getPriceGroupKey(updated[i].optionValues, options)
                    if (groupKey === editedGroupKey) {
                        updated[i] = {...updated[i], price: newPrice, priceOverridden: true}
                    }
                }
            }
        } else {
            updated[index] = {...updated[index], [field]: val}
        }

        onChange(updated)
    }

    const resetPriceToBase = (index: number) => {
        const updated = [...value]
        updated[index] = {...updated[index], price: basePrice, priceOverridden: false}
        onChange(updated)
    }

    const resetAllPricesToBase = () => {
        onChange(value.map(v => ({...v, price: basePrice, priceOverridden: false})))
    }

    const updateOptionValue = (variantIndex: number, optionName: string, optionValue: string) => {
        const updated = [...value]
        updated[variantIndex] = {
            ...updated[variantIndex],
            optionValues: {...updated[variantIndex].optionValues, [optionName]: optionValue}
        }
        onChange(updated)
    }

    const overriddenCount = value.filter(v => v.priceOverridden).length

    // If no variants exist, add a default one
    if (value.length === 0) {
        onChange([{
            sku: "",
            price: basePrice,
            stock: baseStock,
            inStock: true,
            optionValues: {},
            priceOverridden: false,
        }])
        return null
    }

    return (
        <div className="space-y-4">
            {/* ─── Base Price & Stock ─── */}
            <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-4">
                <div className="flex items-center gap-2 mb-3">
                    <div className="h-2 w-2 rounded-full bg-primary"/>
                    <Label className="text-sm font-semibold">Base Defaults</Label>
                    <span className="text-xs text-muted-foreground">
                        — applied to all variants unless individually overridden
                    </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Base Price (৳)</Label>
                        <Input
                            type="text"
                            value={basePrice}
                            onChange={(e) => handleBasePriceChange(e.target.value)}
                            placeholder="e.g. 125000"
                            className="h-9"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Default Stock</Label>
                        <Input
                            type="number"
                            value={baseStock}
                            onChange={(e) => handleBaseStockChange(parseInt(e.target.value) || 0)}
                            placeholder="0"
                            className="h-9"
                        />
                    </div>
                </div>

                {hasNonPricingOptions && (
                    <p className="text-[11px] text-muted-foreground mt-3 pt-2 border-t border-primary/15">
                        💡 Options without "Affects pricing" will share price automatically — editing one updates all in the group.
                    </p>
                )}

                {overriddenCount > 0 && (
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-primary/20">
                        <span className="text-xs text-muted-foreground">
                            {overriddenCount} variant{overriddenCount !== 1 ? "s" : ""} with custom price
                        </span>
                        <Button
                            type="button" variant="ghost" size="sm"
                            className="h-7 text-xs gap-1 text-primary hover:text-primary"
                            onClick={resetAllPricesToBase}
                        >
                            <RotateCcw className="w-3 h-3"/>
                            Reset all to base
                        </Button>
                    </div>
                )}
            </div>

            {/* ─── Action bar ─── */}
            <div className="flex items-center gap-2 flex-wrap">
                {hasOptions && (
                    <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={handleGenerateAll}>
                        <Wand2 className="w-3.5 h-3.5"/>
                        Generate All Combinations
                    </Button>
                )}
                <span className="text-xs text-muted-foreground ml-auto">
                    {value.length} variant{value.length !== 1 ? "s" : ""}
                </span>
            </div>

            {/* ─── Variant table ─── */}
            <div className="border rounded-lg overflow-hidden">
                {/* Header */}
                <div className="grid gap-2 px-3 py-2 bg-muted/50 text-xs font-medium text-muted-foreground"
                     style={{
                         gridTemplateColumns: `${hasOptions ? validOptions.map(() => "1fr").join(" ") + " " : ""}minmax(100px,1fr) 80px 80px 50px 32px`
                     }}>
                    {validOptions.map(o => (
                        <div key={o.name} className="flex items-center gap-1">
                            {o.name}
                            {!o.affectsPrice && (
                                <span className="text-[9px] text-muted-foreground/60" title="Does not affect price">
                                    (same $)
                                </span>
                            )}
                        </div>
                    ))}
                    <div>Price (৳)</div>
                    <div>Stock</div>
                    <div>SKU</div>
                    <div>Active</div>
                    <div></div>
                </div>

                {/* Rows */}
                {value.map((variant, index) => {
                    const isOverridden = variant.priceOverridden && variant.price !== basePrice
                    return (
                        <div key={index}
                             className={`grid gap-2 px-3 py-2 border-t items-center ${isOverridden ? "bg-amber-50/50 dark:bg-amber-950/10" : ""}`}
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

                            {/* Price — with override indicator */}
                            <div className="relative">
                                <Input
                                    type="text"
                                    value={variant.price}
                                    onChange={(e) => updateVariant(index, "price", e.target.value)}
                                    placeholder={basePrice || "0.00"}
                                    className={`h-8 text-sm ${isOverridden ? "border-amber-400 pr-7" : ""}`}
                                />
                                {isOverridden && (
                                    <button
                                        type="button"
                                        onClick={() => resetPriceToBase(index)}
                                        className="absolute right-1.5 top-1/2 -translate-y-1/2 text-amber-500 hover:text-amber-700 transition-colors"
                                        title="Reset to base price"
                                    >
                                        <RotateCcw className="w-3 h-3"/>
                                    </button>
                                )}
                            </div>

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
                    )
                })}
            </div>

            {/* Add variant button */}
            <Button type="button" variant="outline" size="sm" className="w-full gap-1.5" onClick={addVariant}>
                <Plus className="w-4 h-4"/>
                Add Variant
            </Button>
        </div>
    )
}
