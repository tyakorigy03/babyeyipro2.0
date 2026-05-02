import React, { useState } from 'react';
import { UserCircle, UserIcon, ChevronLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export function Layout({ children, userName = "[current user name]", navItems = [], isHome = true, title = "" }) {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();

  return (
    <div className={`w-full flex flex-col h-screen overflow-hidden ${isHome ? 'bg-striped-blue' : 'bg-white'}`}>

      {/* Header */}
      <header className={`relative flex items-center justify-between  ${isHome ?'px-10 py-4':'px-6 py-1'}  transition-all duration-300 ${isHome ? 'bg-transparent text-primary' : 'bg-primary text-white shadow-lg'}`}>

        {/* Left Section */}
        <div className="flex items-center gap-6">
          
          {/* Logo & Title */}
          {!isHome ? (
            <Link 
              to="/" 
              className="flex items-center gap-3 no-underline group cursor-pointer"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="w-7 h-7 flex items-center justify-center relative">
                <AnimatePresence mode="wait">
                  {isHovered ? (
                    <motion.div
                      key="chevron"
                      initial={{ opacity: 0, x: 5, scale: 0.8 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 5, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                    >
                      <ChevronLeft className="w-6 h-6 text-white" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="logo"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.15 }}
                    >
                      <img src="/logo_white.png" className="w-7 h-auto" alt="Logo" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {title && (
                <div className="border-l border-white/30 pl-3 ml-1 overflow-hidden h-7 flex items-center">
                  <AnimatePresence mode="wait">
                    {isHovered ? (
                      <motion.span
                        key="back"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.15 }}
                        className="font-bold text-lg uppercase tracking-tight text-white/90"
                      >
                        Back
                      </motion.span>
                    ) : (
                      <motion.span
                        key="title"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.15 }}
                        className="font-bold text-lg uppercase tracking-tight"
                      >
                        {title}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <img src="/logo.png" className="w-10 h-auto" alt="Logo" />
            </div>
          )}

          {/* Nav */}
          <nav>
            {navItems.length > 0 ? (
              <div className="flex items-center gap-4">
                {navItems.map((item, index) => {
                  // If path is exactly /setup, it should only be active if the current location is /setup
                  const isActive = item.path === '/setup' 
                    ? location.pathname === '/setup' 
                    : (location.pathname === item.path);
                  
                  return (
                    <Link
                      key={index}
                      to={item.path}
                      className={`text-sm transition-all duration-200 no-underline font-medium ${
                        isActive 
                          ? 'text-accent font-bold' 
                          : (isHome ? 'text-primary/60 hover:text-primary' : 'text-white/60 hover:text-white')
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            ) : (
              <span className={`text-sm ${isHome ? 'text-primary' : 'text-white'}`}>
                 Babyeyi System
              </span>
            )}
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <Link 
            to="/setup" 
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isHome ? 'bg-primary/5 text-primary hover:bg-primary/10' : 'bg-white/10 text-white hover:bg-white/20'}`}
            title="System Setup"
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z" />
              <path d="m11 11-7.5 7.5" />
              <path d="m20 20-2.5-2.5" />
              <path d="M10 6.5 6.5 10" />
            </svg>
          </Link>

          {userName && (
            <>
              <span className={`font-semibold ${isHome ? 'text-primary/80' : 'text-white'}`}>
                {userName}
              </span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isHome ? 'bg-primary' : 'bg-white/10 hover:bg-white/20'}`}>
                <UserIcon className="w-4 h-4 text-white" strokeWidth={1.5} />
              </div>
            </>
          )}
        </div>

        {!isHome && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent/30 shadow-[0_1px_10px_rgba(245,158,11,0.3)]"></div>}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>

    </div>
  );
}
