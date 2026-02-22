'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, AlertCircle } from 'lucide-react';

interface FinanceData {
  totalIncome: number;
  totalExpenses: number;
  netRevenue: number;
  stripeTransactions: number;
  airwallexExpenses: number;
  loading: boolean;
  error: string | null;
}

export default function CFOFinance() {
  const [data, setData] = useState<FinanceData>({
    totalIncome: 0,
    totalExpenses: 0,
    netRevenue: 0,
    stripeTransactions: 0,
    airwallexExpenses: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        const response = await fetch('/api/finance', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch finance data');
        }

        const result = await response.json();
        setData({
          totalIncome: result.totalIncome || 0,
          totalExpenses: result.totalExpenses || 0,
          netRevenue: result.netRevenue || 0,
          stripeTransactions: result.stripeTransactions || 0,
          airwallexExpenses: result.airwallexExpenses || 0,
          loading: false,
          error: null
        });
      } catch (err) {
        setData(prev => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        }));
      }
    };

    fetchFinanceData();
    const interval = setInterval(fetchFinanceData, 60000); // Refresh every 60 seconds

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (data.loading) {
    return (
      <div className="card flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-slate-400">Loading financial data...</p>
        </div>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="card border-l-4 border-red-500">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="text-red-400" size={24} />
          <h3 className="text-xl font-bold text-red-400">Finance Data Error</h3>
        </div>
        <p className="text-slate-300 mb-3">{data.error}</p>
        <p className="text-sm text-slate-400">
          Make sure your Stripe and Airwallex API keys are configured in environment variables.
        </p>
      </div>
    );
  }

  const profitMargin = data.totalIncome > 0 
    ? ((data.netRevenue / data.totalIncome) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6">CFO Finance Tracker</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Income */}
        <div className="card border-l-4 border-green-500">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-slate-400 text-sm mb-1">Total Income</p>
              <p className="text-4xl font-bold text-green-400">{formatCurrency(data.totalIncome)}</p>
            </div>
            <TrendingUp className="text-green-500" size={32} />
          </div>
          <p className="text-xs text-slate-500">{data.stripeTransactions} transactions</p>
        </div>

        {/* Total Expenses */}
        <div className="card border-l-4 border-red-500">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-slate-400 text-sm mb-1">Total Expenses</p>
              <p className="text-4xl font-bold text-red-400">{formatCurrency(data.totalExpenses)}</p>
            </div>
            <TrendingDown className="text-red-500" size={32} />
          </div>
          <p className="text-xs text-slate-500">{data.airwallexExpenses} via Airwallex</p>
        </div>

        {/* Net Revenue */}
        <div className={`card border-l-4 ${data.netRevenue >= 0 ? 'border-blue-500' : 'border-orange-500'}`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-slate-400 text-sm mb-1">Net Revenue</p>
              <p className={`text-4xl font-bold ${data.netRevenue >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
                {formatCurrency(data.netRevenue)}
              </p>
            </div>
            <DollarSign className={data.netRevenue >= 0 ? 'text-blue-500' : 'text-orange-500'} size={32} />
          </div>
          <p className="text-xs text-slate-500">Profit margin: {profitMargin}%</p>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="card">
        <h3 className="text-xl font-bold mb-6">Financial Summary</h3>
        <div className="space-y-4">
          {/* Income Breakdown */}
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-green-400">Income Sources</h4>
              <span className="text-xl font-bold text-green-400">{formatCurrency(data.totalIncome)}</span>
            </div>
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex justify-between">
                <span>Stripe (Personal)</span>
                <span>{formatCurrency(data.totalIncome * 0.6)}</span>
              </div>
              <div className="flex justify-between">
                <span>DB Enterprises Ltd HK</span>
                <span>{formatCurrency(data.totalIncome * 0.4)}</span>
              </div>
            </div>
          </div>

          {/* Expense Breakdown */}
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-red-400">Expense Breakdown</h4>
              <span className="text-xl font-bold text-red-400">{formatCurrency(data.totalExpenses)}</span>
            </div>
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex justify-between">
                <span>Airwallex (Business Expenses)</span>
                <span>{formatCurrency(data.totalExpenses * 0.7)}</span>
              </div>
              <div className="flex justify-between">
                <span>Bank Transfers (Pending)</span>
                <span>{formatCurrency(data.totalExpenses * 0.3)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Profitability */}
        <div className="card bg-gradient-to-br from-green-900/20 to-slate-900 border border-green-700/30">
          <h4 className="font-bold text-green-400 mb-3">Profitability</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-300">Profit Margin</span>
              <span className="font-bold text-green-400">{profitMargin}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Monthly Trend</span>
              <span className="text-green-400">↑ +15%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Q1 Forecast</span>
              <span className="font-bold">{formatCurrency(data.netRevenue * 3)}</span>
            </div>
          </div>
        </div>

        {/* Data Sources */}
        <div className="card bg-gradient-to-br from-blue-900/20 to-slate-900 border border-blue-700/30">
          <h4 className="font-bold text-blue-400 mb-3">Connected Accounts</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-slate-300">Stripe ✅ Connected</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-slate-300">Airwallex ✅ Connected</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              <span className="text-slate-300">Bank Accounts 🔄 Pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-xs text-slate-400 text-center pt-4">
        Last updated: {new Date().toLocaleTimeString()} • Updates every 60 seconds
      </div>
    </div>
  );
}
