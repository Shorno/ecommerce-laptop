"use client"

import {useState, useRef, useEffect, useCallback} from "react";
import {SearchIcon, X, Clock, Loader2} from "lucide-react";
import {searchProducts} from "@/app/actions/products/search-products";
import {useRouter} from "next/navigation";
import Image from "next/image";
import {useDebounce} from "@/hooks/use-debounce";
import {useQuery} from "@tanstack/react-query";

type SearchResult = {
    id: number;
    name: string;
    slug: string;
    image: string;
    minPrice: string | null;
    category: {
        name: string;
        slug: string;
    };
}

const RECENT_SEARCHES_KEY = "laptop-bd-recent-searches";
const MAX_RECENT_SEARCHES = 5;

function getRecentSearches(): string[] {
    if (typeof window === "undefined") return [];
    try {
        const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function saveRecentSearch(query: string) {
    const searches = getRecentSearches();
    const filtered = searches.filter((s) => s.toLowerCase() !== query.toLowerCase());
    const updated = [query, ...filtered].slice(0, MAX_RECENT_SEARCHES);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
}

function clearRecentSearches() {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
}

interface InlineSearchProps {
    className?: string;
    placeholder?: string;
}

export default function InlineSearch({className = "", placeholder = "Search products..."}: InlineSearchProps) {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const debouncedQuery = useDebounce(query, 300);
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const {data: results = [], isLoading} = useQuery({
        queryKey: ['search-products', debouncedQuery],
        queryFn: async () => {
            if (!debouncedQuery.trim()) return [];
            return await searchProducts(debouncedQuery) as SearchResult[];
        },
        enabled: debouncedQuery.trim().length > 0,
        staleTime: 1000 * 60 * 5,
    });

    // Load recent searches on mount
    useEffect(() => {
        setRecentSearches(getRecentSearches());
    }, []);

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleProductClick = useCallback((productSlug: string, productName: string) => {
        saveRecentSearch(productName);
        setRecentSearches(getRecentSearches());
        setQuery("");
        setIsOpen(false);
        router.push(`/product/${productSlug}`);
    }, [router]);

    const handleRecentClick = useCallback((search: string) => {
        setQuery(search);
        inputRef.current?.focus();
    }, []);

    const handleClearRecent = useCallback(() => {
        clearRecentSearches();
        setRecentSearches([]);
    }, []);

    const handleClearQuery = useCallback(() => {
        setQuery("");
        inputRef.current?.focus();
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            setIsOpen(false);
            inputRef.current?.blur();
        }
    }, []);

    const showDropdown = isOpen && (query.trim().length > 0 || recentSearches.length > 0);

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Search Input */}
            <div className="relative flex items-center">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full h-10 pl-4 pr-10 rounded-l-lg border-0 bg-white text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-tech-accent/50"
                />
                {query && (
                    <button
                        onClick={handleClearQuery}
                        className="absolute right-14 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Clear search"
                    >
                        <X className="h-4 w-4"/>
                    </button>
                )}
                <button
                    className="h-10 px-4 bg-tech-accent hover:bg-tech-accent/90 text-white rounded-r-lg flex items-center justify-center transition-colors flex-shrink-0"
                    aria-label="Search"
                    onClick={() => {
                        if (query.trim()) {
                            inputRef.current?.focus();
                            setIsOpen(true);
                        }
                    }}
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin"/>
                    ) : (
                        <SearchIcon className="h-4 w-4"/>
                    )}
                </button>
            </div>

            {/* Dropdown Results */}
            {showDropdown && (
                <>
                    {/* Backdrop overlay */}
                    <div className="fixed inset-0 top-0 z-40" onClick={() => setIsOpen(false)}/>

                    <div
                        className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-2xl border border-border z-50 max-h-[70vh] overflow-hidden"
                    >
                        {/* Search Results */}
                        {query.trim() && (
                            <div className="overflow-y-auto max-h-[60vh] min-h-[228px]">
                                {isLoading ? (
                                    <div className="p-4 space-y-3 min-h-[228px]">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i}
                                                 className="flex items-center gap-3 px-4 py-3 animate-pulse">
                                                <div className="h-12 w-12 rounded-md bg-muted flex-shrink-0"/>
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-4 w-3/4 bg-muted rounded"/>
                                                    <div className="h-3 w-1/2 bg-muted rounded"/>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : results.length > 0 ? (
                                    <div>
                                        {results.map((product) => (
                                            <button
                                                key={product.id}
                                                onClick={() => handleProductClick(product.slug, product.name)}
                                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/60 transition-colors text-left"
                                            >
                                                <div
                                                    className="relative h-12 w-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                                                    <Image
                                                        src={product.image}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-sm text-foreground truncate">{product.name}</h4>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span
                                                            className="text-sm font-semibold text-tech-accent">{product.minPrice ? `৳${product.minPrice}` : 'Price TBD'}</span>
                                                        <span
                                                            className="text-xs text-muted-foreground">• {product.category.name}</span>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="min-h-[228px] flex items-center justify-center text-center text-muted-foreground text-sm">
                                        No products found for &quot;{query}&quot;
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Recent Searches (shown when input is focused but empty) */}
                        {!query.trim() && recentSearches.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
                                    <span
                                        className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent Searches</span>
                                    <button
                                        onClick={handleClearRecent}
                                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <Clock className="h-3 w-3"/>
                                        Clear
                                    </button>
                                </div>
                                <div>
                                    {recentSearches.map((search, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleRecentClick(search)}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/60 transition-colors text-left"
                                        >
                                            <SearchIcon className="h-4 w-4 text-muted-foreground flex-shrink-0"/>
                                            <span className="text-sm text-foreground truncate">{search}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
