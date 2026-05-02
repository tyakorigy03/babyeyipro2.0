import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, LayoutGrid, List,
  UserCog, CreditCard, CheckSquare, Users, BookOpen, Clock,
  ClipboardList, FileText, TrendingUp, Wallet, ShoppingCart,
  Bus, UtensilsCrossed, HeartPulse, Shield, LayoutDashboard,
  BarChart2, ScrollText, MessageSquare, Settings, Lock, Fingerprint,
  ChevronRight, DollarSign
} from 'lucide-react';

// ─── App Definitions ──────────────────────────────────────────────────────────
const ALL_APPS = [
  // People & HR
  { id:'staff',      domain:'People & HR',     icon: UserCog,        color:'bg-primary',     label:'Staff',               desc:'All employee records, contracts, org structure, recruitment & HR workflows.', path:'/staff',                  live:true  },
  { id:'payroll',    domain:'People & HR',     icon: CreditCard,     color:'bg-violet-600',  label:'Payroll',             desc:'Monthly salary processing, payslips, ShuleAdvance & statutory deductions.',   path:null,                      live:false },
  { id:'attendance', domain:'People & HR',     icon: CheckSquare,    color:'bg-emerald-600', label:'Attendance',          desc:'Gate logs, class period register, teacher clock-in & absence management.',     path:'/attendance',             live:true  },
  // Academic
  { id:'students',   domain:'Academic',        icon: Users,          color:'bg-sky-600',     label:'Students',            desc:'Enrollment, student profiles, parent links, transfers & graduation.',          path:'/students',               live:true  },
  { id:'academic',   domain:'Academic',        icon: BookOpen,       color:'bg-indigo-600',  label:'Academic Structure',  desc:'Levels, classes, A Level combinations, TVET tracks & curriculum mapping.',     path:null,                      live:false },
  { id:'timetable',  domain:'Academic',        icon: Clock,          color:'bg-cyan-600',    label:'Timetable',           desc:'Auto-generate schedules, drag-drop override, substitutions & publishing.',     path:'/academic/timetable',     live:true  },
  { id:'assess',     domain:'Academic',        icon: ClipboardList,  color:'bg-orange-500',  label:'Assessments',         desc:'Exams, homework, continuous assessment, grading scales & result processing.',  path:null,                      live:false },
  { id:'reports',    domain:'Academic',        icon: FileText,       color:'bg-rose-500',    label:'Report Cards',        desc:'Generate, review, approve & distribute report cards per level and term.',       path:null,                      live:false },
  { id:'promotions', domain:'Academic',        icon: TrendingUp,     color:'bg-teal-600',    label:'Promotions',          desc:'Promotion rules, eligibility checks, bulk class moves & graduation processing.',path:null,                      live:false },
  // Finance
  { id:'fees',       domain:'Finance',         icon: DollarSign,     color:'bg-green-600',   label:'Fees',                desc:'Fee structures, invoicing, payment processing, disputes & debt management.',   path:null,                      live:false },
  { id:'wallet',     domain:'Finance',         icon: Wallet,         color:'bg-lime-600',    label:'Wallet',              desc:'iCard digital balances, top-ups, spending history & per-user limits.',          path:null,                      live:false },
  { id:'expenses',   domain:'Finance',         icon: ShoppingCart,   color:'bg-amber-600',   label:'Expenses',            desc:'Procurement, inventory tracking, maintenance, utilities & petty cash.',         path:null,                      live:false },
  // Operations
  { id:'transport',  domain:'Operations',      icon: Bus,            color:'bg-yellow-600',  label:'Transport',           desc:'Routes, vehicle management, student assignments & live GPS tracking.',          path:null,                      live:false },
  { id:'canteen',    domain:'Operations',      icon: UtensilsCrossed,color:'bg-red-500',     label:'Canteen',             desc:'Menu, iCard POS, kitchen display system & food inventory management.',          path:null,                      live:false },
  { id:'health',     domain:'Operations',      icon: HeartPulse,     color:'bg-pink-600',    label:'Health',              desc:'Clinic visits, emergencies, medications, conditions & immunization records.',   path:null,                      live:false },
  { id:'discipline', domain:'Operations',      icon: Shield,         color:'bg-slate-600',   label:'Discipline',          desc:'Incidents, merit/demerit points, sanctions, counseling & behavior reports.',    path:null,                      live:false },
  // Insight
  { id:'dashboards', domain:'Insight',         icon: LayoutDashboard,color:'bg-purple-600',  label:'Dashboards',          desc:'Academic, attendance, financial & operations KPI dashboards with trends.',      path:null,                      live:false },
  { id:'rptbuilder', domain:'Insight',         icon: BarChart2,      color:'bg-fuchsia-600', label:'Reports',             desc:'Custom report builder, scheduling, export formats & saved templates.',          path:null,                      live:false },
  { id:'audit',      domain:'Insight',         icon: ScrollText,     color:'bg-neutral-600', label:'Audit',               desc:'Full activity logs, sensitive action flags, filtering & compliance export.',    path:null,                      live:false },
  // Communication
  { id:'comms',      domain:'Communication',   icon: MessageSquare,  color:'bg-sky-500',     label:'Comms',               desc:'SMS, email, push notifications, broadcast messages & delivery history.',       path:null,                      live:false },
  // System
  { id:'settings',   domain:'System',          icon: Settings,       color:'bg-gray-600',    label:'Settings',            desc:'School profile, academic calendar, notification rules & grading scales.',      path:null,                      live:false },
  { id:'users',      domain:'System',          icon: Lock,           color:'bg-zinc-700',    label:'Users & Roles',       desc:'Admin users, RBAC permissions, role creation & login history.',               path:null,                      live:false },
  { id:'icard',      domain:'System',          icon: Fingerprint,    color:'bg-stone-600',   label:'iCard',               desc:'Identity card management, IoT gate integration & reprint requests.',          path:null,                      live:false },
];

