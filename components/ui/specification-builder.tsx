"use client"

import {Plus, Trash2, GripVertical} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"

export interface SpecItem {
    label: string
    value: string
}

export interface SpecGroup {
    group: string
    specs: SpecItem[]
}

interface SpecificationBuilderProps {
    value: SpecGroup[]
    onChange: (value: SpecGroup[]) => void
}

export default function SpecificationBuilder({value, onChange}: SpecificationBuilderProps) {
    const addGroup = () => {
        onChange([...value, {group: "", specs: [{label: "", value: ""}]}])
    }

    const removeGroup = (groupIndex: number) => {
        onChange(value.filter((_, i) => i !== groupIndex))
    }

    const updateGroupName = (groupIndex: number, name: string) => {
        const updated = [...value]
        updated[groupIndex] = {...updated[groupIndex], group: name}
        onChange(updated)
    }

    const addSpec = (groupIndex: number) => {
        const updated = [...value]
        updated[groupIndex] = {
            ...updated[groupIndex],
            specs: [...updated[groupIndex].specs, {label: "", value: ""}]
        }
        onChange(updated)
    }

    const removeSpec = (groupIndex: number, specIndex: number) => {
        const updated = [...value]
        updated[groupIndex] = {
            ...updated[groupIndex],
            specs: updated[groupIndex].specs.filter((_, i) => i !== specIndex)
        }
        // Remove group if no specs left
        if (updated[groupIndex].specs.length === 0) {
            onChange(updated.filter((_, i) => i !== groupIndex))
        } else {
            onChange(updated)
        }
    }

    const updateSpec = (groupIndex: number, specIndex: number, field: "label" | "value", val: string) => {
        const updated = [...value]
        const specs = [...updated[groupIndex].specs]
        specs[specIndex] = {...specs[specIndex], [field]: val}
        updated[groupIndex] = {...updated[groupIndex], specs}
        onChange(updated)
    }

    return (
        <div className="space-y-4">
            {value.map((group, groupIndex) => (
                <div key={groupIndex} className="border border-border rounded-lg overflow-hidden">
                    {/* Group Header */}
                    <div className="flex items-center gap-2 bg-muted/50 px-3 py-2">
                        <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0"/>
                        <Input
                            value={group.group}
                            onChange={(e) => updateGroupName(groupIndex, e.target.value)}
                            placeholder="Group name (e.g. Display, Processor)"
                            className="h-8 text-sm font-medium bg-transparent border-0 shadow-none focus-visible:ring-0 px-0"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive flex-shrink-0"
                            onClick={() => removeGroup(groupIndex)}
                            title="Remove group"
                        >
                            <Trash2 className="w-3.5 h-3.5"/>
                        </Button>
                    </div>

                    {/* Specs */}
                    <div className="p-3 space-y-2">
                        {group.specs.map((spec, specIndex) => (
                            <div key={specIndex} className="flex items-center gap-2">
                                <Input
                                    value={spec.label}
                                    onChange={(e) => updateSpec(groupIndex, specIndex, "label", e.target.value)}
                                    placeholder="Label (e.g. Screen Size)"
                                    className="h-8 text-sm flex-1"
                                />
                                <Input
                                    value={spec.value}
                                    onChange={(e) => updateSpec(groupIndex, specIndex, "value", e.target.value)}
                                    placeholder="Value (e.g. 15.6 inch FHD)"
                                    className="h-8 text-sm flex-1"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-muted-foreground hover:text-destructive flex-shrink-0"
                                    onClick={() => removeSpec(groupIndex, specIndex)}
                                    title="Remove spec"
                                >
                                    <Trash2 className="w-3 h-3"/>
                                </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs gap-1 text-muted-foreground"
                            onClick={() => addSpec(groupIndex)}
                        >
                            <Plus className="w-3 h-3"/>
                            Add Spec
                        </Button>
                    </div>
                </div>
            ))}

            <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full gap-1.5"
                onClick={addGroup}
            >
                <Plus className="w-4 h-4"/>
                Add Specification Group
            </Button>
        </div>
    )
}
