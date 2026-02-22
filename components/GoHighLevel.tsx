'use client';

import { useEffect, useState } from 'react';
import { Phone, Calendar, TrendingUp, AlertCircle } from 'lucide-react';

interface GHLData {
  leads: number;
  appointments: number;
  conversions: number;
  loading: boolean;
  error: string | null;
}

export default function GoHighLevel() {
  const [data, setData] = useState<GHLData>({
    leads: 0,
    appointments: 0,
    conversions: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchGHLData = async () => {
      try {
        const response = await fetch('/api/ghl', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch GHL data');
        }

        const result = await response.json();
        setData({
          leads: result.leads || 0,
          appointments: result.appointments || 0,
          conversions: result.conversions || 0,
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

    fetchGHLData();
    const interval = setInterval(fetchGHLData, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (data.loading) {
    return (
      <div className="card flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-slate-400">Connecting to GoHighLevel...</p>
        </div>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="card border-l-4 border-red-500">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="text-red-400" size={24} />
          <h3 className="text-xl font-bold text-red-400">GoHighLevel Error</h3>
        </div>
        <p className="text-slate-300 mb-3">{data.error}</p>
        <p className="text-sm text-slate-400">
          Make sure your GHL API key is set in environment variables: <code className="bg-slate-800 px-2 py-1 rounded">NEXT_PUBLIC_GHL_API_KEY</code>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6">GoHighLevel Integration</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Leads Card */}
        <div className="card border-l-4 border-blue-500">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-slate-400 text-sm mb-1">Total Leads</p>
              <p className="text-4xl font-bold text-blue-400">{data.leads}</p>
            </div>
            <Phone className="text-blue-500" size={32} />
          </div>
          <p className="text-xs text-slate-500">Updated every 30 seconds</p>
        </div>

        {/* Appointments Card */}
        <div className="card border-l-4 border-green-500">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-slate-400 text-sm mb-1">Appointments</p>
              <p className="text-4xl font-bold text-green-400">{data.appointments}</p>
            </div>
            <Calendar className="text-green-500" size={32} />
          </div>
          <p className="text-xs text-slate-500">This week</p>
        </div>

        {/* Conversions Card */}
        <div className="card border-l-4 border-purple-500">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-slate-400 text-sm mb-1">Conversions</p>
              <p className="text-4xl font-bold text-purple-400">{data.conversions}</p>
            </div>
            <TrendingUp className="text-purple-500" size={32} />
          </div>
          <p className="text-xs text-slate-500">Conversion rate</p>
        </div>
      </div>

      {/* Pipeline Overview */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4">Pipeline Overview</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-300">New Leads</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-slate-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <span className="text-sm text-slate-400">65%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Qualified</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-slate-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '42%' }}></div>
              </div>
              <span className="text-sm text-slate-400">42%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Closed</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-slate-700 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '18%' }}></div>
              </div>
              <span className="text-sm text-slate-400">18%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Status */}
      <div className="card bg-gradient-to-r from-slate-800 to-slate-900">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <p className="font-semibold">Live GHL Connection</p>
        </div>
        <p className="text-sm text-slate-400">Connected to your GoHighLevel account. Data updates in real-time.</p>
      </div>
    </div>
  );
}
