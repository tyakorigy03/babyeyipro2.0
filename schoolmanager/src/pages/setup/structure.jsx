import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Grid,
  List,
  Layout as LayoutIcon
} from 'lucide-react';
import { 
  ModalBackdrop, 
  ModalShell, 
  FieldRow, 
  TextInput, 
  SelectInput,
  BtnPrimary, 
  BtnGhost
} from './shared';

export default function Structure() {
  const [showModal, setShowModal] = useState(false);
  const [classes, setClasses] = useState([
    { id: 1, name: 'P1 A', level: 'Primary', capacity: 40, teacher: 'Murenzi Eric' },
    { id: 2, name: 'Baby Class', level: 'Nursery', capacity: 30, teacher: 'Sarah Uwase' }
  ]);

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Action Bar */}
      <div className="flex items-center justify-between px-5 py-2 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowModal(true)}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-1.5 rounded-md text-sm font-semibold tracking-wide shadow-sm transition flex items-center gap-2"
          >
            <Plus size={16} /> New Class
          </button>
          <h1 className="text-base font-semibold text-slate-800 uppercase tracking-tight">School Classes</h1>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center border border-slate-300 rounded-md overflow-hidden focus-within:border-primary/60">
            <div className="flex items-center px-3 py-1.5">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input type="text" placeholder="Search classes..." className="w-52 text-sm bg-transparent focus:outline-none" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <span>1-2 / 2</span>
            <button className="p-1 hover:bg-slate-100 rounded"><ChevronLeft size={16} /></button>
            <button className="p-1 hover:bg-slate-100 rounded"><ChevronRight size={16} /></button>
          </div>
          <div className="flex items-center border border-slate-300 rounded-md overflow-hidden bg-white shadow-sm">
            <button className="p-2 hover:bg-slate-50 text-slate-400"><Grid size={16} /></button>
            <button className="p-2 bg-slate-50 text-primary border-x border-slate-300"><List size={16} /></button>
            <button className="p-2 hover:bg-slate-50 text-slate-400"><LayoutIcon size={16} /></button>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto bg-gray-100">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="border-b border-slate-200 text-slate-800 text-[11px] font-bold bg-white sticky top-0 z-10">
              <th className="px-4 py-2 w-10 border-r border-slate-100"><input type="checkbox" className="rounded" /></th>
              <th className="px-4 py-2 border-r border-slate-100 uppercase tracking-wider">Class Name</th>
              <th className="px-4 py-2 border-r border-slate-100 uppercase tracking-wider">Level</th>
              <th className="px-4 py-2 border-r border-slate-100 uppercase tracking-wider">Capacity</th>
              <th className="px-4 py-2 uppercase tracking-wider">Teacher</th>
            </tr>
          </thead>
          <tbody className="text-[11px]">
            {classes.map((c, idx) => (
              <tr key={c.id} className={`border-b border-slate-200 cursor-pointer transition-colors hover:bg-primary/5 ${idx % 2 !== 0 ? 'bg-slate-200' : 'bg-white'}`}>
                <td className="px-4 py-1.5 w-10"><input type="checkbox" className="rounded" /></td>
                <td className="px-4 py-1.5 font-medium text-slate-700 border-r border-slate-100">{c.name}</td>
                <td className="px-4 py-1.5 text-slate-600 font-medium border-r border-slate-100">{c.level}</td>
                <td className="px-4 py-1.5 text-slate-600 font-medium border-r border-slate-100">{c.capacity} Students</td>
                <td className="px-4 py-1.5 text-slate-600 font-medium">{c.teacher}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <ModalBackdrop onClose={() => setShowModal(false)}>
            <ModalShell title="Add New Class" subtitle="Academic · Structural Unit" onClose={() => setShowModal(false)}
              footer={<><BtnGhost onClick={() => setShowModal(false)}>Cancel</BtnGhost><BtnPrimary onClick={() => setShowModal(false)}>Add Class</BtnPrimary></>}>
              <div className="space-y-5">
                <FieldRow label="Class Name" required><TextInput placeholder="e.g. S1 A" /></FieldRow>
                <FieldRow label="Level" required><SelectInput><option>Nursery</option><option>Primary</option></SelectInput></FieldRow>
                <FieldRow label="Capacity"><TextInput type="number" placeholder="40" /></FieldRow>
                <FieldRow label="Teacher"><TextInput placeholder="Assigned teacher name..." /></FieldRow>
              </div>
            </ModalShell>
          </ModalBackdrop>
        )}
      </AnimatePresence>
    </div>
  );
}
