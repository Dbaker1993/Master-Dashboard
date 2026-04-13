'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Target, Users, CheckCircle } from 'lucide-react';

interface UnitEconomicsData {
  // Revenue
  monthlyRevenue: { month: string; value: number }[];
  grossMargin: number;
  netMargin: number;
  revenueTarget: number;

  // Sales
  costPerLead: number;
  closeRate: number;
  costPerClose: number;
  leadsPerDay: number;
  currentAdSpend: number;
  targetAdSpend: number;

  // Team
  revenuePerStaff: number;
  staffCost: number;
  totalRevenue: number;
  dealsNeededFor100k: number;
  staffNeededFor100k: number;

  // Bottleneck
  bottleneck: 'marketing' | 'sales' | 'delivery' | 'onboarding' | 'none';

  loading: boolean;
  error: string | null;
  lastUpdated: string;
}

export default function UnitEconomics() {
  const [data, setData] = useState<UnitEconomicsData>({
    monthlyRevenue: [
      { month: 'Jan', value: 7000 },
      { month: 'Feb', value: 14000 },
      { month: 'Mar', value: 40000 },
    ],
    grossMargin: 90,
    netMargin: 55,
    revenueTarget: 100000,
    costPerLead: 18.50,
    closeRate: 11,
    costPerClose: 168,
    leadsPerDay: 12.5,
    currentAdSpend: 160,
    targetAdSpend: 250,
    revenuePerStaff: 40000,
    staffCost: 22000,
    totalRevenue: 40000,
    dealsNeededFor100k: 100,
    staffNeededFor100k: 3,
    bottleneck: 'sales',
    loading: false,
    error: null,
    lastUpdated: new Date().toLocaleTimeString(),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/unit-economics', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Failed to fetch unit economics data');

        const result = await response.json();
        setData(prev => ({
          ...prev,
          ...result,
          loading: false,
          lastUpdated: new Date().toLocaleTimeString(),
        }));
      } catch (err) {
        console.log('Using fallback data (API not yet configured)');
        setData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const maxRevenue = Math.max(...data.monthlyRevenue.map(m => m.value), data.revenueTarget);
  
  const getBottleneckInfo = () => {
    const bottlenecks: Record<string, { label: string; color: string; icon: string; desc: string }> = {
      marketing: { label: 'Marketing', color: 'text-red-400', icon: '🔴', desc: 'Increasing ad spend is the lever' },
      sales: { label: 'Sales', color: 'text-yellow-400', icon: '🟡', desc: 'Josh needs coaching or capacity increase' },
      delivery: { label: 'Delivery', color: 'text-orange-400', icon: '🟠', desc: 'Stuart needs ramp or backup' },
      onboarding: { label: 'Onboarding', color: 'text-purple-400', icon: '🟣', desc: 'Client success/retention issue' },
      none: { label: 'All Systems Go', color: 'text-green-400', icon: '🟢', desc: 'Balanced growth' },
    };
    return bottlenecks[data.bottleneck];
  };

  const bottleneckInfo = getBottleneckInfo();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Unit Economics Dashboard</h2>
        <div className="text-xs text-slate-400">
          Last updated: {data.lastUpdated}
        </div>
      </div>

      {/* Revenue Engine */}
      <div className="card">
        <h3 className="text-xl font-bold mb-6 text-blue-400">📈 Revenue Engine</h3>
        
        <div className="space-y-6">
          {/* Chart */}
          <div>
            <div className="flex items-end gap-2 h-48">
              {data.monthlyRevenue.map((month, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div className="text-xs font-bold mb-2">
                    {formatCurrency(month.value)}
                  </div>
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-lg transition-all"
                    style={{ height: `${(month.value / maxRevenue) * 100}%` }}
                  />
                  <div className="text-xs text-slate-400 mt-2">{month.month}</div>
                </div>
              ))}
              {/* Target line */}
              <div className="absolute right-24 text-xs text-green-400 font-bold">
                Target: {formatCurrency(data.revenueTarget)}
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <p className="text-slate-400 text-sm mb-1">Gross Margin</p>
              <p className="text-3xl font-bold text-green-400">{data.grossMargin}%</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <p className="text-slate-400 text-sm mb-1">Net Margin</p>
              <p className="text-3xl font-bold text-blue-400">{data.netMargin}%</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <p className="text-slate-400 text-sm mb-1">Monthly Growth</p>
              <p className="text-3xl font-bold text-cyan-400">
                +186%
                <span className="text-lg ml-1">📈</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Machine */}
      <div className="card">
        <h3 className="text-xl font-bold mb-6 text-yellow-400">🎯 Sales Machine (Josh)</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* CPL Tracker */}
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <p className="text-slate-400 text-sm mb-3">Cost Per Lead</p>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-4xl font-bold text-cyan-400">
                  {formatCurrency(data.costPerLead)}
                </span>
                <span className="text-sm text-green-400">✓ Target: <20</span>
              </div>
              <div className="w-full bg-slate-700 rounded h-2">
                <div
                  className={`h-full rounded transition-all ${
                    data.costPerLead < 20 ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${Math.min((data.costPerLead / 20) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Close Rate */}
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <p className="text-slate-400 text-sm mb-3">Close Rate</p>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-4xl font-bold text-green-400">
                  {data.closeRate}%
                </span>
                <span className="text-sm text-slate-400">(vs 5% avg)</span>
              </div>
              <div className="w-full bg-slate-700 rounded h-2">
                <div
                  className="h-full rounded bg-green-500 transition-all"
                  style={{ width: `${Math.min(data.closeRate * 2, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Additional metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <p className="text-slate-400 text-sm mb-1">Cost Per Close</p>
              <p className="text-2xl font-bold text-blue-400">{formatCurrency(data.costPerClose)}</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <p className="text-slate-400 text-sm mb-1">Leads/Day (Josh)</p>
              <p className="text-2xl font-bold text-cyan-400">{data.leadsPerDay.toFixed(1)}</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <p className="text-slate-400 text-sm mb-1">Daily Ad Spend</p>
              <p className="text-xl font-bold text-slate-300">
                {formatCurrency(data.currentAdSpend)} / {formatCurrency(data.targetAdSpend)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Economics */}
      <div className="card">
        <h3 className="text-xl font-bold mb-6 text-purple-400">👥 Team Economics (The Scaling Model)</h3>
        
        <div className="space-y-4">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="mb-6">
              <h4 className="font-semibold text-purple-300 mb-3">How Many "Stuarts" Do We Need?</h4>
              <p className="text-sm text-slate-400 mb-4">
                At £40k/month with {data.staffNeededFor100k} staff needed to hit £100k/month target
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-slate-400 text-xs mb-1">Revenue/Staff</p>
                  <p className="text-2xl font-bold text-green-400">
                    {formatCurrency(data.revenuePerStaff)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">Staff Cost</p>
                  <p className="text-2xl font-bold text-red-400">
                    {formatCurrency(data.staffCost)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">Margin/Staff</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {formatCurrency(data.revenuePerStaff - data.staffCost)}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-600 pt-4">
              <h4 className="font-semibold text-slate-300 mb-3">Path to £100k/Month</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="text-slate-400">Deals needed @ 11% close rate</span>
                    <span className="font-bold text-cyan-400">{data.dealsNeededFor100k} deals</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded h-2">
                    <div
                      className="h-full rounded bg-cyan-500 transition-all"
                      style={{ width: '40%' }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="text-slate-400">Staff needed (delivery + sales)</span>
                    <span className="font-bold text-purple-400">{data.staffNeededFor100k} people</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded h-2">
                    <div
                      className="h-full rounded bg-purple-500 transition-all"
                      style={{ width: '30%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CEO Bottleneck Indicator */}
      <div className="card bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700">
        <h3 className="text-xl font-bold mb-6 text-slate-200">🚦 CEO Bottleneck Indicator (Tim's Framework)</h3>
        
        <div className="flex items-center gap-6 mb-6">
          <div className="text-6xl">{bottleneckInfo.icon}</div>
          <div>
            <p className="text-3xl font-bold mb-1">{bottleneckInfo.label}</p>
            <p className="text-slate-300 text-sm">{bottleneckInfo.desc}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          {['Marketing', 'Sales', 'Delivery', 'Onboarding'].map((fn, i) => {
            const statuses: Record<string, string> = {
              'Marketing': data.bottleneck === 'marketing' ? '🔴' : '🟢',
              'Sales': data.bottleneck === 'sales' ? '🟡' : '🟢',
              'Delivery': data.bottleneck === 'delivery' ? '🟠' : '🟢',
              'Onboarding': data.bottleneck === 'onboarding' ? '🟣' : '🟢',
            };
            return (
              <div key={i} className="bg-slate-700 rounded p-3 flex items-center gap-2">
                <span className="text-xl">{statuses[fn]}</span>
                <span className="text-slate-300">{fn}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scaling Roadmap */}
      <div className="card">
        <h3 className="text-xl font-bold mb-6 text-green-400">🗺️ Scaling Roadmap</h3>
        
        <div className="space-y-3">
          {[
            { stage: 'Q2 2026', goal: '£100k/month UK', milestone: 'Now' },
            { stage: 'Q3 2026', goal: 'USA test (Texas)', milestone: '£100/day ads' },
            { stage: 'Q4 2026', goal: 'USA scaling (3 states)', milestone: '£250/day spend' },
            { stage: 'Q1 2027', goal: '£500k/month (UK+USA)', milestone: 'Multi-market ops' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                i === 0 ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'
              }`}>
                {i === 0 ? '✓' : i + 1}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{item.stage}</p>
                <p className="text-sm text-slate-400">{item.goal}</p>
              </div>
              <p className="text-sm text-slate-500">{item.milestone}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Input Section */}
      <div className="card border-l-4 border-orange-500">
        <h3 className="text-xl font-bold mb-4 text-orange-400">✏️ Weekly Update Form</h3>
        <p className="text-sm text-slate-400 mb-4">
          Update these values weekly (Monday morning) to keep metrics accurate
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-400 block mb-2">Josh's Close Rate This Week (%)</label>
            <input
              type="number"
              defaultValue={data.closeRate}
              placeholder="e.g. 11"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-200 text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 block mb-2">Cost Per Lead (£)</label>
            <input
              type="number"
              defaultValue={data.costPerLead}
              placeholder="e.g. 18.50"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-200 text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 block mb-2">Calls Recorded This Week</label>
            <input
              type="number"
              placeholder="e.g. 75"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-200 text-sm"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 block mb-2">Daily Ad Spend (£)</label>
            <input
              type="number"
              defaultValue={data.currentAdSpend}
              placeholder="e.g. 160"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-200 text-sm"
            />
          </div>
        </div>
        <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold text-sm text-white transition-colors">
          Save Weekly Update
        </button>
      </div>
    </div>
  );
}
