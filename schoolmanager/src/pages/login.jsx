import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 1500);
  };

  return (
    <div className="h-screen overflow-y-auto flex flex-col justify-between">
      {/* Main Content Area - Form Container instead of Apps */}
      <div className="py-20 pb-0 flex justify-center flex-grow items-center px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm backdrop-blur-md bg-white/30 py-20 px-10"
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-accent rounded-lg py-2  text-xs shadow-xl shadow-primary/10 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3"
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
    </div>
  );
}
