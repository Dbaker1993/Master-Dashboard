'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  title: string;
  emoji: string;
  sport: string;
  sportEmoji: string;
  tasks: string[];
  status: 'active' | 'idle' | 'working';
  lastUpdate: string;
}

export default function MasterAgents() {
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);

  const agents: Agent[] = [
    {
      id: 'keith',
      name: 'Keith',
      title: 'Master Agent',
      emoji: '🦞',
      sport: 'Chess',
      sportEmoji: '♟️',
      tasks: [
        '📊 Orchestrate all sub-agents',
        '🎯 Monitor dashboard health',
        '⚡ Real-time task coordination',
        '🔄 Process queue management',
        '🧠 Strategic automation planning'
      ],
      status: 'active',
      lastUpdate: 'Now'
    },
    {
      id: 'romeo',
      name: 'Romeo',
      title: 'Finance Agent',
      emoji: '💰',
      sport: 'Tennis',
      sportEmoji: '🎾',
      tasks: [
        '💳 Monitor Stripe charges',
        '💸 Track Airwallex expenses',
        '📈 Update CFO Dashboard',
        '⚠️ Alert on large transactions >£500',
        '🔄 Refresh finance data every 60 min'
      ],
      status: 'active',
      lastUpdate: '2 min ago'
    },
    {
      id: 'content-agent',
      name: 'Content Agent',
      title: 'Content Creation',
      emoji: '🎬',
      sport: 'Basketball',
      sportEmoji: '🏀',
      tasks: [
        '📹 Monitor Fathom transcripts',
        '✍️ Generate McKinsey reports',
        '📝 Create weekly content briefs',
        '🎨 Design visual assets',
        '🚀 Publish to social channels'
      ],
      status: 'idle',
      lastUpdate: '1 hour ago'
    },
    {
      id: 'operations',
      name: 'Operations',
      title: 'Operations Agent',
      emoji: '⚙️',
      sport: 'Soccer',
      sportEmoji: '⚽',
      tasks: [
        '🔔 Archive processed emails',
        '📧 Manage lead distribution',
        '🗂️ Update UK database',
        '⏰ Schedule automations',
        '📋 Track project status'
      ],
      status: 'active',
      lastUpdate: '5 min ago'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'from-green-900/30 to-slate-900 border-green-700/50';
      case 'working':
        return 'from-blue-900/30 to-slate-900 border-blue-700/50';
      case 'idle':
        return 'from-slate-800 to-slate-900 border-slate-700/50';
      default:
        return 'from-slate-800 to-slate-900 border-slate-700/50';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>;
      case 'working':
        return <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>;
      case 'idle':
        return <div className="w-3 h-3 bg-slate-500 rounded-full"></div>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">⚙️ Master Agents Control Center</h1>
        <p className="text-slate-400">Real-time monitoring of all automation agents</p>
      </div>

      {/* Agency Overview */}
      <div className="card bg-gradient-to-r from-slate-800 to-slate-900 mb-8">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span>🏢 The Office</span>
          <span className="text-sm bg-blue-500/20 text-blue-200 px-3 py-1 rounded-full">4 Agents Active</span>
        </h3>
        <p className="text-slate-300 text-sm">Each agent monitors specific operations and reports back to the Master Agent (Keith). Click any agent to see their current tasks.</p>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className={`card bg-gradient-to-br ${getStatusColor(agent.status)} cursor-pointer transition-all hover:scale-105 border`}
            onClick={() => setExpandedAgent(expandedAgent === agent.id ? null : agent.id)}
          >
            {/* Agent Desk */}
            <div className="mb-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {/* Cartoon Character */}
                  <div className="text-5xl">{agent.emoji}</div>
                  
                  <div>
                    <h3 className="text-xl font-bold">{agent.name}</h3>
                    <p className="text-sm text-slate-400">{agent.title}</p>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2">
                  {getStatusBadge(agent.status)}
                  <span className="text-xs font-semibold px-2 py-1 bg-slate-700/50 rounded">
                    {agent.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Sport Badge */}
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <span className="text-2xl">{agent.sportEmoji}</span>
                <span className="font-semibold">{agent.sport}</span>
                <span className="text-xs text-slate-500 ml-auto">{agent.lastUpdate}</span>
              </div>
            </div>

            {/* Expandable Tasks */}
            <div className="border-t border-slate-700/50 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-300">
                  {agent.tasks.length} Active Tasks
                </span>
                {expandedAgent === agent.id ? (
                  <ChevronUp size={20} className="text-slate-400" />
                ) : (
                  <ChevronDown size={20} className="text-slate-400" />
                )}
              </div>

              {/* Task List */}
              {expandedAgent === agent.id && (
                <div className="mt-4 space-y-2">
                  {agent.tasks.map((task, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-sm text-slate-300 p-2 bg-slate-800/50 rounded border border-slate-700/30"
                    >
                      <span className="mt-0.5">✓</span>
                      <span>{task}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Communication Hub */}
      <div className="card border-l-4 border-blue-500">
        <h3 className="text-lg font-bold mb-4 text-blue-400">📡 Agent Communication</h3>
        <div className="space-y-3 text-sm text-slate-300">
          <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded">
            <span className="text-xl">🦞</span>
            <div>
              <p className="font-semibold">Keith (Master) → Romeo</p>
              <p className="text-xs text-slate-400">Coordinate finance updates</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded">
            <span className="text-xl">💰</span>
            <div>
              <p className="font-semibold">Romeo → Master Dashboard</p>
              <p className="text-xs text-slate-400">Send live finance data every 60 min</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded">
            <span className="text-xl">🎬</span>
            <div>
              <p className="font-semibold">Content Agent → Drive</p>
              <p className="text-xs text-slate-400">Auto-publish Fathom reports</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded">
            <span className="text-xl">⚙️</span>
            <div>
              <p className="font-semibold">Operations → Gmail</p>
              <p className="text-xs text-slate-400">Archive & manage lead flow</p>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card text-center">
          <p className="text-slate-400 text-xs mb-1">ACTIVE AGENTS</p>
          <p className="text-3xl font-bold text-green-400">3</p>
        </div>
        <div className="stat-card text-center">
          <p className="text-slate-400 text-xs mb-1">TOTAL TASKS</p>
          <p className="text-3xl font-bold text-blue-400">20+</p>
        </div>
        <div className="stat-card text-center">
          <p className="text-slate-400 text-xs mb-1">UPTIME</p>
          <p className="text-3xl font-bold text-purple-400">99.9%</p>
        </div>
        <div className="stat-card text-center">
          <p className="text-slate-400 text-xs mb-1">COORDINATION</p>
          <p className="text-3xl font-bold text-yellow-400">24/7</p>
        </div>
      </div>
    </div>
  );
}
