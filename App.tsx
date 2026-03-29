
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Mail, 
  Settings as SettingsIcon,
  Menu,
  X,
  Sparkles,
  HardHat,
  Factory
} from 'lucide-react';
import { ViewType } from './types';
import Dashboard from './components/Dashboard';
import ImageStudio from './components/ImageStudio';
import EmailAssistant from './components/EmailAssistant';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, view: ViewType.DASHBOARD },
    { name: 'Visual Ops', icon: Factory, view: ViewType.IMAGE_STUDIO },
    { name: 'Sales Inbox', icon: Mail, view: ViewType.EMAIL_ASSISTANT },
    { name: 'Settings', icon: SettingsIcon, view: ViewType.SETTINGS },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-100">
      {/* Sidebar */}
      <aside className={`
        ${isSidebarOpen ? 'w-64' : 'w-20'} 
        transition-all duration-300 bg-slate-900 border-r border-slate-800 flex flex-col fixed h-full z-50
      `}>
        <div className="p-6 flex items-center gap-3">
          <div className="bg-orange-500 p-2 rounded-xl text-slate-950 shadow-lg shadow-orange-500/20">
            <HardHat size={24} />
          </div>
          {isSidebarOpen && <h1 className="font-bold text-xl tracking-tight">BTP Flow AI</h1>}
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => setCurrentView(item.view)}
              className={`
                w-full flex items-center gap-4 p-3 rounded-lg transition-colors
                ${currentView === item.view 
                  ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}
              `}
            >
              <item.icon size={20} />
              {isSidebarOpen && <span className="font-medium">{item.name}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-2 text-slate-500 hover:text-slate-100"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`
        flex-1 transition-all duration-300 
        ${isSidebarOpen ? 'ml-64' : 'ml-20'}
        min-h-screen
      `}>
        <header className="h-16 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400">
            <span>Operations</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-100 font-medium capitalize">
              {currentView.replace('_', ' ').toLowerCase()}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
              <Sparkles size={16} className="text-orange-500" />
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Industrial Mode Active</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-600 shadow-inner" />
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {currentView === ViewType.DASHBOARD && <Dashboard setView={setCurrentView} />}
          {currentView === ViewType.IMAGE_STUDIO && <ImageStudio />}
          {currentView === ViewType.EMAIL_ASSISTANT && <EmailAssistant />}
          {currentView === ViewType.SETTINGS && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
               <SettingsIcon size={48} className="text-slate-700 animate-pulse" />
               <h2 className="text-2xl font-bold">Parameters</h2>
               <p className="text-slate-400">Sales workflows and technical catalogs optimization rules are locked by Admin.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
