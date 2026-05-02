import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays, Plus, Users, UserCog, Check, X, Search,
  ChevronRight, Mic, Bus, BookOpen, Award, ArrowLeft, Save
} from 'lucide-react';

const EVENT_TYPES = [
  { id: 'assembly', label: 'Assembly', icon: Mic, color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200' },
  { id: 'meeting', label: 'Staff Meeting', icon: BookOpen, color: 'text-primary', bg: 'bg-primary/5', border: 'border-primary/20' },
  { id: 'trip', label: 'School Trip', icon: Bus, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  { id: 'ceremony', label: 'Ceremony', icon: Award, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
];

const ALL_STAFF = [
  { id: 1, name: 'Robert Ntaganda', role: 'ICT Teacher' },
  { id: 2, name: 'David Kagabo', role: 'ICT Teacher' },
  { id: 3, name: 'Diane Umutoni', role: 'Literature Teacher' },
  { id: 4, name: 'Samuel Bizimana', role: 'Literature Teacher' },
  { id: 5, name: 'Eric Kayisire', role: 'Accountant' },
  { id: 6, name: 'Jean Pierre', role: 'Discipline Master' },
  { id: 7, name: 'Chef Tom Habimana', role: 'Head of Kitchen' },
];

const ALL_CLASSES = ['Baby Class','P1','P2','P3','P4','P5','P6','S1','S2','S3','S4 PCM','S4 PCB','S6 PCM'];

const mockEvents = [
  { id: 1, title: 'Monday Morning Assembly', type: 'assembly', date: '2025-04-21', attendees: { staff: [1,2,3,4,5,6,7], classes: ALL_CLASSES }, recorded: true },
  { id: 2, title: 'Q2 Staff Review Meeting', type: 'meeting', date: '2025-04-18', attendees: { staff: [1,2,3,4,5,6,7], classes: [] }, recorded: false },
];

// ─── Wizard ───────────────────────────────────────────────────────────────────
function CreateEventWizard({ onSave, onCancel }) {
  const [step, setStep] = useState(0); // 0=type, 1=details, 2=who, 3=record
  const [eventType, setEventType] = useState(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [includeStaff, setIncludeStaff] = useState(true);
  const [includeStudents, setIncludeStudents] = useState(true);
  const [staffAtt, setStaffAtt] = useState(() => Object.fromEntries(ALL_STAFF.map(s => [s.id, 'present'])));
  const [classAtt, setClassAtt] = useState(() => Object.fromEntries(ALL_CLASSES.map(c => [c, 'present'])));
  const [search, setSearch] = useState('');

  const toggleStaff = id => setStaffAtt(p => ({ ...p, [id]: p[id] === 'present' ? 'absent' : 'present' }));
  const toggleClass = cls => setClassAtt(p => ({ ...p, [cls]: p[cls] === 'present' ? 'absent' : 'present' }));

  const steps = ['Type', 'Details', 'Who Attends', 'Record'];

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      className="flex flex-col h-full"
    >
      {/* Wizard header */}
      <div className="flex items-center gap-4 px-6 py-3 border-b border-slate-200 bg-white shrink-0">
        <button onClick={onCancel} className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-primary uppercase tracking-wide transition-colors">
          <ArrowLeft size={13} /> Back
        </button>
        <div className="flex items-center gap-2 flex-1">
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider transition-all ${i === step ? 'text-primary' : i < step ? 'text-emerald-600' : 'text-slate-300'}`}>
                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black border ${i === step ? 'bg-primary text-white border-primary' : i < step ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white border-slate-200 text-slate-400'}`}>
                  {i < step ? <Check size={8} /> : i + 1}
                </div>
                {s}
              </div>
              {i < steps.length - 1 && <ChevronRight size={12} className="text-slate-200" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">

        {/* Step 0: Event type */}
        {step === 0 && (
          <div className="max-w-xl mx-auto">
            <h2 className="text-base font-black text-slate-800 uppercase tracking-tight mb-1">What type of event?</h2>
            <p className="text-xs text-slate-400 mb-6">Select the category that best describes this event.</p>
            <div className="grid grid-cols-2 gap-3">
              {EVENT_TYPES.map(et => {
                const Icon = et.icon;
                return (
                  <button
                    key={et.id}
                    onClick={() => setEventType(et)}
                    className={`p-5 rounded-xl border-2 text-left transition-all ${eventType?.id === et.id ? `${et.border} ${et.bg}` : 'border-slate-200 bg-white hover:border-slate-300'}`}
                  >
                    <Icon size={22} className={eventType?.id === et.id ? et.color : 'text-slate-400'} />
                    <p className={`font-black text-xs uppercase tracking-wider mt-3 ${eventType?.id === et.id ? et.color : 'text-slate-600'}`}>{et.label}</p>
                  </button>
                );
              })}
            </div>
            <div className="flex justify-end mt-6">
              <button disabled={!eventType} onClick={() => setStep(1)} className="bg-primary disabled:opacity-40 text-white px-5 py-2 rounded-md text-sm font-bold uppercase tracking-wide transition-all">
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 1: Details */}
        {step === 1 && (
          <div className="max-w-xl mx-auto">
            <h2 className="text-base font-black text-slate-800 uppercase tracking-tight mb-1">Event Details</h2>
            <p className="text-xs text-slate-400 mb-6">Give this event a name and date.</p>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 block mb-1.5">Event Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Monday Morning Assembly"
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-primary/40 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 block mb-1.5">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-primary/40 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 block mb-2">Who is involved?</label>
                <div className="flex gap-3">
                  {[['includeStaff', 'Staff', includeStaff, setIncludeStaff], ['includeStudents', 'Students', includeStudents, setIncludeStudents]].map(([key, label, val, setter]) => (
                    <button key={key} onClick={() => setter(!val)} className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all ${val ? 'bg-primary text-white border-primary' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>
                      {val && <Check size={12} />} {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button onClick={() => setStep(0)} className="text-slate-500 hover:text-primary text-sm font-bold uppercase tracking-wide transition-colors">Back</button>
              <button disabled={!title} onClick={() => setStep(2)} className="bg-primary disabled:opacity-40 text-white px-5 py-2 rounded-md text-sm font-bold uppercase tracking-wide">Next</button>
            </div>
          </div>
        )}

        {/* Step 2: Record attendance */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-base font-black text-slate-800 uppercase tracking-tight mb-1">Mark Attendance</h2>
            <p className="text-xs text-slate-400 mb-4">Click to toggle present/absent. Green = present, Red = absent.</p>

            <div className="flex items-center border border-slate-200 rounded-lg px-3 py-2 mb-4 focus-within:border-primary/40 bg-white">
              <Search size={14} className="text-slate-400 mr-2" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="text-sm outline-none bg-transparent flex-1 text-slate-700 font-medium placeholder:text-slate-400" />
            </div>

            <div className="space-y-4">
              {includeStaff && (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2 flex items-center gap-2"><UserCog size={11} /> Staff</p>
                  <div className="grid grid-cols-2 gap-2">
                    {ALL_STAFF.filter(s => s.name.toLowerCase().includes(search.toLowerCase())).map(s => (
                      <button
                        key={s.id}
                        onClick={() => toggleStaff(s.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${staffAtt[s.id] === 'present' ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${staffAtt[s.id] === 'present' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                          {staffAtt[s.id] === 'present' ? <Check size={12} /> : <X size={12} />}
                        </div>
                        <div>
                          <p className={`text-[11px] font-bold ${staffAtt[s.id] === 'present' ? 'text-emerald-800' : 'text-rose-700'}`}>{s.name}</p>
                          <p className="text-[9px] text-slate-400 font-medium">{s.role}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {includeStudents && (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2 flex items-center gap-2"><Users size={11} /> Classes</p>
                  <div className="grid grid-cols-4 gap-2">
                    {ALL_CLASSES.filter(c => c.toLowerCase().includes(search.toLowerCase())).map(cls => (
                      <button
                        key={cls}
                        onClick={() => toggleClass(cls)}
                        className={`flex items-center justify-between p-2.5 rounded-lg border text-left transition-all ${classAtt[cls] === 'present' ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}
                      >
                        <span className={`text-[10px] font-black uppercase tracking-wide ${classAtt[cls] === 'present' ? 'text-emerald-800' : 'text-rose-700'}`}>{cls}</span>
                        {classAtt[cls] === 'present' ? <Check size={10} className="text-emerald-500" /> : <X size={10} className="text-rose-500" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-between mt-6">
              <button onClick={() => setStep(1)} className="text-slate-500 hover:text-primary text-sm font-bold uppercase tracking-wide transition-colors">Back</button>
              <button onClick={() => onSave({ title, date, type: eventType, staffAtt, classAtt })} className="bg-primary text-white px-5 py-2 rounded-md text-sm font-bold uppercase tracking-wide flex items-center gap-2">
                <Save size={13} /> Save Event
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function EventAttendance() {
  const [events, setEvents] = useState(mockEvents);
  const [creating, setCreating] = useState(false);

  const handleSave = (data) => {
    setEvents(prev => [
      ...prev,
      { id: prev.length + 1, title: data.title, type: data.type.id, date: data.date, attendees: {}, recorded: true },
    ]);
    setCreating(false);
  };

  const typeInfo = (id) => EVENT_TYPES.find(e => e.id === id) || EVENT_TYPES[0];

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 overflow-hidden">
      <AnimatePresence mode="wait">
        {creating ? (
          <CreateEventWizard key="wizard" onSave={handleSave} onCancel={() => setCreating(false)} />
        ) : (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full">
            {/* Action bar */}
            <div className="flex items-center justify-between px-5 border-b border-slate-200 bg-white shrink-0 h-14">
              <h1 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <CalendarDays size={16} className="text-violet-600" /> Event Attendance
              </h1>
              <button
                onClick={() => setCreating(true)}
                className="bg-primary hover:bg-primary/90 text-white px-4 py-1.5 rounded-md text-sm font-semibold tracking-wide shadow-sm transition flex items-center gap-2"
              >
                <Plus size={14} /> New Event
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6 bg-slate-50/40">
              <div className="max-w-3xl mx-auto space-y-3">
                {events.map((ev, i) => {
                  const t = typeInfo(ev.type);
                  const Icon = t.icon;
                  return (
                    <motion.div
                      key={ev.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-center gap-4 p-5 bg-white rounded-xl border ${t.border} shadow-sm`}
                    >
                      <div className={`w-11 h-11 rounded-xl ${t.bg} border ${t.border} flex items-center justify-center shrink-0`}>
                        <Icon size={20} className={t.color} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-[12px] font-black text-slate-800 uppercase tracking-tight">{ev.title}</p>
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${t.bg} ${t.color} border ${t.border}`}>{t.label}</span>
                          {ev.recorded && (
                            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                              <Check size={8} /> Recorded
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium">{new Date(ev.date).toLocaleDateString('en-GB', { weekday:'long', day:'2-digit', month:'long', year:'numeric' })}</p>
                      </div>
                      <button className="text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20 bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-all">
                        View
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