const DOMAINS = ['All', 'People & HR', 'Academic', 'Finance', 'Operations', 'Insight', 'Communication', 'System'];

// ─── App Card ─────────────────────────────────────────────────────────────────
const AppCard = ({ app }) => {
  const Icon = app.icon;
  const card = (
    <div className={`group bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-4 hover:shadow-md hover:border-slate-300 transition-all duration-200 relative ${!app.live ? 'opacity-70' : ''}`}>
      {/* Color swatch — no icon, Odoo style */}
      <div className={`w-14 h-14 rounded-xl ${app.color} shrink-0 shadow-sm`} />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-[13px] font-black text-slate-800 leading-tight">{app.label}</h3>
          {!app.live && (
            <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 border border-slate-200 shrink-0">
              Coming Soon
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-400 font-medium leading-relaxed mb-3 line-clamp-2">{app.desc}</p>
        <div className="flex items-center gap-2">
          {app.live ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wide text-primary bg-primary/8 border border-primary/20 px-3 py-1.5 rounded-lg">
              Open <ChevronRight size={10} />
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wide text-slate-400 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
              Learn More
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return app.live && app.path
    ? <Link to={app.path} className="no-underline block">{card}</Link>
    : card;
};

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Apps() {
  const [search, setSearch]       = useState('');
  const [domain, setDomain]       = useState('All');
  const [viewMode, setViewMode]   = useState('grid'); // 'grid' | 'list'

  const filtered = useMemo(() =>
    ALL_APPS.filter(a => {
      const matchDomain = domain === 'All' || a.domain === domain;
      const matchSearch = a.label.toLowerCase().includes(search.toLowerCase()) ||
                          a.desc.toLowerCase().includes(search.toLowerCase());
      return matchDomain && matchSearch;
    }),
  [search, domain]);

  const domainCounts = useMemo(() => {
    const counts = {};
    ALL_APPS.forEach(a => { counts[a.domain] = (counts[a.domain] || 0) + 1; });
    return counts;
  }, []);

  return (
    <div className="flex h-full bg-slate-50/40 font-sans overflow-hidden">

      {/* ── Left Sidebar ─────────────────────────────────────────────────── */}
      <aside className="w-52 shrink-0 bg-white border-r border-slate-200 overflow-y-auto">
        <div className="px-4 pt-5 pb-3">
          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400 mb-2">Apps</p>
          {['All'].map(d => (
            <div
              key={d}
              onClick={() => setDomain(d)}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer text-[11px] font-bold transition-all mb-0.5 ${domain === d ? 'bg-primary/8 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <span>{d}</span>
              <span className="text-[10px] text-slate-400 font-medium">{ALL_APPS.length}</span>
            </div>
          ))}
        </div>

        <div className="px-4 pb-3 border-t border-slate-100 pt-4">
          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400 mb-2">Domains</p>
          {DOMAINS.filter(d => d !== 'All').map(d => (
            <div
              key={d}
              onClick={() => setDomain(d)}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer text-[11px] font-bold transition-all mb-0.5 ${domain === d ? 'bg-primary/8 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <span>{d}</span>
              <span className="text-[10px] text-slate-400 font-medium">{domainCounts[d] || 0}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Toolbar */}
        <div className="flex items-center gap-3 px-5 py-3 bg-white border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2 flex-1 max-w-md bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
            <Search size={13} className="text-slate-400 shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search apps…"
              className="flex-1 bg-transparent text-[11px] text-slate-700 outline-none font-medium placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-1 ml-auto">
            <span className="text-[10px] text-slate-400 font-medium mr-2">{filtered.length} / {ALL_APPS.length} apps</span>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-slate-100'}`}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-slate-100'}`}
            >
              <List size={15} />
            </button>
          </div>
        </div>

        {/* App Grid / List */}
        <div className="flex-1 overflow-y-auto p-5">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Search size={28} className="text-slate-200 mb-3" />
              <p className="text-sm font-bold text-slate-400">No apps match "{search}"</p>
            </div>
          ) : (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3'
                : 'flex flex-col gap-2'
            }>
              {filtered.map(app => <AppCard key={app.id} app={app} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
