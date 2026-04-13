"use client"

import {Plus, Trash2, X, DollarSign} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Badge} from "@/components/ui/badge"
import {Switch} from "@/components/ui/switch"
import {Label} from "@/components/ui/label"
import {useState} from "react"

export interface ProductOptionData {
    name: string
    values: string[]
    position: number
    /** If true (default), this option creates different price points. If false, all values share the same price. */
    affectsPrice: boolean
}

interface ProductOptionBuilderProps {
    value: ProductOptionData[]
    onChange: (value: ProductOptionData[]) => void
    maxOptions?: number
}

export default function ProductOptionBuilder({value, onChange, maxOptions = 3}: ProductOptionBuilderProps) {
    const [newValues, setNewValues] = useState<Record<number, string>>({})

    const addOption = () => {
        if (value.length >= maxOptions) return
        onChange([...value, {name: "", values: [], position: value.length, affectsPrice: true}])
    }

    const removeOption = (index: number) => {
        onChange(value.filter((_, i) => i !== index).map((opt, i) => ({...opt, position: i})))
    }

    const updateOptionName = (index: number, name: string) => {
        const updated = [...value]
        updated[index] = {...updated[index], name}
        onChange(updated)
    }

    const toggleAffectsPrice = (index: number, checked: boolean) => {
        const updated = [...value]
        updated[index] = {...updated[index], affectsPrice: checked}
        onChange(updated)
    }

    const addValue = (optionIndex: number) => {
        const val = (newValues[optionIndex] || "").trim()
        if (!val) return
        if (value[optionIndex].values.includes(val)) return

        const updated = [...value]
        updated[optionIndex] = {
            ...updated[optionIndex],
            values: [...updated[optionIndex].values, val]
        }
        onChange(updated)
        setNewValues({...newValues, [optionIndex]: ""})
    }

    const removeValue = (optionIndex: number, valueIndex: number) => {
        const updated = [...value]
        updated[optionIndex] = {
            ...updated[optionIndex],
            values: updated[optionIndex].values.filter((_, i) => i !== valueIndex)
        }
        onChange(updated)
    }

    const handleValueKeyDown = (e: React.KeyboardEvent, optionIndex: number) => {
        if (e.key === "Enter") {
            e.preventDefault()
            addValue(optionIndex)
        }
    }

    return (
        <div className="space-y-4">
            {value.map((option, optionIndex) => (
                <div key={optionIndex} className="border rounded-lg p-4 space-y-3 bg-muted/20">
                    <div className="flex items-center gap-2">
                        <Input
                            value={option.name}
                            onChange={(e) => updateOptionName(optionIndex, e.target.value)}
                            placeholder="Option name (e.g. RAM / Storage, Color)"
                            className="h-9 text-sm font-medium"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive flex-shrink-0"
                            onClick={() => removeOption(optionIndex)}
                        >
                            <Trash2 className="w-4 h-4"/>
                        </Button>
                    </div>

                    {/* Affects pricing toggle */}
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <DollarSign className={`h-3.5 w-3.5 ${option.affectsPrice ? "text-green-600" : "text-muted-foreground"}`}/>
                            <Label className="text-xs cursor-pointer select-none" htmlFor={`affects-price-${optionIndex}`}>
                                Affects pricing
                            </Label>
                        </div>
                        <div className="flex items-center gap-2">
                            {!option.affectsPrice && (
                                <span className="text-[10px] text-muted-foreground">
                                    All values share same price
                                </span>
                            )}
                            <Switch
                                id={`affects-price-${optionIndex}`}
                                checked={option.affectsPrice}
                                onCheckedChange={(checked) => toggleAffectsPrice(optionIndex, checked)}
                            />
                        </div>
                    </div>

                    {/* Existing values as badges */}
                    {option.values.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {option.values.map((val, valueIndex) => (
                                <Badge key={valueIndex} variant="secondary" className="gap-1 pr-1 text-xs">
                                    {val}
                                    <button
                                        type="button"
                                        onClick={() => removeValue(optionIndex, valueIndex)}
                                        className="ml-0.5 rounded-full hover:bg-destructive/20 p-0.5"
                                    >
                                        <X className="w-3 h-3"/>
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    )}

                    {/* Add new value input */}
                    <div className="flex items-center gap-2">
                        <Input
                            value={newValues[optionIndex] || ""}
                            onChange={(e) => setNewValues({...newValues, [optionIndex]: e.target.value})}
                            onKeyDown={(e) => handleValueKeyDown(e, optionIndex)}
                            placeholder="Type a value and press Enter (e.g. 16GB/512GB)"
                            className="h-8 text-sm"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 px-3 flex-shrink-0"
                            onClick={() => addValue(optionIndex)}
                        >
                            Add
                        </Button>
                    </div>
                </div>
            ))}

            {value.length < maxOptions && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full gap-1.5"
                    onClick={addOption}
                >
                    <Plus className="w-4 h-4"/>
                    Add Option {value.length > 0 && `(${value.length}/${maxOptions})`}
                </Button>
            )}
        </div>
    )
}
