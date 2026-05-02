import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save, Clock, BellRing, Calendar, Settings, Coffee, BookOpen,
  Plus, Trash2, ChevronDown, Utensils, UserCog, GraduationCap,
  Users, DollarSign, ShieldCheck, AlertCircle, Check
} from 'lucide-react';

// ─── Shared primitives ────────────────────────────────────────────────────────
const Toggle = ({ value, onChange }) => (
  <button
    onClick={() => onChange(!value)}
    className={`relative w-10 h-5 rounded-full transition-all shrink-0 ${value ? 'bg-primary' : 'bg-slate-200'}`}
  >
    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${value ? 'left-5' : 'left-0.5'}`} />
  </button>
);

const SectionCard = ({ icon: Icon, iconBg, iconBorder, iconColor, title, subtitle, children }) => (
  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
    <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-slate-50">
      <div className={`w-7 h-7 rounded-lg ${iconBg} flex items-center justify-center border ${iconBorder} shrink-0`}>
        <Icon size={14} className={iconColor} />
      </div>
      <div>
        <p className="text-xs font-black text-slate-800 uppercase tracking-wider">{title}</p>
        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{subtitle}</p>
      </div>
    </div>
    {children}
  </div>
);

const FieldRow = ({ label, hint, children }) => (
  <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 last:border-0">
    <div className="mr-4">
      <p className="text-xs font-bold text-slate-700">{label}</p>
      {hint && <p className="text-[10px] text-slate-400 font-medium mt-0.5">{hint}</p>}
    </div>
    {children}
  </div>
);

// ─── Section: School Days & Periods ──────────────────────────────────────────
const WEEKDAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const defaultPeriods = [
  { id: 1, name: 'Period 1', start: '08:00', end: '08:50', is_break: false },
  { id: 2, name: 'Period 2', start: '08:50', end: '09:40', is_break: false },
  { id: 3, name: 'Break',    start: '09:40', end: '10:00', is_break: true  },
  { id: 4, name: 'Period 3', start: '10:00', end: '10:50', is_break: false },
  { id: 5, name: 'Period 4', start: '10:50', end: '11:40', is_break: false },
  { id: 6, name: 'Lunch',    start: '11:40', end: '12:40', is_break: true  },
  { id: 7, name: 'Period 5', start: '12:40', end: '13:30', is_break: false },
  { id: 8, name: 'Period 6', start: '13:30', end: '14:20', is_break: false },
];

function SchoolDaysSection() {
  const [activeDays, setActiveDays] = useState(['Monday','Tuesday','Wednesday','Thursday','Friday']);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [campusOpen, setCampusOpen] = useState('07:30');
  const [campusClose, setCampusClose] = useState('17:00');
  const [periodsByDay, setPeriodsByDay] = useState(() => {
    const obj = {};
    WEEKDAYS.forEach(d => { obj[d] = ['Monday','Tuesday','Wednesday','Thursday','Friday'].includes(d) ? [...defaultPeriods.map(p => ({...p}))] : []; });
    return obj;
  });

  const toggleDay = (day) => {
    setActiveDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const updatePeriod = (day, id, field, val) => {
    setPeriodsByDay(prev => ({
      ...prev,
      [day]: prev[day].map(p => p.id === id ? { ...p, [field]: val } : p),
    }));
  };

  const removePeriod = (day, id) => {
    setPeriodsByDay(prev => ({ ...prev, [day]: prev[day].filter(p => p.id !== id) }));
  };

  const addPeriod = (day, is_break) => {
    setPeriodsByDay(prev => ({
      ...prev,
      [day]: [...prev[day], { id: Date.now(), name: is_break ? 'Break' : `Period ${prev[day].filter(p=>!p.is_break).length + 1}`, start: '14:30', end: '15:20', is_break }],
    }));
  };

  const periods = periodsByDay[selectedDay] || [];

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-slate-50">
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
          <Calendar size={14} className="text-primary" />
        </div>
        <div>
          <p className="text-xs font-black text-slate-800 uppercase tracking-wider">School Days & Periods</p>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">Define which days are active and configure the period schedule for each day</p>
        </div>
      </div>

      <div className="flex divide-x divide-slate-100">
        {/* Day picker */}
        <div className="w-48 shrink-0 p-3 space-y-1">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-2 mb-2">Active Days</p>
          {WEEKDAYS.map(day => (
            <div
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer transition-all ${selectedDay === day ? 'bg-primary/5 border border-primary/20' : 'border border-transparent hover:bg-slate-50'}`}
            >
              <label className="flex items-center gap-2 cursor-pointer" onClick={e => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={activeDays.includes(day)}
                  onChange={() => toggleDay(day)}
                  className="w-3 h-3 accent-primary"
                />
                <span className={`text-[11px] font-bold uppercase tracking-tight ${selectedDay === day ? 'text-primary' : 'text-slate-600'}`}>{day}</span>
              </label>
              <span className={`text-[9px] font-bold ${selectedDay === day ? 'text-primary' : 'text-slate-300'}`}>{periodsByDay[day].length}</span>
            </div>
          ))}

          <div className="pt-3 border-t border-slate-100 space-y-2 mt-2">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-2">Campus Hours</p>
            <div className="px-2 space-y-2">
              <div>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Opens</p>
                <input type="time" value={campusOpen} onChange={e => setCampusOpen(e.target.value)} className="w-full border border-slate-200 rounded px-2 py-1 text-[11px] font-bold text-slate-700 outline-none focus:border-primary" />
              </div>
              <div>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Closes</p>
                <input type="time" value={campusClose} onChange={e => setCampusClose(e.target.value)} className="w-full border border-slate-200 rounded px-2 py-1 text-[11px] font-bold text-slate-700 outline-none focus:border-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* Period editor */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">{selectedDay} Schedule</p>
            <div className="flex gap-2">
              <button onClick={() => addPeriod(selectedDay, true)} className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded transition-all hover:bg-amber-100">
                <Coffee size={10} /> Add Break
              </button>
              <button onClick={() => addPeriod(selectedDay, false)} className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-primary bg-primary/5 border border-primary/20 px-2 py-1 rounded transition-all hover:bg-primary/10">
                <Plus size={10} /> Add Period
              </button>
            </div>
          </div>

          {periods.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
              <Calendar size={24} className="mb-2 opacity-30" />
              <p className="text-xs font-bold uppercase tracking-wide">No periods — day is off</p>
            </div>
          ) : (
            <div className="overflow-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    <th className="px-4 py-2 w-8">#</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2 w-28">Start</th>
                    <th className="px-4 py-2 w-28">End</th>
                    <th className="px-4 py-2 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {periods.map((p, i) => (
                      <motion.tr
                        key={p.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`border-b border-slate-100 group ${p.is_break ? 'bg-amber-50/40' : i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                      >
                        <td className="px-4 py-2 text-[10px] text-slate-400 font-bold">{i + 1}</td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            {p.is_break
                              ? <Coffee size={11} className="text-amber-500 shrink-0" />
                              : <BookOpen size={11} className="text-primary/40 shrink-0" />}
                            <input
                              value={p.name}
                              onChange={e => updatePeriod(selectedDay, p.id, 'name', e.target.value)}
                              className={`text-[11px] font-bold bg-transparent border-b border-transparent focus:border-slate-300 outline-none w-full ${p.is_break ? 'text-amber-700' : 'text-slate-800'}`}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <input type="time" value={p.start} onChange={e => updatePeriod(selectedDay, p.id, 'start', e.target.value)}
                            className="text-[11px] font-bold text-slate-700 border border-slate-200 rounded px-2 py-1 outline-none focus:border-primary bg-white" />
                        </td>
                        <td className="px-4 py-2">
                          <input type="time" value={p.end} onChange={e => updatePeriod(selectedDay, p.id, 'end', e.target.value)}
                            className="text-[11px] font-bold text-slate-700 border border-slate-200 rounded px-2 py-1 outline-none focus:border-primary bg-white" />
                        </td>
                        <td className="px-4 py-2">
                          <button onClick={() => removePeriod(selectedDay, p.id)} className="p-1 text-slate-300 hover:text-rose-500 rounded transition-colors opacity-0 group-hover:opacity-100">
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Section: Staff Shift Hours ───────────────────────────────────────────────
const DEPT_TYPES = [
  { name: 'ICT Department',          type: 'teaching',     defaultIn: '07:45', defaultOut: '15:00' },
  { name: 'Literature Department',   type: 'teaching',     defaultIn: '07:45', defaultOut: '15:00' },
  { name: 'Accounting Dept',         type: 'non-teaching', defaultIn: '07:30', defaultOut: '17:00' },
  { name: 'Discipline Dept',         type: 'non-teaching', defaultIn: '06:30', defaultOut: '18:00' },
  { name: 'Support Staff',           type: 'non-teaching', defaultIn: '06:00', defaultOut: '19:00' },
];

function ShiftSection() {
  const [shifts, setShifts] = useState(DEPT_TYPES.map(d => ({ ...d, checkIn: d.defaultIn, checkOut: d.defaultOut })));

  const update = (name, field, val) => {
    setShifts(prev => prev.map(s => s.name === name ? { ...s, [field]: val } : s));
  };

  return (
    <SectionCard
      icon={UserCog}
      iconBg="bg-amber-50"
      iconBorder="border-amber-200"
      iconColor="text-amber-600"
      title="Staff Shift Hours"
      subtitle="Default check-in and check-out times per department — used as baselines for non-teaching staff attendance"
    >
      <div className="divide-y divide-slate-100">
        {shifts.map(s => (
          <div key={s.name} className="flex items-center gap-4 px-5 py-3">
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-slate-700">{s.name}</p>
              <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${s.type === 'teaching' ? 'text-primary bg-primary/5' : 'text-amber-700 bg-amber-50'}`}>
                {s.type === 'teaching' ? 'Teaching' : 'Non-Teaching'}
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1.5 border border-slate-200 rounded px-2 py-1 bg-white">
                <span className="text-[9px] font-black text-slate-400 uppercase">In</span>
                <input type="time" value={s.checkIn} onChange={e => update(s.name, 'checkIn', e.target.value)}
                  className="text-[11px] font-bold text-slate-700 outline-none bg-transparent" />
              </div>
              <div className="flex items-center gap-1.5 border border-slate-200 rounded px-2 py-1 bg-white">
                <span className="text-[9px] font-black text-slate-400 uppercase">Out</span>
                <input type="time" value={s.checkOut} onChange={e => update(s.name, 'checkOut', e.target.value)}
                  className="text-[11px] font-bold text-slate-700 outline-none bg-transparent" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

// ─── Section: Grace Periods ───────────────────────────────────────────────────
function GraceSection() {
  const [studentGrace, setStudentGrace] = useState(10);
  const [staffGrace, setStaffGrace] = useState(5);
  const [registerLock, setRegisterLock] = useState(30);

  return (
    <SectionCard
      icon={Clock}
      iconBg="bg-primary/10"
      iconBorder="border-primary/20"
      iconColor="text-primary"
      title="Grace Periods & Register Lock"
      subtitle="Time windows that determine when someone is marked late and when attendance registers close"
    >
      <div className="divide-y divide-slate-100">
        {[
          { label: 'Student grace period', hint: 'Minutes after period start before a student is marked late', val: studentGrace, set: setStudentGrace, max: 60, step: 5, unit: 'min' },
          { label: 'Staff grace period', hint: 'Minutes after shift start before staff is marked late', val: staffGrace, set: setStaffGrace, max: 30, step: 5, unit: 'min' },
          { label: 'Register lock time', hint: 'Minutes after period start when the register closes and can no longer be edited', val: registerLock, set: setRegisterLock, max: 120, step: 10, unit: 'min' },
        ].map(item => (
          <FieldRow key={item.label} label={item.label} hint={item.hint}>
            <div className="flex items-center gap-4 shrink-0">
              <input type="range" min={0} max={item.max} step={item.step} value={item.val}
                onChange={e => item.set(Number(e.target.value))}
                className="w-32 accent-primary" />
              <span className="text-primary font-black text-sm w-16 text-right">{item.val} {item.unit}</span>
            </div>
          </FieldRow>
        ))}
      </div>
    </SectionCard>
  );
}

// ─── Section: Notifications ───────────────────────────────────────────────────
function NotificationsSection() {
  const [rules, setRules] = useState([
    { id: 1, label: 'Notify parent when student is absent',       enabled: true  },
    { id: 2, label: 'Notify parent when student arrives late',    enabled: false },
    { id: 3, label: 'Notify HOD when teacher misses a period',    enabled: true  },
    { id: 4, label: 'Notify admin when staff misses shift',       enabled: true  },
    { id: 5, label: 'Notify bursar with daily meal cost summary', enabled: false },
    { id: 6, label: 'Alert admin on consecutive absences (3+)',   enabled: true  },
  ]);

  const toggle = (id) => setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));

  return (
    <SectionCard
      icon={BellRing}
      iconBg="bg-blue-50"
      iconBorder="border-blue-200"
      iconColor="text-blue-500"
      title="Notification Rules"
      subtitle="Automated alerts triggered by attendance events — sent to parents, HODs and admins"
    >
      <div className="divide-y divide-slate-100">
        {rules.map(r => (
          <FieldRow key={r.id} label={r.label}>
            <Toggle value={r.enabled} onChange={() => toggle(r.id)} />
          </FieldRow>
        ))}
      </div>
    </SectionCard>
  );
}

