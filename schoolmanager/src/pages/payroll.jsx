import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, 
  Search, 
  Filter, 
  ChevronDown, 
  Download, 
  FileText, 
  TrendingUp, 
  CheckCircle2, 
  Calendar, 
  Wallet,
  Building2,
  Users,
  Check,
  X,
  Plus,
  Clock,
  Layout as LayoutIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ─── Department Hierarchy ───────────────────────────────────────────────────
const deptHierarchy = [
  { name: 'Academic', children: [{ name: 'Primary School' }, { name: 'Secondary School' }] },
  { name: 'Administration', children: [{ name: 'Finance' }, { name: 'HR' }, { name: 'IT Support' }] },
  { name: 'Operations', children: [{ name: 'Transport' }, { name: 'Canteen' }, { name: 'Security' }] },
];

// ─── Tree Item ──────────────────────────────────────────────────────────────
const TreeItem = ({ item, depth = 0, selectedDept, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isSelected = selectedDept === item.name;

  return (
    <div className="mb-0.5">
      <div
        className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer text-[10px] transition-all ${
          depth === 0
            ? 'text-slate-800 font-bold uppercase tracking-tight mt-2'
            : isSelected
            ? 'bg-accent/5 text-accent font-black uppercase tracking-tight border border-accent/20'
            : 'text-slate-600 hover:bg-slate-50 uppercase tracking-tight font-medium border border-transparent'
        }`}
        onClick={() => hasChildren ? setIsOpen(!isOpen) : onSelect(item.name)}
      >
        <div className="flex items-center gap-1.5 overflow-hidden">
          {hasChildren && (
            <ChevronDown size={11} className={`text-slate-400 transition-transform ${!isOpen ? '-rotate-90' : ''}`} />
          )}
          {!hasChildren && <div className="w-1.5 h-1.5 rounded-full bg-slate-300 ml-1 shrink-0" />}
          <span className="truncate">{item.name}</span>
        </div>
      </div>
      {isOpen && hasChildren && (
        <div className="ml-3 border-l border-slate-100 pl-1.5 space-y-0.5 mt-0.5">
          {item.children.map((child, idx) => (
            <TreeItem key={idx} item={child} depth={depth + 1} selectedDept={selectedDept} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function Payroll() {
  const navigate = useNavigate();
  const [selectedDept, setSelectedDept] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const payrollData = [
    { id: 1, name: 'Jean Damascene', role: 'Teacher', grade: 'Grade 3', gross: '850,000', net: '640,000', status: 'processed', period: 'April 2026' },
    { id: 2, name: 'Alice Umutoni', role: 'Admin', grade: 'Grade 5', gross: '1,200,000', net: '910,000', status: 'pending', period: 'April 2026' },
    { id: 3, name: 'Emmanuel Karekezi', role: 'Teacher', grade: 'Grade 2', gross: '650,000', net: '495,000', status: 'processed', period: 'April 2026' },
    { id: 4, name: 'Beatrice Uwase', role: 'Nurse', grade: 'Grade 4', gross: '950,000', net: '720,000', status: 'processed', period: 'April 2026' },
    { id: 5, name: 'Claude Nsabimana', role: 'Driver', grade: 'Grade 1', gross: '450,000', net: '345,000', status: 'pending', period: 'April 2026' },
    { id: 6, name: 'Grace Mutoni', role: 'Teacher', grade: 'Grade 3', gross: '850,000', net: '640,000', status: 'processed', period: 'April 2026' },
    { id: 7, name: 'Safi Ishimwe', role: 'Admin', grade: 'Grade 2', gross: '650,000', net: '495,000', status: 'processed', period: 'April 2026' },
  ];

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 overflow-hidden font-sans">
      
      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between px-5 border-b border-slate-200 bg-white sticky top-0 z-20 shrink-0 h-14">
        <div className="flex items-center gap-6">
          <button className="bg-primary hover:bg-primary/90 text-white px-4 py-1.5 rounded-md text-xs font-semibold shadow-sm transition flex items-center gap-2">
            <TrendingUp size={13} /> Process Payroll
          </button>
          <h1 className="text-sm font-semibold text-slate-800">Monthly Payroll</h1>
        </div>

        {/* Center Search */}
        <div className="flex-1 flex justify-center max-w-md mx-auto">
          <div className="relative w-full max-w-xs">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search staff…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-accent bg-slate-50/50 transition-all"
            />
          </div>
        </div>

        {selectedDept && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1 text-emerald-600">
                <DollarSign size={10} className="stroke-[3]" /> 42.8M Net
              </span>
              <span className="flex items-center gap-1 text-amber-500">
                <Wallet size={10} className="stroke-[3]" /> 2.1M Advance
              </span>
            </div>
            <div className="flex items-center border border-slate-300 rounded-md overflow-hidden bg-white px-2.5 py-1.5">
              <Calendar size={12} className="text-slate-400 mr-1.5" />
              <span className="text-xs font-semibold text-slate-700">April 2026 Cycle</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* ── Sidebar ── */}
        <aside className="w-56 border-r border-slate-100 p-3 bg-white overflow-y-auto shrink-0">
          <h2 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
            <LayoutIcon className="w-3 h-3 text-primary" /> DEPARTMENTS
          </h2>
          <nav>
            {deptHierarchy.map((node, idx) => (
              <TreeItem key={idx} item={node} selectedDept={selectedDept} onSelect={setSelectedDept} />
            ))}
          </nav>

          <div className="mt-8 pt-4 border-t border-slate-100 space-y-1">
            <h2 className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-2">
              <Filter size={9} className="text-primary" /> Reports
            </h2>
            <button className="flex items-center gap-2 w-full px-2 py-1.5 rounded text-[10px] font-bold text-slate-500 hover:bg-slate-50 hover:text-primary transition-all uppercase tracking-tight">
              <Download size={12} className="text-slate-300" /> Export Excel
            </button>
            <button className="flex items-center gap-2 w-full px-2 py-1.5 rounded text-[10px] font-bold text-slate-500 hover:bg-slate-50 hover:text-primary transition-all uppercase tracking-tight">
              <FileText size={12} className="text-slate-300" /> Statutory Summary
            </button>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 overflow-auto bg-gray-100 flex flex-col">
          <AnimatePresence mode="wait">
            {!selectedDept ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-1 flex flex-col items-center justify-center p-12 text-center"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4">
                  <Users size={24} className="text-slate-200" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Select a Department</h3>
                <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
                  Choose a department from the sidebar to view and process staff payroll.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="table"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 overflow-auto"
              >
                <table className="w-full text-left border-collapse table-fixed">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-800 text-[11px] font-bold bg-white sticky top-0 z-10">
                      <th className="px-4 py-2 w-10 border-r border-slate-100"><input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary/20" /></th>
                      <th className="px-4 py-2 border-r border-slate-100 uppercase tracking-wider">Employee</th>
                      <th className="px-4 py-2 border-r border-slate-100 uppercase tracking-wider">Designation</th>
                      <th className="px-4 py-2 border-r border-slate-100 uppercase tracking-wider text-right">Gross (RWF)</th>
                      <th className="px-4 py-2 uppercase tracking-wider text-right">Net (RWF)</th>
                    </tr>
                  </thead>
                  <tbody className="text-[11px]">
                    {payrollData.map((staff, index) => (
                      <tr 
                        key={staff.id} 
                        className={`border-b border-slate-200 cursor-pointer transition-colors hover:bg-primary/5 ${
                          index % 2 !== 0 ? 'bg-slate-200' : 'bg-white'
                        }`}
                      >
                        <td className="px-4 py-1.5 w-10"><input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary/20" /></td>
                        <td className="px-4 py-1.5 border-r border-slate-100">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shadow-sm border border-primary/20">
                              {staff.name.charAt(0)}
                            </div>
                            <span className="font-medium text-slate-700">{staff.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-1.5 border-r border-slate-100 font-medium text-slate-600">
                          {staff.role} ({staff.grade})
                        </td>
                        <td className="px-4 py-1.5 border-r border-slate-100 font-bold text-slate-800 text-right">{staff.gross}</td>
                        <td className="px-4 py-1.5 font-black text-primary text-right">{staff.net}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
