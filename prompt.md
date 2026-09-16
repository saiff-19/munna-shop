# Build Shop Ledger

Read `RULES.md` first and follow it throughout the project.

Build a complete mobile-first shop ledger using the existing Vite + React project and Supabase.

## Core Flow

### Authentication
Implement:
- Login
- Signup
- Forgot/reset password
- Logout
- Persist Supabase sessions across devices

Each Supabase account represents one store. Different accounts must never see each other's data.

### Dashboard
Create a clean mobile dashboard showing:
- Current date
- Unpaid total
- First unpaid date → today
- Add Milk
- Add Other Item
- View Sheet
- Recent payment history

### Add Milk
- Select only TON or FULL CREAM.
- Show the current price from `profiles`.
- Enter quantity.
- Date defaults to today but is editable.
- Save the historical price into `ledger`.

### Add Other Item
- Free-text item name.
- Price.
- Quantity.
- Editable date.
- Save to `ledger`.

### Milk Prices
Create a settings screen where the user can update:
- TON price
- FULL CREAM price

Changing prices must not affect existing ledger entries.

### View Sheet
Display ledger entries in a mobile-friendly list/card layout showing:
- Date
- Item
- Type
- Quantity
- Price
- Total
- Paid/unpaid status

Support editing and deleting entries with confirmation for deletion.

### Payment
Show the current unpaid amount.

When "Mark as Paid" is pressed:
- Show a confirmation modal containing amount and date range.
- Do nothing until confirmed.
- On confirmation, create the payment and settle all currently unpaid entries atomically.
- Refresh the dashboard.

Show only the latest 2 payment periods.

## Final Requirements

Use Supabase directly from React. Implement secure RLS. Keep the UI polished, fast and extremely simple to use.

After implementation, test authentication, CRUD, milk price changes, historical prices, unpaid calculation, payment settlement, payment history, RLS isolation and mobile layouts.