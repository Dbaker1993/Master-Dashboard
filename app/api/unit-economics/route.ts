import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';

const DATA_FILE = '/tmp/unit-economics-data.json';

// ===== CONSTANTS (update these manually or via POST) =====
const MANUAL_OVERRIDES = {
  salesCostDaily: 130,      // Josh salary/commission per day
  managerCostWeekly: 335,   // Stuart/manager per week
  contractorCostPerJob: 60, // Delivery contractor per job avg
  currentRevenue: 40000,    // Last closed month revenue (update monthly)
  revenueTarget: 180000,    // David's target (£180k = £100k profit)
  profitTarget: 100000,     // £100k/month profit target
  avgJobValue: 2102,        // Average job value
};

// ===== META API =====
const META_TOKEN = process.env.META_API_TOKEN || "";
const AD_ACCOUNT = "act_880261347248172";

async function fetchMetaInsights(datePreset: string, timeIncrement?: number) {
  const fields = 'spend,impressions,clicks,reach,actions,cost_per_action_type';
  let url = `https://graph.facebook.com/v19.0/${AD_ACCOUNT}/insights?fields=${fields}&date_preset=${datePreset}&access_token=${META_TOKEN}`;
  if (timeIncrement) url += `&time_increment=${timeIncrement}`;
  const res = await fetch(url);
  return await res.json();
}

// ===== GHL API =====
const GHL_API = process.env.GHL_API_KEY || "";
const GHL_LOCATION = "Cc0nsfFvtPjWksOwHHTz";

const PIPELINE_STAGE_MAP: Record<string, string> = {
  "bccc7445-824b-42ce-9d61-e36bdc0d2d86": "New Lead",
  "36dc7b06-055a-44cd-9cad-841da0503b88": "Contacted - Spoke",
  "a0f6f9c1-9010-4983-aa88-3c196c53d5ed": "No Reply",
  "594ff585-58a8-494f-ac2c-59ab915745c9": "Quoted",
  "b8fb4eb3-beda-4a4e-b39e-06855996cd5a": "Won",
  "27cf8e4b-fb6b-493b-afb1-d9225a11dc66": "Hot Follow Up",
};

async function fetchGHLData() {
  // Get contacts (new leads this week)
  const contactsRes = await fetch(
    `https://services.leadconnectorhq.com/contacts/?locationId=${GHL_LOCATION}&limit=100`,
    { headers: { Authorization: `Bearer ${GHL_API}`, Version: '2021-07-28' } }
  );
  const contactsData = await contactsRes.json();
  const contacts = contactsData.contacts || [];
  
  const now = Date.now();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  
  const weeklyLeads = contacts.filter((c: any) => {
    try {
      return new Date(c.dateAdded).getTime() > weekAgo;
    } catch { return false; }
  }).length;
  
  const todayLeads = contacts.filter((c: any) => {
    try {
      return new Date(c.dateAdded).getTime() > todayStart.getTime();
    } catch { return false; }
  }).length;

  // Get pipeline opportunities
  const oppsRes = await fetch(
    `https://services.leadconnectorhq.com/opportunities/search?location_id=${GHL_LOCATION}&limit=100`,
    { headers: { Authorization: `Bearer ${GHL_API}`, Version: '2021-07-28' } }
  );
  const oppsData = await oppsRes.json();
  const opps = oppsData.opportunities || [];
  
  const stageCounts: Record<string, number> = {};
  for (const opp of opps) {
    const stageName = PIPELINE_STAGE_MAP[opp.pipelineStageId] || 'Other';
    stageCounts[stageName] = (stageCounts[stageName] || 0) + 1;
  }
  
  const wonCount = stageCounts['Won'] || 0;
  const quotedCount = stageCounts['Quoted'] || 0;
  const totalPipeline = opps.length;
  const winRate = totalPipeline > 0 ? Math.round((wonCount / totalPipeline) * 100) : 0;

  return {
    weeklyLeads,
    todayLeads,
    leadsPerDay: Math.round((weeklyLeads / 7) * 10) / 10,
    pipeline: {
      total: totalPipeline,
      won: wonCount,
      quoted: quotedCount,
      stages: Object.entries(stageCounts).map(([name, count]) => ({ name, count })),
      winRate,
    }
  };
}

