import React from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  ChevronDown, 
  Loader2
} from 'lucide-react';

export const PRIMARY = 'primary';
export const ACCENT = 'accent';

export function ModalBackdrop({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {children}
    </div>
  );
}

export function ModalShell({ title, subtitle,padding=true, width = 'max-w-md', onClose, children, footer }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      className={`relative bg-white rounded-xl shadow-2xl w-full ${width} max-h-[90vh] flex flex-col overflow-hidden`}
    >
      <div className="flex items-start justify-between px-7 pt-6 pb-4 border-b border-slate-100">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">{subtitle}</p>
          <h2 className="text-base font-bold text-slate-800">{title}</h2>
        </div>
        <button onClick={onClose} className="text-slate-300 hover:text-slate-500 transition-colors mt-0.5 ml-4">
          <X size={18} />
        </button>
      </div>
      <div className= {`flex-1 overflow-y-auto ${padding && 'px-7 py-6'}`}>{children}</div>
      {footer && (
        <div className="px-7 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
          {footer}
        </div>
      )}
    </motion.div>
  );
}

export function FieldRow({ label, required, children }) {
  return (
    <div className="grid grid-cols-3 items-center gap-4">
      <label className="text-sm font-semibold text-slate-700">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <div className="col-span-2">{children}</div>
    </div>
  );
}

export function TextInput({ ...props }) {
  return (
    <input {...props} className="w-full text-sm bg-transparent border-b border-slate-200 py-1.5 focus:outline-none focus:border-primary transition-colors" />
  );
}

export function SelectInput({ children, ...props }) {
  return (
    <div className="relative">
      <select {...props} className="w-full text-sm bg-transparent border-b border-slate-200 py-1.5 focus:outline-none focus:border-primary appearance-none cursor-pointer transition-colors">
        {children}
      </select>
      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}

export function BtnPrimary({ children, onClick, disabled, loading, color = PRIMARY }) {
  return (
    <button onClick={onClick} disabled={disabled || loading}
      className="hover:opacity-90 bg-primary  disabled:opacity-50 text-white px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-wide shadow-md transition-all flex items-center gap-2"
      style={{ background: color }}>
      {loading && <Loader2 size={13} className="animate-spin" />}
      {children}
    </button>
  );
}

export function BtnGhost({ children, onClick }) {
  return (
    <button onClick={onClick} className="text-slate-500 hover:text-slate-700 px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-wide border border-slate-200 hover:border-slate-300 transition-all">
      {children}
    </button>
  );
}

export function BtnDanger({ children, onClick, disabled, loading }) {
  return (
    <button onClick={onClick} disabled={disabled || loading}
      className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-wide shadow-md transition-all flex items-center gap-2">
      {loading && <Loader2 size={13} className="animate-spin" />}
      {children}
    </button>
  );
}

export function BtnSuccess({ children, onClick, disabled, loading }) {
  return (
    <button onClick={onClick} disabled={disabled || loading}
      className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-wide shadow-md transition-all flex items-center gap-2">
      {loading && <Loader2 size={13} className="animate-spin" />}
      {children}
    </button>
  );
}

export function SetupHeader({ title, onNew, newLabel }) {
  return (
    <div className="flex items-center justify-between px-5 py-2 border-b border-slate-200 bg-white">
      <div className="flex items-center gap-3">
        {onNew && (
          <button 
            onClick={onNew}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-1.5 rounded-md text-sm font-semibold tracking-wide shadow-sm transition"
          >
            New {newLabel}
          </button>
        )}
        <h1 className="text-base font-semibold text-slate-800 uppercase tracking-tight">{title}</h1>
      </div>
    </div>
  );
}