// ─── Sidebar nav sections ─────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'days',    label: 'School Days & Periods', icon: Calendar  },
  { id: 'shifts',  label: 'Staff Shift Hours',     icon: UserCog   },
  { id: 'grace',   label: 'Grace & Lock Times',    icon: Clock     },
  { id: 'notify',  label: 'Notifications',         icon: BellRing  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AttendanceConfig() {
  const [active, setActive] = useState('days');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 overflow-hidden">
      {/* Action Bar */}
      <div className="flex items-center justify-between px-5 border-b border-slate-200 bg-white shrink-0 h-14">
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            className={`text-white px-4 py-1.5 rounded-md text-sm font-semibold tracking-wide shadow-sm transition flex items-center gap-2 ${saved ? 'bg-emerald-600' : 'bg-primary hover:bg-primary/90'}`}
          >
            {saved ? <><Check size={14} /> Saved</> : <><Save size={14} /> Save Configuration</>}
          </button>
          <h1 className="text-base font-semibold text-slate-800">Attendance Configuration</h1>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <AlertCircle size={12} className="text-amber-500" />
          Changes affect all attendance modules
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 border-r border-slate-100 p-4 bg-white overflow-y-auto shrink-0">
          <h2 className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-3">
            <Settings size={11} className="text-primary" /> Configuration
          </h2>
          <nav className="space-y-0.5">
            {SECTIONS.map(s => {
              const Icon = s.icon;
              return (
                <div
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded cursor-pointer text-[11px] font-bold uppercase tracking-tight transition-all border ${
                    active === s.id
                      ? 'bg-primary/5 text-primary border-primary/20'
                      : 'text-slate-500 hover:bg-slate-50 border-transparent'
                  }`}
                >
                  <Icon size={12} className={active === s.id ? 'text-primary' : 'text-slate-400'} />
                  {s.label}
                </div>
              );
            })}
          </nav>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">Affects modules</p>
            {[
              { icon: GraduationCap, label: 'Student Attendance', color: 'text-primary' },
              { icon: UserCog,       label: 'Staff Attendance',   color: 'text-emerald-600' },
            ].map(m => {
              const Icon = m.icon;
              return (
                <div key={m.label} className="flex items-center gap-2 px-2 py-1.5">
                  <Icon size={11} className={m.color} />
                  <span className={`text-[10px] font-bold ${m.color}`}>{m.label}</span>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Main panel */}
        <main className="flex-1 overflow-auto bg-gray-50/30 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {active === 'days'   && <SchoolDaysSection />}
              {active === 'shifts' && <ShiftSection />}
              {active === 'grace'  && <GraceSection />}
              {active === 'notify' && <NotificationsSection />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
