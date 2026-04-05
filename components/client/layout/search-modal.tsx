"use client"
import {useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {SearchIcon} from "lucide-react";
import {searchProducts} from "@/app/actions/products/search-products";
import {useRouter} from "next/navigation";
import Image from "next/image";
import {useDebounce} from "@/hooks/use-debounce";
import {Skeleton} from "@/components/ui/skeleton";
import {useQuery} from "@tanstack/react-query";

interface SearchModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type SearchResult = {
    id: number;
    name: string;
    slug: string;
    image: string;
    price: string;
    size: string;
    inStock: boolean;
    category: {
        name: string;
        slug: string;
    };
}

export default function SearchModal({open, onOpenChange}: SearchModalProps) {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 300);
    const router = useRouter();

    const {data: results = [], isLoading} = useQuery({
        queryKey: ['search-products', debouncedQuery],
        queryFn: async () => {
            if (!debouncedQuery.trim()) {
                return [];
            }
            return await searchProducts(debouncedQuery) as SearchResult[];
        },
        enabled: debouncedQuery.trim().length > 0,
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });

    const handleProductClick = (categorySlug: string, productSlug: string) => {
        router.push(`/products/${categorySlug}/${productSlug}`);
        onOpenChange(false);
        setQuery("");
    };

    const handleOpenChange = (open: boolean) => {
        onOpenChange(open);
        if (!open) {
            setQuery("");
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-2xl p-0 top-[10%] translate-y-0 min-h-[40vh] max-h-[80vh] flex flex-col">
                <DialogHeader className="px-6 pt-6 pb-4">
                    <DialogTitle>Search Products</DialogTitle>
                </DialogHeader>
                <div className="px-6 pb-4">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                        <Input
                            placeholder="Search for products..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="pl-9"
                            autoFocus
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="divide-y">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="flex items-center gap-4 p-4">
                                    <Skeleton className="h-16 w-16 rounded-md flex-shrink-0"/>
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-5 w-3/4"/>
                                        <Skeleton className="h-4 w-1/2"/>
                                        <Skeleton className="h-4 w-2/3"/>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : results.length > 0 ? (
                        <div className="divide-y">
                            {results.map((product) => (
                                <button
                                    key={product.id}
                                    onClick={() => handleProductClick(product.category.slug, product.slug)}
                                    className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors text-left"
                                >
                                    <div
                                        className="relative h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium truncate">{product.name}</h4>
                                        <p className="text-sm text-muted-foreground">{product.category.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="font-semibold">৳{product.price}</span>
                                            <span className="text-xs text-muted-foreground">• {product.size}</span>
                                            {!product.inStock && (
                                                <span className="text-xs text-red-500">• Out of Stock</span>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : query.trim() && !isLoading ? (
                        <div className="py-8 text-center text-muted-foreground">
                            No products found for &quot;{query}&quot;
                        </div>
                    ) : (
                        <div className="py-8 text-center text-muted-foreground">
                            Start typing to search products
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
