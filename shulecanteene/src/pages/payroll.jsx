import React, { useState } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Search, 
  Filter, 
  ChevronRight, 
  Download, 
  FileText, 
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Wallet
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
    <div className="flex justify-between items-start mb-3">
      <div className={`p-2.5 rounded-lg ${color} bg-opacity-10`}>
        <Icon className={color.replace('bg-', 'text-')} size={20} />
      </div>
      {trend && (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">{title}</p>
    <h3 className="text-xl font-black text-slate-800">{value}</h3>
  </div>
);

const NavTab = ({ active, label, onClick }) => (
  <button
    onClick={onClick}
    className={`px-5 py-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${
      active 
        ? 'border-primary text-primary bg-primary/5' 
        : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'
    }`}
  >
    {label}
  </button>
);

export default function Payroll() {
  const [activeTab, setActiveTab] = useState('processing');
  const [searchQuery, setSearchQuery] = useState('');

  const payrollData = [
    { id: 1, name: 'Jean Damascene', role: 'Teacher', grade: 'Grade 3', gross: '850,000', net: '640,000', status: 'processed', period: 'April 2026' },
    { id: 2, name: 'Alice Umutoni', role: 'Admin', grade: 'Grade 5', gross: '1,200,000', net: '910,000', status: 'pending', period: 'April 2026' },
    { id: 3, name: 'Emmanuel Karekezi', role: 'Teacher', grade: 'Grade 2', gross: '650,000', net: '495,000', status: 'processed', period: 'April 2026' },
    { id: 4, name: 'Beatrice Uwase', role: 'Nurse', grade: 'Grade 4', gross: '950,000', net: '720,000', status: 'processed', period: 'April 2026' },
    { id: 5, name: 'Claude Nsabimana', role: 'Driver', grade: 'Grade 1', gross: '450,000', net: '345,000', status: 'pending', period: 'April 2026' },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50/50 font-sans overflow-hidden">
      
      {/* ── Header Section ── */}
      <div className="bg-white border-b border-slate-200 px-8 pt-8 shrink-0">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Payroll Management</h1>
            <p className="text-slate-500 text-xs font-medium mt-1 uppercase tracking-[0.15em]">
              Financial Year 2025/2026 • <span className="text-primary font-bold">April Cycle</span>
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-lg text-xs font-bold shadow-sm hover:bg-slate-900 transition-all">
              <Plus size={16} /> New Salary Structure
            </button>
            <button className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-xs font-bold shadow-sm hover:shadow-lg hover:shadow-primary/20 transition-all">
              <TrendingUp size={16} /> Process Payroll
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Total Net Pay" 
            value="RWF 42,850,000" 
            icon={DollarSign} 
            color="bg-primary" 
            trend={12}
          />
          <StatCard 
            title="Total Deductions" 
            value="RWF 8,240,000" 
            icon={TrendingUp} 
            color="bg-rose-500" 
            trend={-2}
          />
          <StatCard 
            title="ShuleAdvance Payout" 
            value="RWF 2,150,000" 
            icon={Wallet} 
            color="bg-amber-500" 
            trend={24}
          />
          <StatCard 
            title="Staff Processed" 
            value="142 / 150" 
            icon={Users} 
            color="bg-emerald-500" 
          />
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100">
          <NavTab active={activeTab === 'processing'} label="Monthly Processing" onClick={() => setActiveTab('processing')} />
          <NavTab active={activeTab === 'structures'} label="Salary Structures" onClick={() => setActiveTab('structures')} />
          <NavTab active={activeTab === 'advance'} label="ShuleAdvance" onClick={() => setActiveTab('advance')} />
          <NavTab active={activeTab === 'statutory'} label="Statutory" onClick={() => setActiveTab('statutory')} />
          <NavTab active={activeTab === 'reports'} label="Reports" onClick={() => setActiveTab('reports')} />
        </div>
      </div>

      {/* ── Content Area ── */}
      <div className="flex-1 overflow-hidden flex flex-col p-8">
        
        {/* Filters Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-3 flex-1">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input 
                type="text" 
                placeholder="Search employee by name or ID..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all">
              <Filter size={15} /> Filters
            </button>
          </div>
          <div className="flex gap-2">
            <button className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-all">
              <Download size={18} />
            </button>
            <button className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-all">
              <FileText size={18} />
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex-1 flex flex-col">
          <div className="overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 sticky top-0 z-10">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100">Employee</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100">Designation</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100">Gross (RWF)</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100">Net (RWF)</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100">Cycle Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {payrollData.map((staff) => (
                  <tr key={staff.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black">
                          {staff.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 leading-none">{staff.name}</p>
                          <p className="text-[10px] text-slate-500 mt-1 uppercase font-semibold">ID: EMP-00{staff.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-xs font-bold text-slate-700">{staff.role}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{staff.grade}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-800">{staff.gross}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-black text-primary">{staff.net}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        staff.status === 'processed' 
                          ? 'bg-emerald-50 text-emerald-600' 
                          : 'bg-amber-50 text-amber-600'
                      }`}>
                        {staff.status === 'processed' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                        {staff.status}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-md transition-all">
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination/Footer */}
          <div className="mt-auto px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Showing 5 of 150 employees</p>
            <div className="flex gap-2">
              <button className="px-4 py-1.5 bg-white border border-slate-200 rounded text-[10px] font-black uppercase text-slate-500 hover:text-primary transition-all">Prev</button>
              <button className="px-4 py-1.5 bg-white border border-slate-200 rounded text-[10px] font-black uppercase text-slate-500 hover:text-primary transition-all">Next</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
