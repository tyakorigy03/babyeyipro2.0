import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  School, Users, MapPin, TrendingUp, TrendingDown, Activity,
  AlertCircle, CheckCircle2, Clock, ChevronRight, Plus,
  Globe, ArrowUpRight, Zap
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { SuperAdminLayout } from './SuperAdminLayout';

// ── Mock Data ──────────────────────────────────────────────
const revenueData = [
  { month: 'Jan', fees: 124000, agents: 8200, kits: 4300 },
  { month: 'Feb', fees: 138000, agents: 9100, kits: 5100 },
  { month: 'Mar', fees: 152000, agents: 10400, kits: 6800 },
  { month: 'Apr', fees: 147000, agents: 11200, kits: 7200 },
  { month: 'May', fees: 165000, agents: 13500, kits: 8900 },
];

const recentSchools = [
  { name: 'Wisdom International School', plan: 'Enterprise', students: 1240, status: 'Active', since: '2024-09' },
  { name: 'Kigali Academy', plan: 'Professional', students: 480, status: 'Active', since: '2024-11' },
  { name: 'Sunrise Nursery & Primary', plan: 'Starter', students: 310, status: 'Pending Setup', since: '2025-01' },
  { name: 'Horizon High School', plan: 'Enterprise', students: 1875, status: 'Active', since: '2023-03' },
];

const recentAgentActivity = [
  { agent: 'Jean Pierre M.', type: 'Proxy Payment', amount: 45000, school: 'Wisdom School', time: '2 min ago' },
  { agent: 'Claudine U.', type: 'ShuleKit Delivery', amount: 12500, school: 'Kigali Academy', time: '18 min ago' },
  { agent: 'Eric N.', type: 'Card Replacement', amount: 5000, school: 'Horizon HS', time: '45 min ago' },
  { agent: 'Marie G.', type: 'Proxy Payment', amount: 32000, school: 'Sunrise School', time: '1 hr ago' },
];

// ── Sub-components ──────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, change, changeType, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="flex items-start justify-between">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={18} />
      </div>
      <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
        changeType === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
      }`}>
        {changeType === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
        {change}
      </span>
    </div>
    <div className="mt-4">
      <p className="text-2xl font-black text-primary">{value}</p>
      <p className="text-gray-400 text-xs mt-1 font-medium">{label}</p>
    </div>
  </motion.div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    'Active': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Pending Setup': 'bg-amber-50 text-amber-700 border-amber-200',
    'Suspended': 'bg-red-50 text-red-700 border-red-200',
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${styles[status] || styles['Active']}`}>
      {status}
    </span>
  );
};

// ── Main Dashboard ──────────────────────────────────────────
export default function SuperAdminDashboard() {
  return (
    <SuperAdminLayout
      title="Platform Dashboard"
      subtitle="BabyeyiPro 2.0 — Global Operations Overview"
    >
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={School}
          label="Active Schools"
          value="47"
          change="+3 this month"
          changeType="up"
          color="bg-primary/10 text-primary"
        />
        <StatCard
          icon={Users}
          label="Total Students"
          value="28,412"
          change="+8.2%"
          changeType="up"
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={MapPin}
          label="Agent Stations"
          value="23"
          change="+2 new"
          changeType="up"
          color="bg-violet-50 text-violet-600"
        />
        <StatCard
          icon={Activity}
          label="Monthly Revenue"
          value="$165K"
          change="+12.1%"
          changeType="up"
          color="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-black text-primary text-sm">Platform Revenue Streams</h3>
              <p className="text-gray-400 text-xs">Fees, Agent Commissions & ShuleKits</p>
            </div>
            <span className="text-xs text-gray-400 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full">Last 5 months</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="fees" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#000435" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#000435" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="agents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: '1px solid #f0f0f0', fontSize: 12 }}
                formatter={(v) => [`$${v.toLocaleString()}`, undefined]}
              />
              <Area type="monotone" dataKey="fees" stroke="#000435" strokeWidth={2} fill="url(#fees)" name="Fees" />
              <Area type="monotone" dataKey="agents" stroke="#f59e0b" strokeWidth={2} fill="url(#agents)" name="Agents" />
              <Area type="monotone" dataKey="kits" stroke="#8b5cf6" strokeWidth={2} fill="none" strokeDasharray="4 2" name="ShuleKits" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-black text-primary text-sm mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: 'Onboard New School', icon: Plus, path: '/superadmin/schools/onboard', color: 'bg-primary text-white' },
              { label: 'Register Agent', icon: Users, path: '/superadmin/agents/register', color: 'bg-amber-500 text-white' },
              { label: 'Create Agent Station', icon: MapPin, path: '/superadmin/stations/new', color: 'bg-violet-600 text-white' },
              { label: 'Platform Analytics', icon: Globe, path: '/superadmin/analytics', color: 'bg-blue-600 text-white' },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  to={action.path}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-primary/20 hover:bg-gray-50 transition-all no-underline group"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${action.color}`}>
                    <Icon size={14} />
                  </div>
                  <span className="text-sm text-gray-700 font-medium flex-1">{action.label}</span>
                  <ChevronRight size={14} className="text-gray-300 group-hover:text-primary transition-colors" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Schools Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-50">
            <div>
              <h3 className="font-black text-primary text-sm">Schools</h3>
              <p className="text-gray-400 text-xs">47 total on platform</p>
            </div>
            <Link to="/superadmin/schools" className="flex items-center gap-1 text-xs text-primary/60 hover:text-primary no-underline font-semibold transition-colors">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentSchools.map((school) => (
              <div key={school.name} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0">
                  <School size={14} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{school.name}</p>
                  <p className="text-xs text-gray-400">{school.students.toLocaleString()} students · {school.plan}</p>
                </div>
                <StatusBadge status={school.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Agent Activity Feed */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-50">
            <div>
              <h3 className="font-black text-primary text-sm">Live Agent Activity</h3>
              <p className="text-gray-400 text-xs">Real-time operations feed</p>
            </div>
            <span className="flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-600 font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {recentAgentActivity.map((activity, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3">
                <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <Zap size={13} className="text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{activity.agent}</p>
                  <p className="text-xs text-gray-400 truncate">{activity.type} · {activity.school}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-primary">{activity.amount.toLocaleString()} RWF</p>
                  <p className="text-[10px] text-gray-300">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
