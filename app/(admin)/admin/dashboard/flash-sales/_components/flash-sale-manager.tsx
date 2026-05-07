"use client"

import {useState, useEffect, useCallback, useMemo} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Badge} from "@/components/ui/badge"
import {Separator} from "@/components/ui/separator"
import {Switch} from "@/components/ui/switch"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog"
import {Checkbox} from "@/components/ui/checkbox"
import {toast} from "sonner"
import {Plus, Trash2, Loader, Zap, Search, X, Calendar, Package, Check, ChevronDown, ChevronUp} from "lucide-react"
import Image from "next/image"
import {formatPrice} from "@/utils/currency"
import {
    getFlashSales, createFlashSale, updateFlashSale, deleteFlashSale,
    removeProductFromFlashSale, getAllProductsForFlashSale, addProductsToFlashSale,
} from "@/app/actions/flash-sale/flash-sale-admin"

type FlashSaleWithItems = Awaited<ReturnType<typeof getFlashSales>>[number]

function getSaleStatus(sale: FlashSaleWithItems): "active" | "upcoming" | "expired" {
    const now = new Date()
    if (!sale.isActive) return "expired"
    if (new Date(sale.startDate) > now) return "upcoming"
    if (new Date(sale.endDate) <= now) return "expired"
    return "active"
}

export default function FlashSaleManager() {
    const [sales, setSales] = useState<FlashSaleWithItems[]>([])
    const [loading, setLoading] = useState(true)
    const [createOpen, setCreateOpen] = useState(false)

    const loadSales = useCallback(async () => {
        setLoading(true)
        setSales(await getFlashSales())
        setLoading(false)
    }, [])

    useEffect(() => { loadSales() }, [loadSales])

    const activeCount = sales.filter(s => getSaleStatus(s) === "active").length

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{sales.length} sale{sales.length !== 1 ? "s" : ""}</span>
                    {activeCount > 0 && <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">{activeCount} Active</Badge>}
                </div>
                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm"><Plus className="h-4 w-4 mr-1.5"/>New Flash Sale</Button>
                    </DialogTrigger>
                    <CreateDialog onCreated={() => { setCreateOpen(false); loadSales() }}/>
                </Dialog>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16 text-muted-foreground">
                    <Loader className="h-5 w-5 animate-spin mr-2"/>Loading...
                </div>
            ) : sales.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed rounded-xl">
                    <Zap className="h-10 w-10 mx-auto mb-3 text-muted-foreground/20"/>
                    <p className="text-sm font-medium text-muted-foreground">No flash sales yet</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">Create your first flash sale to get started.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {sales.map(sale => <SaleCard key={sale.id} sale={sale} onUpdate={loadSales}/>)}
                </div>
            )}
        </div>
    )
}

/* ─── Create Dialog ─── */

function CreateDialog({onCreated}: {onCreated: () => void}) {
    const [title, setTitle] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [saving, setSaving] = useState(false)

    const handleCreate = async () => {
        if (!title || !startDate || !endDate) { toast.error("Fill all fields"); return }
        if (new Date(endDate) <= new Date(startDate)) { toast.error("End date must be after start"); return }
        setSaving(true)
        const r = await createFlashSale({title, startDate, endDate})
        setSaving(false)
        r.success ? (toast.success("Flash sale created!"), onCreated()) : toast.error(r.error)
    }

    return (
        <DialogContent className="max-w-md">
            <DialogHeader>
                <DialogTitle>Create Flash Sale</DialogTitle>
                <DialogDescription>Set up a new timed sale event.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
                <div><Label className="text-xs">Title</Label><Input placeholder="e.g. Weekend Flash Deal" value={title} onChange={e => setTitle(e.target.value)}/></div>
                <div className="grid grid-cols-2 gap-3">
                    <div><Label className="text-xs">Start Date</Label><Input type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)}/></div>
                    <div><Label className="text-xs">End Date</Label><Input type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)}/></div>
                </div>
            </div>
            <DialogFooter>
                <Button onClick={handleCreate} disabled={saving} size="sm">
                    {saving && <Loader className="h-4 w-4 animate-spin mr-1.5"/>}Create Sale
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}

/* ─── Sale Card ─── */

