import React, { useState, useEffect, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  ArrowRight,
  ChevronLeft, 
  Save, 
  ArrowLeft,
  Search,
  Settings,
  Users,
  BarChart2,
  List,
  Layout as LayoutIcon,
  MapPin,
  Link as LinkIcon,
  School,
  Briefcase,
  Layers,
  CalendarIcon,
  Grid,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { 
  ModalShell, 
  ModalBackdrop, 
  FieldRow, 
  TextInput, 
  SelectInput, 
  BtnGhost, 
  BtnPrimary,
  BtnDanger
} from './shared';

const RoutineTemplatesLibrary = () => {
  const navigate = useNavigate();

  const [routines, setRoutines] = useState([
    {
      id: 'rt_001',
      name: 'Standard School Day',
      description: 'Regular academic day with morning assembly, periods, and afternoon activities',
      type: 'academic',
      applicableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      isActive: true,
      timeSlots: [
        {
          id: 'slot_001',
          startTime: '07:30',
          endTime: '08:00',
          duration: 30,
          activities: [
            {
              id: 'act_001',
              name: 'Morning Assembly',
              targetGroups: ['all_students', 'staff'],
              location: 'School Ground',
              isAttendancePoint: true,
              attendanceMethod: 'mass',
              responsibleRole: 'principal',
              description: 'Flag raising, announcements, prayers'
            }
          ]
        },
        {
          id: 'slot_002',
          startTime: '08:00',
          endTime: '08:40',
          duration: 40,
          activities: [
            {
              id: 'act_002',
              name: 'Period 1',
              targetGroups: ['all_students'],
              location: 'Assigned Classrooms',
              isAttendancePoint: true,
              attendanceMethod: 'per_class',
              responsibleRole: 'subject_teacher',
              isMultiInstance: true
            }
          ]
        },
        {
          id: 'slot_003',
          startTime: '08:40',
          endTime: '09:20',
          duration: 40,
          activities: [
            {
              id: 'act_003',
              name: 'Period 2',
              targetGroups: ['all_students'],
              location: 'Assigned Classrooms',
              isAttendancePoint: false,
              attendanceMethod: 'per_class',
              responsibleRole: 'subject_teacher',
              isMultiInstance: true
            }
          ]
        },
        {
          id: 'slot_004',
          startTime: '09:20',
          endTime: '09:40',
          duration: 20,
          activities: [
            {
              id: 'act_004',
              name: 'Morning Break',
              targetGroups: ['all_students'],
              location: 'Canteen / Field',
              isAttendancePoint: false,
              responsibleRole: 'prefects',
              description: 'Snack time, restroom, free play'
            }
          ]
        },
        {
          id: 'slot_005',
          startTime: '09:40',
          endTime: '10:20',
          duration: 40,
          activities: [
            {
              id: 'act_005',
              name: 'Period 3',
              targetGroups: ['all_students'],
              location: 'Assigned Classrooms',
              isAttendancePoint: true,
              attendanceMethod: 'per_class',
              responsibleRole: 'subject_teacher',
              isMultiInstance: true,
              description: 'Attendance taken after break'
            }
          ]
        },
        {
          id: 'slot_006',
          startTime: '10:20',
          endTime: '11:00',
          duration: 40,
          activities: [
            {
              id: 'act_006',
              name: 'Period 4',
              targetGroups: ['all_students'],
              location: 'Assigned Classrooms',
              isAttendancePoint: false,
              responsibleRole: 'subject_teacher',
              isMultiInstance: true
            }
          ]
        },
        {
          id: 'slot_007',
          startTime: '11:00',
          endTime: '11:40',
          duration: 40,
          activities: [
            {
              id: 'act_007',
              name: 'Period 5',
              targetGroups: ['all_students'],
              location: 'Assigned Classrooms',
              isAttendancePoint: false,
              responsibleRole: 'subject_teacher',
              isMultiInstance: true
            }
          ]
        },
        {
          id: 'slot_008',
          startTime: '11:40',
          endTime: '12:20',
          duration: 40,
          activities: [
            {
              id: 'act_008',
              name: 'Period 6',
              targetGroups: ['all_students'],
              location: 'Assigned Classrooms',
              isAttendancePoint: false,
              responsibleRole: 'subject_teacher',
              isMultiInstance: true
            }
          ]
        },
        {
          id: 'slot_009',
          startTime: '12:20',
          endTime: '13:00',
          duration: 40,
          activities: [
            {
              id: 'act_009',
              name: 'Lunch Break',
              targetGroups: ['all_students', 'staff'],
              location: 'Dining Hall',
              isAttendancePoint: false,
              responsibleRole: 'matron',
              description: 'Lunch service'
            }
          ]
        },
        {
          id: 'slot_010',
          startTime: '14:00',
          endTime: '15:30',
          duration: 90,
          activities: [
            {
              id: 'act_010',
              name: 'Afternoon Sports / Clubs',
              targetGroups: ['all_students'],
              location: 'Various',
              isAttendancePoint: true,
              responsibleRole: 'sports_master',
              description: 'Sports, clubs, extracurricular activities'
            }
          ]
        },
        {
          id: 'slot_011',
          startTime: '16:00',
          endTime: '17:00',
          duration: 60,
          activities: [
            {
              id: 'act_011a',
              name: 'Chapel / Devotion',
              targetGroups: ['boarding'],
              location: 'Chapel',
              isAttendancePoint: true,
              responsibleRole: 'chaplain',
              description: 'Evening devotion for boarding students'
            },
            {
              id: 'act_011b',
              name: 'Bus Loading & Departure',
              targetGroups: ['bus_students'],
              location: 'Bus Park',
              isAttendancePoint: true,
              responsibleRole: 'transport_officer',
              requiresSignOut: true,
              description: 'Students boarding school buses'
            },
            {
              id: 'act_011c',
              name: 'Parent Pickup',
              targetGroups: ['parent_pickup'],
              location: 'Main Gate',
              isAttendancePoint: true,
              responsibleRole: 'security',
              requiresSignOut: true,
              description: 'Parent pickup zone'
            },
            {
              id: 'act_011d',
              name: 'Staff Meeting',
              targetGroups: ['staff'],
              location: 'Staff Room',
              isAttendancePoint: true,
              responsibleRole: 'principal',
              description: 'Daily staff debrief'
            }
          ]
        },
        {
          id: 'slot_012',
          startTime: '18:00',
          endTime: '20:00',
          duration: 120,
          activities: [
            {
              id: 'act_012',
              name: 'Evening Prep / Study Hall',
              targetGroups: ['boarding'],
              location: 'Library / Classrooms',
              isAttendancePoint: true,
              responsibleRole: 'supervisor',
              description: 'Supervised evening study'
            }
          ]
        },
        {
          id: 'slot_013',
          startTime: '20:00',
          endTime: '21:00',
          duration: 60,
          activities: [
            {
              id: 'act_013',
              name: 'Dinner & Free Time',
              targetGroups: ['boarding'],
              location: 'Dining Hall',
              isAttendancePoint: false,
              responsibleRole: 'matron'
            }
          ]
        },
        {
          id: 'slot_014',
          startTime: '21:00',
          endTime: '21:30',
          duration: 30,
          activities: [
            {
              id: 'act_014',
              name: 'Bedtime Prep & Lights Out',
              targetGroups: ['boarding'],
              location: 'Dormitories',
              isAttendancePoint: true,
              responsibleRole: 'matron',
              description: 'Bedtime routine and roll call'
            }
          ]
        }
      ]
    },
    {
      id: 'rt_002',
      name: 'Half Day Schedule',
      description: 'Shortened day for exam periods or special events',
      type: 'half_day',
      applicableDays: ['saturday'],
      isActive: true,
      timeSlots: [
        {
          id: 'slot_001',
          startTime: '08:00',
          endTime: '08:30',
          duration: 30,
          activities: [
            {
              id: 'act_001',
              name: 'Brief Assembly',
              targetGroups: ['all_students'],
              location: 'School Ground',
              isAttendancePoint: true,
              responsibleRole: 'principal'
            }
          ]
        },
        {
          id: 'slot_002',
          startTime: '08:30',
          endTime: '12:00',
          duration: 210,
          activities: [
            {
              id: 'act_002',
              name: 'Sports / Clubs / Exams',
              targetGroups: ['all_students'],
              location: 'Various',
              isAttendancePoint: true,
              responsibleRole: 'activity_coordinator'
            }
          ]
        },
        {
          id: 'slot_003',
          startTime: '12:00',
          endTime: '13:00',
          duration: 60,
          activities: [
            {
              id: 'act_003a',
              name: 'Bus Loading',
              targetGroups: ['bus_students'],
              location: 'Bus Park',
              isAttendancePoint: true,
              responsibleRole: 'transport_officer'
            },
            {
              id: 'act_003b',
              name: 'Parent Pickup',
              targetGroups: ['parent_pickup'],
              location: 'Main Gate',
              isAttendancePoint: true,
              responsibleRole: 'security'
            },
            {
              id: 'act_003c',
              name: 'Lunch for Boarding',
              targetGroups: ['boarding'],
              location: 'Dining Hall',
              isAttendancePoint: false,
              responsibleRole: 'matron'
            }
          ]
        }
      ]
    },
    {
      id: 'rt_003',
      name: 'Exam Week Schedule',
      description: 'Modified schedule during examination week',
      type: 'exam',
      applicableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      isActive: true,
      timeSlots: [
        {
          id: 'slot_001',
          startTime: '08:00',
          endTime: '11:00',
          duration: 180,
          activities: [
            {
              id: 'act_001',
              name: 'Morning Examination',
              targetGroups: ['all_students'],
              location: 'Exam Halls',
              isAttendancePoint: true,
              attendanceMethod: 'per_class',
              responsibleRole: 'invigilator',
              description: 'Main exam session'
            }
          ]
        },
        {
          id: 'slot_002',
          startTime: '11:00',
          endTime: '12:00',
          duration: 60,
          activities: [
            {
              id: 'act_002',
              name: 'Break & Rest',
              targetGroups: ['all_students'],
              location: 'Various',
              isAttendancePoint: false,
              responsibleRole: 'prefects'
            }
          ]
        },
        {
          id: 'slot_003',
          startTime: '12:00',
          endTime: '13:00',
          duration: 60,
          activities: [
            {
              id: 'act_003a',
              name: 'Bus Loading',
              targetGroups: ['bus_students'],
              location: 'Bus Park',
              isAttendancePoint: true,
              responsibleRole: 'transport_officer'
            },
            {
              id: 'act_003b',
              name: 'Lunch for Boarding',
              targetGroups: ['boarding'],
              location: 'Dining Hall',
              isAttendancePoint: false,
              responsibleRole: 'matron'
            }
          ]
        },
        {
          id: 'slot_004',
          startTime: '14:00',
          endTime: '17:00',
          duration: 180,
          activities: [
            {
              id: 'act_004',
              name: 'Afternoon Revision',
              targetGroups: ['boarding'],
              location: 'Library',
              isAttendancePoint: true,
              responsibleRole: 'supervisor',
              description: 'Supervised revision for boarding students'
            }
          ]
        }
      ]
    }
  ]);

  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [showRoutineModal, setShowRoutineModal] = useState(false);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [expandedSlotId, setExpandedSlotId] = useState(null);
  const [showRoutineSettings, setShowRoutineSettings] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupSearch, setGroupSearch] = useState('');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [roleSearch, setRoleSearch] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [schoolLocations] = useState([
    { id: 'loc_001', name: 'School Ground', type: 'Outdoor', capacity: 500 },
    { id: 'loc_002', name: 'Dining Hall', type: 'Indoor', capacity: 300 },
    { id: 'loc_003', name: 'Main Assembly Hall', type: 'Indoor', capacity: 450 },
    { id: 'loc_004', name: 'Library', type: 'Quiet Zone', capacity: 60 },
    { id: 'loc_005', name: 'Science Lab', type: 'Specialized', capacity: 40 },
    { id: 'loc_006', name: 'Computer Lab', type: 'Specialized', capacity: 35 },
    { id: 'loc_007', name: 'Sports Field', type: 'Outdoor', capacity: 1000 },
    { id: 'loc_008', name: 'Chapel', type: 'Indoor', capacity: 200 },
    { id: 'loc_009', name: 'Assigned Classrooms', type: 'Multi-Room', capacity: 40 }
  ]);
  const [viewMode, setViewMode] = useState('timeline'); // timeline, matrix, groups
  
  // Student groups configuration
  const [studentGroups] = useState([
    { id: 'all_students', name: 'All Students', color: 'blue', type: 'global' },
    { id: 'boarding', name: 'Boarding Students', color: 'purple', type: 'residence' },
    { id: 'day', name: 'Day Students', color: 'green', type: 'residence' },
    { id: 'bus_students', name: 'Bus Students', color: 'orange', type: 'transport' },
    { id: 'parent_pickup', name: 'Parent Pickup', color: 'amber', type: 'transport' },
    { id: 'staff', name: 'Staff', color: 'slate', type: 'role' },
    { id: 'sports_team', name: 'Sports Team', color: 'emerald', type: 'extracurricular' },
    { id: 'club_members', name: 'Club Members', color: 'teal', type: 'extracurricular' }
  ]);

  const [responsibleRoles] = useState([
    { id: 'principal', name: 'Principal', default: true },
    { id: 'class_teacher', name: 'Class Teacher', default: true },
    { id: 'subject_teacher', name: 'Subject Teacher', default: true },
    { id: 'sports_master', name: 'Sports Master', default: true },
    { id: 'chaplain', name: 'Chaplain', default: false },
    { id: 'matron', name: 'Matron', default: false },
    { id: 'supervisor', name: 'Supervisor', default: false },
    { id: 'transport_officer', name: 'Transport Officer', default: false },
    { id: 'security', name: 'Security', default: false },
    { id: 'prefects', name: 'Prefects', default: false },
    { id: 'invigilator', name: 'Invigilator', default: false },
    { id: 'activity_coordinator', name: 'Activity Coordinator', default: false }
  ]);

  // Helper functions
  const getGroupColor = (groupId) => {
    const group = studentGroups.find(g => g.id === groupId);
    return group?.color || 'gray';
  };

  const getActivityTypeIcon = (activityName) => {
    if (activityName.includes('Assembly')) return '🎪';
    if (activityName.includes('Period')) return '📚';
    if (activityName.includes('Break') || activityName.includes('Lunch') || activityName.includes('Dinner')) return '🍽️';
    if (activityName.includes('Sports')) return '⚽';
    if (activityName.includes('Chapel')) return '🙏';
    if (activityName.includes('Bus') || activityName.includes('Pickup')) return '🚌';
    if (activityName.includes('Prep') || activityName.includes('Study')) return '📖';
    return '📋';
  };

  // Create new routine
  const createRoutine = () => {
    const newRoutine = {
      id: `rt_${Date.now()}`,
      name: 'New Routine Template',
      description: '',
      type: 'academic',
      applicableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      isActive: true,
      timeSlots: []
    };
    setRoutines([...routines, newRoutine]);
    setSelectedRoutine(newRoutine);
    setShowRoutineModal(true);
  };

  // Add time slot
  const addTimeSlot = () => {
    if (!selectedRoutine) return;
    const newSlot = {
      id: `slot_${Date.now()}`,
      startTime: '08:00',
      endTime: '08:40',
      duration: 40,
      activities: []
    };
    const updatedRoutine = {
      ...selectedRoutine,
      timeSlots: [...selectedRoutine.timeSlots, newSlot]
    };
    setSelectedRoutine(updatedRoutine);
    setRoutines(routines.map(r => r.id === selectedRoutine.id ? updatedRoutine : r));
    setSelectedSlot(newSlot);
    setShowSlotModal(true);
  };

  // Add parallel activity to slot (Improved Workflow)
  const addActivity = () => {
    if (!selectedSlot) return;
    const newActivity = {
      id: `temp_act_${Date.now()}`,
      name: '',
      targetGroups: ['all_students'],
      location: '',
      isAttendancePoint: false,
      attendanceMethod: 'mass',
      responsibleRole: 'class_teacher',
      description: ''
    };
    // We don't update the slot yet! Just set the activity for the modal
    setSelectedActivity(newActivity);
    setShowActivityModal(true);
  };

  const updateSlotInRoutine = (updatedSlot) => {
    const updatedRoutine = {
      ...selectedRoutine,
      timeSlots: selectedRoutine.timeSlots.map(s => s.id === updatedSlot.id ? updatedSlot : s)
    };
    setSelectedRoutine(updatedRoutine);
    setRoutines(routines.map(r => r.id === selectedRoutine.id ? updatedRoutine : r));
  };

  const updateActivityInSlot = (slotId, updatedActivity) => {
    const slot = selectedRoutine.timeSlots.find(s => s.id === slotId);
    if (slot) {
      const updatedSlot = {
        ...slot,
        activities: slot.activities.map(a => a.id === updatedActivity.id ? updatedActivity : a)
      };
      updateSlotInRoutine(updatedSlot);
    }
  };

  const deleteActivity = (slotId, activityId) => {
    const slot = selectedRoutine.timeSlots.find(s => s.id === slotId);
    if (slot) {
      const updatedSlot = {
        ...slot,
        activities: slot.activities.filter(a => a.id !== activityId)
      };
      updateSlotInRoutine(updatedSlot);
    }
  };

  const deleteTimeSlot = (slotId) => {
    const updatedRoutine = {
      ...selectedRoutine,
      timeSlots: selectedRoutine.timeSlots.filter(s => s.id !== slotId)
    };
    setSelectedRoutine(updatedRoutine);
    setRoutines(routines.map(r => r.id === selectedRoutine.id ? updatedRoutine : r));
  };

  // Timeline View (Table with Collapsible Rows)
  const renderTimelineView = () => (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="border-b border-slate-200 text-slate-800 text-[11px] font-bold bg-white sticky top-0 z-10">
              <th className="px-4 py-2 w-32 border-r border-slate-100 uppercase tracking-wider">Time </th>
              <th className="px-4 py-2 border-r border-slate-100 uppercase tracking-wider">Activities </th>
              <th className="px-4 py-2 border-r border-slate-100 uppercase tracking-wider text-center w-24">Dur.</th>
              <th className="px-4 py-2 uppercase tracking-wider text-right w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="text-[11px]">
            {selectedRoutine.timeSlots.map((slot, index) => {
              const isExpanded = expandedSlotId === slot.id;
              return (
                <Fragment key={slot.id}>
                  <tr 
                    onClick={() => setExpandedSlotId(isExpanded ? null : slot.id)}
                    className={`border-b border-slate-200 cursor-pointer transition-colors ${isExpanded ? 'bg-primary/5 border-l-2 border-l-primary' : index % 2 !== 0 ? 'bg-slate-50/50 hover:bg-primary/5' : 'bg-white hover:bg-primary/5'}`}
                  >
                    <td className="px-4 py-2 border-r border-slate-100/50">
                      <div className="flex items-center gap-2">
                        <Clock size={12} className="text-primary" />
                        <span className="font-mono font-bold text-slate-700">{slot.startTime} - {slot.endTime}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 border-r border-slate-100/50">
                      <div className="flex flex-wrap gap-1">
                        {slot.activities.length > 0 ? (
                          slot.activities.map(a => (
                            <span key={a.id} className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-md font-bold flex items-center gap-1 border border-slate-200/50">
                              {getActivityTypeIcon(a.name)} {a.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-amber-500 italic font-medium">No activities assigned</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-center text-slate-500 border-r border-slate-100/50 font-mono font-bold">{slot.duration}m</td>
                    <td className="px-4 py-2 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={(e) => { e.stopPropagation(); setSelectedSlot(slot); setShowSlotModal(true); }} className="p-1 text-slate-400 hover:text-primary transition-all"><Edit size={13} /></button>
                        <button onClick={(e) => { e.stopPropagation(); deleteTimeSlot(slot.id); }} className="p-1 text-slate-400 hover:text-red-600 transition-all"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>

                  {/* Sub-table for Parallel Activities */}
                  {isExpanded && (
                    <tr className="bg-slate-50/30">
                      <td colSpan={4} className="px-8 py-6 bg-primary/3 border-b border-slate-200 shadow-inner">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <LayoutIcon size={14} className="text-primary" />
                            </div>
                            <div>
                              <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Parallel Activities</h4>
                            </div>
                          </div>
                          <button 
                            onClick={() => { setSelectedSlot(slot); addActivity(); }}
                            className="bg-primary text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
                          >
                            <Plus size={12} /> Add Activity
                          </button>
                        </div>

                        {slot.activities.length > 0 ? (
                          <div className="bg-white  border border-slate-200 overflow-hidden shadow-sm">
                            <table className="w-full text-left border-collapse table-fixed">
                              <thead>
                                <tr className="border-b border-slate-200 text-slate-800 text-[10px] font-bold bg-slate-50/50">
                                  <th className="px-4 py-2 border-r border-slate-100 uppercase tracking-wider">Activity Name</th>
                                  <th className="px-4 py-2 border-r border-slate-100 uppercase tracking-wider w-32">Location</th>
                                  <th className="px-4 py-2 border-r border-slate-100 uppercase tracking-wider">Target Groups</th>
                                  <th className="px-4 py-2 border-r border-slate-100 uppercase tracking-wider w-40">Responsible</th>
                                  <th className="px-4 py-2 uppercase tracking-wider text-right w-24">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="text-[10px]">
                                {slot.activities.map((activity, aIndex) => (
                                  <tr 
                                    key={activity.id} 
                                    className={`border-b border-slate-100 cursor-pointer transition-colors hover:bg-primary/5 ${aIndex % 2 !== 0 ? 'bg-slate-50/30' : 'bg-white'}`}
                                    onClick={() => { setSelectedActivity(activity); setSelectedSlot(slot); setShowActivityModal(true); }}
                                  >
                                    <td className="px-4 py-2 border-r border-slate-100/50">
                                      <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-xs border border-primary/20">
                                          {getActivityTypeIcon(activity.name)}
                                        </div>
                                        <div>
                                          <span className="font-bold text-slate-700">{activity.name}</span>
                                          {activity.isAttendancePoint && (
                                            <span className="ml-2 text-[8px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded-full font-black border border-red-100 uppercase tracking-tighter">Attendance</span>
                                          )}
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-4 py-2 text-slate-500 font-medium border-r border-slate-100/50">{activity.location || '—'}</td>
                                    <td className="px-4 py-2 border-r border-slate-100/50">
                                      <div className="flex flex-wrap gap-1">
                                        {activity.targetGroups.map(groupId => (
                                          <span key={groupId} className={`text-[8px] px-1.5 py-0.5 rounded bg-${getGroupColor(groupId)}-50 text-${getGroupColor(groupId)}-700 border border-${getGroupColor(groupId)}-100 font-bold`}>
                                            {studentGroups.find(g => g.id === groupId)?.name}
                                          </span>
                                        ))}
                                      </div>
                                    </td>
                                    <td className="px-4 py-2 border-r border-slate-100/50">
                                      <div className="flex items-center gap-2 text-slate-600 font-bold">
                                        <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                          <Users size={10} />
                                        </div>
                                        {responsibleRoles.find(r => r.id === activity.responsibleRole)?.name}
                                      </div>
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                      <div className="flex justify-end gap-1">
                                        <button onClick={(e) => { e.stopPropagation(); setSelectedActivity(activity); setSelectedSlot(slot); setShowActivityModal(true); }} className="p-1 text-slate-400 hover:text-primary transition-all"><Edit size={13} /></button>
                                        <button onClick={(e) => { e.stopPropagation(); deleteActivity(slot.id, activity.id); }} className="p-1 text-slate-300 hover:text-red-600 transition-all"><Trash2 size={13} /></button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="bg-white/50 rounded-xl border-2 border-dashed border-slate-200 py-10 flex flex-col items-center justify-center shadow-inner">
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                              <LayoutIcon size={20} className="text-slate-300" />
                            </div>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">No activities scheduled</p>
                            <p className="text-[10px] text-slate-300 mt-1">Click 'Add Activity' to populate this time window</p>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Slot footer */}
      <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/30 shrink-0">
        <button
          onClick={addTimeSlot}
          className="flex items-center gap-2 text-[11px] font-black text-primary hover:underline uppercase tracking-widest"
        >
          <div className="w-6 h-6 rounded-lg bg-primary text-white flex items-center justify-center shadow-md shadow-primary/20">
            <Plus size={14} />
          </div>
          Add New Time Slot
        </button>
      </div>
    </div>
  );

  // Group Matrix View - Shows which groups do what at each time
  const renderMatrixView = () => {
    const allGroups = studentGroups.filter(g => g.type !== 'global');
    const timeSlots = selectedRoutine?.timeSlots || [];
    
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-[11px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-3 py-2 text-slate-600 font-bold w-32">Time</th>
              {allGroups.map(group => (
                <th key={group.id} className="px-2 py-2 text-center text-slate-600 font-bold">
                  {group.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(slot => (
              <tr key={slot.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                <td className="px-3 py-2 font-mono text-slate-700">
                  {slot.startTime} - {slot.endTime}
                </td>
                {allGroups.map(group => {
                  const activity = slot.activities.find(a => a.targetGroups.includes(group.id));
                  return (
                    <td key={group.id} className="px-2 py-2 text-center">
                      {activity ? (
                        <div className="text-[10px]">
                          <div className="font-bold text-slate-700">{activity.name}</div>
                          <div className="text-slate-400">{activity.location}</div>
                          {activity.isAttendancePoint && (
                            <span className="text-[8px] text-red-500">📋 Attendance</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Routine Selection Sidebar
  const renderRoutineSidebar = () => (
    <div className="w-64 bg-white rounded-l-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden border-r-0">
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <span className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">Routine Templates</span>
        <button 
          onClick={createRoutine}
          className="flex items-center gap-1 text-[10px] font-bold text-primary hover:bg-primary/10 px-2 py-1 rounded transition-all"
        >
          <Plus size={12} /> New
        </button>
      </div>
      <div className="flex-1 overflow-auto p-2 space-y-1">
        {routines.map(routine => (
          <button
            key={routine.id}
            onClick={() => setSelectedRoutine(routine)}
            className={`w-full text-left p-3 rounded-lg transition-all ${selectedRoutine?.id === routine.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-slate-50 text-slate-600'}`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded flex items-center justify-center ${selectedRoutine?.id === routine.id ? 'bg-white/20' : 'bg-slate-100'}`}>
                <Clock size={12} className={selectedRoutine?.id === routine.id ? 'text-white' : 'text-slate-400'} />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold">{routine.name}</div>
                <div className={`text-[9px] ${selectedRoutine?.id === routine.id ? 'text-white/70' : 'text-slate-400'}`}>
                  {routine.timeSlots.length} time slots
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // Main Render
  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] overflow-auto">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between px-6 py-2 bg-white border-b border-slate-200 sticky top-0 z-20 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h2 className="text-base font-bold text-slate-800 -mt-1">School Routine Templates</h2>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="h-6 w-[1px] bg-slate-200" />
          <button 
            onClick={() => navigate('/')}
            className="bg-primary hover:bg-primary/90 text-white px-5 py-1.5 rounded font-bold text-xs uppercase tracking-wider shadow-md shadow-primary/20 transition-all flex items-center gap-2"
          >
            <Save size={14} /> Save & Exit
          </button>
        </div>
      </div>

      <div className="p-8 max-w-[1600px] mx-auto w-full pt-4 flex-1 flex flex-col min-h-0">
        <div className="flex gap-0 flex-1 animate-in fade-in duration-500 min-h-0">
          {renderRoutineSidebar()}
          
          <div className="flex-1 flex flex-col overflow-hidden rounded-r-lg border border-slate-200 shadow-sm bg-white">
            {selectedRoutine ? (
          <>
            {/* Routine Header */}
            <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">{selectedRoutine.name}</h3>

                  <span className={`text-[9px] px-2 py-0.5 rounded-full ${selectedRoutine.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {selectedRoutine.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <div className="relative">
                  <button 
                    onClick={() => setShowRoutineSettings(!showRoutineSettings)}
                    className={`p-1.5 rounded-lg transition-all ${showRoutineSettings ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-primary hover:bg-primary/10'}`}
                  >
                    <Settings size={14} className={showRoutineSettings ? 'animate-spin-slow' : ''} />
                  </button>

                  <AnimatePresence>
                    {showRoutineSettings && (
                      <>
                        <motion.div 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-30" 
                          onClick={() => setShowRoutineSettings(false)} 
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-40 overflow-hidden"
                        >
                          <div className="px-4 py-2 border-b border-slate-50 mb-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Routine Actions</p>
                          </div>
                          <button className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-primary/5 hover:text-primary transition-all">
                            <Plus size={14} /> Import Routines
                          </button>
                          <button className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-primary/5 hover:text-primary transition-all">
                            <BarChart2 size={14} /> Export to Excel
                          </button>
                          <button className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-primary/5 hover:text-primary transition-all">
                            <Save size={14} /> Export to PDF
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">{selectedRoutine.description || 'No description'}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                  <button 
                    onClick={() => setViewMode('timeline')}
                    className={`px-3 py-1 text-[10px] font-bold transition-colors ${viewMode === 'timeline' ? 'bg-primary text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                  >
                    Timeline
                  </button>
                  <button 
                    onClick={() => setViewMode('matrix')}
                    className={`px-3 py-1 text-[10px] font-bold transition-colors ${viewMode === 'matrix' ? 'bg-primary text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                  >
                    Group Matrix
                  </button>
                </div>
                

                <button 
                  onClick={() => setShowRoutineModal(true)}
                  className="p-1.5 text-slate-400 hover:text-primary transition-colors"
                >
                  <Edit size={14} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              {viewMode === 'timeline' ? renderTimelineView() : renderMatrixView()}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
            <Clock size={48} className="mb-4 opacity-10" />
            <p className="text-sm font-bold text-slate-400">Select a routine template to view or edit</p>
            <button 
              onClick={createRoutine}
              className="mt-3 text-xs text-primary font-bold hover:underline"
            >
              Or create a new routine
            </button>
          </div>
        )}
      </div>

      {/* Routine Modal */}
      {showRoutineModal && selectedRoutine && (
        <ModalBackdrop onClose={() => setShowRoutineModal(false)}>
          <ModalShell 
            title="Edit Routine Template"
            subtitle="Configure basic information"
            onClose={() => setShowRoutineModal(false)}
            footer={
              <div className="flex justify-between w-full">
                <BtnDanger onClick={() => {
                  setRoutines(routines.filter(r => r.id !== selectedRoutine.id));
                  setSelectedRoutine(null);
                  setShowRoutineModal(false);
                }}>Delete Routine</BtnDanger>
                <div className="flex gap-3">
                  <BtnGhost onClick={() => setShowRoutineModal(false)}>Cancel</BtnGhost>
                  <BtnPrimary onClick={() => setShowRoutineModal(false)}>Save</BtnPrimary>
                </div>
              </div>
            }
          >
            <div className="space-y-5">
              <FieldRow label="Routine Name" required>
                <TextInput 
                  value={selectedRoutine.name}
                  onChange={(e) => setSelectedRoutine({...selectedRoutine, name: e.target.value})}
                  placeholder="e.g., Standard School Day"
                />
              </FieldRow>
              <FieldRow label="Description">
                <textarea 
                  rows={2}
                  value={selectedRoutine.description}
                  onChange={(e) => setSelectedRoutine({...selectedRoutine, description: e.target.value})}
                  className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-primary"
                  placeholder="Describe when this routine is used..."
                />
              </FieldRow>
              <FieldRow label="Routine Type">
                <SelectInput 
                  value={selectedRoutine.type}
                  onChange={(e) => setSelectedRoutine({...selectedRoutine, type: e.target.value})}
                >
                  <option value="academic">Academic Day</option>
                  <option value="half_day">Half Day</option>
                  <option value="exam">Exam Week</option>
                  <option value="orientation">Orientation</option>
                  <option value="special">Special Event</option>
                </SelectInput>
              </FieldRow>
              <FieldRow label="Applicable Days">
                <div className="flex gap-2 flex-wrap">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                    <label key={day} className="flex items-center gap-1">
                      <input 
                        type="checkbox"
                        checked={selectedRoutine.applicableDays.includes(day)}
                        onChange={(e) => {
                          const newDays = e.target.checked
                            ? [...selectedRoutine.applicableDays, day]
                            : selectedRoutine.applicableDays.filter(d => d !== day);
                          setSelectedRoutine({...selectedRoutine, applicableDays: newDays});
                        }}
                        className="rounded border-slate-300 text-primary focus:ring-primary/20"
                      />
                      <span className="text-xs capitalize">{day.slice(0, 3)}</span>
                    </label>
                  ))}
                </div>
              </FieldRow>
              <FieldRow label="Status">
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    checked={selectedRoutine.isActive}
                    onChange={(e) => setSelectedRoutine({...selectedRoutine, isActive: e.target.checked})}
                    className="rounded border-slate-300 text-primary focus:ring-primary/20"
                  />
                  <span className="text-sm">Active (available for scheduling)</span>
                </label>
              </FieldRow>
            </div>
          </ModalShell>
        </ModalBackdrop>
      )}

      {/* Time Slot Modal */}
      {showSlotModal && selectedSlot && (
        <ModalBackdrop onClose={() => setShowSlotModal(false)}>
          <ModalShell 
            title="Edit Time Slot"
            subtitle="Configure timing for this block"
            onClose={() => setShowSlotModal(false)}
            footer={
              <div className="flex justify-end w-full gap-3">
                <BtnGhost onClick={() => setShowSlotModal(false)}>Cancel</BtnGhost>
                <BtnPrimary onClick={() => setShowSlotModal(false)}>Save</BtnPrimary>
              </div>
            }
          >
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <FieldRow label="Start Time" required>
                  <TextInput 
                    type="time"
                    value={selectedSlot.startTime}
                    onChange={(e) => {
                      const newStart = e.target.value;
                      const [hours, minutes] = newStart.split(':');
                      const [endHours, endMinutes] = selectedSlot.endTime.split(':');
                      const startMinutes = parseInt(hours) * 60 + parseInt(minutes);
                      const endMinutesTotal = parseInt(endHours) * 60 + parseInt(endMinutes);
                      const duration = endMinutesTotal - startMinutes;
                      setSelectedSlot({
                        ...selectedSlot, 
                        startTime: newStart,
                        duration: duration > 0 ? duration : 40
                      });
                    }}
                  />
                </FieldRow>
                <FieldRow label="End Time" required>
                  <TextInput 
                    type="time"
                    value={selectedSlot.endTime}
                    onChange={(e) => {
                      const newEnd = e.target.value;
                      const [startHours, startMinutes] = selectedSlot.startTime.split(':');
                      const [endHours, endMinutes] = newEnd.split(':');
                      const startMinutesTotal = parseInt(startHours) * 60 + parseInt(startMinutes);
                      const endMinutesTotal = parseInt(endHours) * 60 + parseInt(endMinutes);
                      const duration = endMinutesTotal - startMinutesTotal;
                      setSelectedSlot({
                        ...selectedSlot, 
                        endTime: newEnd,
                        duration: duration > 0 ? duration : 40
                      });
                    }}
                  />
                </FieldRow>
              </div>
              <FieldRow label="Duration">
                <div className="text-sm font-mono text-slate-600 bg-slate-50 px-3 py-2 rounded border border-slate-200">
                  {selectedSlot.duration} minutes
                </div>
              </FieldRow>
            </div>
          </ModalShell>
        </ModalBackdrop>
      )}

      {/* Activity Modal */}
      {showActivityModal && selectedActivity && selectedSlot && (
        <ModalBackdrop onClose={() => setShowActivityModal(false)}>
          <ModalShell 
            title={!selectedActivity.id.startsWith('temp_act_') ? "Edit Activity" : "Add Parallel Activity"}
            subtitle="Configure what happens during this time block"
            width="max-w-2xl"
            onClose={() => setShowActivityModal(false)}
            footer={
              <div className="flex justify-between w-full">
                {!selectedActivity.id.startsWith('temp_act_') && (
                  <BtnDanger onClick={() => {
                    deleteActivity(selectedSlot.id, selectedActivity.id);
                    setShowActivityModal(false);
                  }}>Delete Activity</BtnDanger>
                )}
                <div className="flex gap-3 ml-auto">
                  <BtnGhost onClick={() => setShowActivityModal(false)}>Cancel</BtnGhost>
                  <BtnPrimary onClick={() => {
                    if (!selectedActivity.id.startsWith('temp_act_')) {
                      // It's an existing activity
                      updateActivityInSlot(selectedSlot.id, selectedActivity);
                    } else {
                      // It's a new activity, convert temp ID to real ID
                      const finalActivity = {
                        ...selectedActivity,
                        id: selectedActivity.id.replace('temp_act_', 'act_')
                      };
                      const updatedSlot = {
                        ...selectedSlot,
                        activities: [...selectedSlot.activities, finalActivity]
                      };
                      updateSlotInRoutine(updatedSlot);
                    }
                    setShowActivityModal(false);
                  }}>Save Activity</BtnPrimary>
                </div>
              </div>
            }
          >
            <div className="space-y-5">
              <FieldRow label="Activity Name" required>
                <TextInput 
                  value={selectedActivity.name}
                  onChange={(e) => setSelectedActivity({...selectedActivity, name: e.target.value})}
                  placeholder="e.g., Morning Assembly, Physics Period, Sports"
                />
              </FieldRow>
              
              <FieldRow label="Location">
                <button 
                  onClick={() => setShowLocationModal(true)}
                  className="w-full text-left bg-transparent border-b border-slate-200 py-1.5 focus:outline-none hover:border-primary transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {selectedActivity.location ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                          <MapPin size={12} />
                        </div>
                        <span className="font-bold text-slate-700">{selectedActivity.location}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-sm">Choose location</span>
                    )}
                  </div>
                  <ArrowRight size={16} className="text-slate-300 group-hover:text-primary transition-colors ml-2 shrink-0" />
                </button>
              </FieldRow>
              
              <FieldRow label="Target Groups" required>
                <button 
                  onClick={() => setShowGroupModal(true)}
                  className="w-full text-left bg-transparent border-b border-slate-200 py-1.5 focus:outline-none hover:border-primary transition-colors flex items-center justify-between group"
                >
                  <div className="flex flex-wrap gap-1 items-center flex-1 min-w-0">
                    {selectedActivity.targetGroups?.length > 0 ? (
                      selectedActivity.targetGroups.map(groupId => {
                        const group = studentGroups.find(g => g.id === groupId);
                        return group ? (
                          <span key={groupId} className={`text-[9px] px-1.5 py-0.5 rounded bg-${getGroupColor(groupId)}-50 text-${getGroupColor(groupId)}-700 border border-${getGroupColor(groupId)}-100 font-black uppercase tracking-tighter`}>
                            {group.name}
                          </span>
                        ) : null;
                      })
                    ) : (
                      <span className="text-slate-400 text-sm">Choose target group</span>
                    )}
                  </div>
                  <ArrowRight size={16} className="text-slate-300 group-hover:text-primary transition-colors ml-2 shrink-0" />
                </button>
              </FieldRow>
              
              <FieldRow label="Attendance">
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox"
                      checked={selectedActivity.isAttendancePoint}
                      onChange={(e) => setSelectedActivity({...selectedActivity, isAttendancePoint: e.target.checked})}
                      className="rounded border-slate-300 text-primary focus:ring-primary/20"
                    />
                    <span className="text-sm">This is an attendance point</span>
                  </label>
                  {selectedActivity.isAttendancePoint && (
                    <SelectInput 
                      value={selectedActivity.attendanceMethod || 'mass'}
                      onChange={(e) => setSelectedActivity({...selectedActivity, attendanceMethod: e.target.value})}
                    >
                      <option value="mass">Mass Attendance (Whole group)</option>
                      <option value="per_class">Per Class Attendance</option>
                      <option value="per_grade">Per Grade Attendance</option>
                      <option value="individual">Individual Roll Call</option>
                    </SelectInput>
                  )}
                </div>
              </FieldRow>
              
              <FieldRow label="Responsible Person/Role">
                <button 
                  onClick={() => setShowRoleModal(true)}
                  className="w-full text-left bg-transparent border-b border-slate-200 py-1.5 focus:outline-none hover:border-primary transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {selectedActivity.responsibleRole ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                          <Users size={12} />
                        </div>
                        <span className="font-bold text-slate-700">
                          {responsibleRoles.find(r => r.id === selectedActivity.responsibleRole)?.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-sm">Choose responsible person</span>
                    )}
                  </div>
                  <ArrowRight size={16} className="text-slate-300 group-hover:text-primary transition-colors ml-2 shrink-0" />
                </button>
              </FieldRow>
              
              <FieldRow label="Description / Notes">
                <textarea 
                  rows={2}
                  value={selectedActivity.description || ''}
                  onChange={(e) => setSelectedActivity({...selectedActivity, description: e.target.value})}
                  className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-primary"
                  placeholder="Additional instructions or notes..."
                />
              </FieldRow>
            </div>
          </ModalShell>
        </ModalBackdrop>
      )}
      </div>
      </div>
      {/* Target Group Selection Modal */}
      {showGroupModal && selectedActivity && (
        <ModalBackdrop onClose={() => setShowGroupModal(false)}>
          <ModalShell
            title="Select Target Groups"
            subtitle="Choose which groups are involved in this activity"
            width="max-w-xl"
            onClose={() => setShowGroupModal(false)}
            footer={
              <div className="flex justify-between w-full items-center">
                <button className="flex items-center gap-2 text-xs font-black text-primary hover:underline uppercase tracking-widest">
                  <Plus size={14} /> Create New Group
                </button>
                <BtnPrimary onClick={() => setShowGroupModal(false)}>Done</BtnPrimary>
              </div>
            }
          >
            <div className="flex flex-col gap-4 max-h-[60vh]">
              {/* Search Header */}
              <div className="relative sticky top-0 bg-white z-10 pb-2">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search size={14} />
                </div>
                <input 
                  type="text"
                  placeholder="Search groups (e.g. Boarding, Grade 10...)"
                  value={groupSearch}
                  onChange={(e) => setGroupSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all shadow-sm"
                />
              </div>

              {/* Groups Table */}
              <div className="flex-1 overflow-auto rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
                      <th className="px-4 py-3 w-10">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 text-primary focus:ring-primary/20"
                          checked={selectedActivity.targetGroups?.length === studentGroups.length}
                          onChange={(e) => {
                            const allIds = studentGroups.map(g => g.id);
                            setSelectedActivity({
                              ...selectedActivity,
                              targetGroups: e.target.checked ? allIds : []
                            });
                          }}
                        />
                      </th>
                      <th className="px-4 py-3">Group Name</th>
                      <th className="px-4 py-3">Category</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    {studentGroups
                      .filter(g => g.name.toLowerCase().includes(groupSearch.toLowerCase()))
                      .map((group, index) => {
                        const isSelected = selectedActivity.targetGroups?.includes(group.id);
                        return (
                          <tr 
                            key={group.id}
                            onClick={() => {
                              const newGroups = isSelected
                                ? selectedActivity.targetGroups.filter(id => id !== group.id)
                                : [...(selectedActivity.targetGroups || []), group.id];
                              setSelectedActivity({...selectedActivity, targetGroups: newGroups});
                            }}
                            className={`border-b border-slate-100 cursor-pointer transition-colors hover:bg-primary/5 ${isSelected ? 'bg-primary/5' : ''} ${index % 2 !== 0 ? 'bg-slate-50/20' : 'bg-white'}`}
                          >
                            <td className="px-4 py-3 w-10">
                              <input 
                                type="checkbox" 
                                checked={isSelected}
                                onChange={() => {}} // Handled by row click
                                className="rounded border-slate-300 text-primary focus:ring-primary/20"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full bg-${getGroupColor(group.id)}-500`} />
                                <span className="font-bold text-slate-700">{group.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight bg-slate-100 px-2 py-0.5 rounded">
                                {group.type}
                              </span>
                            </td>
                          </tr>
                        );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </ModalShell>
        </ModalBackdrop>
      )}
      {/* Responsible Role Selection Modal */}
      {showRoleModal && selectedActivity && (
        <ModalBackdrop onClose={() => setShowRoleModal(false)}>
          <ModalShell
            title="Assign Responsibility"
            subtitle="Choose the person or role in charge of this activity"
            width="max-w-xl"
            onClose={() => setShowRoleModal(false)}
            footer={
              <div className="flex justify-between w-full items-center">
                <button className="flex items-center gap-2 text-xs font-black text-primary hover:underline uppercase tracking-widest">
                  <Plus size={14} /> Add New Role
                </button>
                <BtnPrimary onClick={() => setShowRoleModal(false)}>Done</BtnPrimary>
              </div>
            }
          >
            <div className="flex flex-col gap-4 max-h-[60vh]">
              {/* Search Header */}
              <div className="relative sticky top-0 bg-white z-10 pb-2">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search size={14} />
                </div>
                <input 
                  type="text"
                  placeholder="Search roles (e.g. Teacher, Principal, Matron...)"
                  value={roleSearch}
                  onChange={(e) => setRoleSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all shadow-sm"
                />
              </div>

              {/* Roles Table */}
              <div className="flex-1 overflow-auto rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
                      <th className="px-4 py-3 w-10"></th>
                      <th className="px-4 py-3">Role / Designation</th>
                      <th className="px-4 py-3">Scope</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    {responsibleRoles
                      .filter(r => r.name.toLowerCase().includes(roleSearch.toLowerCase()))
                      .map((role, index) => {
                        const isSelected = selectedActivity.responsibleRole === role.id;
                        return (
                          <tr 
                            key={role.id}
                            onClick={() => {
                              setSelectedActivity({...selectedActivity, responsibleRole: role.id});
                              setShowRoleModal(false); // Single selection, close immediately or wait for "Done"
                            }}
                            className={`border-b border-slate-100 cursor-pointer transition-colors hover:bg-primary/5 ${isSelected ? 'bg-primary/5' : ''} ${index % 2 !== 0 ? 'bg-slate-50/20' : 'bg-white'}`}
                          >
                            <td className="px-4 py-3 w-10 text-center">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-primary bg-primary' : 'border-slate-200'}`}>
                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </div>
                            </td>
                            <td className="px-4 py-3 font-bold text-slate-700">
                              {role.name}
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight bg-slate-100 px-2 py-0.5 rounded">
                                {role.default ? 'System Default' : 'Custom Role'}
                              </span>
                            </td>
                          </tr>
                        );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </ModalShell>
        </ModalBackdrop>
      )}
      {/* Location Selection Modal */}
      {showLocationModal && selectedActivity && (
        <ModalBackdrop onClose={() => setShowLocationModal(false)}>
          <ModalShell
            padding={false}
            title="Select Activity Location"
            width="max-w-xl"
            onClose={() => setShowLocationModal(false)}
            footer={
              <div className="flex justify-between w-full items-center">
                <button className="flex items-center gap-2 text-xs font-black text-primary hover:underline uppercase tracking-widest">
                  <Plus size={14} /> Add New Location
                </button>
                <BtnPrimary onClick={() => setShowLocationModal(false)}>Done</BtnPrimary>
              </div>
            }
          >
            <div className="flex flex-col max-h-[60vh]">
              {/* Search Header */}

              <div className="sticky top-0   bg-white z-10">
                 <div className="flex justify-between p-2 items-center gap-5">
          {/* Search */}
          <div className="flex items-center border border-slate-300 rounded-md overflow-hidden focus-within:border-primary/60">
            <div className="flex items-center px-3 py-1.5">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input
                type="text"
                placeholder="Search location..."
                className="w-52 text-sm bg-transparent focus:outline-none placeholder:text-slate-400"
              />
            </div>
            <div className="px-2 py-2 border-l border-slate-300 bg-slate-50 hover:bg-slate-100 cursor-pointer">
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <span>1-10 / 45</span>
            <button className="p-1 hover:bg-slate-100 rounded">
              <ChevronLeft size={16} />
            </button>
            <button className="p-1 hover:bg-slate-100 rounded">
              <ChevronRight size={16} />
            </button>
          </div>

          {/* View Switch */}
          <div className="flex items-center border border-slate-300 rounded-md overflow-hidden bg-white">
            <button className="p-2 hover:bg-slate-50 text-slate-400">
              <Grid size={16} />
            </button>
            <button className="p-2 bg-slate-50 text-primary border-x border-slate-300">
              <List size={16} />
            </button>
          </div>
        </div>
                
              </div>

              {/* Locations Table */}
              <div className="flex-1 overflow-auto  border border-slate-200">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
                      <th className="px-4 py-3 w-10"></th>
                      <th className="px-4 py-3">Location Name</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3 text-center">Cap.</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    {schoolLocations
                      .filter(l => l.name.toLowerCase().includes(locationSearch.toLowerCase()))
                      .map((loc, index) => {
                        const isSelected = selectedActivity.location === loc.name;
                        return (
                          <tr 
                            key={loc.id}
                            onClick={() => {
                              setSelectedActivity({...selectedActivity, location: loc.name});
                              setShowLocationModal(false);
                            }}
                            className={`border-b border-slate-100 cursor-pointer transition-colors hover:bg-primary/5 ${isSelected ? 'bg-primary/5' : ''} ${index % 2 !== 0 ? 'bg-slate-50/20' : 'bg-white'}`}
                          >
                            <td className="px-4 py-3 w-10 text-center">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-primary bg-primary' : 'border-slate-200'}`}>
                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </div>
                            </td>
                            <td className="px-4 py-3 font-bold text-slate-700">
                              <div className="flex items-center gap-2">
                                <MapPin size={12} className="text-slate-400" />
                                {loc.name}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight bg-slate-100 px-2 py-0.5 rounded">
                                {loc.type}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center font-mono text-slate-500">
                              {loc.capacity}
                            </td>
                          </tr>
                        );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </ModalShell>
        </ModalBackdrop>
      )}
    </div>
  );
};

export default RoutineTemplatesLibrary;
