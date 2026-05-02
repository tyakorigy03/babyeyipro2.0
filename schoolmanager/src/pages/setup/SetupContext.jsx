import React, { createContext, useContext, useState } from 'react';

const SetupContext = createContext();

export const INITIAL_ROUTINE_TEMPLATES = [
  {
    id: 'r1',
    name: 'Standard Academic Day',
    slots: [
      { time: '06:30', activity: 'Wake Up & Morning Prep', target: 'Boarding Only' },
      { time: '07:30', activity: 'Breakfast Session', target: 'All Students' },
      { time: '08:00', activity: 'Morning Assembly', target: 'All Students' },
      { time: '08:30', activity: 'First Learning Block', target: 'Academic' }
    ]
  },
  {
    id: 'r2',
    name: 'Friday Early Dismissal',
    slots: [
      { time: '07:30', activity: 'Breakfast', target: 'All' },
      { time: '12:00', activity: 'Lunch & Cleanup', target: 'All' },
      { time: '13:30', activity: 'Student Departure', target: 'Day Only' }
    ]
  }
];

export function SetupProvider({ children }) {
  const [routineTemplates, setRoutineTemplates] = useState(INITIAL_ROUTINE_TEMPLATES);

  const addRoutine = (name) => {
    const newRoutine = {
      id: `r${Date.now()}`,
      name,
      slots: []
    };
    setRoutineTemplates([...routineTemplates, newRoutine]);
  };

  const updateRoutine = (id, updatedRoutine) => {
    setRoutineTemplates(routineTemplates.map(r => r.id === id ? updatedRoutine : r));
  };

  const deleteRoutine = (id) => {
    setRoutineTemplates(routineTemplates.filter(r => r.id !== id));
  };

  return (
    <SetupContext.Provider value={{ 
      routineTemplates, 
      setRoutineTemplates,
      addRoutine,
      updateRoutine,
      deleteRoutine
    }}>
      {children}
    </SetupContext.Provider>
  );
}

export function useSetup() {
  const context = useContext(SetupContext);
  if (!context) {
    throw new Error('useSetup must be used within a SetupProvider');
  }
  return context;
}
