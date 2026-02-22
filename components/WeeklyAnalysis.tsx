import { TrendingUp, TrendingDown } from 'lucide-react';

export default function WeeklyAnalysis() {
  const analysis = {
    wins: [
      { item: 'Tenzin Automation Live', impact: '+4 qualified leads', icon: '🎯' },
      { item: 'Bulk Loom Campaign Start', impact: '702 contacts queued', icon: '📧' },
      { item: 'Dashboard Development', impact: 'UI/UX complete', icon: '🎨' },
      { item: 'Lead Response Time', impact: '4 min avg (↓ 60%)', icon: '⚡' },
    ],
    losses: [
      { item: 'Gmail Rate Limiting', issue: 'Needed staggered sends', icon: '⚠️' },
      { item: 'Sheet API Parsing', issue: 'Fixed formatting issues', icon: '🔧' },
      { item: 'Manual Outreach', issue: 'Now fully automated', icon: '🤖' },
    ],
    nextWeek: [
      'Launch CFO Finance Dashboard',
      'Integrate GoHighLevel API',
      'Connect Facebook Ads Account',
      'Weekly analysis automation',
      'Mobile dashboard optimization',
    ]
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6">Weekly Analysis</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* What Worked */}
        <div className="card border-l-4 border-green-500">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-green-400" size={24} />
            <h3 className="text-2xl font-bold text-green-400">What Worked</h3>
          </div>
          <div className="space-y-3">
            {analysis.wins.map((win, idx) => (
              <div key={idx} className="bg-slate-800 rounded p-3 border border-green-700/30">
                <div className="flex items-start gap-2">
                  <span className="text-2xl">{win.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{win.item}</p>
                    <p className="text-sm text-green-400">{win.impact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What Didn't */}
        <div className="card border-l-4 border-orange-500">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="text-orange-400" size={24} />
            <h3 className="text-2xl font-bold text-orange-400">Lessons Learned</h3>
          </div>
          <div className="space-y-3">
            {analysis.losses.map((loss, idx) => (
              <div key={idx} className="bg-slate-800 rounded p-3 border border-orange-700/30">
                <div className="flex items-start gap-2">
                  <span className="text-2xl">{loss.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{loss.item}</p>
                    <p className="text-sm text-orange-300">{loss.issue}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Next Week */}
      <div className="card bg-gradient-to-r from-slate-800 to-slate-900 border-l-4 border-blue-500">
        <h3 className="text-2xl font-bold text-blue-400 mb-4">Next Week Focus</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {analysis.nextWeek.map((task, idx) => (
            <div key={idx} className="flex items-center gap-2 text-slate-300">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>{task}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
