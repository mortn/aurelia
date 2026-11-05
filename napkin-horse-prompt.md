one-shot prompt:

    You are a senior product designer and fullstack engineer. Using the attached hand-drawn wireframe as the structural source of truth, build a complete, polished, responsive horse-auction website in

    STACK & SCOPE
    - Next.js (App Router), TypeScript, Tailwind CSS, lucide-react, and Recharts.
    - Frontend-only: realistic mock data and local state. No backend, real auth, or payments.
    - Persist the watchlist in localStorage. Everything must run with `npm install && npm run dev`.

    BRAND & ART DIRECTION
    Create a premium equestrian auction house called "AURELIA EQUINE" with a minimal horse-head monogram. Interpret the sketch as layout only — do not reproduce its handwritten style.
    - Palette: warm ivory #F5EFE4 background, deep forest #1E3A2C primary, saddle tan #A97445 accents, clay #8A3F2F for sold badges, ink #17231C text.
    - Typography: Fraunces for display headings, Inter for body/UI via next/font.
    - Editorial, restrained, expensive-feeling: generous whitespace, fine hairline borders, subtle shadows, 2px radii, full-bleed horse photography. Use Unsplash horse images with an elegant gradient/

    LAYOUT
    1. Sticky header: wordmark at left; search field/icon, Log In, and Register buttons at right. Below, a nav row: Home (active with underline), Horses for Sale, Recently Sold, Newsletter, My Watchli
    2. Main section titled "Live & Upcoming Auctions" with a small live indicator and three auction cards in a row:
       - Thunder — Lot 014, 9yo Warmblood gelding, current bid $12,000, 18 bids, ending in 2h 14m, LIVE.
       - Belle — Lot 015, 7yo Thoroughbred mare, current bid $8,000, 11 bids, ending in 5h 40m, LIVE.
       - Atlas — Lot 016, 6yo Dutch Warmblood stallion, $16,500 starting bid, opens tomorrow, UPCOMING, no bids yet.
       Each card: photo, status chip, lot number, name and details, current bid or starting bid, bid count, ticking countdown, a small bid-history sparkline, a €œPlace Bid€ button, a star toggle label
    3. Clicking a card opens a detail dialog with a larger image, horse specs, full bid-history line chart and table, and the same bid/watch/tour actions.
    4. Lower split layout: "Recently Sold" on the left with two horizontal cards — Spirit, sold for $25,000; Daisy, sold for $14,000 — each with a clear SOLD badge, final price, and result link. On th
    5. A modest footer with contact, location, and social links.

    INTERACTIONS
    - Watch toggles persist locally, update the nav badge, and power a watchlist-only filtered view with an empty state.
    - Search filters auctions and sold horses by name or breed, with a clear empty state.
    - Place Bid opens a validated modal with the current bid, $500 minimum increment, and amount input. On submit, update the bid, bid count, chart, and show a success toast.
    - Request Virtual Tour opens a modal with name, email, preferred date/time, and notes, showing a confirmation on submit.
    - Login/Register open accessible tabbed modals with validated fields, clearly simulated.
    - Newsletter submission validates the email and shows a success message without reloading.
    - Countdowns tick live and switch to "Ended" at zero.

    RESPONSIVENESS & ACCESSIBILITY
    Three columns on desktop, two on tablet, one on mobile with a hamburger menu. Include keyboard focus states, ARIA labels and aria-pressed on toggles, focus-trapped dialogs with Escape/backdrop clo

    QUALITY BAR
    Use real microcopy and realistic content; no lorem ipsum or TODOs. Include empty, loading, and success states. Keep components clean and data separate. Ensure `npm run build` passes and the layout