function SaleCard({sale, onUpdate}: {sale: FlashSaleWithItems; onUpdate: () => void}) {
    const status = getSaleStatus(sale)
    const [expanded, setExpanded] = useState(status === "active")
    const [toggling, setToggling] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [addOpen, setAddOpen] = useState(false)

    const handleToggle = async (checked: boolean) => {
        setToggling(true)
        await updateFlashSale(sale.id, {isActive: checked})
        toast.success(checked ? "Sale activated" : "Sale deactivated")
        setToggling(false); onUpdate()
    }

    const handleDelete = async () => {
        if (!confirm("Delete this flash sale permanently?")) return
        setDeleting(true); await deleteFlashSale(sale.id)
        toast.success("Deleted"); setDeleting(false); onUpdate()
    }

    const statusColors = {
        active: "bg-emerald-500", upcoming: "bg-blue-500", expired: "bg-gray-400",
    }

    return (
        <div className="rounded-xl border bg-card overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/20 transition-colors" onClick={() => setExpanded(!expanded)}>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${statusColors[status]}`}/>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">{sale.title}</span>
                        <Badge variant="outline" className="text-[10px] font-normal capitalize">{status}</Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3"/>{new Date(sale.startDate).toLocaleDateString("en-GB", {day: "numeric", month: "short"})} — {new Date(sale.endDate).toLocaleDateString("en-GB", {day: "numeric", month: "short", year: "numeric"})}</span>
                        <span className="flex items-center gap-1"><Package className="h-3 w-3"/>{sale.items.length} product{sale.items.length !== 1 ? "s" : ""}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    <Switch checked={sale.isActive} onCheckedChange={handleToggle} disabled={toggling}/>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={handleDelete} disabled={deleting}>
                        <Trash2 className="h-3.5 w-3.5"/>
                    </Button>
                </div>
                {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0"/> : <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0"/>}
            </div>

            {/* Expanded Items */}
            {expanded && (
                <>
                    <Separator/>
                    <div className="p-4 space-y-2">
                        {sale.items.length === 0 ? (
                            <p className="text-xs text-muted-foreground text-center py-6">No products in this sale yet.</p>
                        ) : (
                            <div className="rounded-lg border overflow-hidden">
                                {/* Table header */}
                                <div className="grid grid-cols-[1fr_120px_100px_40px] gap-2 px-3 py-2 bg-muted/40 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                                    <span>Product</span><span>Base Price</span><span>Discount</span><span/>
                                </div>
                                {sale.items.map((item, i) => (
                                    <ItemRow key={item.id} item={item} isLast={i === sale.items.length - 1} onRemoved={onUpdate}/>
                                ))}
                            </div>
                        )}
                        <Dialog open={addOpen} onOpenChange={setAddOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="w-full mt-2">
                                    <Plus className="h-3.5 w-3.5 mr-1.5"/>Add Products
                                </Button>
                            </DialogTrigger>
                            <AddProductsDialog flashSaleId={sale.id} existingProductIds={sale.items.map(i => i.productId)} onAdded={() => { setAddOpen(false); onUpdate() }}/>
                        </Dialog>
                    </div>
                </>
            )}
        </div>
    )
}

/* ─── Item Row (with product info) ─── */

function ItemRow({item, isLast, onRemoved}: {item: FlashSaleWithItems["items"][number]; isLast: boolean; onRemoved: () => void}) {
    const [removing, setRemoving] = useState(false)
    const prod = item.product

    const handleRemove = async () => {
        setRemoving(true); await removeProductFromFlashSale(item.id)
        toast.success("Removed"); setRemoving(false); onRemoved()
    }

    const discountLabel = item.discountType === "percentage" ? `${item.discountValue}%` : `৳${item.discountValue}`

    // Calculate sale price for preview
    const basePrice = prod?.minPrice ? parseFloat(prod.minPrice) : 0
    let salePrice = basePrice
    if (basePrice > 0) {
        salePrice = item.discountType === "percentage"
            ? basePrice * (1 - parseFloat(item.discountValue) / 100)
            : basePrice - parseFloat(item.discountValue)
        salePrice = Math.max(0, Math.round(salePrice))
    }

    return (
        <div className={`grid grid-cols-[1fr_120px_100px_40px] gap-2 items-center px-3 py-2.5 hover:bg-muted/20 transition-colors ${!isLast ? "border-b" : ""}`}>
            {/* Product */}
            <div className="flex items-center gap-2.5 min-w-0">
                {prod?.image ? (
                    <div className="relative w-9 h-9 rounded-md bg-muted overflow-hidden flex-shrink-0 border">
                        <Image src={prod.image} alt={prod.name || ""} fill className="object-contain p-0.5"/>
                    </div>
                ) : (
                    <div className="w-9 h-9 rounded-md bg-muted flex-shrink-0"/>
                )}
                <span className="text-sm font-medium truncate">{prod?.name || `Product #${item.productId}`}</span>
            </div>
            {/* Base Price */}
            <div className="text-sm text-muted-foreground">
                {prod?.minPrice ? (
                    <div className="flex flex-col">
                        <span className="line-through text-xs">{formatPrice(prod.minPrice)}</span>
                        <span className="text-emerald-600 font-medium text-xs">{formatPrice(salePrice.toString())}</span>
                    </div>
                ) : "—"}
            </div>
            {/* Discount */}
            <Badge variant="secondary" className="text-[11px] w-fit">{discountLabel} off</Badge>
            {/* Remove */}
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={handleRemove} disabled={removing}>
                {removing ? <Loader className="h-3 w-3 animate-spin"/> : <X className="h-3.5 w-3.5"/>}
            </Button>
        </div>
    )
}

/* ─── Add Products Dialog (Multi-select) ─── */

type ProductItem = {id: number; name: string; slug: string; image: string; minPrice: string | null}

