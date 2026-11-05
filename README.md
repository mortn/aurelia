# Aurelia Equine

A responsive, frontend-only horse auction experience built with Next.js App Router, TypeScript, Tailwind CSS, lucide-react, and Recharts.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Create a production build with `npm run build`; run a standalone type check with `npm run typecheck`.

## What’s included

- Live and upcoming lots with ticking countdowns, bid history charts, and accessible horse-detail dialogs.
- Simulated bidding with minimum-increment validation and local success feedback.
- Watchlist saved to `localStorage`, responsive navigation, and combined name/breed search.
- Sold-horse results, newsletter signup, virtual-tour request, and simulated login/register flows.
- Responsive desktop, tablet, and mobile layouts; no backend, real account, or payment processing.

Horse photography is loaded from Unsplash. Watchlist data is stored locally in the browser; all other auction data is mock data held in page state.
