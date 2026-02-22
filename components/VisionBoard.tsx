import { Target, TrendingUp, Zap } from 'lucide-react';

export default function VisionBoard() {
  const goals = [
    {
      id: 1,
      title: 'RapidQS UK Launch',
      metric: '£500k MRR',
      status: 'In Progress',
      progress: 65,
      icon: '🚀'
    },
    {
      id: 2,
      title: 'Lead Generation',
      metric: '702 Outreach',
      status: 'Active',
      progress: 45,
      icon: '📧'
    },
    {
      id: 3,
      title: 'Team Scale',
      metric: '5 Team Members',
      status: 'Planning',
      progress: 30,
      icon: '👥'
    },
    {
      id: 4,
      title: 'Market Expansion',
      metric: '3 New Markets',
      status: 'Upcoming',
      progress: 20,
      icon: '🌍'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          2026 Vision Board
        </h1>
        <p className="text-slate-400 text-lg">Strategic Goals & Quarterly Milestones</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="card hover:scale-105 transition-transform duration-300 cursor-pointer group"
          >
            <div className="text-4xl mb-3">{goal.icon}</div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
              {goal.title}
            </h3>
            <div className="text-2xl font-bold text-blue-400 mb-3">{goal.metric}</div>
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-400">{goal.status}</span>
              <span className="text-sm font-semibold text-green-400">{goal.progress}%</span>
            </div>

            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${goal.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-8">
        <div className="card flex items-center justify-between">
          <div>
            <p className="text-slate-400 mb-1">Q1 Revenue Target</p>
            <p className="text-3xl font-bold">£150k</p>
          </div>
          <TrendingUp className="text-green-400" size={40} />
        </div>

        <div className="card flex items-center justify-between">
          <div>
            <p className="text-slate-400 mb-1">Active Leads</p>
            <p className="text-3xl font-bold">1,204</p>
          </div>
          <Zap className="text-yellow-400" size={40} />
        </div>

        <div className="card flex items-center justify-between">
          <div>
            <p className="text-slate-400 mb-1">Conversion Rate</p>
            <p className="text-3xl font-bold">12.5%</p>
          </div>
          <Target className="text-cyan-400" size={40} />
        </div>
      </div>
    </div>
  );
}