function AddProductsDialog({flashSaleId, existingProductIds, onAdded}: {flashSaleId: number; existingProductIds: number[]; onAdded: () => void}) {
    const [allProducts, setAllProducts] = useState<ProductItem[]>([])
    const [loading, setLoading] = useState(true)
    const [query, setQuery] = useState("")
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
    const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage")
    const [discountValue, setDiscountValue] = useState("")
    const [adding, setAdding] = useState(false)

    useEffect(() => {
        let cancelled = false
        getAllProductsForFlashSale().then(data => {
            if (!cancelled) { setAllProducts(data.filter(p => !existingProductIds.includes(p.id))); setLoading(false) }
        })
        return () => { cancelled = true }
    }, [existingProductIds])

    const filtered = useMemo(() => {
        if (!query.trim()) return allProducts
        const q = query.toLowerCase()
        return allProducts.filter(p => p.name.toLowerCase().includes(q))
    }, [allProducts, query])

    const toggleProduct = (id: number) => {
        setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
    }

    const toggleAll = () => {
        setSelectedIds(selectedIds.size === filtered.length ? new Set() : new Set(filtered.map(p => p.id)))
    }

    const handleAdd = async () => {
        if (selectedIds.size === 0 || !discountValue) { toast.error("Select products and set discount"); return }
        setAdding(true)
        const r = await addProductsToFlashSale({
            flashSaleId,
            items: Array.from(selectedIds).map(productId => ({productId, discountType, discountValue})),
        })
        setAdding(false)
        r.success ? (toast.success(`Added ${selectedIds.size} product(s)`), onAdded()) : toast.error(r.error || "Failed")
    }

    return (
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col gap-0 p-0">
            <DialogHeader className="px-6 pt-6 pb-4">
                <DialogTitle>Add Products to Flash Sale</DialogTitle>
                <DialogDescription>Select products and apply a discount to all selected.</DialogDescription>
            </DialogHeader>

            {/* Discount Config */}
            <div className="px-6 pb-4 border-b">
                <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-muted/40">
                    <div>
                        <Label className="text-[11px] text-muted-foreground uppercase tracking-wider">Discount Type</Label>
                        <Select value={discountType} onValueChange={v => setDiscountType(v as "percentage" | "fixed")}>
                            <SelectTrigger className="h-9 mt-1"><SelectValue/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="percentage">Percentage (%)</SelectItem>
                                <SelectItem value="fixed">Fixed Amount (৳)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label className="text-[11px] text-muted-foreground uppercase tracking-wider">Value</Label>
                        <Input type="number" className="h-9 mt-1" placeholder={discountType === "percentage" ? "e.g. 15" : "e.g. 2000"} value={discountValue} onChange={e => setDiscountValue(e.target.value)}/>
                    </div>
                </div>
            </div>

            {/* Search + Select All */}
            <div className="flex items-center gap-3 px-6 py-3 border-b">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                    <Input placeholder="Filter by name..." value={query} onChange={e => setQuery(e.target.value)} className="pl-9 h-9"/>
                </div>
                <Button type="button" variant="outline" size="sm" className="h-9 text-xs" onClick={toggleAll}>
                    {selectedIds.size === filtered.length && filtered.length > 0 ? "Deselect All" : "Select All"}
                </Button>
            </div>

            {/* Product List */}
            <div className="flex-1 min-h-0 overflow-y-auto px-2">
                {loading ? (
                    <div className="flex items-center justify-center py-12 text-muted-foreground text-sm"><Loader className="h-4 w-4 animate-spin mr-2"/>Loading products...</div>
                ) : filtered.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-12">No products found</p>
                ) : (
                    <div className="py-1">
                        {filtered.map(p => {
                            const sel = selectedIds.has(p.id)
                            const salePx = discountValue && p.minPrice
                                ? formatPrice((discountType === "percentage"
                                    ? parseFloat(p.minPrice) * (1 - parseFloat(discountValue) / 100)
                                    : parseFloat(p.minPrice) - parseFloat(discountValue)).toString())
                                : null
                            return (
                                <label key={p.id} className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${sel ? "bg-primary/5 ring-1 ring-primary/20" : ""}`}>
                                    <Checkbox checked={sel} onCheckedChange={() => toggleProduct(p.id)}/>
                                    <div className="relative w-9 h-9 rounded-md bg-muted overflow-hidden flex-shrink-0 border">
                                        <Image src={p.image} alt={p.name} fill className="object-contain p-0.5"/>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium leading-snug line-clamp-1">{p.name}</p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span>{p.minPrice ? formatPrice(p.minPrice) : "Price varies"}</span>
                                            {salePx && <span className="text-emerald-600 font-medium">→ {salePx}</span>}
                                        </div>
                                    </div>
                                    {sel && <Check className="h-4 w-4 text-primary flex-shrink-0"/>}
                                </label>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-3 border-t bg-muted/20">
                <span className="text-xs text-muted-foreground">{selectedIds.size} selected</span>
                <Button type="button" onClick={handleAdd} disabled={adding || selectedIds.size === 0 || !discountValue} size="sm">
                    {adding && <Loader className="h-4 w-4 animate-spin mr-1.5"/>}
                    Add {selectedIds.size > 0 ? `${selectedIds.size} Product${selectedIds.size > 1 ? "s" : ""}` : "to Sale"}
                </Button>
            </div>
        </DialogContent>
    )
}
