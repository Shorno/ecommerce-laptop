"use client"

import {Plus, Trash2} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"

export interface KeyFeature {
    label: string
    value: string
}

interface KeyFeaturesBuilderProps {
    value: KeyFeature[]
    onChange: (value: KeyFeature[]) => void
}

export default function KeyFeaturesBuilder({value, onChange}: KeyFeaturesBuilderProps) {
    const addFeature = () => {
        onChange([...value, {label: "", value: ""}])
    }

    const removeFeature = (index: number) => {
        onChange(value.filter((_, i) => i !== index))
    }

    const updateFeature = (index: number, field: "label" | "value", val: string) => {
        const updated = [...value]
        updated[index] = {...updated[index], [field]: val}
        onChange(updated)
    }

    return (
        <div className="space-y-2">
            {value.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                    <Input
                        value={feature.label}
                        onChange={(e) => updateFeature(index, "label", e.target.value)}
                        placeholder="Label (e.g. Processor)"
                        className="h-8 text-sm flex-[2]"
                    />
                    <Input
                        value={feature.value}
                        onChange={(e) => updateFeature(index, "value", e.target.value)}
                        placeholder="Value (e.g. Intel Core i5-13500H)"
                        className="h-8 text-sm flex-[3]"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive flex-shrink-0"
                        onClick={() => removeFeature(index)}
                        title="Remove feature"
                    >
                        <Trash2 className="w-3.5 h-3.5"/>
                    </Button>
                </div>
            ))}
            <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full gap-1.5"
                onClick={addFeature}
            >
                <Plus className="w-4 h-4"/>
                Add Feature
            </Button>
        </div>
    )
}
