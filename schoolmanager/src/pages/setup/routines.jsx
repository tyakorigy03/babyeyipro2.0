import React, { useState } from 'react';
import { 
  Clock, Plus, Edit, Trash2, Calendar, 
  Users, CheckCircle, AlertCircle, ArrowLeft,
  ChevronDown, ChevronRight, Save, Settings
} from 'lucide-react';
import { ModalShell, ModalBackdrop, FieldRow, TextInput, BtnGhost, BtnPrimary } from './shared';

import { useSetup } from './SetupContext';

export function RoutineLibrary() {
  const { routineTemplates, addRoutine, deleteRoutine, updateRoutine } = useSetup();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState('');
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-end mb-2">
        <button 
          onClick={() => setShowAddModal(true)} 
          className="bg-primary text-white px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2"
        >
          <Plus size={16} /> Add New Routine Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routineTemplates.map((routine) => (
          <div key={routine.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm leading-tight">{routine.name}</h3>
                  <span className="text-xs text-slate-400 font-medium">{routine.slots.length} Activities</span>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-slate-400 hover:text-primary bg-slate-50 rounded-lg"><Edit size={14} /></button>
                <button 
                  onClick={() => deleteRoutine(routine.id)}
                  className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 rounded-lg"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="space-y-4 relative before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
              {routine.slots.map((slot, idx) => (
                <div key={idx} className="flex gap-4 items-start relative">
                  <div className="w-5 h-5 rounded-full bg-white border-2 border-slate-200 z-10 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-400">{slot.time}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wide ${slot.target?.includes('Boarding') ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                        {slot.target}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-700 mt-0.5">{slot.activity}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-8 py-3 border-2 border-dashed border-slate-100 rounded-xl text-xs font-bold text-slate-300 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all uppercase tracking-wider">
              Add New Time Slot
            </button>
          </div>
        ))}

        {/* Add Card */}
        <div 
          onClick={() => setShowAddModal(true)}
          className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5 cursor-pointer transition-all min-h-[300px]"
        >
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-primary/10">
            <Plus size={32} />
          </div>
          <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Add New Routine Template</span>
        </div>
      </div>

      {/* Add Routine Modal */}
      {showAddModal && (
        <ModalBackdrop onClose={() => setShowAddModal(false)}>
          <ModalShell 
            title="Add New Routine Template"
            subtitle="School Routines · Configuration"
            onClose={() => setShowAddModal(false)}
            footer={
              <>
                <BtnGhost onClick={() => setShowAddModal(false)}>Cancel</BtnGhost>
                <BtnPrimary 
                  onClick={() => {
                    if (newRoutineName.trim()) {
                      addRoutine(newRoutineName);
                      setNewRoutineName('');
                      setShowAddModal(false);
                    }
                  }}
                >
                  Create Template
                </BtnPrimary>
              </>
            }
          >
            <div className="space-y-4">
              <FieldRow label="Template Name" required>
                <TextInput 
                  value={newRoutineName}
                  onChange={(e) => setNewRoutineName(e.target.value)}
                  placeholder="e.g. Standard Academic Day" 
                  autoFocus
                />
              </FieldRow>
            </div>
          </ModalShell>
        </ModalBackdrop>
      )}
    </div>
  );
}
