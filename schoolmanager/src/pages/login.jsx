import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { success } = await login({
      identifier: formData.username,
      password: formData.password,
    });

    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="h-screen overflow-y-auto flex flex-col justify-between">
      {/* Main Content Area - Form Container instead of Apps */}
      <div className="py-2  pb-0 flex justify-center flex-grow items-center px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full backdrop-blur-md max-w-sm shadow-sm bg-white/10 py-20 px-10"
        >
          {/* Login Form content starts directly with inputs now */}

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-12">
              {/* Username Input - Styles from student_create */}
              <div className="relative group">
                <label className="absolute -top-5 left-0 text-sm  text-primary/90  transition-colors group-focus-within:text-primary/90">
                   Email
                </label>
                <div className="flex items-center gap-3 border-b border-primary/50 group-focus-within:border-primary/90 transition-colors">
                  <User size={16} className=" text-primary/50 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    required
                    className="flex-1 bg-transparent py-2 text-sm  focus:outline-none "
                    placeholder="Enter your email here ......"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
              </div>

              {/* Password Input - Styles from student_create */}
              <div className="relative group">
                <div className="flex items-center justify-between absolute -top-5 left-0 right-0">
                   <label className="text-sm  text-primary/90 tracking-wider transition-colors group-focus-within:text-primary/90">
                     Password
                   </label>
                   <Link to="#" className="text-xs text-primary/90 hover:underline transition-all">Forgot?</Link>
                </div>
                <div className="flex items-center gap-3 border-b border-primary/50 group-focus-within:border-primary/90 transition-colors">
                  <Lock size={16} className=" text-primary/50 group-focus-within:text-primary transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="flex-1 bg-transparent py-2 text-sm  focus:outline-none "
                    placeholder="Enter password here ....."
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-primary/50 hover:text-primary/90 transition-colors pr-1"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
               <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" className="peer appearance-none w-4 h-4 rounded border border-primary/20 checked:bg-primary checked:border-primary transition-all" />
                    <div className="absolute opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none">
                       <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3L3 5L7 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </div>
                  <span className="text-xs  text-primary/50  group-hover:text-primary transition-colors ">Keep me signed in</span>
               </label>
            </div>

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-accent rounded-lg py-2  text-xs shadow-xl shadow-primary/10 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Enter Dashboard <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>

      <footer className="w-full pt-2 pb-16 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-primary/20"></div>
            <div className="flex items-center gap-2">
              <span className="text-primary/40 text-[10px] uppercase tracking-[0.2em] font-bold">Managed by</span>
              <span className="text-primary font-black tracking-tighter text-lg flex items-center">
                EDU<span className="text-accent">POTO</span>
              </span>
            </div>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-primary/20"></div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-primary/60 text-[11px] font-medium tracking-wide uppercase">
              Elevating Education through Technology
            </p>
            <div className="flex items-center gap-2 mt-4">
              <span className="w-1 h-1 rounded-full bg-accent/40"></span>
              <p className="text-primary/30 text-[9px] font-medium tracking-widest uppercase">
                © {new Date().getFullYear()} Edupoto Global. All rights reserved.
              </p>
              <span className="w-1 h-1 rounded-full bg-accent/40"></span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
