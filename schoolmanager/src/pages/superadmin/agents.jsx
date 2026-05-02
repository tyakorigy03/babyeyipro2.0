import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Plus, Search, Users, Zap, MoreVertical,
  CheckCircle2, Clock, Building2, ArrowUpRight, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SuperAdminLayout } from './SuperAdminLayout';

const stations = [
  { id: 1, name: 'Kigali Central Hub', address: 'KN 2 Ave, Kigali', region: 'Kigali', agents: 5, transactions: 842, status: 'Active', gps: '-1.9441, 30.0619' },
  { id: 2, name: 'Musanze Station', address: 'Musanze Town Center', region: 'Northern', agents: 2, transactions: 312, status: 'Active', gps: '-1.5009, 29.6348' },
  { id: 3, name: 'Huye Station', address: 'Huye District Office Area', region: 'Southern', agents: 3, transactions: 225, status: 'Active', gps: '-2.5969, 29.7348' },
  { id: 4, name: 'Rubavu Station', address: 'Near Lake Kivu', region: 'Western', agents: 2, transactions: 178, status: 'Active', gps: '-1.6793, 29.2602' },
  { id: 5, name: 'Kayonza Station', address: 'Kayonza Town', region: 'Eastern', agents: 1, transactions: 98, status: 'Inactive', gps: '-1.9021, 30.6453' },
];

const agents = [
  { id: 1, name: 'Jean Pierre Mugiraneza', station: 'Kigali Central Hub', wallet: 125000, commission: 45200, transactions: 284, status: 'Active' },
  { id: 2, name: 'Claudine Uwimana', station: 'Kigali Central Hub', wallet: 87000, commission: 32100, transactions: 198, status: 'Active' },
  { id: 3, name: 'Eric Niyomugabo', station: 'Musanze Station', wallet: 43000, commission: 18400, transactions: 156, status: 'Active' },
  { id: 4, name: 'Marie Goretti', station: 'Huye Station', wallet: 65000, commission: 22800, transactions: 112, status: 'Active' },
  { id: 5, name: 'Samuel Bizimana', station: 'Rubavu Station', wallet: 12000, commission: 8200, transactions: 64, status: 'Active' },
  { id: 6, name: 'Anne Nkurunziza', station: 'Kayonza Station', wallet: 5000, commission: 2100, transactions: 18, status: 'Suspended' },
];

function AgentRow({ agent }) {
  const initials = agent.name.split(' ').map(n => n[0]).join('').slice(0, 2);
  const statusColor = agent.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200';

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-black text-xs">{initials}</span>
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-800">{agent.name}</p>
            <p className="text-xs text-gray-400">{agent.station}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusColor}`}>{agent.status}</span>
      </td>
      <td className="py-3 px-4 text-sm font-bold text-primary">{agent.wallet.toLocaleString()} RWF</td>
      <td className="py-3 px-4 text-sm text-gray-600">{agent.commission.toLocaleString()} RWF</td>
      <td className="py-3 px-4 text-sm text-gray-600">{agent.transactions}</td>
      <td className="py-3 px-4">
        <button className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-all">
          <MoreVertical size={14} />
        </button>
      </td>
    </motion.tr>
  );
}

function StationCard({ station }) {
  const isActive = station.status === 'Active';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
            <MapPin size={16} className="text-violet-600" />
          </div>
          <div>
            <p className="font-black text-gray-800 text-sm">{station.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{station.address}</p>
          </div>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
          isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></span>
          {station.status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-gray-50 rounded-xl p-2.5 text-center">
          <p className="font-black text-primary text-base">{station.agents}</p>
          <p className="text-[9px] text-gray-400 uppercase tracking-wide">Agents</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-2.5 text-center">
          <p className="font-black text-primary text-base">{station.transactions}</p>
          <p className="text-[9px] text-gray-400 uppercase tracking-wide">Txns</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-2.5 text-center">
          <p className="font-black text-primary text-xs">{station.region}</p>
          <p className="text-[9px] text-gray-400 uppercase tracking-wide">Region</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function AgentsPage() {
  const [tab, setTab] = useState('agents');
  const [search, setSearch] = useState('');

  const filteredAgents = agents.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.station.toLowerCase().includes(search.toLowerCase()));

  return (
    <SuperAdminLayout
      title="Agents & Stations"
      subtitle="Manage the ground operations network"
    >
      {/* Summary Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Active Agents', value: agents.filter(a => a.status === 'Active').length, icon: Users, color: 'bg-amber-50 text-amber-600' },
          { label: 'Agent Stations', value: stations.length, icon: MapPin, color: 'bg-violet-50 text-violet-600' },
          { label: 'Total Commissions', value: `${agents.reduce((s, a) => s + a.commission, 0).toLocaleString()} RWF`, icon: Zap, color: 'bg-emerald-50 text-emerald-600' },
        ].map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                <Icon size={16} />
              </div>
              <div>
                <p className="font-black text-primary text-lg leading-none">{card.value}</p>
                <p className="text-gray-400 text-xs mt-0.5">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl mb-4 w-fit">
        {[
          { key: 'agents', label: 'Agents' },
          { key: 'stations', label: 'Stations' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
              tab === t.key ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'agents' && (
        <>
          <div className="flex justify-between mb-4 gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl pl-8 pr-3 py-2 text-sm outline-none focus:border-primary/30"
                placeholder="Search agents..."
              />
            </div>
            <Link
              to="/superadmin/agents/register"
              className="flex items-center gap-2 bg-accent text-primary font-bold text-sm px-4 py-2 rounded-xl no-underline hover:bg-amber-400 transition-colors"
            >
              <Plus size={14} /> Register Agent
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  {['Agent', 'Status', 'Wallet Balance', 'Commissions Earned', 'Transactions', ''].map(h => (
                    <th key={h} className="text-left text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredAgents.map(agent => <AgentRow key={agent.id} agent={agent} />)}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'stations' && (
        <>
          <div className="flex justify-end mb-4">
            <Link
              to="/superadmin/stations/new"
              className="flex items-center gap-2 bg-accent text-primary font-bold text-sm px-4 py-2 rounded-xl no-underline hover:bg-amber-400 transition-colors"
            >
              <Plus size={14} /> New Station
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {stations.map(s => <StationCard key={s.id} station={s} />)}
          </div>
        </>
      )}
    </SuperAdminLayout>
  );
}
