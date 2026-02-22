import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export default function CurrentProjects() {
  const projects = [
    {
      id: 1,
      name: 'RapidQS UK Platform',
      status: 'live',
      kpi: '24 qualified leads',
      progress: 85,
      team: 'David + Dev Team'
    },
    {
      id: 2,
      name: 'Tenzin Lead Automation',
      status: 'live',
      kpi: '4 min response time',
      progress: 90,
      team: 'Keith'
    },
    {
      id: 3,
      name: 'Bulk Loom Outreach',
      status: 'live',
      kpi: '702 contacts active',
      progress: 35,
      team: 'Keith'
    },
    {
      id: 4,
      name: 'Master Dashboard',
      status: 'in-progress',
      kpi: '7 components built',
      progress: 100,
      team: 'Keith + Dev'
    },
  ];

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'live':
        return <CheckCircle2 className="text-green-400" size={20} />;
      case 'in-progress':
        return <Clock className="text-blue-400" size={20} />;
      case 'blocked':
        return <AlertCircle className="text-red-400" size={20} />;
      default:
        return null;
    }
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'live':
        return 'status-badge status-live';
      case 'in-progress':
        return 'status-badge status-progress';
      case 'blocked':
        return 'status-badge status-blocked';
      default:
        return 'status-badge status-backlog';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold mb-6">Current Projects Live</h2>
      <div className="grid gap-4">
        {projects.map((project) => (
          <div key={project.id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {getStatusIcon(project.status)}
                <div>
                  <h3 className="text-xl font-bold">{project.name}</h3>
                  <p className="text-sm text-slate-400">{project.team}</p>
                </div>
              </div>
              <span className={getStatusClass(project.status)}>
                {project.status.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center justify-between mb-3">
              <p className="text-slate-300">{project.kpi}</p>
              <p className="text-sm font-semibold text-green-400">{project.progress}%</p>
            </div>

            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
