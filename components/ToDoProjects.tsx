import { Flag } from 'lucide-react';

export default function ToDoProjects() {
  const todos = [
    { id: 1, title: 'Build CFO Dashboard', priority: 'red', daysLeft: 3 },
    { id: 2, title: 'Connect Stripe API', priority: 'red', daysLeft: 2 },
    { id: 3, title: 'Integrate GoHighLevel', priority: 'yellow', daysLeft: 5 },
    { id: 4, title: 'Facebook Ads Integration', priority: 'yellow', daysLeft: 7 },
    { id: 5, title: 'Bank Account Connection', priority: 'yellow', daysLeft: 10 },
    { id: 6, title: 'Weekly Analysis Report', priority: 'blue', daysLeft: 14 },
    { id: 7, title: 'Mobile App Design', priority: 'blue', daysLeft: 21 },
  ];

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'red':
        return 'from-red-600 to-red-900';
      case 'yellow':
        return 'from-yellow-600 to-yellow-900';
      case 'blue':
        return 'from-blue-600 to-blue-900';
      default:
        return 'from-slate-600 to-slate-900';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch(priority) {
      case 'red':
        return 'URGENT';
      case 'yellow':
        return 'IN PROGRESS';
      case 'blue':
        return 'BACKLOG';
      default:
        return 'PLANNED';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold mb-6">To-Do Projects</h2>
      
      <div className="grid gap-3">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className={`bg-gradient-to-r ${getPriorityColor(todo.priority)} rounded-lg p-4 flex items-center justify-between group hover:shadow-lg transition-shadow cursor-pointer`}
          >
            <div className="flex items-center gap-3">
              <Flag size={20} className="text-white" />
              <div>
                <h4 className="font-semibold text-white">{todo.title}</h4>
                <p className="text-sm text-slate-200 opacity-80">{getPriorityLabel(todo.priority)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-white">{todo.daysLeft}d</p>
              <p className="text-xs text-slate-100 opacity-70">remaining</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-700">
        <div className="stat-card text-center">
          <p className="text-slate-400 text-sm mb-1">Urgent Tasks</p>
          <p className="text-3xl font-bold text-red-400">2</p>
        </div>
        <div className="stat-card text-center">
          <p className="text-slate-400 text-sm mb-1">In Progress</p>
          <p className="text-3xl font-bold text-yellow-400">3</p>
        </div>
        <div className="stat-card text-center">
          <p className="text-slate-400 text-sm mb-1">Backlog</p>
          <p className="text-3xl font-bold text-blue-400">2</p>
        </div>
      </div>
    </div>
  );
}
