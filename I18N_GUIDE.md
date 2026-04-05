# Internationalization (i18n) Guide

## What's Already Set Up

1. ✅ `i18n/request.ts` - Reads locale from cookies
2. ✅ `app/layout.tsx` - Wraps app with `NextIntlClientProvider`
3. ✅ `messages/en.json` and `messages/bn.json` - Translation files
4. ✅ `components/language-switcher.tsx` - Language toggle component

## For Future Pages - Quick Steps

### Step 1: Add Translations to JSON Files

Add your page translations to both `messages/en.json` and `messages/bn.json`:

```json
// messages/en.json
{
  "orders": { ... },
  "products": {
    "title": "Products Management",
    "addProduct": "Add Product",
    "name": "Name",
    "price": "Price",
    // ... add all text here
  }
}
```

```json
// messages/bn.json
{
  "orders": { ... },
  "products": {
    "title": "পণ্য ব্যবস্থাপনা",
    "addProduct": "পণ্য যোগ করুন",
    "name": "নাম",
    "price": "মূল্য",
    // ... add Bengali translations
  }
}
```

### Step 2: Server Components (Pages)

Use `getTranslations` from `next-intl/server`:

```typescript
import {getTranslations} from 'next-intl/server';

export default async function ProductsPage() {
    const t = await getTranslations('products');
    
    return (
        <div>
            <h1>{t('title')}</h1>
            {/* ... */}
        </div>
    )
}
```

### Step 3: Client Components

Use `useTranslations` hook from `next-intl`:

```typescript
"use client"

import { useTranslations } from "next-intl"

export default function ProductTable() {
    const t = useTranslations('products');
    
    return (
        <div>
            <button>{t('addProduct')}</button>
            {/* ... */}
        </div>
    )
}
```

### Step 4: Table Columns (Client Component Pattern)

Convert static columns to a hook:

```typescript
"use client"

import { useTranslations } from "next-intl"
import { ColumnDef } from "@tanstack/react-table"

export function useProductColumns() {
    const t = useTranslations('products');
    
    const columns: ColumnDef<Product>[] = [
        {
            accessorKey: "name",
            header: () => <div>{t('name')}</div>,
            // ...
        },
        {
            accessorKey: "price",
            header: () => <div>{t('price')}</div>,
            // ...
        },
    ]
    
    return columns;
}
```

Then use it in your list component:

```typescript
"use client"

import { useProductColumns } from "./product-columns"
import { use } from "react"

export default function ProductList({ productsPromise }) {
    const products = use(productsPromise);
    const columns = useProductColumns();
    
    return <ProductTable columns={columns} data={products} />
}
```

And in your page:

```typescript
export default async function ProductsPage() {
    const productsPromise = getProducts();
    
    return (
        <Suspense fallback={<Loading />}>
            <ProductList productsPromise={productsPromise} />
        </Suspense>
    )
}
```

## Common Patterns

### Dynamic Values in Translations

```typescript
// In JSON
"welcome": "Welcome, {name}!"

// In component
t('welcome', { name: user.name })
```

### Nested Translations

```typescript
// In JSON
{
  "status": {
    "active": "Active",
    "inactive": "Inactive"
  }
}

// In component
t('status.active')
```

### Pluralization (if needed)

```typescript
// In JSON
"items": "{count, plural, =0 {No items} =1 {1 item} other {# items}}"

// In component
t('items', { count: 5 })
```

## Quick Checklist for New Pages

- [ ] Add translations to `messages/en.json`
- [ ] Add translations to `messages/bn.json`
- [ ] Use `getTranslations` in server components
- [ ] Use `useTranslations` in client components
- [ ] Convert table columns to hook if using data tables
- [ ] Replace all hardcoded strings with `t('key')`
- [ ] Test both English and Bangla

## Example: Converting a Page

**Before:**
```typescript
export default function Page() {
    return <h1>Products Management</h1>
}
```

**After:**
```typescript
import {getTranslations} from 'next-intl/server';

export default async function Page() {
    const t = await getTranslations('products');
    return <h1>{t('title')}</h1>
}
```

## Notes

- Locale is stored in cookies, so it persists across pages
- Use `<LanguageSwitcher />` component to allow users to change language
- Always add translations to BOTH language files
- Keep translation keys consistent and descriptive