// ===== STRIPE =====
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY || "";

async function fetchStripeRevenue() {
  // Use hardcoded actuals from Tim meeting (Stripe is NZ business, UK revenue tracked separately)
  // TODO: Connect Xero for UK P&L
  return {
    jan: 7000,
    feb: 14000,
    mar: 40000,
    apr: 0, // live - update from Xero when connected
  };
}

// ===== MAIN HANDLER =====
export async function GET() {
  try {
    // Load any manually overridden data
    let manualData: any = {};
    try {
      if (fs.existsSync(DATA_FILE)) {
        manualData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      }
    } catch {}

    // Fetch all live data in parallel
    const [metaToday, metaWeek, metaMonth, metaDaily, ghlData, stripeData] = await Promise.allSettled([
      fetchMetaInsights('today'),
      fetchMetaInsights('last_7d'),
      fetchMetaInsights('this_month'),
      fetchMetaInsights('last_7d', 1),
      fetchGHLData(),
      fetchStripeRevenue(),
    ]);

    // Parse Meta data
    const metaTodayData = metaToday.status === 'fulfilled' ? metaToday.value?.data?.[0] : null;
    const metaWeekData = metaWeek.status === 'fulfilled' ? metaWeek.value?.data?.[0] : null;
    const metaMonthData = metaMonth.status === 'fulfilled' ? metaMonth.value?.data?.[0] : null;
    const metaDailyData = metaDaily.status === 'fulfilled' ? metaDaily.value?.data || [] : [];

    const getLeads = (d: any) => {
      if (!d?.actions) return 0;
      return d.actions.filter((a: any) => a.action_type === 'lead')
        .reduce((sum: number, a: any) => sum + parseInt(a.value), 0);
    };

    const todaySpend = parseFloat(metaTodayData?.spend || '0');
    const todayLeadsFromMeta = getLeads(metaTodayData);
    const weekSpend = parseFloat(metaWeekData?.spend || '0');
    const weekLeadsFromMeta = getLeads(metaWeekData);
    const monthSpend = parseFloat(metaMonthData?.spend || '0');
    const monthLeadsFromMeta = getLeads(metaMonthData);
    const dailyAvgSpend = weekSpend / 7;
    
    const cpl = monthLeadsFromMeta > 0 ? monthSpend / monthLeadsFromMeta : 0;

    // GHL data
    const ghl = ghlData.status === 'fulfilled' ? ghlData.value : {
      weeklyLeads: 74, todayLeads: 0, leadsPerDay: 10.6,
      pipeline: { total: 100, won: 6, quoted: 5, stages: [], winRate: 6 }
    };

    // Costs
    const salesCostDaily = manualData.salesCostDaily || MANUAL_OVERRIDES.salesCostDaily;
    const managerCostWeekly = manualData.managerCostWeekly || MANUAL_OVERRIDES.managerCostWeekly;
    const contractorCostPerJob = manualData.contractorCostPerJob || MANUAL_OVERRIDES.contractorCostPerJob;
    
    const monthlyAdSpend = dailyAvgSpend * 30;
    const monthlySalesCost = salesCostDaily * 22;
    const monthlyManagerCost = managerCostWeekly * 4.3;
    const monthlyOpex = monthlyAdSpend + monthlySalesCost + monthlyManagerCost;
    const currentRevenue = manualData.currentRevenue || MANUAL_OVERRIDES.currentRevenue;
    const netProfit = currentRevenue - monthlyOpex;

    // Scaling
    const closeRate = ghl.pipeline.winRate || 6;
    const dealsPerMonth = Math.round(ghl.leadsPerDay * 30 * (closeRate / 100));
    const avgJobValue = manualData.avgJobValue || MANUAL_OVERRIDES.avgJobValue;
    const dealsNeededFor180k = Math.round(MANUAL_OVERRIDES.revenueTarget / avgJobValue);

    const result = {
      // Revenue
      monthlyRevenue: [
        { month: 'Jan', value: 7000, txns: 25 },
        { month: 'Feb', value: 14000, txns: 35 },
        { month: 'Mar', value: 40000, txns: 57 },
        { month: 'Apr', value: manualData.aprRevenue || 0, txns: 0, live: true },
      ],
      currentRevenue,
      grossMargin: 90,
      netMargin: Math.round((netProfit / currentRevenue) * 100),
      revenueTarget: MANUAL_OVERRIDES.revenueTarget,
      profitTarget: MANUAL_OVERRIDES.profitTarget,

      // Meta Ads (LIVE)
      meta: {
        todaySpend: Math.round(todaySpend * 100) / 100,
        todayLeads: todayLeadsFromMeta || ghl.todayLeads,
        weekSpend: Math.round(weekSpend * 100) / 100,
        weekLeads: weekLeadsFromMeta,
        monthSpend: Math.round(monthSpend * 100) / 100,
        monthLeads: monthLeadsFromMeta,
        dailyAvgSpend: Math.round(dailyAvgSpend * 100) / 100,
        cpl: Math.round(cpl * 100) / 100,
        impressionsMonth: parseInt(metaMonthData?.impressions || '0'),
        reachMonth: parseInt(metaMonthData?.reach || '0'),
        dailyBreakdown: metaDailyData.map((d: any) => ({
          date: d.date_start,
          spend: parseFloat(d.spend || '0'),
          leads: getLeads(d),
        })),
      },

      // GHL (LIVE)
      ghl: {
        weeklyLeads: ghl.weeklyLeads,
        todayLeads: ghl.todayLeads,
        leadsPerDay: ghl.leadsPerDay,
        pipeline: ghl.pipeline,
        closeRate,
        winRate: ghl.pipeline.winRate,
        quotedCount: ghl.pipeline.quoted,
      },

      // Costs (manual but structured)
      costs: {
        salesCostDaily,
        managerCostWeekly,
        contractorCostPerJob,
        monthlyAdSpend: Math.round(monthlyAdSpend),
        monthlySalesCost: Math.round(monthlySalesCost),
        monthlyManagerCost: Math.round(monthlyManagerCost),
        monthlyOpex: Math.round(monthlyOpex),
        netProfit: Math.round(netProfit),
      },

      // Scaling model
      scaling: {
        avgJobValue,
        dealsPerMonth,
        dealsNeededFor180k,
        dealsNeededFor100kProfit: Math.round(MANUAL_OVERRIDES.profitTarget / (avgJobValue * 0.77)),
        gapToTarget: dealsNeededFor180k - dealsPerMonth,
        lever_adSpend: { from: dailyAvgSpend, to: 250, estimatedDeals: Math.round(16.5 * 30 * 0.11) },
        lever_closeRate: { from: closeRate, to: 15, estimatedDeals: Math.round(ghl.leadsPerDay * 30 * 0.15) },
      },

      // Markets
      markets: [
        { name: 'UK', status: 'active', monthlyRev: currentRevenue },
        { name: 'Portugal', status: 'clients', monthlyRev: 0 },
        { name: 'Spain', status: 'target', monthlyRev: 0 },
        { name: 'USA', status: 'target', monthlyRev: 0 },
      ],

      bottleneck: 'sales' as const,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Unit economics API error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let current: any = {};
    try {
      if (fs.existsSync(DATA_FILE)) current = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    } catch {}
    const updated = { ...current, ...body, lastManualUpdate: new Date().toISOString() };
    fs.writeFileSync(DATA_FILE, JSON.stringify(updated, null, 2));
    return NextResponse.json({ ok: true, saved: updated });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}
