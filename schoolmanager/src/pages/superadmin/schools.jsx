import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  School, Plus, Search, Filter, ChevronRight, MoreVertical,
  Users, MapPin, CheckCircle2, AlertCircle, Clock, ArrowUpRight,
  Building2, Calendar, Globe
} from 'lucide-react';
import { SuperAdminLayout } from './SuperAdminLayout';

const schools = [
  { id: 1, name: 'Wisdom International School', domain: 'wisdom.babyeyi.com', region: 'Kigali', plan: 'Enterprise', students: 1240, staff: 85, status: 'Active', onboarded: '2024-09-01', admin: 'Dr. Patrick M.' },
  { id: 2, name: 'Kigali Academy', domain: 'kac.babyeyi.com', region: 'Kigali', plan: 'Professional', students: 480, staff: 42, status: 'Active', onboarded: '2024-11-15', admin: 'Jeanne A.' },
  { id: 3, name: 'Sunrise Nursery & Primary', domain: 'sunrise.babyeyi.com', region: 'Musanze', plan: 'Starter', students: 310, staff: 28, status: 'Pending Setup', onboarded: '2025-01-10', admin: 'Eric K.' },
  { id: 4, name: 'Horizon High School', domain: 'horizon.babyeyi.com', region: 'Huye', plan: 'Enterprise', students: 1875, staff: 120, status: 'Active', onboarded: '2023-03-20', admin: 'Prof. Grace N.' },
  { id: 5, name: 'Bright Future Academy', domain: 'bfa.babyeyi.com', region: 'Rubavu', plan: 'Professional', students: 620, staff: 55, status: 'Active', onboarded: '2024-06-01', admin: 'Samuel B.' },
  { id: 6, name: 'Agahozo-Shalom School', domain: 'agash.babyeyi.com', region: 'Kayonza', plan: 'Enterprise', students: 520, staff: 60, status: 'Suspended', onboarded: '2024-02-14', admin: 'Anne N.' },
];

const planColors = {
  Enterprise: 'bg-primary/10 text-primary border-primary/20',
  Professional: 'bg-blue-50 text-blue-700 border-blue-200',
  Starter: 'bg-gray-100 text-gray-600 border-gray-200',
};

const statusConfig = {
  Active: { class: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  'Pending Setup': { class: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400 animate-pulse' },
  Suspended: { class: 'bg-red-50 text-red-600 border-red-200', dot: 'bg-red-500' },
};

function SchoolCard({ school }) {
  const status = statusConfig[school.status] || statusConfig['Active'];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/10 transition-all p-5 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary/5 flex items-center justify-center">
            <Building2 size={18} className="text-primary" />
          </div>
          <div>
            <p className="font-black text-gray-800 text-sm leading-tight">{school.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{school.domain}</p>
          </div>
        </div>
        <button className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-gray-600 hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100">
          <MoreVertical size={14} />
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${planColors[school.plan]}`}>{school.plan}</span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${status.class}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
          {school.status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-gray-50 rounded-xl p-2 text-center">
          <p className="font-black text-primary text-sm">{school.students.toLocaleString()}</p>
          <p className="text-[9px] text-gray-400 uppercase tracking-wide">Students</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-2 text-center">
          <p className="font-black text-primary text-sm">{school.staff}</p>
          <p className="text-[9px] text-gray-400 uppercase tracking-wide">Staff</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-2 text-center">
          <p className="font-black text-primary text-sm">{school.region}</p>
          <p className="text-[9px] text-gray-400 uppercase tracking-wide">Region</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Calendar size={10} />
          <span>Since {new Date(school.onboarded).toLocaleDateString('en', { month: 'short', year: 'numeric' })}</span>
        </div>
        <Link
          to={`/superadmin/schools/${school.id}`}
          className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/70 no-underline transition-colors"
        >
          Manage <ArrowUpRight size={11} />
        </Link>
      </div>
    </motion.div>
  );
}

export default function SchoolsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = schools.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.region.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <SuperAdminLayout
      title="Schools"
      subtitle={`${schools.length} institutions on the platform`}
    >
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/5"
            placeholder="Search by school name or region..."
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Active', 'Pending Setup', 'Suspended'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`text-xs font-semibold px-3 py-2 rounded-xl border transition-all ${
                statusFilter === status
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-primary/30'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <Link
          to="/superadmin/schools/onboard"
          className="flex items-center gap-2 bg-accent text-primary font-bold text-sm px-4 py-2.5 rounded-xl no-underline hover:bg-amber-400 transition-colors flex-shrink-0"
        >
          <Plus size={15} />
          Onboard School
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(school => <SchoolCard key={school.id} school={school} />)}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-16 text-gray-400">
            <School size={32} className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No schools found</p>
          </div>
        )}
      </div>
    </SuperAdminLayout>
  );
}
