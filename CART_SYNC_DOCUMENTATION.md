# Cart Synchronization System

## Overview
This cart system synchronizes between local Zustand storage (localStorage) and a PostgreSQL database, ensuring users have a consistent cart experience across sessions and devices.

## How It Works

### 1. **Local Cart (Unauthenticated Users)**
- Uses Zustand with localStorage persistence
- All cart operations happen locally
- Cart persists across browser sessions
- No database operations

### 2. **Authenticated Cart Syncing**

#### On Login:
1. **CartSync component** detects user login
2. If local cart has items:
   - Syncs local cart to database using `syncToDatabase()`
   - Merges with existing database cart (takes higher quantity)
   - Loads merged cart from database using `loadFromDatabase()`
3. If local cart is empty:
   - Simply loads cart from database

#### During Session (Authenticated):
- **Add to cart**: Updates local state + database simultaneously
- **Increment/Decrement**: Updates local state + database simultaneously
- **Remove item**: Updates local state + database simultaneously
- **Clear cart**: Clears local state + database simultaneously

All cart actions pass `isAuthenticated` parameter to determine if database sync is needed.

#### On Logout:
- Clears local cart
- Database cart is preserved for next login

### 3. **Database Schema**

```typescript
// Cart table (one per user)
cartSchema {
  id: serial
  userId: varchar
  sessionId: varchar (for guest carts - future feature)
  expiresAt: timestamp
  created_at, updated_at
}

// Cart items (many per cart)
cartItem {
  id: serial
  cartId: integer (references cartSchema.id)
  productId: integer (references product.id)
  quantity: integer
  priceAtAdd: decimal (preserves price at time of adding)
  created_at, updated_at
}
```

## Key Features

### Merge Strategy
When syncing local cart to database:
- If item exists in both: **takes the higher quantity**
- If item only in local: **adds to database**
- If item only in database: **preserves it** (might be from another device)

### Real-time Sync
Every cart operation when authenticated:
1. Updates Zustand store (immediate UI update)
2. Syncs to database (persists change)

### Stock Management
- Respects product stock limits
- Prevents adding more than available quantity
- Works for both local and database operations

## File Structure

```
app/
  actions/
    cart.ts                    # Server actions for database operations
  (client)/
    layout.tsx                 # Includes CartSync component

components/
  client/
    cart/
      cart-sync.tsx           # Handles login/logout sync
      cart-drawer.tsx         # Cart UI
      cart-item.tsx           # Cart item with auth-aware actions
    product/
      product-card.tsx        # Add to cart with auth-aware actions

stote/
  cart-sotre.ts              # Zustand store with sync methods

db/
  schema/
    cart.schema.ts           # Database schema
```

## Usage in Components

### Adding Items to Cart
```typescript
const session = authClient.useSession();
const { addItem } = useCartActions();
const isAuthenticated = !!session.data?.user;

// Add to cart
addItem(product, isAuthenticated);
```

### Updating Quantity
```typescript
const session = authClient.useSession();
const { increment, decrement } = useCartActions();
const isAuthenticated = !!session.data?.user;

// Update quantity
increment(productId, isAuthenticated);
decrement(productId, isAuthenticated);
```

### Removing Items
```typescript
const session = authClient.useSession();
const { removeItem } = useCartActions();
const isAuthenticated = !!session.data?.user;

// Remove item
removeItem(productId, isAuthenticated);
```

## Why This Works

### The Problem You Had Before
When you deleted from local cart, it didn't delete from database because:
1. The actions weren't being called with `isAuthenticated` flag
2. The sync was one-directional (only on login)

### The Solution
1. **Bidirectional Sync**: Every cart operation checks authentication and syncs accordingly
2. **Auth-aware Actions**: All cart components pass `isAuthenticated` to actions
3. **Real-time Updates**: Database is updated immediately, not just on login
4. **CartSync Component**: Handles initial sync on login/logout

## Testing

### Test Scenario 1: Unauthenticated User
1. Add items to cart (stored in localStorage)
2. Refresh page (cart persists)
3. Close browser and reopen (cart still there)

### Test Scenario 2: Login with Empty Local Cart
1. Login
2. If you have items in database cart, they load automatically

### Test Scenario 3: Login with Items in Local Cart
1. Add items to cart while logged out
2. Login
3. Local cart syncs to database
4. Merged cart (local + database) loads
5. All operations now sync to database

### Test Scenario 4: Multi-device Sync
1. Add items on Device A
2. Login on Device B
3. Cart from Device A loads on Device B
4. Add more items on Device B
5. Both devices have all items (after refresh on Device A)

### Test Scenario 5: Logout
1. Have items in cart while logged in
2. Logout
3. Local cart clears
4. Login again
5. Cart restores from database

## Troubleshooting

### Cart not syncing?
- Check browser console for errors
- Verify authentication status: `session.data?.user`
- Check database connection

### Duplicate items?
- The merge strategy takes higher quantity
- Check if `syncToDatabase` is being called multiple times

### Cart not persisting?
- For unauthenticated: Check localStorage (key: `cart-storage`)
- For authenticated: Check database tables `cartSchema` and `cart_item`

## Future Enhancements

1. **Guest Cart Sessions**: Use sessionId for guest carts
2. **Cart Expiration**: Auto-clean old carts using expiresAt
3. **Optimistic Updates**: Show UI changes before database confirms
4. **Conflict Resolution**: Better handling when same item modified on multiple devices
5. **Cart Analytics**: Track cart abandonment, popular items, etc.

