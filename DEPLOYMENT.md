# Deployment Guide - Master Dashboard

## Prerequisites

1. Vercel account (free at vercel.com)
2. GitHub account with this repo
3. Node.js 18+ locally

## Deploy to Vercel (2 Minutes)

### Option 1: Vercel CLI (Fastest)

```bash
npm install -g vercel
cd /tmp/vercel-dashboard
vercel deploy
```

Follow the prompts and your dashboard goes live instantly.

### Option 2: Connect GitHub to Vercel

1. Push repo to GitHub:
```bash
git remote add origin https://github.com/YOUR_USERNAME/master-dashboard.git
git push -u origin main
```

2. Go to vercel.com → Import Project
3. Select your GitHub repo
4. Click Deploy
5. Done! Automatic deploys on every push

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Project Structure

```
master-dashboard/
├── app/                    # Next.js app router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main dashboard
│   └── globals.css         # Tailwind styles
├── components/             # Reusable components
│   ├── VisionBoard.tsx
│   ├── CurrentProjects.tsx
│   ├── ToDoProjects.tsx
│   ├── WeeklyAnalysis.tsx
│   └── Placeholder.tsx     # API-ready components
├── package.json            # Dependencies
└── README.md               # Project info
```

## Adding API Integrations

### Step 1: Set Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_STRIPE_KEY=sk_live_...
NEXT_PUBLIC_GHL_API_KEY=...
NEXT_PUBLIC_FB_ACCESS_TOKEN=...
NEXT_PUBLIC_BANK_API_KEY=...
```

### Step 2: Create API Routes

Example - `app/api/finance/route.ts`:

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  const stripeData = await fetch('https://api.stripe.com/v1/charges', {
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
    },
  });

  const data = await stripeData.json();
  return NextResponse.json(data);
}
```

### Step 3: Update Components

Replace placeholder calls:

```typescript
// Before
<Placeholder title="CFO Finance" ... />

// After
import { useEffect, useState } from 'react';

export default function CFOFinance() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/finance')
      .then(res => res.json())
      .then(setData);
  }, []);

  return <div>{/* Display data */}</div>;
}
```

## Integrations Roadmap

- ✅ Vision Board (Live)
- ✅ Current Projects (Live)
- ✅ To-Do Projects (Live)
- ✅ Weekly Analysis (Live)
- 🔌 CFO Finance (Stripe + Bank API)
- 🔌 Marketing Data (Facebook Ads API)
- 🔌 GoHighLevel (GHL API)

## Monitoring & Maintenance

### Vercel Dashboard
- https://vercel.com/dashboard
- Monitor deployments, logs, analytics

### Performance
- Core Web Vitals tracked automatically
- Lighthouse scores in Vercel Analytics

### Rollback
```bash
vercel rollback
```

## Support & Troubleshooting

### Build Fails
```bash
npm run build  # Test locally first
npm install --legacy-peer-deps  # If peer dependency issues
```

### Env Vars Not Loading
- Add to Vercel Project Settings → Environment Variables
- Restart deployment
- Vars must start with `NEXT_PUBLIC_` to be client-side

### Need to Debug
```bash
npm run dev  # Local testing
vercel env pull  # Pull production env vars locally
```

## Next Steps

1. ✅ Deploy to Vercel
2. 📝 Share dashboard URL with team
3. 🔌 Connect first API (Stripe)
4. 📊 Add real data to components
5. 🚀 Iterate based on feedback

---

**Deployed Dashboard:** [Your Vercel URL will appear here after deployment]

Questions? Check README.md or reach out to Keith.
