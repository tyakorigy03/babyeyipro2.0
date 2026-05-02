import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, School, Users, MapPin, BarChart3, Settings,
  ChevronLeft, LogOut, Bell, Search, ChevronRight, Menu, X
} from 'lucide-react';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/superadmin' },
      { icon: BarChart3, label: 'Analytics', path: '/superadmin/analytics' },
    ],
  },
  {
    label: 'Platform',
    items: [
      { icon: School, label: 'Schools', path: '/superadmin/schools' },
      { icon: MapPin, label: 'Agent Stations', path: '/superadmin/stations' },
      { icon: Users, label: 'Agents', path: '/superadmin/agents' },
    ],
  },
  {
    label: 'Administration',
    items: [
      { icon: Settings, label: 'Platform Settings', path: '/superadmin/settings' },
    ],
  },
];

export function SuperAdminLayout({ children, title, subtitle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 64 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="bg-primary text-white flex flex-col flex-shrink-0 overflow-hidden"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10 h-16">
          <img src="/logo_white.png" alt="Logo" className="w-7 h-auto flex-shrink-0" />
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col overflow-hidden"
              >
                <span className="font-black text-sm tracking-tight leading-none">BabyeyiPro</span>
                <span className="text-accent text-[10px] font-bold tracking-widest uppercase">SuperAdmin</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-4">
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-white/30 text-[9px] uppercase tracking-widest font-bold px-4 mb-2"
                  >
                    {group.label}
                  </motion.p>
                )}
              </AnimatePresence>
              {group.items.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    title={!sidebarOpen ? item.label : undefined}
                    className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg mb-0.5 transition-all no-underline
                      ${isActive
                        ? 'bg-accent text-primary font-bold shadow-lg shadow-accent/30'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                      }`}
                  >
                    <Icon size={16} className="flex-shrink-0" />
                    <AnimatePresence>
                      {sidebarOpen && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-sm whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/10 p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-black text-xs">SA</span>
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-semibold truncate">Super Admin</p>
                <p className="text-white/40 text-[10px] truncate">admin@babyeyi.com</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="border-t border-white/10 py-3 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
        >
          <motion.div animate={{ rotate: sidebarOpen ? 0 : 180 }}>
            <ChevronLeft size={16} />
          </motion.div>
        </button>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-6 flex-shrink-0">
          <div>
            <h1 className="font-black text-primary text-lg leading-none">{title}</h1>
            {subtitle && <p className="text-gray-400 text-xs mt-0.5">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/5 w-48"
                placeholder="Search..."
              />
            </div>
            <button className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 relative">
              <Bell size={14} />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-accent rounded-full text-[8px] text-primary font-bold flex items-center justify-center">3</span>
            </button>
            <Link
              to="/"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors no-underline bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5"
            >
              <LogOut size={13} />
              <span className="hidden sm:block">Exit</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
