import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Search,
  Settings,
  List,
  Grid,
  Layout as LayoutIcon,
  Calendar,
  BarChart2,
  Users,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const employees = [
  { id: 1, name: 'Dr. John Kalisa', phone: '(+250) 788-123-456', dept: 'Administration', job: 'Headmaster (HM)', manager: '' },
  { id: 2, name: 'Mrs. Sarah Uwase', phone: '(+250) 788-234-567', dept: 'Administration', job: 'Director of Studies (DOS)', manager: 'John Kalisa' },
  { id: 3, name: 'Mr. James Wilson', phone: '(+250) 788-345-678', dept: 'Academic', job: 'HOD Science', manager: 'Sarah Uwase' },
  { id: 4, name: 'Ms. Maria Garcia', phone: '(+250) 788-456-789', dept: 'Academic', job: 'Mathematics Teacher', manager: 'James Wilson' },
  { id: 5, name: 'Robert Brown', phone: '(+250) 788-567-890', dept: 'Discipline', job: 'Discipline Master', manager: 'John Kalisa' },
  { id: 6, name: 'Alice Mukana', phone: '(+250) 788-678-901', dept: 'Administration', job: 'Secretary', manager: 'John Kalisa' },
  { id: 7, name: 'Chef Tom Habimana', phone: '(+250) 788-789-012', dept: 'Support Staff', job: 'Head of Kitchen', manager: 'Alice Mukana' },
];

const departments = [
  { name: 'All', count: '' },
  { name: 'Administration', count: 3 },
  { name: 'Academic', count: 2 },
  { name: 'Discipline', count: 1 },
  { name: 'Support Staff', count: 1 },
];

export default function Staff() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div id='staff-div' className="flex flex-col h-full bg-white border border-slate-200 overflow-hidden text-sm text-slate-700">
      
      {/* Action Bar */}
      <div className="flex items-center justify-between px-5 py-2 border-b border-slate-200 bg-white relative">
        
        <div className="flex items-center gap-3">
          <Link to="/staff/new" className="bg-primary hover:bg-primary/90 text-white px-4 py-1.5 rounded-md text-sm font-semibold tracking-wide shadow-sm transition no-underline">
            New
          </Link>

          <div className="flex items-center gap-2 relative">
            <h1 className="text-base font-semibold text-slate-800">Staffs</h1>
            <div className="relative">
              <Settings 
                className={`w-4 h-4 cursor-pointer transition-colors ${showSettings ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`} 
                onClick={() => setShowSettings(!showSettings)}
              />
              
              <AnimatePresence>
                {showSettings && (
                  <>
                    <div 
                      className="fixed inset-0 z-20" 
                      onClick={() => setShowSettings(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-30 overflow-hidden"
                      style={{ top: '100%' }}
                    >
                      <button className="w-full px-4 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-primary flex items-center gap-2 transition-colors">
                        <Users size={14} className="text-slate-400" />
                        Import Staff
                      </button>
                      <div className="my-1 border-t border-slate-100" />
                      <button className="w-full px-4 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-primary flex items-center gap-2 transition-colors">
                        <BarChart2 size={14} className="text-slate-400" />
                        Export to Excel
                      </button>
                      <button className="w-full px-4 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-primary flex items-center gap-2 transition-colors">
                        <BarChart2 size={14} className="text-slate-400" />
                        Export to PDF
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5">

          {/* Search */}
          <div className="flex items-center border border-slate-300 rounded-md overflow-hidden focus-within:border-primary/60">
            <div className="flex items-center px-3 py-1.5">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input
                type="text"
                placeholder="Search..."
                className="w-52 text-sm bg-transparent focus:outline-none placeholder:text-slate-400"
              />
            </div>
            <div className="px-2 py-2 border-l border-slate-300 bg-slate-50 hover:bg-slate-100 cursor-pointer">
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <span className="font-medium">1-4 / 4</span>
            <button className="p-1 hover:bg-slate-100 rounded disabled:opacity-30" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-slate-100 rounded disabled:opacity-30" disabled>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* View Switch */}
          <div className="flex items-center border border-slate-300 rounded-md overflow-hidden bg-white shadow-sm">
            <button className="p-2 hover:bg-slate-50 text-slate-400">
              <Grid className="w-4 h-4" />
            </button>
            <button className="p-2 bg-slate-50 text-primary border-x border-slate-300">
              <List className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-slate-50 text-slate-400">
              <LayoutIcon className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-slate-50 text-slate-400 border-x border-slate-300">
              <Calendar className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-slate-50 text-slate-400">
              <BarChart2 className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

       <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 border-r border-slate-100 p-3 bg-white">
          <h2 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Users className="w-3 h-3 text-primary" /> DEPARTMENT
          </h2>
          <nav className="space-y-0.5">
            {departments.map((dept) => (
              <div 
                key={dept.name}
                className={`flex items-center justify-between px-2 py-1 rounded cursor-pointer text-xs transition-all ${dept.name === 'All' ? 'bg-primary/5 text-primary font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <span>{dept.name}</span>
                <span className={`text-[10px] font-medium ${dept.name === 'All' ? 'text-primary' : 'text-slate-400'}`}>{dept.count}</span>
              </div>
            ))}
          </nav>
        </aside>

        {/* Table */}
        <div className="flex-1 overflow-auto bg-gray-100">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="border-b border-slate-200 text-slate-800 text-[11px] font-bold bg-white">
                <th className="px-4 py-2 w-10 border-r border-slate-100"><input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary/20" /></th>
                <th className="px-4 py-2 border-r border-slate-100 uppercase tracking-wider">Name</th>
                <th className="px-4 py-2 border-r border-slate-100 uppercase tracking-wider">Work Phone</th>
                <th className="px-4 py-2 border-r border-slate-100 uppercase tracking-wider">Department</th>
                <th className="px-4 py-2 uppercase tracking-wider">Job</th>
              </tr>
            </thead>
            <tbody className="text-[11px]">
              {employees.map((emp, index) => (
                <tr key={emp.id} className={`border-b border-slate-200 cursor-pointer transition-colors hover:bg-primary/5 ${index % 2 !== 0 ? 'bg-slate-200' : ''}`}>
                  <td className="px-4 py-1.5 w-10"><input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary/20" /></td>
                  <td className="px-4 py-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary overflow-hidden shadow-sm border border-primary/20">
                        {emp.name.charAt(0)}
                      </div>
                      <span className="font-medium text-slate-700">{emp.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-1.5 text-slate-600 font-medium">{emp.phone}</td>
                  <td className="px-4 py-1.5 text-slate-600">{emp.dept}</td>
                  <td className="px-4 py-1.5 text-slate-600 font-medium">{emp.job}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}