# TODOS — ShipTimer

## Before Deploy

- [ ] **OG image** — Create static `public/og.png` (1200x630). Dark background, "ShipTimer" in white, launch date below. Figma or Canva, ~5 min. Without it, social previews show a blank Vercel card.
  - **Why:** The page will be shared as a URL. The OG preview is the first impression before anyone clicks.
  - **Where to start:** `/public/` directory. Any 1200x630 PNG works.

- [ ] **Custom domain** — Buy `shiptimer.com` or `shiptimer.dev`, configure in Vercel DNS settings (~5 min once domain is owned).
  - **Why:** `shiptimer.vercel.app` signals "dev project." A real domain signals intent.
  - **Where to start:** Vercel dashboard → Domains → Add.

## Polish (before launch, not blocking)

- [ ] **UTC timezone label** — Add a single line below the countdown: "Launching Dec 31 · 11:59pm UTC" so visitors in non-UTC timezones understand when the launch happens in their context.
  - **Why:** The countdown hits zero at 4pm SF / 7pm NYC / midnight London. Without context, SF users may be confused by a 4pm expiry.
  - **Where to start:** `src/App.jsx`, below the countdown row. One `<p>` element with muted styling.
