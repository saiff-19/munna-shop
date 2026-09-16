# Shop Ledger — Development Rules

## Tech
- Vite + React + JavaScript.
- Supabase for Auth and PostgreSQL.
- Use `@supabase/supabase-js`.
- No custom backend.
- No MongoDB, Firebase, Redux, Bootstrap, jQuery, or Tailwind.
- Keep dependencies minimal.
- Use `.env` for Supabase URL and publishable key.
- Never expose Supabase service-role/secret keys.

## Architecture
- Supabase Auth account = one store.
- The same account may be logged into multiple devices.
- Different accounts must have completely isolated data.
- Use RLS for all user-owned data.
- Never rely on frontend filtering for security.

## Database
Use these tables:

### profiles
- `id` → `auth.users.id`
- `ton_price`
- `full_cream_price`
- `updated_at`

Default prices:
- TON: ₹27
- FULL CREAM: ₹36

### ledger
- `id`
- `user_id`
- `item_name`
- `item_type`
- `quantity`
- `price`
- `date`
- `payment_id`
- `created_at`

### payments
- `id`
- `user_id`
- `amount`
- `from_date`
- `to_date`
- `paid_at`
- `created_at`

A database trigger creates a profile automatically after signup.

## Ledger Rules
- Milk types are only `TON` and `FULL_CREAM`.
- Milk price comes from the user's profile.
- Copy the current milk price into the ledger entry when adding milk.
- Changing milk price must never modify old entries.
- Other items have a free-text name and manually entered price.
- Do not create an item/catalog table.
- New entry date defaults to today but must be editable.
- `total = quantity × price`; do not store total separately.
- `payment_id = NULL` means unpaid.
- `payment_id != NULL` means paid.

## Payment Rules
- Unpaid total includes all currently unpaid ledger entries.
- Determine the first unpaid entry date.
- "Mark as Paid" must show a confirmation before changing anything.
- On confirmation, atomically:
  1. calculate unpaid total,
  2. determine first unpaid date,
  3. create payment,
  4. set `to_date` to today,
  5. attach the payment ID to all currently unpaid entries.
- `paid_at` is generated when payment is confirmed.
- Show only the latest 2 payment periods in payment history.
- Payment history means the last 2 settlements, not calendar months.

## UI
- Mobile-only application.
- Support phone widths roughly from 320px upward.
- Do not design a desktop dashboard and shrink it.
- On desktop, keep the application constrained to a phone-like width.
- Premium modern iPhone-inspired aesthetic.
- Use subtle glassmorphism, frosted surfaces, blur, soft shadows, rounded corners and restrained gradients.
- Keep the interface minimal and uncluttered.
- Avoid excessive glass effects, colors, borders and animations.
- Prioritize adding entries and checking unpaid balance.
- Use bottom sheets/modals where they improve mobile UX.
- Touch targets should be at least ~44px.
- Support loading, empty and error states.
- Respect `prefers-reduced-motion`.

## Code Quality
- Keep components small and reusable.
- Separate Supabase/data logic from UI where practical.
- Centralize calculations and date utilities.
- Avoid unnecessary abstractions.
- Do not invent features outside the requirements.
- Do not overwrite existing working configuration unnecessarily.
- Test the application after implementation.