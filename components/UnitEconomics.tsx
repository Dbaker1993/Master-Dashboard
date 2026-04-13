'use client';

import { useEffect, useState } from 'react';

interface DashboardData {
  monthlyRevenue: { month: string; value: number; txns: number; live?: boolean }[];
  currentRevenue: number;
  grossMargin: number;
  netMargin: number;
  revenueTarget: number;
  profitTarget: number;
  meta: {
    todaySpend: number;
    todayLeads: number;
    weekSpend: number;
    weekLeads: number;
    monthSpend: number;
    monthLeads: number;
    dailyAvgSpend: number;
    cpl: number;
    impressionsMonth: number;
    reachMonth: number;
    dailyBreakdown: { date: string; spend: number; leads: number }[];
  };
  ghl: {
    weeklyLeads: number;
    todayLeads: number;
    leadsPerDay: number;
    pipeline: {
      total: number;
      won: number;
      quoted: number;
      stages: { name: string; count: number }[];
      winRate: number;
    };
    closeRate: number;
    winRate: number;
    quotedCount: number;
  };
  costs: {
    salesCostDaily: number;
    managerCostWeekly: number;
    contractorCostPerJob: number;
    monthlyAdSpend: number;
    monthlySalesCost: number;
    monthlyManagerCost: number;
    monthlyOpex: number;
    netProfit: number;
  };
  scaling: {
    avgJobValue: number;
    dealsPerMonth: number;
    dealsNeededFor180k: number;
    dealsNeededFor100kProfit: number;
    gapToTarget: number;
    lever_adSpend: { from: number; to: number; estimatedDeals: number };
    lever_closeRate: { from: number; to: number; estimatedDeals: number };
  };
  markets: { name: string; status: string; monthlyRev: number }[];
  bottleneck: string;
  lastUpdated: string;
}

const STAGE_COLORS: Record<string, string> = {
  'New Lead': 'bg-cyan-500',
  'Contacted - Spoke': 'bg-blue-500',
  'No Reply': 'bg-slate-500',
  'Hot Follow Up': 'bg-yellow-500',
  'Quoted': 'bg-purple-500',
  'Won': 'bg-green-500',
  'Other': 'bg-slate-600',
};

