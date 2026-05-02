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
  BtnPrimary, 
  BtnGhost,
  PRIMARY
} from './shared';

export default function Academic() {
  const [showModal, setShowModal] = useState(false);
  const [years, setYears] = useState([
    { id: 1, name: '2024-2025', status: 'Active' },
    { id: 2, name: '2025-2026', status: 'Inactive' }
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
            <Plus size={16} /> New Year
          </button>
          <h1 className="text-base font-semibold text-slate-800 uppercase tracking-tight">Academic Years</h1>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center border border-slate-300 rounded-md overflow-hidden focus-within:border-primary/60">
            <div className="flex items-center px-3 py-1.5">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input type="text" placeholder="Search years..." className="w-52 text-sm bg-transparent focus:outline-none" />
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
              <th className="px-4 py-2 border-r border-slate-100 uppercase tracking-wider">Year Name</th>
              <th className="px-4 py-2 border-r border-slate-100 uppercase tracking-wider w-32">Status</th>
              <th className="px-4 py-2 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-[11px]">
            {years.map((y, idx) => (
              <tr key={y.id} className={`border-b border-slate-200 cursor-pointer transition-colors hover:bg-primary/5 ${idx % 2 !== 0 ? 'bg-slate-200' : 'bg-white'}`}>
                <td className="px-4 py-1.5 w-10"><input type="checkbox" className="rounded" /></td>
                <td className="px-4 py-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shadow-sm border border-primary/20 uppercase">{y.name.charAt(0)}</div>
                    <span className="font-medium text-slate-700">{y.name}</span>
                  </div>
                </td>
                <td className="px-4 py-1.5 border-x border-slate-100">
                   <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${y.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>{y.status}</span>
                </td>
                <td className="px-4 py-1.5 text-right">
                   {y.status !== 'Active' && <button onClick={() => setYears(years.map(item => item.id === y.id ? {...item, status: 'Active'} : {...item, status: 'Inactive'}))} className="text-primary font-bold text-[10px] uppercase hover:underline">Activate</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <ModalBackdrop onClose={() => setShowModal(false)}>
            <ModalShell title="New Academic Year" subtitle="Foundation · Timeframe" onClose={() => setShowModal(false)}
              footer={<><BtnGhost onClick={() => setShowModal(false)}>Cancel</BtnGhost><BtnPrimary onClick={() => setShowModal(false)}>Create Year</BtnPrimary></>}>
              <div className="space-y-5">
                <FieldRow label="Year Name" required><TextInput placeholder="e.g. 2025-2026" /></FieldRow>
                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary/20 w-4 h-4" />
                  <span className="text-xs font-semibold text-slate-600">Activate immediately</span>
                </div>
              </div>
            </ModalShell>
          </ModalBackdrop>
        )}
      </AnimatePresence>
    </div>
  );
}
