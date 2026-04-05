# Manual Payment Verification System

## Overview
This document describes the manual payment verification system implemented for bKash and Rocket mobile banking payments. Customers enter their transaction ID and sender number after making payment, and admins verify the payment in the dashboard.

## Features Implemented

### 1. Database Schema Updates
- **File**: `db/schema/payment.ts`
- **Changes**: Added `senderNumber` and `receiverNumber` fields to the payment table for manual verification

### 2. Customer-Facing Components

#### Payment Submission
- **Files**: 
  - `app/(client)/checkout/payment/verify/_components/bKash-verification-card.tsx`
  - `app/(client)/checkout/payment/verify/_components/rocket-verification-card.tsx`
- **Functionality**: 
  - Customers enter their mobile number and transaction ID
  - Submit payment details for admin verification
  - Payment status is set to "pending"
  - Redirects to success page after submission

#### Metadata
- **File**: `app/(client)/checkout/payment/verify/layout.tsx`
- **Added**: SEO metadata for payment verification page

### 3. Server Actions

#### Manual Payment Submission
- **File**: `app/actions/manual-payment.ts`
- **Function**: `submitManualPayment()`
- **Process**:
  1. Validates user authentication
  2. Validates transaction ID and sender number
  3. Verifies order belongs to user
  4. Updates payment record with transaction details
  5. Sets payment status to "pending"

#### Admin Payment Verification
- **File**: `app/(admin)/admin/dashboard/orders/actions/verify-manual-payment.ts`
- **Functions**:
  - `verifyManualPayment()`: Approve or reject payments
  - `getPendingPayments()`: Fetch all pending payments

### 4. Admin Dashboard Components

#### Verify Payment Dialog
- **File**: `app/(admin)/admin/dashboard/orders/_components/verify-payment-dialog.tsx`
- **Functionality**:
  - Shows in order actions dropdown menu
  - Only visible for orders with pending payments
  - Displays transaction details
  - Approve or reject buttons

#### Pending Payments List
- **File**: `app/(admin)/admin/dashboard/orders/_components/pending-payments-list.tsx`
- **Functionality**:
  - Dedicated view for all pending payments
  - Auto-refreshes every 30 seconds
  - Inline approve/reject actions
  - Shows customer and payment details

#### Pending Payments Page
- **File**: `app/(admin)/admin/dashboard/payments/page.tsx`
- **Route**: `/admin/dashboard/payments`
- **Functionality**: Standalone page for payment verification

#### Order Columns Update
- **File**: `app/(admin)/admin/dashboard/orders/_components/order-columns.tsx`
- **Changes**: Added "Verify Payment" option in order actions dropdown

## Payment Flow

### Customer Side:
1. Customer places order and selects bKash/Rocket payment
2. Redirected to payment verification page
3. Makes payment via mobile banking app
4. Returns to verification page
5. Enters sender number and transaction ID
6. Submits for verification
7. Payment status: **Pending**

### Admin Side:
1. Admin sees pending payment in:
   - Order list (verify option in dropdown)
   - Dedicated payments page (`/admin/dashboard/payments`)
2. Reviews transaction details
3. Verifies payment in mobile banking app
4. Clicks "Approve" or "Reject"
5. On approval:
   - Payment status → **Completed**
   - Order status → **Confirmed**
6. On rejection:
   - Payment status → **Failed**

## Database Migration Required

After implementing these changes, you need to run:

```bash
npx drizzle-kit generate
npx drizzle-kit push
```

This will:
1. Generate migration for the new payment fields
2. Apply the migration to your database

## Routes Added

### Customer Routes
- `/checkout/payment/verify` - Payment verification page (existing, enhanced)

### Admin Routes
- `/admin/dashboard/payments` - Pending payments verification page (new)

## Security Notes

1. **Authentication**: All actions verify user authentication
2. **Authorization**: 
   - Customer actions check order ownership
   - Admin actions have TODO comments for role checking
   - Implement admin role check before production

## TODO: Add Admin Role Check

In the following files, uncomment and implement admin role checking:

1. `app/(admin)/admin/dashboard/orders/actions/verify-manual-payment.ts`
   ```typescript
   // TODO: Add admin role check here
   // if (session.user.role !== "admin") {
   //     return {
   //         success: false,
   //         error: "Unauthorized access"
   //     };
   // }
   ```

## Testing Checklist

- [ ] Customer can submit transaction details
- [ ] Payment status shows as "pending" after submission
- [ ] Admin can see pending payments in orders list
- [ ] Admin can see pending payments in `/admin/dashboard/payments`
- [ ] Admin can approve payment (payment → completed, order → confirmed)
- [ ] Admin can reject payment (payment → failed)
- [ ] Validation works for missing fields
- [ ] User can only submit for their own orders
- [ ] Database migration completed successfully

## Existing Code Preserved

All existing payment code (SSLCommerz integration) in `app/actions/payment.ts` remains unchanged and can be used later when needed.

## Next Steps

1. Run database migration commands
2. Test the complete flow
3. Implement admin role checking
4. Add notification system (optional)
5. Add payment receipt/invoice generation (optional)

