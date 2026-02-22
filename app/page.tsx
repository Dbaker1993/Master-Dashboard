'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import VisionBoard from '@/components/VisionBoard';
import CurrentProjects from '@/components/CurrentProjects';
import ToDoProjects from '@/components/ToDoProjects';
import WeeklyAnalysis from '@/components/WeeklyAnalysis';
import GoHighLevel from '@/components/GoHighLevel';
import Placeholder from '@/components/Placeholder';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('vision');

  const sections = [
    { id: 'vision', label: 'Vision Board', icon: '🎯' },
    { id: 'projects', label: 'Current Projects', icon: '📊' },
    { id: 'todo', label: 'To-Do List', icon: '✅' },
    { id: 'analysis', label: 'Weekly Analysis', icon: '📈' },
    { id: 'finance', label: 'CFO Finance', icon: '💰' },
    { id: 'marketing', label: 'Marketing Data', icon: '📱' },
    { id: 'ghl', label: 'GoHighLevel', icon: '🔗' },
  ];

  const renderSection = () => {
    switch(activeSection) {
      case 'vision':
        return <VisionBoard />;
      case 'projects':
        return <CurrentProjects />;
      case 'todo':
        return <ToDoProjects />;
      case 'analysis':
        return <WeeklyAnalysis />;
      case 'finance':
        return <Placeholder 
          title="Master CFO Finance Tracker" 
          description="Connect to Stripe, bank accounts, and expense tracking. Real-time P&L dashboard."
          icon="💰"
        />;
      case 'marketing':
        return <Placeholder 
          title="Total Marketing Data" 
          description="Facebook Ads spend, Tenzin leads, Loom video metrics, conversion funnels."
          icon="📱"
        />;
      case 'ghl':
        return <GoHighLevel />;
      default:
        return <VisionBoard />;
    }
  };

  return (
    <div className="flex h-screen bg-brand-darker">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-slate-900 border-r border-slate-700 transition-all duration-300 overflow-hidden`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8">
            David Baker
          </h1>
          <nav className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="mr-2">{section.icon}</span>
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-6 left-6 right-6 bg-slate-800 rounded-lg p-4 border border-slate-700">
          <p className="text-xs text-slate-400 mb-2">Last Updated</p>
          <p className="text-sm font-semibold text-white">Today at 2:32 PM</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-slate-900 border-b border-slate-700 sticky top-0 z-10 p-6 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <X size={24} className="text-slate-300" />
            ) : (
              <Menu size={24} className="text-slate-300" />
            )}
          </button>
          
          <div className="flex-1 ml-6">
            <h1 className="text-2xl font-bold">
              {sections.find(s => s.id === activeSection)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-slate-400">Welcome Back</p>
              <p className="font-semibold">David Baker</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full"></div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}
