# Master Dashboard - RapidQS

Executive dashboard for tracking projects, leads, and financial performance.

## Features

✅ **Vision Board** - Strategic goals and KPIs  
✅ **Current Projects** - Live project tracking  
✅ **To-Do Projects** - Color-coded priority list  
✅ **Weekly Analysis** - What worked, what didn't  
🔌 **CFO Finance** - Stripe + bank account integration (coming soon)  
🔌 **Marketing Data** - FB ads, leads, metrics (coming soon)  
🔌 **GoHighLevel** - Live leads and pipeline (coming soon)  

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Recharts
- Lucide Icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Deployment

Deploy to Vercel with one click:

```bash
vercel deploy
```

## Environment Variables

Add your API keys to `.env.local`:

```
NEXT_PUBLIC_STRIPE_KEY=...
NEXT_PUBLIC_GHL_API_KEY=...
NEXT_PUBLIC_FB_ACCESS_TOKEN=...
NEXT_PUBLIC_BANK_API_KEY=...
```

## Structure

```
/app           - Next.js app router
/components    - Reusable dashboard components
/lib           - Utilities and helpers
/public        - Static assets
```

## API Integration

Components are ready for:
- Stripe API (income)
- Bank APIs (expenses)
- Facebook Ads API (marketing metrics)
- GoHighLevel API (leads & pipeline)
- Google Sheets API (financial data)

## License

Proprietary - RapidQS 2026
