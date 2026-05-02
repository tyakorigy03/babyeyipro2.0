import React, { useState } from 'react';
import { 
  Settings, Plus, Clock, ArrowLeft, Save, 
  Database, Shield, Globe, Terminal, Server
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { RoutineLibrary } from './routines';
import { useSetup, INITIAL_ROUTINE_TEMPLATES } from './SetupContext';

export default function System() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('General');
  const { routineTemplates, setRoutineTemplates } = useSetup();

  const tabs = [
    { label: 'General Settings', id: 'General', icon: Settings },
    { label: 'Security & Access', id: 'Security', icon: Shield }
  ];

  const renderGeneralTab = () => (
    <div className="h-full flex flex-col items-center justify-center p-20 text-center space-y-4 bg-gray-50 border border-dashed border-slate-200 rounded-2xl">
      <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-300 border border-slate-100">
        <Server size={32} />
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">System Configurations</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Manage school-wide parameters, API integrations, and core system preferences.</p>
      </div>
      <button className="bg-primary text-white px-5 py-2 rounded text-[10px] font-black uppercase tracking-widest shadow-lg">Modify Settings</button>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] overflow-auto">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between px-6 py-2 bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-slate-400 hover:text-primary transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex flex-col">
            <h2 className="text-base font-bold text-slate-800 -mt-1">System Setup</h2>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="h-6 w-[1px] bg-slate-200" />
          <button 
            onClick={() => navigate('/')}
            className="bg-primary hover:bg-primary/90 text-white px-5 py-1.5 rounded font-bold text-xs uppercase tracking-wider shadow-md shadow-primary/20 transition-all flex items-center gap-2"
          >
            <Save size={14} /> Save & Exit
          </button>
        </div>
      </div>

      <div className="p-8">
        <div className="flex border-b border-slate-200 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all relative ${
                activeTab === tab.id ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>

        <div className="min-h-[400px]">
          {activeTab === 'General' && renderGeneralTab()}
          {activeTab === 'Security' && (
             <div className="h-full flex flex-col items-center justify-center p-20 text-center text-slate-300">
               <Shield size={48} className="mb-4 opacity-20" />
               <p className="text-xs uppercase tracking-widest font-black">Access Control coming soon</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