export default function UnitEconomics() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState('');

  const fetchData = async () => {
    try {
      const res = await fetch('/api/unit-economics');
      if (!res.ok) throw new Error('API error');
      const d = await res.json();
      setData(d);
      setLastRefresh(new Date().toLocaleTimeString('en-GB'));
    } catch (err) {
      console.error('Failed to fetch unit economics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fmt = (v: number) =>
    new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-slate-400">Loading live data from Meta, GHL, Stripe...</p>
        </div>
      </div>
    );
  }

  const maxRev = Math.max(...data.monthlyRevenue.map(m => m.value), data.revenueTarget);
  const currentProgress = Math.round((data.currentRevenue / data.revenueTarget) * 100);

  return (
    <div className="space-y-5">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">CEO Dashboard</h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Target: <span className="text-green-400 font-semibold">{fmt(data.revenueTarget)} revenue</span> = <span className="text-cyan-400 font-semibold">{fmt(data.profitTarget)} profit</span>/month
          </p>
        </div>
        <div className="text-right">
          <button onClick={fetchData} className="text-xs text-blue-400 hover:text-blue-300 mb-1 block ml-auto">↺ Refresh</button>
          <p className="text-xs text-slate-500">Updated {lastRefresh} · Live: Meta + GHL</p>
        </div>
      </div>

      {/* TOP KPI ROW */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-green-900/40 to-slate-800 border border-green-700/50 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">Last Month Revenue</p>
          <p className="text-3xl font-bold text-green-400">{fmt(data.currentRevenue)}</p>
          <p className="text-xs text-green-600 mt-1">March 2026</p>
        </div>
        <div className="bg-gradient-to-br from-blue-900/40 to-slate-800 border border-blue-700/50 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">Net Profit</p>
          <p className="text-3xl font-bold text-blue-400">{fmt(data.costs.netProfit)}</p>
          <p className="text-xs text-slate-500 mt-1">{data.netMargin}% net margin</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-900/40 to-slate-800 border border-yellow-700/50 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">Today's Ad Spend</p>
          <p className="text-3xl font-bold text-yellow-400">{fmt(data.meta.todaySpend)}</p>
          <p className="text-xs text-slate-500 mt-1">{data.meta.todayLeads} leads today</p>
        </div>
        <div className="bg-gradient-to-br from-cyan-900/40 to-slate-800 border border-cyan-700/50 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">Cost Per Lead (live)</p>
          <p className="text-3xl font-bold text-cyan-400">{fmt(data.meta.cpl)}</p>
          <p className="text-xs text-green-400 mt-1">✓ Under £20 target</p>
        </div>
      </div>

      {/* PROGRESS TO TARGET */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-slate-200">Progress to {fmt(data.revenueTarget)}/month</h3>
          <span className="text-sm text-slate-400">{currentProgress}% of target</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-4 mb-2">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all"
            style={{ width: `${Math.min(currentProgress, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>£0</span>
          <span className="text-blue-400 font-semibold">Now: {fmt(data.currentRevenue)}</span>
          <span className="text-green-400 font-semibold">Target: {fmt(data.revenueTarget)}</span>
        </div>
      </div>

      {/* REVENUE + META ADS SIDE BY SIDE */}
      <div className="grid grid-cols-2 gap-5">

        {/* Revenue Chart */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <h3 className="text-sm font-bold text-blue-400 mb-4">📈 Revenue Trajectory</h3>
          <div className="flex items-end gap-2 h-32 mb-3">
            {data.monthlyRevenue.map((m, i) => {
              const h = m.value > 0 ? (m.value / maxRev) * 100 : 3;
              return (
                <div key={i} className="flex-1 flex flex-col items-center">
                  {m.value > 0 && <div className="text-xs font-bold text-white mb-1">{fmt(m.value)}</div>}
                  <div
                    className={`w-full rounded-t transition-all ${
                      m.live ? 'bg-slate-600 border-t-2 border-dashed border-slate-400' :
                      i === data.monthlyRevenue.length - 2 ? 'bg-gradient-to-t from-blue-600 to-cyan-400' :
                      'bg-gradient-to-t from-blue-800 to-blue-500'
                    }`}
                    style={{ height: `${h}%` }}
                  />
                  <div className="text-xs text-slate-400 mt-1">{m.month}</div>
                </div>
              );
            })}
            <div className="flex-1 flex flex-col items-center">
              <div className="text-xs font-bold text-green-400 mb-1">TARGET</div>
              <div
                className="w-full rounded-t border-2 border-dashed border-green-500 bg-green-900/20"
                style={{ height: `${(data.revenueTarget / maxRev) * 100}%` }}
              />
              <div className="text-xs text-green-400 mt-1">{fmt(data.revenueTarget)}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-slate-900 rounded p-2">
              <div className="text-slate-400">Gross Margin</div>
              <div className="font-bold text-green-400">{data.grossMargin}%</div>
            </div>
            <div className="bg-slate-900 rounded p-2">
              <div className="text-slate-400">MoM Growth</div>
              <div className="font-bold text-cyan-400">+186%</div>
            </div>
          </div>
        </div>

        {/* Meta Ads Live */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-blue-400">📢 Meta Ads (Live)</h3>
            <span className="text-xs text-green-400 bg-green-900/30 px-2 py-0.5 rounded">● LIVE</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-slate-900 rounded p-2 text-center">
              <div className="text-slate-400 text-xs">Today Spend</div>
              <div className="font-bold text-yellow-400">{fmt(data.meta.todaySpend)}</div>
            </div>
            <div className="bg-slate-900 rounded p-2 text-center">
              <div className="text-slate-400 text-xs">Today Leads</div>
              <div className="font-bold text-cyan-400">{data.meta.todayLeads}</div>
            </div>
            <div className="bg-slate-900 rounded p-2 text-center">
              <div className="text-slate-400 text-xs">Month Spend</div>
              <div className="font-bold text-red-400">{fmt(data.meta.monthSpend)}</div>
            </div>
            <div className="bg-slate-900 rounded p-2 text-center">
              <div className="text-slate-400 text-xs">Month Leads</div>
              <div className="font-bold text-blue-400">{data.meta.monthLeads}</div>
            </div>
            <div className="bg-slate-900 rounded p-2 text-center">
              <div className="text-slate-400 text-xs">CPL (month)</div>
              <div className="font-bold text-green-400">{fmt(data.meta.cpl)}</div>
            </div>
            <div className="bg-slate-900 rounded p-2 text-center">
              <div className="text-slate-400 text-xs">Avg Daily Spend</div>
              <div className="font-bold text-slate-300">{fmt(data.meta.dailyAvgSpend)}</div>
            </div>
          </div>
          {/* Daily sparkline */}
          <div>
            <p className="text-xs text-slate-500 mb-1">Last 7 days daily spend</p>
            <div className="flex items-end gap-1 h-10">
              {data.meta.dailyBreakdown.map((d, i) => {
                const maxSpend = Math.max(...data.meta.dailyBreakdown.map(x => x.spend));
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-yellow-500/70 rounded-t"
                      style={{ height: `${(d.spend / maxSpend) * 100}%` }}
                      title={`${d.date}: £${d.spend.toFixed(0)} | ${d.leads} leads`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* GHL PIPELINE + SALES */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-yellow-400">🎯 GHL Pipeline & Sales Performance (Live)</h3>
          <span className="text-xs text-green-400 bg-green-900/30 px-2 py-0.5 rounded">● LIVE</span>
        </div>
        <div className="grid grid-cols-5 gap-3 mb-5">
          <div className="bg-slate-900 rounded p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">Leads This Week</div>
            <div className="text-2xl font-bold text-cyan-400">{data.ghl.weeklyLeads}</div>
          </div>
          <div className="bg-slate-900 rounded p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">Daily Average</div>
            <div className="text-2xl font-bold text-cyan-400">{data.ghl.leadsPerDay}</div>
          </div>
          <div className="bg-slate-900 rounded p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">Pipeline (total)</div>
            <div className="text-2xl font-bold text-blue-400">{data.ghl.pipeline.total}</div>
          </div>
          <div className={`bg-slate-900 rounded p-3 text-center ${data.ghl.closeRate < 8 ? 'border border-yellow-600' : ''}`}>
            <div className="text-xs text-slate-400 mb-1">Win Rate</div>
            <div className={`text-2xl font-bold ${data.ghl.closeRate < 8 ? 'text-yellow-400' : 'text-green-400'}`}>
              {data.ghl.closeRate}%
            </div>
            {data.ghl.closeRate < 8 && <div className="text-xs text-yellow-500">Target: 15%</div>}
          </div>
          <div className="bg-slate-900 rounded p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">Quoted</div>
            <div className="text-2xl font-bold text-purple-400">{data.ghl.quotedCount}</div>
          </div>
        </div>

        {/* Pipeline stages */}
        <div className="space-y-2">
          {data.ghl.pipeline.stages
            .sort((a, b) => b.count - a.count)
            .map((stage, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-32 text-xs text-slate-400 text-right shrink-0">{stage.name}</div>
              <div className="flex-1 bg-slate-700 rounded h-5 overflow-hidden">
                <div
                  className={`h-full ${STAGE_COLORS[stage.name] || 'bg-slate-500'} rounded transition-all flex items-center justify-end pr-2`}
                  style={{ width: `${Math.max((stage.count / data.ghl.pipeline.total) * 100, 5)}%` }}
                >
                  <span className="text-xs font-bold text-white">{stage.count}</span>
                </div>
              </div>
              <div className="text-xs text-slate-500 w-8">{Math.round(stage.count / data.ghl.pipeline.total * 100)}%</div>
            </div>
          ))}
        </div>

        {data.ghl.closeRate < 8 && (
          <div className="mt-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-3 text-sm">
            🟡 <strong className="text-yellow-300">Sales is the bottleneck.</strong>{' '}
            <span className="text-slate-300">Win rate {data.ghl.closeRate}% vs target 15%. Josh needs coaching + more authority content from David.</span>
          </div>
        )}
      </div>

      {/* COST STRUCTURE */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
        <h3 className="text-sm font-bold text-red-400 mb-4">💸 Real Cost Structure (Daily + Monthly)</h3>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 text-xs border-b border-slate-700">
                  <th className="text-left pb-2">Cost Item</th>
                  <th className="text-right pb-2">Daily</th>
                  <th className="text-right pb-2">Monthly</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                <tr className="border-b border-slate-700/50">
                  <td className="py-2 text-slate-300">📢 Meta Ads</td>
                  <td className="text-right text-yellow-400">{fmt(data.meta.dailyAvgSpend)}</td>
                  <td className="text-right text-yellow-400">{fmt(data.costs.monthlyAdSpend)}</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-2 text-slate-300">🤙 Josh (Sales)</td>
                  <td className="text-right text-red-400">{fmt(data.costs.salesCostDaily)}</td>
                  <td className="text-right text-red-400">{fmt(data.costs.monthlySalesCost)}</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-2 text-slate-300">👔 Stuart (Manager)</td>
                  <td className="text-right text-red-400">{fmt(Math.round(data.costs.managerCostWeekly / 5))}</td>
                  <td className="text-right text-red-400">{fmt(data.costs.monthlyManagerCost)}</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-2 text-slate-300">🔧 Contractor /job</td>
                  <td className="text-right text-orange-400 text-xs">£{data.costs.contractorCostPerJob}/job</td>
                  <td className="text-right text-orange-400">variable</td>
                </tr>
                <tr>
                  <td className="py-2 font-semibold text-white">Total OPEX</td>
                  <td className="text-right font-bold text-slate-300">{fmt(Math.round(data.costs.monthlyOpex / 30))}</td>
                  <td className="text-right font-bold text-red-400">{fmt(data.costs.monthlyOpex)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-slate-900 rounded-lg p-4">
            <h4 className="font-semibold text-slate-300 mb-4 text-sm">March P&L</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Revenue</span>
                <span className="text-green-400 font-bold">{fmt(data.currentRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total OPEX</span>
                <span className="text-red-400">−{fmt(data.costs.monthlyOpex)}</span>
              </div>
              <div className="border-t border-slate-700 pt-2 flex justify-between">
                <span className="font-semibold text-white">Net Profit</span>
                <span className="text-cyan-400 text-xl font-bold">{fmt(data.costs.netProfit)}</span>
              </div>
              <div className="border-t border-slate-700 pt-2 text-xs text-slate-500">
                Need {fmt(data.revenueTarget)} revenue → {fmt(data.profitTarget)} profit target
                <div className="text-yellow-400 mt-1">Gap: {fmt(data.profitTarget - data.costs.netProfit)}/month to close</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SCALING MODEL */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
        <h3 className="text-sm font-bold text-purple-400 mb-4">🚀 Scaling Model — Path to £180k/Month</h3>
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-slate-900 rounded p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">Avg Job Value</div>
            <div className="text-2xl font-bold text-green-400">{fmt(data.scaling.avgJobValue)}</div>
          </div>
          <div className="bg-slate-900 rounded p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">Deals Now</div>
            <div className="text-2xl font-bold text-yellow-400">{data.scaling.dealsPerMonth}/mo</div>
          </div>
          <div className="bg-slate-900 rounded p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">Deals Needed</div>
            <div className="text-2xl font-bold text-red-400">{data.scaling.dealsNeededFor180k}/mo</div>
            <div className="text-xs text-slate-500">gap: {data.scaling.gapToTarget} more</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-3">
            <p className="text-xs font-bold text-blue-300 mb-1">Lever A: Ad Spend</p>
            <p className="text-xs text-slate-400">{fmt(data.scaling.lever_adSpend.from)}/day → £250/day</p>
            <p className="text-xs text-green-400 mt-1">~{data.scaling.lever_adSpend.estimatedDeals} deals/month</p>
          </div>
          <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-3">
            <p className="text-xs font-bold text-yellow-300 mb-1">Lever B: Close Rate</p>
            <p className="text-xs text-slate-400">{data.scaling.lever_closeRate.from}% → 15% (content)</p>
            <p className="text-xs text-green-400 mt-1">~{data.scaling.lever_closeRate.estimatedDeals} deals/month</p>
          </div>
          <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-3">
            <p className="text-xs font-bold text-green-300 mb-1">Both Together</p>
            <p className="text-xs text-slate-400">Ads up + Josh rate to 15%</p>
            <p className="text-xs text-green-400 mt-1">~{fmt(data.scaling.lever_adSpend.estimatedDeals * data.scaling.avgJobValue)}/month</p>
          </div>
        </div>
      </div>

      {/* MARKETS */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
        <h3 className="text-sm font-bold text-green-400 mb-4">🌍 Market Expansion (£3–5M/year path)</h3>
        <div className="grid grid-cols-4 gap-3">
          {data.markets.map((m, i) => (
            <div key={i} className={`rounded-lg p-3 border ${
              m.status === 'active' ? 'border-green-600 bg-green-900/20' :
              m.status === 'clients' ? 'border-blue-600 bg-blue-900/20' :
              'border-slate-600 bg-slate-900'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">
                  {m.name === 'UK' ? '🇬🇧' : m.name === 'Portugal' ? '🇵🇹' : m.name === 'Spain' ? '🇪🇸' : '🇺🇸'}
                </span>
                <span className="font-semibold text-sm">{m.name}</span>
              </div>
              <div className={`text-xs font-medium ${
                m.status === 'active' ? 'text-green-400' :
                m.status === 'clients' ? 'text-blue-400' :
                'text-slate-500'
              }`}>
                {m.status === 'active' ? '● Active' : m.status === 'clients' ? '● Has clients' : '○ Target'}
              </div>
              {m.monthlyRev > 0 && (
                <div className="text-xs text-green-400 mt-1">{fmt(m.monthlyRev)}/mo</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div className="text-xs text-slate-600 text-center">
        Data: Meta Ads API (live) + GHL CRM (live) + Manual P&L · Updates every 60s · Cron refresh 8am daily
      </div>
    </div>
  );
}
