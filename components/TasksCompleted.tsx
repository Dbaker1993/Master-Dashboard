'use client';

import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface Automation {
  id: string;
  name: string;
  frequency: string;
  weeklyRuns: number;
  lastRun: string;
  status: 'active' | 'idle' | 'error';
  tasksCompleted: number;
  successRate: number;
}

export default function TasksCompleted() {
  const automations: Automation[] = [
    {
      id: 'tenzin-leads',
      name: 'Tenzin Lead Extraction',
      frequency: 'Every 15 minutes',
      weeklyRuns: 672,
      lastRun: '2 minutes ago',
      status: 'active',
      tasksCompleted: 47,
      successRate: 100
    },
    {
      id: 'tenzin-loom',
      name: 'Tenzin Loom Video Sends',
      frequency: 'Every 15 minutes',
      weeklyRuns: 672,
      lastRun: '4 minutes ago',
      status: 'active',
      tasksCompleted: 12,
      successRate: 100
    },
    {
      id: 'bulk-loom',
      name: 'Bulk Loom Outreach (702 Contacts)',
      frequency: 'Every hour',
      weeklyRuns: 168,
      lastRun: '1 hour ago',
      status: 'active',
      tasksCompleted: 156,
      successRate: 98
    },
    {
      id: 'tenzin-archive',
      name: 'Tenzin Email Archive',
      frequency: 'Every hour',
      weeklyRuns: 168,
      lastRun: '47 minutes ago',
      status: 'active',
      tasksCompleted: 38,
      successRate: 100
    },
    {
      id: 'fathom-drive',
      name: 'Fathom → Google Drive (Clients Dashboard)',
      frequency: 'Every 12 hours',
      weeklyRuns: 14,
      lastRun: 'Next: in 8 hours',
      status: 'idle',
      tasksCompleted: 0,
      successRate: 100
    },
    {
      id: 'romeo-finance',
      name: 'Romeo Finance Agent (24/7 Monitoring)',
      frequency: '24/7 continuous',
      weeklyRuns: 168,
      lastRun: 'Running now',
      status: 'active',
      tasksCompleted: 168,
      successRate: 100
    },
    {
      id: 'weekly-loom-report',
      name: 'Weekly Loom Reply Dashboard',
      frequency: 'Friday 9 AM',
      weeklyRuns: 1,
      lastRun: 'Next Friday 9 AM',
      status: 'idle',
      tasksCompleted: 0,
      successRate: 100
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>;
      case 'idle':
        return <div className="w-3 h-3 bg-slate-500 rounded-full"></div>;
      case 'error':
        return <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>;
      default:
        return null;
    }
  };

  const totalWeeklyRuns = automations.reduce((sum, a) => sum + a.weeklyRuns, 0);
  const totalTasksCompleted = automations.reduce((sum, a) => sum + a.tasksCompleted, 0);
  const totalActiveAutomations = automations.filter(a => a.status === 'active').length;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6">📋 Weekly Tasks Completed</h2>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card text-center">
          <p className="text-slate-400 text-xs mb-1">ACTIVE AUTOMATIONS</p>
          <p className="text-3xl font-bold text-green-400">{totalActiveAutomations}</p>
        </div>
        <div className="stat-card text-center">
          <p className="text-slate-400 text-xs mb-1">WEEKLY RUNS</p>
          <p className="text-3xl font-bold text-blue-400">{totalWeeklyRuns.toLocaleString()}</p>
        </div>
        <div className="stat-card text-center">
          <p className="text-slate-400 text-xs mb-1">TASKS COMPLETED</p>
          <p className="text-3xl font-bold text-purple-400">{totalTasksCompleted}</p>
        </div>
        <div className="stat-card text-center">
          <p className="text-slate-400 text-xs mb-1">SUCCESS RATE</p>
          <p className="text-3xl font-bold text-yellow-400">99.5%</p>
        </div>
      </div>

      {/* Automations List */}
      <div className="space-y-3">
        {automations.map((automation) => (
          <div key={automation.id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 flex-1">
                {/* Status Icon */}
                <div className="mt-1">{getStatusIcon(automation.status)}</div>

                {/* Automation Info */}
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-white mb-1">{automation.name}</h3>
                  <div className="flex flex-wrap gap-3 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {automation.frequency}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span>Last: {automation.lastRun}</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  automation.status === 'active' 
                    ? 'bg-green-500/20 text-green-300'
                    : automation.status === 'idle'
                    ? 'bg-slate-500/20 text-slate-300'
                    : 'bg-red-500/20 text-red-300'
                }`}>
                  {automation.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-slate-700/50">
              <div className="text-center">
                <p className="text-slate-400 text-xs mb-1">WEEKLY RUNS</p>
                <p className="text-xl font-bold text-blue-400">{automation.weeklyRuns.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-slate-400 text-xs mb-1">THIS WEEK</p>
                <p className="text-xl font-bold text-purple-400">{automation.tasksCompleted}</p>
              </div>
              <div className="text-center">
                <p className="text-slate-400 text-xs mb-1">SUCCESS RATE</p>
                <p className="text-xl font-bold text-green-400">{automation.successRate}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Summary */}
      <div className="card bg-gradient-to-r from-slate-800 to-slate-900 border-l-4 border-blue-500">
        <h3 className="text-lg font-bold mb-4 text-blue-400">📊 Weekly Performance</h3>
        <div className="space-y-3 text-sm text-slate-300">
          <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded">
            <span>Automated processes running</span>
            <span className="font-bold text-green-400">24/7</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded">
            <span>Leads processed (Tenzin)</span>
            <span className="font-bold text-blue-400">47 this week</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded">
            <span>Loom outreach emails sent</span>
            <span className="font-bold text-purple-400">156+ scheduled</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded">
            <span>Finance monitoring (Romeo)</span>
            <span className="font-bold text-yellow-400">100% uptime</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded">
            <span>System reliability</span>
            <span className="font-bold text-green-400">99.5%</span>
          </div>
        </div>
      </div>

      {/* Upcoming Automations */}
      <div className="card border-l-4 border-purple-500">
        <h3 className="text-lg font-bold mb-4 text-purple-400">⏰ Upcoming This Week</h3>
        <div className="space-y-2 text-sm text-slate-300">
          <div className="flex items-center gap-2 p-2">
            <span className="text-lg">📄</span>
            <span>Fathom Dashboard (Next 12h run)</span>
          </div>
          <div className="flex items-center gap-2 p-2">
            <span className="text-lg">📈</span>
            <span>Weekly Loom Reply Report (Friday 9 AM)</span>
          </div>
          <div className="flex items-center gap-2 p-2">
            <span className="text-lg">💰</span>
            <span>Romeo Finance Hourly Updates (24/7 active)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
