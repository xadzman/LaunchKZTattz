# Bolt → Supabase implementation (continued from Stage 4)

This update adds:
- `src/lib/db.ts` — typed helpers for inserting bookings/subscribers
- `src/lib/recaptcha.ts` — calls Supabase Edge Function `verify-recaptcha`
- `src/components/ImageUploader.tsx` — drag & drop uploader to Supabase Storage (`booking_ref_images` bucket)
- Supabase Edge Functions:
  - `verify-recaptcha`
  - `send-booking-email`
  - `send-subscription-email`
- Wiring stubs in `Booking.tsx` and `MailingList.tsx`

## Environment variables (Vite)
In `.env` (or `.env.local`):
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_RECAPTCHA_SITE_KEY=...
```

## Supabase project
Create bucket `booking_ref_images` (public) in Storage.

## Edge functions (Supabase CLI)
```
supabase functions deploy verify-recaptcha --no-verify-jwt
supabase functions deploy send-booking-email --no-verify-jwt
supabase functions deploy send-subscription-email --no-verify-jwt
```
Set env vars for each function (in Supabase dashboard → Functions → Settings):
- `RECAPTCHA_SECRET`
- `RESEND_API_KEY`
- `CONTACT_NOTIFY_EMAIL`
- `FROM_EMAIL`

## Booking flow
1. User fills booking form, uploads reference images (optional) → images stored in `booking_ref_images`.
2. Client verifies reCAPTCHA via `verify-recaptcha` (returns score).
3. Client inserts into `booking_requests` via `addBookingRequest()` with the public URLs.
4. Optionally invoke `send-booking-email` edge function to notify you + send user confirmation.

## Mailing list flow
1. User submits email (and optional promo tag) → `addSubscriber()` inserts to `mailing_list_subscribers`.
2. Optionally invoke `send-subscription-email` to send a welcome email.
