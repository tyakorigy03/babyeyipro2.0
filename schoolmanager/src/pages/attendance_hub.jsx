import React from 'react';
import { Users, UserCog, Utensils, ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const scenarios = [
  {
    icon: Users,
    label: 'Student Attendance',
    description: 'Record daily period-by-period attendance for all classes. Track presence, absences and lateness.',
    color: 'text-primary',
    bg: 'bg-primary/5',
    border: 'border-primary/20',
    path: '/attendance/students',
    stat: '312 students enrolled',
  },
  {
    icon: UserCog,
    label: 'Teacher Attendance',
    description: 'Monitor staff presence, punctuality and duty compliance',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    path: '/attendance/teachers',
    stat: '7 staff members',
  },
];

export default function AttendanceHub() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <div className="flex items-center px-6 h-14 border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3">
          <ShieldCheck size={16} className="text-primary" />
          <h1 className="text-base font-bold text-slate-800 uppercase tracking-wide">Attendance</h1>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-200 rounded px-2 py-0.5 ml-1">Hub</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8 bg-slate-50/40">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">What are you recording today?</h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">Each module captures a specific kind of attendance. Pick the right one for the right context.</p>
          </div>

          <div className="space-y-3">
            {scenarios.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.button
                  key={s.path}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.2 }}
                  onClick={() => navigate(s.path)}
                  className={`w-full flex items-center gap-5 p-5 rounded-xl border ${s.border} bg-white hover:shadow-md hover:-translate-y-0.5 transition-all text-left group`}
                >
                  <div className={`w-12 h-12 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}>
                    <Icon size={22} className={s.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <p className={`font-black text-xs uppercase tracking-wider ${s.color}`}>{s.label}</p>
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${s.bg} ${s.color} border ${s.border}`}>{s.stat}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{s.description}</p>
                  </div>
                  <ArrowRight size={14} className={`${s.color} opacity-0 group-hover:opacity-100 transition-opacity shrink-0`} />
                </motion.button>
              );
            })}
          </div>

          {/* Config nudge at bottom — not a nav item, just a contextual pointer */}
          <div className="mt-8 flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white">
            <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
              <ShieldCheck size={13} className="text-slate-500" />
            </div>
            <p className="text-[11px] text-slate-400 font-medium flex-1">
              Attendance behaviour is driven by your school configuration — periods, shifts, grace times, meal costs and notifications.
            </p>
            <button onClick={() => navigate('/attendance/config')} className="text-[10px] font-black uppercase tracking-wider text-primary border border-primary/20 bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-all shrink-0">
              Configure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
