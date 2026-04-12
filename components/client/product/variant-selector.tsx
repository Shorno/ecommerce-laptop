"use client"

import {useState, useEffect, useMemo} from "react"
import {cn} from "@/lib/utils"

interface VariantOption {
    name: string
    values: string[]
}

interface VariantItem {
    id: number
    price: string
    stock: number
    inStock: boolean
    optionValues: Record<string, string> | null
}

export interface SelectedVariant {
    id: number
    price: string
    stock: number
    inStock: boolean
    label: string
}

interface VariantSelectorProps {
    options: VariantOption[]
    variants: VariantItem[]
    onVariantChange: (variant: SelectedVariant | null) => void
}

export default function VariantSelector({options, variants, onVariantChange}: VariantSelectorProps) {
    // Initialize selections with first option value for each option
    const [selections, setSelections] = useState<Record<string, string>>(() => {
        const initial: Record<string, string> = {}
        options.forEach(opt => {
            if (opt.values.length > 0) {
                initial[opt.name] = opt.values[0]
            }
        })
        return initial
    })

    // Find the matching variant for the current selection
    const matchedVariant = useMemo(() => {
        if (options.length === 0) {
            // No options — return the default variant
            return variants[0] || null
        }

        return variants.find(v => {
            if (!v.optionValues) return false
            const parsed = typeof v.optionValues === "string"
                ? (() => { try { return JSON.parse(v.optionValues as string) } catch { return {} } })()
                : v.optionValues

            return options.every(opt => parsed[opt.name] === selections[opt.name])
        }) || null
    }, [selections, variants, options])

    // Notify parent when variant changes
    useEffect(() => {
        if (matchedVariant) {
            const optVals = matchedVariant.optionValues
                ? typeof matchedVariant.optionValues === "string"
                    ? (() => { try { return JSON.parse(matchedVariant.optionValues as string) } catch { return {} } })()
                    : matchedVariant.optionValues
                : {}
            const label = Object.values(optVals).join(" / ") || "Default"

            onVariantChange({
                id: matchedVariant.id,
                price: matchedVariant.price,
                stock: matchedVariant.stock,
                inStock: matchedVariant.inStock,
                label,
            })
        } else {
            onVariantChange(null)
        }
    }, [matchedVariant]) // eslint-disable-line react-hooks/exhaustive-deps

    // Check if a specific option value combination has an available variant
    const isValueAvailable = (optionName: string, optionValue: string): { exists: boolean; inStock: boolean } => {
        const testSelections = {...selections, [optionName]: optionValue}

        const matching = variants.find(v => {
            if (!v.optionValues) return false
            const parsed = typeof v.optionValues === "string"
                ? (() => { try { return JSON.parse(v.optionValues as string) } catch { return {} } })()
                : v.optionValues

            return options.every(opt => parsed[opt.name] === testSelections[opt.name])
        })

        return {
            exists: !!matching,
            inStock: matching?.inStock ?? false,
        }
    }

    const handleSelect = (optionName: string, value: string) => {
        setSelections(prev => ({...prev, [optionName]: value}))
    }

    if (options.length === 0) return null

    return (
        <div className="space-y-4">
            {options.map(option => (
                <div key={option.name} className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                        {option.name}:
                        <span className="ml-1.5 font-normal text-muted-foreground">
                            {selections[option.name]}
                        </span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {option.values.map(value => {
                            const isSelected = selections[option.name] === value
                            const {exists, inStock} = isValueAvailable(option.name, value)
                            const isDisabled = !exists

                            return (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => !isDisabled && handleSelect(option.name, value)}
                                    disabled={isDisabled}
                                    className={cn(
                                        "px-4 py-2 text-sm rounded-md border transition-all duration-150",
                                        "hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                        isSelected && "border-primary bg-primary/5 text-primary font-medium ring-1 ring-primary/30",
                                        !isSelected && !isDisabled && "border-border bg-background text-foreground",
                                        isDisabled && "opacity-40 cursor-not-allowed line-through border-border/50",
                                        !inStock && exists && !isSelected && "opacity-60 border-dashed",
                                    )}
                                >
                                    {value}
                                    {!inStock && exists && (
                                        <span className="ml-1 text-[10px] text-destructive">(Out)</span>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>
            ))}
        </div>
    )
}
