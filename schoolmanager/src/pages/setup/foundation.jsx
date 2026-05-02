import React, { useState, useRef, useEffect, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Camera, 
  Tag, 
  Users, 
  Plus,
  ArrowRight,
  BarChart2,
  Calendar,
  Save,
  Search,
  ChevronDown,
  Layers,
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
  List,
  Grid,
  Layout as LayoutIcon,
  AlertTriangle,
  Clock,
  BookOpen,
  Briefcase,
  TrendingUp,
  Edit,
  Trash2,
  Copy,
  CalendarDays,
  School,
  MapPin,
  ChevronUp,
  FolderTree,
  FolderOpen,
  Folder,
  FileText,
  CalendarRange,
  Eye,
  Repeat,
  Ban,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Bell,
} from 'lucide-react';

import { ModalShell, ModalBackdrop, FieldRow, TextInput, BtnGhost, BtnPrimary, BtnDanger, BtnSuccess } from './shared';
import { useSetup, INITIAL_ROUTINE_TEMPLATES } from './SetupContext';

// ==================== TYPES / CONSTANTS ====================

const DAY_MODES = {
  REGULAR: { label: 'Regular Class Day', color: 'blue', icon: '📘', affectsTimetable: true, affectsAttendance: true },
  ASSESSMENT: { label: 'Assessment / CATs', color: 'amber', icon: '📝', affectsTimetable: true, affectsAttendance: true },
  EXAM_WEEK: { label: 'Exam Week', color: 'red', icon: '📖', affectsTimetable: true, affectsAttendance: false },
  RESUMPTION: { label: 'Resumption / Orientation', color: 'emerald', icon: '🎒', affectsTimetable: true, affectsAttendance: false },
  CLOSURE: { label: 'Closure / Report Cards', color: 'purple', icon: '📜', affectsTimetable: false, affectsAttendance: false },
  HOLIDAY: { label: 'Holiday / Break', color: 'slate', icon: '🌴', affectsTimetable: false, affectsAttendance: false },
  SPECIAL_EVENT: { label: 'Special Event', color: 'primary', icon: '🎉', affectsTimetable: true, affectsAttendance: false }
};

// Helper SelectInput component (add if not in shared)
const SelectInput = ({ children, value, onChange, className = '' }) => (
  <select 
    value={value} 
    onChange={onChange} 
    className={`w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-primary bg-white ${className}`}
  >
    {children}
  </select>
);

// ==================== MAIN COMPONENT ====================

export default function SetupFoundation() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Academic');
  
  // Tree expansion states
  const [expandedYears, setExpandedYears] = useState({});
  const [expandedTerms, setExpandedTerms] = useState({});
  const [expandedPhases, setExpandedPhases] = useState({});
  const { routineTemplates, setRoutineTemplates, addRoutine, updateRoutine } = useSetup();
  
  const [openRoutineDropdown, setOpenRoutineDropdown] = useState(null);
  const [showRoutineSelector, setShowRoutineSelector] = useState(false);
  const [activeDayForSelector, setActiveDayForSelector] = useState(null);
  const [showRoutineCreator, setShowRoutineCreator] = useState(false);
  
  // Modal states
  const [showYearModal, setShowYearModal] = useState(false);
  const [showTermModal, setShowTermModal] = useState(false);
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [showCombinationModal, setShowCombinationModal] = useState(false);
  const [showTVETModal, setShowTVETModal] = useState(false);
  const [showPhaseModal, setShowPhaseModal] = useState(false);
  const [showDailyBreakdownModal, setShowDailyBreakdownModal] = useState(false);
  const [showExceptionModal, setShowExceptionModal] = useState(false);
  const [showLevelSettings, setShowLevelSettings] = useState(false);
  
  // Selected items for modals
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedExceptionDate, setSelectedExceptionDate] = useState(null);

  // States moved from OperationalCalendar
  const [selectedRow, setSelectedRow] = useState(null);
  const [showPhaseDetailModal, setShowPhaseDetailModal] = useState(false);
  const [selectedPhaseForModal, setSelectedPhaseForModal] = useState(null);
  
  // Form states for modals
  const [phaseForm, setPhaseForm] = useState({
    name: '',
    mode: 'REGULAR',
    startDate: '',
    endDate: '',
    rules: {
      timetable: 'FULL',
      attendanceRequired: true,
      homeworkSubmission: true,
      feePenaltiesActive: true,
      parentNotifications: true,
      canteenHours: '8am-4pm',
      transportSchedule: 'NORMAL'
    }
  });
  
  const [dailyBreakdownForm, setDailyBreakdownForm] = useState({
    date: '',
    description: '',
    schedule: ''
  });
  
  const [exceptionForm, setExceptionForm] = useState({
    date: '',
    mode: 'HOLIDAY',
    reason: ''
  });

  // ==================== SAMPLE DATA ====================

  const [academicYears, setAcademicYears] = useState([
    { 
      id: 1, 
      name: '2024-2025', 
      status: 'Active',
      startDate: '2024-01-10',
      endDate: '2024-12-05',
      terms: [
        { 
          id: 101, 
          name: 'Term 1', 
          startDate: '2024-01-10', 
          endDate: '2024-03-28', 
          isActive: true,
          operationalCalendar: {
            phases: [
              {
                id: 1,
                name: 'Registration & Orientation Week',
                mode: 'RESUMPTION',
                startDate: '2024-01-10',
                endDate: '2024-01-14',
                rules: {
                  timetable: 'ORIENTATION',
                  attendanceRequired: false,
                  homeworkSubmission: false,
                  feePenaltiesActive: false,
                  parentNotifications: true,
                  canteenHours: '9am-2pm',
                  transportSchedule: 'REDUCED'
                },
                dailyBreakdown: [
                  { date: '2024-01-10', description: 'Staff Preparation Day', schedule: 'Staff only' },
                  { date: '2024-01-11', description: 'Parents Welcome Assembly & Registration', schedule: '9am-3pm' },
                  { date: '2024-01-12', description: 'Student Registration & Fee Payment', schedule: '8am-4pm' },
                  { date: '2024-01-13', description: 'Textbook & Timetable Distribution', schedule: '8am-4pm' },
                  { date: '2024-01-14', description: 'First Day of Classes (Half Day)', schedule: '8am-12pm' }
                ]
              },
              {
                id: 2,
                name: 'Normal Academic Weeks',
                mode: 'REGULAR',
                startDate: '2024-01-15',
                endDate: '2024-02-20',
                rules: {
                  timetable: 'FULL',
                  attendanceRequired: true,
                  homeworkSubmission: true,
                  feePenaltiesActive: true,
                  parentNotifications: true,
                  canteenHours: '8am-4pm',
                  transportSchedule: 'NORMAL'
                },
                dailyBreakdown: []
              },
              {
                id: 3,
                name: 'Mid-Term Assessments (CATs)',
                mode: 'ASSESSMENT',
                startDate: '2024-02-21',
                endDate: '2024-02-25',
                rules: {
                  timetable: 'CAT_SCHEDULE',
                  attendanceRequired: true,
                  homeworkSubmission: false,
                  feePenaltiesActive: true,
                  parentNotifications: true,
                  canteenHours: '8am-4pm',
                  transportSchedule: 'NORMAL'
                },
                dailyBreakdown: [
                  { date: '2024-02-21', description: 'Mathematics & English CATs', schedule: '8am-12pm' },
                  { date: '2024-02-22', description: 'Science & Kinyarwanda CATs', schedule: '8am-12pm' },
                  { date: '2024-02-23', description: 'SST & Entrepreneurship CATs', schedule: '8am-12pm' },
                  { date: '2024-02-24', description: 'Practical Assessments', schedule: '8am-2pm' },
                  { date: '2024-02-25', description: 'Results Review Day', schedule: 'Staff only' }
                ]
              },
              {
                id: 4,
                name: 'Post-CAT Normal Weeks',
                mode: 'REGULAR',
                startDate: '2024-02-26',
                endDate: '2024-03-17',
                rules: {
                  timetable: 'FULL',
                  attendanceRequired: true,
                  homeworkSubmission: true,
                  feePenaltiesActive: true,
                  parentNotifications: true,
                  canteenHours: '8am-4pm',
                  transportSchedule: 'NORMAL'
                },
                dailyBreakdown: []
              },
              {
                id: 5,
                name: 'End of Term Examinations',
                mode: 'EXAM_WEEK',
                startDate: '2024-03-18',
                endDate: '2024-03-24',
                rules: {
                  timetable: 'EXAM_SCHEDULE',
                  attendanceRequired: false,
                  homeworkSubmission: false,
                  feePenaltiesActive: false,
                  parentNotifications: true,
                  canteenHours: '10am-2pm',
                  transportSchedule: 'ADJUSTED'
                },
                dailyBreakdown: [
                  { date: '2024-03-18', description: 'Mathematics Paper 1 & 2', schedule: '8am-1pm' },
                  { date: '2024-03-19', description: 'English Paper 1 & 2', schedule: '8am-1pm' },
                  { date: '2024-03-20', description: 'Science Paper 1 & 2', schedule: '8am-1pm' },
                  { date: '2024-03-21', description: 'Kinyarwanda & SST Papers', schedule: '8am-1pm' },
                  { date: '2024-03-22', description: 'Practical Exams', schedule: '8am-2pm' },
                  { date: '2024-03-23', description: 'Staff Grading Day', schedule: 'Staff only' }
                ]
              },
              {
                id: 6,
                name: 'Closure & Report Card Collection',
                mode: 'CLOSURE',
                startDate: '2024-03-25',
                endDate: '2024-03-28',
                rules: {
                  timetable: 'NONE',
                  attendanceRequired: false,
                  homeworkSubmission: false,
                  feePenaltiesActive: false,
                  parentNotifications: true,
                  canteenHours: 'CLOSED',
                  transportSchedule: 'SPECIAL'
                },
                dailyBreakdown: [
                  { date: '2024-03-25', description: 'Report Card Printing & Verification', schedule: 'Staff only' },
                  { date: '2024-03-26', description: 'Report Card Collection (S4-S6)', schedule: '9am-3pm' },
                  { date: '2024-03-27', description: 'Report Card Collection (P1-S3)', schedule: '9am-3pm' },
                  { date: '2024-03-28', description: 'Parent-Teacher Conferences & Term Closure', schedule: '9am-2pm' }
                ]
              }
            ],
            exceptions: [
              { date: '2024-02-06', mode: 'HOLIDAY', reason: 'Heroes Day' },
              { date: '2024-03-08', mode: 'HOLIDAY', reason: 'International Women\'s Day' }
            ]
          }
        },
        { 
          id: 102, 
          name: 'Term 2', 
          startDate: '2024-04-08', 
          endDate: '2024-07-25', 
          isActive: false,
          operationalCalendar: {
            phases: [],
            exceptions: []
          }
        },
        { 
          id: 103, 
          name: 'Term 3', 
          startDate: '2024-09-02', 
          endDate: '2024-12-05', 
          isActive: false,
          operationalCalendar: {
            phases: [],
            exceptions: []
          }
        }
      ]
    },
    { 
      id: 2, 
      name: '2025-2026', 
      status: 'Inactive',
      startDate: '2025-01-10',
      endDate: '2025-12-05',
      terms: []
    }
  ]);

  // ── Normalized school structure state (mirrors DB schema) ──────────────
  const [levels, setLevels] = useState([
    { level_id: 1, name: 'Nursery', code: 'NUR', display_order: 1, promotion_rule: 'auto' },
    { level_id: 2, name: 'Primary', code: 'PRI', display_order: 2, promotion_rule: 'conditional' },
    { level_id: 3, name: 'O Level (S1-S3)', code: 'OLE', display_order: 3, promotion_rule: 'conditional' },
    { level_id: 4, name: 'A Level (S4-S6)', code: 'ALE', display_order: 4, promotion_rule: 'strict' },
    { level_id: 5, name: 'TVET', code: 'TVT', display_order: 5, promotion_rule: 'competency' },
  ]);

  const [grades, setGrades] = useState([
    { grade_id: 1, level_id: 1, grade_number: 1, name: 'Baby Class', code: 'NUR-BC', default_capacity: 30 },
    { grade_id: 2, level_id: 1, grade_number: 2, name: 'Middle Class', code: 'NUR-MC', default_capacity: 32 },
    { grade_id: 3, level_id: 1, grade_number: 3, name: 'Top Class', code: 'NUR-TC', default_capacity: 35 },
    { grade_id: 4, level_id: 2, grade_number: 1, name: 'P1', code: 'P1', default_capacity: 45 },
    { grade_id: 5, level_id: 2, grade_number: 2, name: 'P2', code: 'P2', default_capacity: 45 },
    { grade_id: 6, level_id: 2, grade_number: 3, name: 'P3', code: 'P3', default_capacity: 45 },
    { grade_id: 7, level_id: 2, grade_number: 4, name: 'P4', code: 'P4', default_capacity: 45 },
    { grade_id: 8, level_id: 2, grade_number: 5, name: 'P5', code: 'P5', default_capacity: 45 },
    { grade_id: 9, level_id: 2, grade_number: 6, name: 'P6', code: 'P6', default_capacity: 45 },
    { grade_id: 10, level_id: 3, grade_number: 1, name: 'S1', code: 'S1', default_capacity: 48 },
    { grade_id: 11, level_id: 3, grade_number: 2, name: 'S2', code: 'S2', default_capacity: 46 },
    { grade_id: 12, level_id: 3, grade_number: 3, name: 'S3', code: 'S3', default_capacity: 44 },
    { grade_id: 13, level_id: 4, grade_number: 1, name: 'S4', code: 'S4', default_capacity: 40 },
    { grade_id: 14, level_id: 4, grade_number: 2, name: 'S5', code: 'S5', default_capacity: 38 },
    { grade_id: 15, level_id: 4, grade_number: 3, name: 'S6', code: 'S6', default_capacity: 36 },
    { grade_id: 16, level_id: 5, grade_number: 1, name: 'Year 1', code: 'Y1', default_capacity: 35 },
    { grade_id: 17, level_id: 5, grade_number: 2, name: 'Year 2', code: 'Y2', default_capacity: 33 },
    { grade_id: 18, level_id: 5, grade_number: 3, name: 'Year 3', code: 'Y3', default_capacity: 30 },
  ]);

  const [combinations, setCombinations] = useState([
    { combination_id: 1, level_id: 4, name: 'PCM', code: 'PCM', description: 'Physics, Chemistry, Mathematics' },
    { combination_id: 2, level_id: 4, name: 'PCB', code: 'PCB', description: 'Physics, Chemistry, Biology' },
    { combination_id: 3, level_id: 4, name: 'HEG', code: 'HEG', description: 'History, Economics, Geography' },
    { combination_id: 4, level_id: 4, name: 'MPC', code: 'MPC', description: 'Mathematics, Physics, Chemistry' },
    { combination_id: 5, level_id: 5, name: 'Construction', code: 'CON', description: 'Building and Construction' },
    { combination_id: 6, level_id: 5, name: 'ICT', code: 'ICT', description: 'Information Technology' },
    { combination_id: 7, level_id: 5, name: 'Hospitality', code: 'HOS', description: 'Hotel and Tourism' },
    { combination_id: 8, level_id: 5, name: 'Mechanics', code: 'MEC', description: 'Automotive Mechanics' },
    { combination_id: 9, level_id: 5, name: 'Electricity', code: 'ELE', description: 'Electrical Installation' },
  ]);

  const [sections, setSections] = useState([
    { section_id: 1, grade_id: 1, stream: null, combination_id: null, custom_name: null, capacity: 30, teacher_id: null, academic_year: '2024-2025', is_active: true },
    { section_id: 2, grade_id: 2, stream: null, combination_id: null, custom_name: null, capacity: 32, teacher_id: null, academic_year: '2024-2025', is_active: true },
    { section_id: 3, grade_id: 3, stream: null, combination_id: null, custom_name: null, capacity: 35, teacher_id: null, academic_year: '2024-2025', is_active: true },
    { section_id: 4, grade_id: 4, stream: 'A', combination_id: null, custom_name: null, capacity: 45, teacher_id: null, academic_year: '2024-2025', is_active: true },
    { section_id: 5, grade_id: 4, stream: 'B', combination_id: null, custom_name: null, capacity: 45, teacher_id: null, academic_year: '2024-2025', is_active: true },
    { section_id: 6, grade_id: 4, stream: 'C', combination_id: null, custom_name: null, capacity: 45, teacher_id: null, academic_year: '2024-2025', is_active: true },
    { section_id: 7, grade_id: 5, stream: 'A', combination_id: null, custom_name: null, capacity: 45, teacher_id: null, academic_year: '2024-2025', is_active: true },
    { section_id: 8, grade_id: 5, stream: 'B', combination_id: null, custom_name: null, capacity: 45, teacher_id: null, academic_year: '2024-2025', is_active: true },
    { section_id: 9, grade_id: 10, stream: 'A', combination_id: null, custom_name: null, capacity: 48, teacher_id: null, academic_year: '2024-2025', is_active: true },
    { section_id: 10, grade_id: 10, stream: 'B', combination_id: null, custom_name: null, capacity: 48, teacher_id: null, academic_year: '2024-2025', is_active: true },
    { section_id: 11, grade_id: 10, stream: 'C', combination_id: null, custom_name: null, capacity: 48, teacher_id: null, academic_year: '2024-2025', is_active: true },
    { section_id: 12, grade_id: 10, stream: 'D', combination_id: null, custom_name: null, capacity: 48, teacher_id: null, academic_year: '2024-2025', is_active: true },
    { section_id: 13, grade_id: 13, stream: null, combination_id: 1, custom_name: null, capacity: 40, teacher_id: null, academic_year: '2024-2025', is_active: true },
    { section_id: 14, grade_id: 13, stream: null, combination_id: 2, custom_name: null, capacity: 40, teacher_id: null, academic_year: '2024-2025', is_active: true },
    { section_id: 15, grade_id: 13, stream: null, combination_id: 3, custom_name: null, capacity: 40, teacher_id: null, academic_year: '2024-2025', is_active: true },
    { section_id: 16, grade_id: 14, stream: null, combination_id: 1, custom_name: null, capacity: 38, teacher_id: null, academic_year: '2024-2025', is_active: true },
    { section_id: 17, grade_id: 14, stream: null, combination_id: 2, custom_name: null, capacity: 38, teacher_id: null, academic_year: '2024-2025', is_active: true },
    { section_id: 18, grade_id: 14, stream: null, combination_id: 3, custom_name: null, capacity: 38, teacher_id: null, academic_year: '2024-2025', is_active: true },
    { section_id: 19, grade_id: 15, stream: null, combination_id: 1, custom_name: null, capacity: 36, teacher_id: null, academic_year: '2024-2025', is_active: true },
    { section_id: 20, grade_id: 15, stream: null, combination_id: 2, custom_name: null, capacity: 36, teacher_id: null, academic_year: '2024-2025', is_active: true },
    { section_id: 21, grade_id: 15, stream: null, combination_id: 3, custom_name: null, capacity: 36, teacher_id: null, academic_year: '2024-2025', is_active: true },
    { section_id: 22, grade_id: 16, stream: null, combination_id: 5, custom_name: null, capacity: 35, teacher_id: null, academic_year: '2024-2025', is_active: true },
    { section_id: 23, grade_id: 16, stream: null, combination_id: 6, custom_name: null, capacity: 35, teacher_id: null, academic_year: '2024-2025', is_active: true },
    { section_id: 24, grade_id: 17, stream: null, combination_id: 5, custom_name: null, capacity: 33, teacher_id: null, academic_year: '2024-2025', is_active: true },
    { section_id: 25, grade_id: 17, stream: null, combination_id: 8, custom_name: null, capacity: 33, teacher_id: null, academic_year: '2024-2025', is_active: true },
  ]);

  const activeYear = academicYears.find(y => y.status === 'Active');
  const tabs = [
    { label: 'Academic Years & Terms', id: 'Academic', icon: CalendarDays },
    { label: 'Levels & Classes', id: 'Structure', icon: School },
  ];

  const getPhaseColor = (mode) => {
    const colors = {
      RESUMPTION: 'border-emerald-200 bg-emerald-50',
      REGULAR: 'border-blue-200 bg-blue-50',
      ASSESSMENT: 'border-amber-200 bg-amber-50',
      EXAM_WEEK: 'border-red-200 bg-red-50',
      CLOSURE: 'border-purple-200 bg-purple-50',
      HOLIDAY: 'border-slate-200 bg-slate-50',
      SPECIAL_EVENT: 'border-primary/20 bg-primary/5'
    };
    return colors[mode] || 'border-slate-200 bg-white';
  };

  const getPhaseBadgeColor = (mode) => {
    const colors = {
      RESUMPTION: 'bg-emerald-100 text-emerald-700',
      REGULAR: 'bg-blue-100 text-blue-700',
      ASSESSMENT: 'bg-amber-100 text-amber-700',
      EXAM_WEEK: 'bg-red-100 text-red-700',
      CLOSURE: 'bg-purple-100 text-purple-700',
      HOLIDAY: 'bg-slate-100 text-slate-600',
      SPECIAL_EVENT: 'bg-primary/10 text-primary'
    };
    return colors[mode] || 'bg-slate-100 text-slate-600';
  };

  const toggleYear = (yearId) => {
    setExpandedYears(prev => ({ ...prev, [yearId]: !prev[yearId] }));
  };

  const toggleTerm = (termId) => {
    setExpandedTerms(prev => ({ ...prev, [termId]: !prev[termId] }));
  };

  const togglePhase = (phaseId) => {
    setExpandedPhases(prev => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  // ==================== MODAL COMPONENTS ====================

  const YearModal = () => (
    <ModalBackdrop onClose={() => setShowYearModal(false)}>
      <ModalShell 
        title="Create Academic Year" 
        subtitle="School Calendar · Foundation" 
        onClose={() => setShowYearModal(false)}
        footer={<><BtnGhost onClick={() => setShowYearModal(false)}>Cancel</BtnGhost><BtnPrimary onClick={() => setShowYearModal(false)}>Create Year</BtnPrimary></>}
      >
        <div className="space-y-5">
          <FieldRow label="Year Name" required><TextInput placeholder="e.g. 2025-2026" /></FieldRow>
          <FieldRow label="Start Date" required><TextInput type="date" /></FieldRow>
          <FieldRow label="End Date" required><TextInput type="date" /></FieldRow>
        </div>
      </ModalShell>
    </ModalBackdrop>
  );

  const TermModal = () => (
    <ModalBackdrop onClose={() => setShowTermModal(false)}>
      <ModalShell 
        title="Add Term" 
        subtitle={`Academic Period · ${selectedYear?.name}`} 
        onClose={() => setShowTermModal(false)}
        footer={<><BtnGhost onClick={() => setShowTermModal(false)}>Cancel</BtnGhost><BtnPrimary onClick={() => setShowTermModal(false)}>Add Term</BtnPrimary></>}
      >
        <div className="space-y-5">
          <FieldRow label="Term Name" required>
            <SelectInput>
              <option>Term 1</option>
              <option>Term 2</option>
              <option>Term 3</option>
            </SelectInput>
          </FieldRow>
          <FieldRow label="Start Date" required><TextInput type="date" /></FieldRow>
          <FieldRow label="End Date" required><TextInput type="date" /></FieldRow>
        </div>
      </ModalShell>
    </ModalBackdrop>
  );

  const PhaseModal = () => (
    <ModalBackdrop onClose={() => setShowPhaseModal(false)}>
      <ModalShell 
        title={selectedPhase ? "Edit Operational Phase" : "Add Operational Phase"} 
        subtitle="Define how the school operates during this period" 
        onClose={() => setShowPhaseModal(false)}
        footer={
          <div className="flex justify-between w-full">
            {selectedPhase && <BtnDanger onClick={() => setShowPhaseModal(false)}>Delete Phase</BtnDanger>}
            <div className="flex gap-3">
              <BtnGhost onClick={() => setShowPhaseModal(false)}>Cancel</BtnGhost>
              <BtnPrimary onClick={() => setShowPhaseModal(false)}>{selectedPhase ? 'Save Changes' : 'Add Phase'}</BtnPrimary>
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          <FieldRow label="Phase Name" required>
            <TextInput 
              placeholder="e.g., Mid-Term Assessments" 
              value={phaseForm.name}
              onChange={(e) => setPhaseForm({...phaseForm, name: e.target.value})}
            />
          </FieldRow>
          
          <FieldRow label="Operational Mode" required>
            <SelectInput 
              value={phaseForm.mode}
              onChange={(e) => setPhaseForm({...phaseForm, mode: e.target.value})}
            >
              <option value="RESUMPTION">🎒 Resumption / Orientation</option>
              <option value="REGULAR">📘 Regular Class Days</option>
              <option value="ASSESSMENT">📝 Assessment / CATs Week</option>
              <option value="EXAM_WEEK">📖 Exam Week</option>
              <option value="CLOSURE">📜 Closure / Report Cards</option>
              <option value="SPECIAL_EVENT">🎉 Special Event</option>
            </SelectInput>
          </FieldRow>
          
          <div className="grid grid-cols-2 gap-4">
            <FieldRow label="Start Date" required>
              <TextInput 
                type="date" 
                value={phaseForm.startDate}
                onChange={(e) => setPhaseForm({...phaseForm, startDate: e.target.value})}
              />
            </FieldRow>
            <FieldRow label="End Date" required>
              <TextInput 
                type="date" 
                value={phaseForm.endDate}
                onChange={(e) => setPhaseForm({...phaseForm, endDate: e.target.value})}
              />
            </FieldRow>
          </div>
          
          <div className="border-t border-slate-100 pt-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Operational Rules</p>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" checked={phaseForm.rules.attendanceRequired} onChange={(e) => setPhaseForm({...phaseForm, rules: {...phaseForm.rules, attendanceRequired: e.target.checked}})} />
                Attendance Required
              </label>
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" checked={phaseForm.rules.homeworkSubmission} onChange={(e) => setPhaseForm({...phaseForm, rules: {...phaseForm.rules, homeworkSubmission: e.target.checked}})} />
                Homework Submission
              </label>
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" checked={phaseForm.rules.feePenaltiesActive} onChange={(e) => setPhaseForm({...phaseForm, rules: {...phaseForm.rules, feePenaltiesActive: e.target.checked}})} />
                Fee Penalties Active
              </label>
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" checked={phaseForm.rules.parentNotifications} onChange={(e) => setPhaseForm({...phaseForm, rules: {...phaseForm.rules, parentNotifications: e.target.checked}})} />
                Parent Notifications
              </label>
            </div>
          </div>
        </div>
      </ModalShell>
    </ModalBackdrop>
  );

  const DailyBreakdownModal = () => (
    <ModalBackdrop onClose={() => setShowDailyBreakdownModal(false)}>
      <ModalShell 
        title="Add Daily Schedule Entry" 
        subtitle={`For Phase: ${selectedPhase?.name}`} 
        onClose={() => setShowDailyBreakdownModal(false)}
        footer={<><BtnGhost onClick={() => setShowDailyBreakdownModal(false)}>Cancel</BtnGhost><BtnPrimary onClick={() => setShowDailyBreakdownModal(false)}>Add Entry</BtnPrimary></>}
      >
        <div className="space-y-5">
          <FieldRow label="Date" required>
            <TextInput 
              type="date" 
              value={dailyBreakdownForm.date}
              onChange={(e) => setDailyBreakdownForm({...dailyBreakdownForm, date: e.target.value})}
            />
          </FieldRow>
          <FieldRow label="Activity Description" required>
            <textarea 
              rows={2}
              placeholder="Describe what happens on this day..."
              className="w-full text-sm border border-slate-200 rounded-lg p-3 focus:outline-none focus:border-primary"
              value={dailyBreakdownForm.description}
              onChange={(e) => setDailyBreakdownForm({...dailyBreakdownForm, description: e.target.value})}
            />
          </FieldRow>
          <FieldRow label="Schedule / Timing">
            <TextInput 
              placeholder="e.g., 8am-3pm" 
              value={dailyBreakdownForm.schedule}
              onChange={(e) => setDailyBreakdownForm({...dailyBreakdownForm, schedule: e.target.value})}
            />
          </FieldRow>
        </div>
      </ModalShell>
    </ModalBackdrop>
  );

  const ExceptionModal = () => (
    <ModalBackdrop onClose={() => setShowExceptionModal(false)}>
      <ModalShell 
        title="Add Date Exception" 
        subtitle="Override normal schedule for a specific date" 
        onClose={() => setShowExceptionModal(false)}
        footer={<><BtnGhost onClick={() => setShowExceptionModal(false)}>Cancel</BtnGhost><BtnPrimary onClick={() => setShowExceptionModal(false)}>Add Exception</BtnPrimary></>}
      >
        <div className="space-y-5">
          <FieldRow label="Date" required>
            <TextInput 
              type="date" 
              value={exceptionForm.date}
              onChange={(e) => setExceptionForm({...exceptionForm, date: e.target.value})}
            />
          </FieldRow>
          <FieldRow label="Exception Type" required>
            <SelectInput 
              value={exceptionForm.mode}
              onChange={(e) => setExceptionForm({...exceptionForm, mode: e.target.value})}
            >
              <option value="HOLIDAY">🌴 Holiday (No School)</option>
              <option value="SPECIAL_EVENT">🎉 Special Event</option>
              <option value="CLOSURE">📜 Closure Day</option>
            </SelectInput>
          </FieldRow>
          <FieldRow label="Reason">
            <TextInput 
              placeholder="e.g., Public Holiday" 
              value={exceptionForm.reason}
              onChange={(e) => setExceptionForm({...exceptionForm, reason: e.target.value})}
            />
          </FieldRow>
        </div>
      </ModalShell>
    </ModalBackdrop>
  );

  const LevelModal = () => (
    <ModalBackdrop onClose={() => setShowLevelModal(false)}>
      <ModalShell 
        title="Add Education Level" 
        subtitle="Structural Unit · Setup" 
        onClose={() => setShowLevelModal(false)}
        footer={<><BtnGhost onClick={() => setShowLevelModal(false)}>Cancel</BtnGhost><BtnPrimary onClick={() => setShowLevelModal(false)}>Add Level</BtnPrimary></>}
      >
        <div className="space-y-5">
          <FieldRow label="Level Name" required><TextInput placeholder="e.g. TVET" /></FieldRow>
          <FieldRow label="Code" required><TextInput placeholder="e.g. TVT" /></FieldRow>
          <FieldRow label="Display Order"><TextInput type="number" placeholder="1" /></FieldRow>
        </div>
      </ModalShell>
    </ModalBackdrop>
  );

  const ClassModal = () => (
    <ModalBackdrop onClose={() => setShowClassModal(false)}>
      <ModalShell 
        title={`Add ${selectedGrade ? 'Section' : 'Grade'} to ${selectedLevel?.name}`} 
        subtitle="Section Assignment · Structure" 
        onClose={() => setShowClassModal(false)}
        footer={<><BtnGhost onClick={() => setShowClassModal(false)}>Cancel</BtnGhost><BtnPrimary onClick={() => setShowClassModal(false)}>Add</BtnPrimary></>}
      >
        <div className="space-y-5">
          {!selectedGrade && (
            <FieldRow label="Grade Name" required>
              <TextInput placeholder="e.g. S4" />
            </FieldRow>
          )}
          <FieldRow label="Stream (optional)">
            <TextInput placeholder="e.g. A, B, C" />
          </FieldRow>
          <FieldRow label="Capacity">
            <TextInput type="number" placeholder="40" />
          </FieldRow>
        </div>
      </ModalShell>
    </ModalBackdrop>
  );

  const CombinationModal = () => (
    <ModalBackdrop onClose={() => setShowCombinationModal(false)}>
      <ModalShell 
        title="Add Combination / Track" 
        subtitle={`For ${selectedLevel?.name}`} 
        onClose={() => setShowCombinationModal(false)}
        footer={<><BtnGhost onClick={() => setShowCombinationModal(false)}>Cancel</BtnGhost><BtnPrimary onClick={() => setShowCombinationModal(false)}>Add</BtnPrimary></>}
      >
        <div className="space-y-5">
          <FieldRow label="Name" required><TextInput placeholder="e.g. PCM or ICT" /></FieldRow>
          <FieldRow label="Code" required><TextInput placeholder="e.g. PCM" /></FieldRow>
          <FieldRow label="Description">
            <TextInput placeholder="Subjects or track description" />
          </FieldRow>
        </div>
      </ModalShell>
    </ModalBackdrop>
  );

  const TVETModal = () => (
    <ModalBackdrop onClose={() => setShowTVETModal(false)}>
      <ModalShell 
        title="Add TVET Track" 
        subtitle="Vocational Stream · Setup" 
        onClose={() => setShowTVETModal(false)}
        footer={<><BtnGhost onClick={() => setShowTVETModal(false)}>Cancel</BtnGhost><BtnPrimary onClick={() => setShowTVETModal(false)}>Add Track</BtnPrimary></>}
      >
        <div className="space-y-5">
          <FieldRow label="Track Name" required><TextInput placeholder="e.g. ICT" /></FieldRow>
          <FieldRow label="Code" required><TextInput placeholder="e.g. TVT-ICT" /></FieldRow>
        </div>
      </ModalShell>
    </ModalBackdrop>
  );

  const getModeLabel = (mode) => {
    const labels = {
      RESUMPTION: 'Resumption',
      REGULAR: 'Regular',
      ASSESSMENT: 'Assessment',
      EXAM_WEEK: 'Exam Week',
      CLOSURE: 'Closure',
      HOLIDAY: 'Holiday',
      SPECIAL_EVENT: 'Special Event'
    };
    return labels[mode] || mode;
  };

  const getModeColor = (mode) => {
    const colors = {
      RESUMPTION: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      REGULAR: 'bg-blue-100 text-blue-800 border-blue-200',
      ASSESSMENT: 'bg-amber-100 text-amber-800 border-amber-200',
      EXAM_WEEK: 'bg-red-100 text-red-800 border-red-200',
      CLOSURE: 'bg-purple-100 text-purple-800 border-purple-200',
      HOLIDAY: 'bg-slate-100 text-slate-600 border-slate-200',
      SPECIAL_EVENT: 'bg-primary/10 text-primary border-primary/20'
    };
    return colors[mode] || 'bg-slate-100 text-slate-700';
  };

  const PhaseDetailModal = () => {
    if (!selectedPhaseForModal) return null;
    const phase = selectedPhaseForModal;
    
    return (
      <ModalBackdrop onClose={() => setShowPhaseDetailModal(false)}>
        <ModalShell 
          title={phase.name}
          width="max-w-2xl"
          subtitle={`${phase.startDate} → ${phase.endDate} · ${getModeLabel(phase.mode)}`}
          onClose={() => setShowPhaseDetailModal(false)}
          footer={
            <div className="flex justify-end w-full">
              <div className="flex gap-3">
                <BtnGhost onClick={() => setShowPhaseDetailModal(false)}>Close</BtnGhost>
                <BtnPrimary onClick={() => { setShowPhaseDetailModal(false); setSelectedPhase(phase); setPhaseForm({...phase}); setShowPhaseModal(true); }}>
                  Edit Phase
                </BtnPrimary>
              </div>
            </div>
          }
        >
          <div className="pb-48">
            <div className="shadow-sm bg-white border border-slate-200 rounded-lg">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3 text-slate-500 w-32">Day of Week</th>
                    <th className="px-5 py-3 text-slate-500">Routine Template</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, idx) => {
                    const currentRoutine = routineTemplates[0] || { name: 'No Specific Routine' };
                    
                    return (
                      <tr key={day} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-4">
                          <span className={`text-xs ${idx > 4 ? 'text-slate-400' : 'text-primary'}`}>
                            {day}
                          </span>
                        </td>
                        <td className="px-5 py-4 relative">
                          <div className="relative group">
                            <button 
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpenRoutineDropdown(openRoutineDropdown === day ? null : day); }}
                              className={`w-full max-w-xs flex items-center justify-between text-[11px] font-medium py-1.5 border-b transition-all ${openRoutineDropdown === day ? 'border-primary text-primary' : 'border-slate-200 text-slate-700 hover:border-slate-400'}`}
                            >
                              <span>{currentRoutine.name}</span>
                              <ChevronDown size={14} className={`transition-transform ${openRoutineDropdown === day ? 'rotate-180' : ''}`} />
                            </button>

                            {openRoutineDropdown === day && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setOpenRoutineDropdown(null)} />
                                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden min-w-[200px]">
                                  <div className="max-h-[200px] overflow-y-auto py-1">
                                    {routineTemplates.map(rt => (
                                      <button 
                                        key={rt.id}
                                        onClick={() => setOpenRoutineDropdown(null)}
                                        className="w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-slate-600 hover:bg-primary/5 hover:text-primary transition-colors border-b border-slate-50 last:border-0"
                                      >
                                        {rt.name}
                                      </button>
                                    ))}
                                    <button 
                                      onClick={() => setOpenRoutineDropdown(null)}
                                      className="w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-slate-400 hover:bg-slate-50 transition-colors"
                                    >
                                      No Specific Routine
                                    </button>
                                  </div>
                                  <div className="p-2 bg-slate-50 border-t border-slate-100">
                                    <button 
                                      onClick={() => { 
                                        setOpenRoutineDropdown(null); 
                                        setActiveDayForSelector(day);
                                        setShowRoutineSelector(true); 
                                      }}
                                      className="w-full py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
                                    >
                                      <Search size={12} /> Search more...
                                    </button>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
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
    );
  };

  const DayEventModal = () => {
    if (!selectedRow || selectedRow.type !== 'exception') return null;
    const event = selectedRow;
    
    return (
      <ModalBackdrop onClose={() => setSelectedRow(null)}>
        <ModalShell 
          title={event.title}
          subtitle={`${event.date} · ${getModeLabel(event.mode)}`}
          onClose={() => setSelectedRow(null)}
          footer={
            <div className="flex justify-end w-full">
              <div className="flex gap-2">
                <button className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1 px-3 py-1.5 bg-red-50 rounded-lg">
                  <Ban size={12} /> Mark as No School
                </button>
              </div>
              <BtnGhost onClick={() => setSelectedRow(null)}>Close</BtnGhost>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-sm text-slate-700">{event.data.reason || 'No additional details'}</p>
            </div>
            
            <div className="border-t border-slate-200 pt-4">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Actions for this day</h4>
              <div className="flex flex-wrap gap-3">
                <button className="text-[11px] px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg flex items-center gap-2">
                  <Calendar size={12} /> Adjust Transport Schedule
                </button>
              </div>
            </div>
          </div>
        </ModalShell>
      </ModalBackdrop>
    );
  };

  const OperationalCalendar = ({ term }) => {
    const calendar = term.operationalCalendar;
    
    if (!calendar || calendar.phases.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-sm text-slate-400 italic">No operational calendar configured for this term.</p>
          <button 
            onClick={() => { setSelectedTerm(term); setSelectedPhase(null); setPhaseForm({...phaseForm, startDate: term.startDate, endDate: term.endDate}); setShowPhaseModal(true); }}
            className="mt-3 text-xs text-primary font-bold uppercase tracking-wide"
          >
            + Configure Term Calendar
          </button>
        </div>
      );
    }

    const buildTimelineRows = () => {
      const rows = [];
      
      calendar.phases.forEach((phase) => {
        rows.push({
          id: `phase-${phase.id}`,
          type: 'phase',
          startDate: phase.startDate,
          endDate: phase.endDate,
          title: phase.name,
          mode: phase.mode,
          data: phase,
          isRange: true
        });
      });
      
      if (calendar.exceptions) {
        calendar.exceptions.forEach((exc, idx) => {
          rows.push({
            id: `exception-${idx}`,
            type: 'exception',
            date: exc.date,
            title: exc.reason || getModeLabel(exc.mode),
            mode: exc.mode,
            data: exc,
            isRange: false
          });
        });
      }
      
      return rows.sort((a, b) => {
        const dateA = a.isRange ? a.startDate : a.date;
        const dateB = b.isRange ? b.startDate : b.date;
        return new Date(dateA) - new Date(dateB);
      });
    };
    
    const timelineRows = buildTimelineRows();

    return (
      <div className="space-y-4">
        <div className="flex justify-end gap-2">
          <button 
            onClick={() => { setSelectedTerm(term); setSelectedPhase(null); setPhaseForm({...phaseForm, startDate: term.startDate, endDate: term.endDate}); setShowPhaseModal(true); }}
            className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
          >
            <Plus size={12} /> Add Phase
          </button>
          <button 
            onClick={() => { setSelectedTerm(term); setExceptionForm({date: '', mode: 'HOLIDAY', reason: ''}); setShowExceptionModal(true); }}
            className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
          >
            <Plus size={12} /> Add Exception
          </button>
        </div>
        
        <div className="overflow-hidden">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-slate-500 font-bold text-[11px] uppercase tracking-wider">Period</th>
                <th className="px-4 py-3 text-slate-500 font-bold text-[11px] uppercase tracking-wider">Event / Phase</th>
                <th className="px-4 py-3 text-slate-500 font-bold text-[11px] uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {timelineRows.map((row) => (
                <tr 
                  key={row.id}
                  className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                  onClick={() => {
                    if (row.type === 'phase') {
                      setSelectedPhaseForModal(row.data);
                      setShowPhaseDetailModal(true);
                    } else {
                      setSelectedRow(row);
                    }
                  }}
                >
                  <td className="px-4 py-3 font-mono text-slate-600 text-[12px]">
                    {row.isRange 
                      ? `${row.startDate.split('-').reverse().join('/')} - ${row.endDate.split('-').reverse().join('/')}`
                      : row.date.split('-').reverse().join('/')
                    }
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getModeColor(row.mode)}`}>
                        {getModeLabel(row.mode)}
                      </span>
                      <span className="font-medium text-slate-700">{row.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ArrowRight size={14} className="text-slate-300 group-hover:text-primary transition-all" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderAcademicCalendarTree = () => (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex justify-end">
        <button 
          onClick={() => setShowYearModal(true)}
          className="bg-primary text-white px-4 py-1.5 rounded text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
        >
          <Plus size={14} /> Create New Academic Year
        </button>
      </div>

      <div className="bg-white rounded border border-slate-200 overflow-hidden shadow-sm">
        {academicYears.map((year) => (
          <div key={year.id} className="border-b border-slate-100 last:border-b-0">
            <div 
              className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 cursor-pointer transition-all"
              onClick={() => toggleYear(year.id)}
            >
              <div className="flex items-center gap-3">
                <button className="text-slate-400 hover:text-primary transition-colors">
                  {expandedYears[year.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>
                <div>
                  <span className="text-base font-bold text-slate-800">{year.name}</span>
                  <div className="flex gap-3 mt-0.5">
                    <span className="text-[10px] text-slate-400">{year.startDate} → {year.endDate}</span>
                    {year.status === 'Active' && (
                      <span className="text-[9px] px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded border border-emerald-100">Active</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <button className="p-1.5 text-slate-400 hover:text-primary transition-colors"><Edit size={14} /></button>
                <button className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>

            {expandedYears[year.id] && (
              <div className="px-6 pb-4 pl-14 space-y-4 border-t border-slate-100 pt-4 bg-slate-50/30">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Terms</h4>
                    </div>
                    <button 
                      onClick={() => { setSelectedYear(year); setShowTermModal(true); }}
                      className="text-[10px] font-bold text-primary uppercase tracking-wider hover:underline flex items-center gap-1"
                    >
                      <Plus size={12} /> Add Term
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {year.terms.map((term) => (
                      <div key={term.id} className="overflow-hidden">
                        <div 
                          className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 cursor-pointer transition-all"
                          onClick={() => toggleTerm(term.id)}
                        >
                          <div className="flex items-center gap-2">
                            <button className="text-slate-400">
                              {expandedTerms[term.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>
                            <span className="text-sm font-bold text-slate-700">{term.name}</span>
                            {term.isActive && (
                              <span className="text-[8px] px-1.5 py-0.5 bg-primary/10 text-primary rounded">Current</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-[10px] text-slate-400">
                            {!expandedTerms[term.id] && <span>{term.startDate} → {term.endDate}</span>}
                            <button className="text-primary hover:underline">Edit</button>
                          </div>
                        </div>
                        
                        {expandedTerms[term.id] && (
                          <div className="py-2 border-t border-slate-100 bg-white">
                            <OperationalCalendar term={term} />
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {year.terms.length === 0 && (
                      <div className="text-center py-6 text-sm text-slate-400 italic border border-dashed border-slate-200 rounded-lg">
                        No terms defined. Click "Add Term" to create.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {academicYears.length === 0 && (
          <div className="text-center py-12">
            <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No academic years created yet</p>
            <button onClick={() => setShowYearModal(true)} className="mt-3 text-primary text-sm font-bold">Create your first academic year</button>
          </div>
        )}
      </div>
    </div>
  );

  const [selectedLevelForDetail, setSelectedLevelForDetail] = useState(levels[0] || null);
  const [selectedGrade, setSelectedGrade] = useState(null);

  // ==================== SINGLE VERSION - NORMALIZED (FIXED) ====================
const renderLevelsClassesTree = () => {
  const levelGrades = selectedLevelForDetail
    ? grades.filter(g => g.level_id === selectedLevelForDetail.level_id)
    : [];
  const levelCombos = selectedLevelForDetail
    ? combinations.filter(c => c.level_id === selectedLevelForDetail.level_id)
    : [];
  const gradeClasses = selectedGrade
    ? sections.filter(s => s.grade_id === selectedGrade.grade_id)
    : [];

  const classDisplayName = (s) => {
    if (s.custom_name) return s.custom_name;
    const grade = grades.find(g => g.grade_id === s.grade_id);
    const combo = combinations.find(c => c.combination_id === s.combination_id);
    const gradeName = grade?.name ?? '';
    const stream = s.stream ? ` ${s.stream}` : '';
    const comboCode = combo ? ` (${combo.code})` : '';
    return `${gradeName}${stream}${comboCode}`;
  };

  // Calculate total enrolled for a grade (mock - replace with real data)
  const getGradeTotalEnrolled = (gradeId) => {
    const gradeClassesList = sections.filter(s => s.grade_id === gradeId);
    return gradeClassesList.reduce((sum, s) => sum + Math.floor(Math.random() * s.capacity), 0);
  };

  // Calculate total capacity for a grade (sum of all its classes' capacities)
  const getGradeTotalCapacity = (gradeId) => {
    const gradeClassesList = sections.filter(s => s.grade_id === gradeId);
    return gradeClassesList.reduce((sum, s) => sum + s.capacity, 0);
  };

  return (
    <div className="flex gap-0 h-[680px] animate-in fade-in duration-500">
      {/* LEFT: Levels Sidebar */}
      <div className="w-64 bg-white rounded-l-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden border-r-0">
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">Levels</span>
          <button onClick={() => setShowLevelModal(true)} className="flex items-center gap-1 text-[10px] font-bold text-primary hover:bg-primary/10 px-2 py-1 rounded transition-all">
            <Plus size={12} /> Add
          </button>
        </div>
        <div className="flex-1 overflow-auto p-2 space-y-1">
          {levels.map(level => {
            const gradeCount = grades.filter(g => g.level_id === level.level_id).length;
            const isActive = selectedLevelForDetail?.level_id === level.level_id;
            return (
              <button key={level.level_id} onClick={() => { setSelectedLevelForDetail(level); setSelectedGrade(null); }}
                className={`w-full text-left p-3 rounded-lg transition-all flex items-center justify-between ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-slate-50 text-slate-600'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded flex items-center justify-center ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    <School size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-bold">{level.name}</div>
                    <div className={`text-[10px] ${isActive ? 'text-white/70' : 'text-slate-400'}`}>{gradeCount} Grades · {level.code}</div>
                  </div>
                </div>
                <ChevronRight size={14} className={isActive ? 'text-white' : 'text-slate-300'} />
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT: Detail Panel */}
      <div className="flex-1 flex flex-col overflow-hidden rounded-r-lg border border-slate-200 shadow-sm bg-white">
        {selectedLevelForDetail ? (
          <>
            {/* Level Header */}
            <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 relative">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">{selectedLevelForDetail.name}</h3>
                    <Settings 
                      className={`w-4 h-4 cursor-pointer transition-colors ${showLevelSettings ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`} 
                      onClick={() => setShowLevelSettings(!showLevelSettings)} 
                    />
                    <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{selectedLevelForDetail.code}</span>
                    {levelCombos.length > 0 && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded border font-bold ${selectedLevelForDetail.level_id === 5 ? 'bg-teal-50 text-teal-600 border-teal-100' : 'bg-purple-50 text-purple-600 border-purple-100'}`}>
                        {selectedLevelForDetail.level_id === 5 ? 'TVET Trade' : 'Combinations'}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                    {levelGrades.length} Grades · Promotion: <span className="text-primary">{selectedLevelForDetail.promotion_rule}</span>
                  </p>
                </div>

                <AnimatePresence>
                  {showLevelSettings && (
                    <>
                      <div className="fixed inset-0 z-20" onClick={() => setShowLevelSettings(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-30 overflow-hidden"
                        style={{ top: '100%' }}
                      >
                        <button className="w-full px-4 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-primary flex items-center gap-2 transition-colors">
                          <Users size={14} className="text-slate-400" />
                          Import Structure
                        </button>
                        <div className="my-1 border-t border-slate-100" />
                        <button className="w-full px-4 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-primary flex items-center gap-2 transition-colors">
                          <BarChart2 size={14} className="text-slate-400" />
                          Export Structure (Excel)
                        </button>
                        <button className="w-full px-4 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-primary flex items-center gap-2 transition-colors">
                          <BarChart2 size={14} className="text-slate-400" />
                          Export to PDF
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1.5 text-slate-400 hover:text-primary transition-colors"><Edit size={14} /></button>
                <button className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>

            <div className="flex-1 overflow-auto flex flex-col">
              {/* Combinations / Tracks strip */}
              {levelCombos.length > 0 && (
                <div className="border-b border-slate-100 px-6 py-3 bg-white shrink-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      {selectedLevelForDetail.level_id === 5 ? <Briefcase size={11} /> : <Layers size={11} />}
                      {selectedLevelForDetail.level_id === 5 ? 'TVET Trades' : 'Subject Combinations'}
                    </h4>
                    <button onClick={() => { setSelectedLevel(selectedLevelForDetail); setShowCombinationModal(true); }}
                      className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline">
                      <Plus size={11} /> Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {levelCombos.map(c => (
                      <div key={c.combination_id} className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-2 ${selectedLevelForDetail.level_id === 5 ? 'bg-teal-50 border-teal-100' : 'bg-purple-50 border-purple-100'}`}>
                        <span className={`text-xs font-black ${selectedLevelForDetail.level_id === 5 ? 'text-teal-700' : 'text-purple-700'}`}>{c.name}</span>
                        <span className={`text-[10px] ${selectedLevelForDetail.level_id === 5 ? 'text-teal-400' : 'text-purple-400'}`}>{c.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Grades Table */}
              <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-[11px] font-bold bg-white sticky top-0 z-10 text-slate-700">
                      <th className="px-4 py-2 border-r border-slate-100 uppercase tracking-wider">Grade</th>
                      <th className="px-4 py-2 border-r border-slate-100 uppercase tracking-wider text-center">Enrolled / Capacity</th>
                      <th className="px-4 py-2 border-r border-slate-100 uppercase tracking-wider text-center">Classes</th>
                      <th className="px-4 py-2 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-[11px]">
                    {levelGrades.map((grade, index) => {
                      const gradeClassesCount = sections.filter(s => s.grade_id === grade.grade_id).length;
                      const totalCapacity = getGradeTotalCapacity(grade.grade_id);
                      const totalEnrolled = getGradeTotalEnrolled(grade.grade_id);
                      const isSelected = selectedGrade?.grade_id === grade.grade_id;
                      const currentClasses = sections.filter(s => s.grade_id === grade.grade_id);
                      const enrollmentPercentage = totalCapacity > 0 ? (totalEnrolled / totalCapacity) * 100 : 0;
                      
                      return (
                        <Fragment key={grade.grade_id}>
                          <tr
                            onClick={() => setSelectedGrade(isSelected ? null : grade)}
                            className={`border-b border-slate-200 cursor-pointer transition-colors ${isSelected ? 'bg-primary/5 border-l-2 border-l-primary' : index % 2 !== 0 ? 'bg-slate-50/50 hover:bg-primary/5' : 'bg-white hover:bg-primary/5'}`}
                          >
                            <td className="px-4 py-2 border-r border-slate-100/50">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20">
                                  {grade.name.charAt(0)}
                                </div>
                                <span className="font-semibold text-slate-700">{grade.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-2 text-center border-r border-slate-100/50">
                              <div className="flex flex-col items-center gap-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-slate-700">{totalEnrolled}</span>
                                  <span className="text-slate-400">/</span>
                                  <span className="font-mono text-slate-600">{totalCapacity}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-2 text-center border-r border-slate-100/50">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${gradeClassesCount > 0 ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'}`}>
                                {gradeClassesCount} classes
                              </span>
                            </td>
                            <td className="px-4 py-2 text-right">
                              <div className="flex justify-end gap-1">
                                <button onClick={e => e.stopPropagation()} className="p-1 text-slate-400 hover:text-primary transition-all"><Edit size={13} /></button>
                                <button onClick={e => e.stopPropagation()} className="p-1 text-slate-400 hover:text-red-600 transition-all"><Trash2 size={13} /></button>
                              </div>
                             </td>
                           </tr>

                          {/* Expanded Classes Table - shows when grade is selected */}
                          {isSelected && (
                            <tr>
                              <td colSpan={4} className="px-6 py-4 bg-primary/3 border-b border-slate-200">
                                <div className="flex items-center justify-between mb-4">
                                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Classes in {grade.name}</span>
                                  <button 
                                    onClick={() => { setSelectedLevel(selectedLevelForDetail); setSelectedGrade(grade); setShowClassModal(true); }}
                                    className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline"
                                  >
                                    <Plus size={11} /> Add Class
                                  </button>
                                </div>
                                
                                {currentClasses.length === 0 ? (
                                  <p className="text-[10px] text-slate-400 italic text-center py-4">No classes yet. Click "Add Class" to create one.</p>
                                ) : (
                                  <div className="overflow-x-auto">
                                    <table className="w-full text-left text-[11px] border-collapse">
                                      <thead>
                                        <tr className="border-b border-slate-200 bg-white/80">
                                          <th className="px-3 py-2 text-slate-600 font-bold">Class Name</th>
                                          <th className="px-3 py-2 text-slate-600 font-bold text-center">Enrolled / Capacity</th>
                                          <th className="px-3 py-2 text-slate-600 font-bold">Class Teacher</th>
                                          <th className="px-3 py-2 text-slate-600 font-bold text-right">Actions</th>
                                         </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-100">
                                        {currentClasses.map(s => {
                                          const combo = combinations.find(c => c.combination_id === s.combination_id);
                                          // Mock enrolled count - in real app, this would come from API
                                          const enrolledCount = Math.floor(Math.random() * s.capacity);
                                          const availableSpots = s.capacity - enrolledCount;
                                          const percentage = (enrolledCount / s.capacity) * 100;
                                          
                                          return (
                                            <tr key={s.section_id} className="hover:bg-white/50 transition-colors">
                                              <td className="px-3 py-2 font-medium text-slate-700">
                                                <div className="flex items-center gap-2">
                                                  <span>{classDisplayName(s)}</span>
                                                  {combo && (
                                                    <span className="text-[9px] px-1.5 py-0.5 bg-purple-100 text-purple-600 rounded-full">
                                                      {combo.code}
                                                    </span>
                                                  )}
                                                  {s.stream && (
                                                    <span className="text-[9px] px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded-full">
                                                      Stream {s.stream}
                                                    </span>
                                                  )}
                                                </div>
                                              </td>
                                              <td className="px-3 py-2">
                                                <div className="flex flex-col items-center gap-1">
                                                  <div className="flex items-center gap-2">
                                                    <span className="font-mono font-bold text-slate-700">{enrolledCount}</span>
                                                    <span className="text-slate-400">/</span>
                                                    <span className="font-mono text-slate-600">{s.capacity}</span>
                                                    {availableSpots < 5 && availableSpots > 0 && (
                                                      <span className="text-[9px] px-1 bg-amber-100 text-amber-700 rounded-full">Few spots left</span>
                                                    )}
                                                    {availableSpots === 0 && (
                                                      <span className="text-[9px] px-1 bg-red-100 text-red-700 rounded-full">Full</span>
                                                    )}
                                                  </div>
                                                </div>
                                              </td>
                                              <td className="px-3 py-2 text-slate-600">
                                                {s.teacher_id ? `Teacher ID: ${s.teacher_id}` : 'Not assigned'}
                                              </td>
                                              <td className="px-3 py-2 text-right">
                                                <div className="flex justify-end gap-1">
                                                  <button className="p-1 text-slate-400 hover:text-primary transition-colors">
                                                    <Edit size={12} />
                                                  </button>
                                                  <button className="p-1 text-slate-400 hover:text-red-600 transition-colors">
                                                    <Trash2 size={12} />
                                                  </button>
                                                </div>
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                      <tfoot className="border-t border-slate-200 bg-slate-50/50">
                                        <tr>
                                          <td className="px-3 py-2 font-bold text-slate-700">Totals</td>
                                          <td className="px-3 py-2">
                                            <div className="flex flex-col items-center gap-1">
                                              <div className="flex items-center gap-2">
                                                <span className="font-mono font-bold text-slate-700">{totalEnrolled}</span>
                                                <span className="text-slate-400">/</span>
                                                <span className="font-mono text-slate-600">{totalCapacity}</span>
                                              </div>
                                            </div>
                                          </td>
                                          <td colSpan={2}></td>
                                        </tr>
                                      </tfoot>
                                    </table>
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
                
                {/* Add Grade footer */}
                <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/30">
                  <button 
                    onClick={() => { setSelectedLevel(selectedLevelForDetail); setSelectedGrade(null); setShowClassModal(true); }}
                    className="flex items-center gap-1.5 text-[11px] font-bold text-primary hover:underline"
                  >
                    <Plus size={12} /> Add Grade to {selectedLevelForDetail.name}
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
            <School size={48} className="mb-4 opacity-10" />
            <p className="text-sm font-bold text-slate-400">Select a level to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};



  // ==================== MAIN RETURN ====================

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] overflow-auto">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between px-6 py-2 bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h2 className="text-base font-bold text-slate-800 -mt-1">System Foundation Setup</h2>
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

      <div className="w-full">
        <div className="p-8">
          {/* Header Section */}
          <div className="flex items-start gap-8 mb-10">
            <div className="relative group cursor-pointer">
              <div className="w-32 h-32 flex items-center justify-center">
                <div className="flex flex-col items-center text-slate-400 group-hover:text-primary transition-colors">
                  <Settings className="w-10 h-10 mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">School Setup</span>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Green Hills Academy</h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                <div className="flex items-center gap-3 group cursor-pointer border-b border-transparent hover:border-slate-200 py-0.5 transition-all">
                  <Calendar className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                  <div className="flex-1 text-sm flex items-center justify-between">
                    <div className="text-slate-700">
                      <span className="text-slate-400 mr-1">Active Year:</span>
                      <span className="font-bold">{activeYear?.name || 'None'}</span>
                    </div>
                    <ArrowRight size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                </div>
                <div className="flex items-center gap-3 group cursor-pointer border-b border-transparent hover:border-slate-200 py-0.5 transition-all">
                  <Layers className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                  <div className="flex-1 text-sm flex items-center justify-between">
                    <div className="text-slate-700">
                      <span className="text-slate-400 mr-1">Levels:</span>
                      <span className="font-bold">{levels.length}</span>
                    </div>
                    <ArrowRight size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                </div>
                <div className="flex items-center gap-3 group cursor-pointer border-b border-transparent hover:border-slate-200 py-0.5 transition-all">
                  <Users className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                  <div className="flex-1 text-sm flex items-center justify-between">
                    <div className="text-slate-700">
                      <span className="text-slate-400 mr-1">Total Grades:</span>
                      <span className="font-bold">{grades.length}</span>
                    </div>
                    <ArrowRight size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                </div>
                <div className="flex items-center gap-3 group cursor-pointer border-b border-transparent hover:border-slate-200 py-0.5 transition-all">
                  <Tag className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                  <div className="flex-1 text-sm flex items-center justify-between">
                    <div className="text-slate-700">
                      <span className="text-slate-400 mr-1">Total Sections:</span>
                      <span className="font-bold">{sections.length}</span>
                    </div>
                    <ArrowRight size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Tabs */}
          <div className="flex border-b border-slate-200 mb-6">
            {tabs.map((tab) => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2.5 text-sm transition-all relative flex items-center gap-2 ${activeTab === tab.id ? 'text-primary' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="min-h-[400px]">
            {activeTab === 'Academic' && renderAcademicCalendarTree()}
            {activeTab === 'Structure' && renderLevelsClassesTree()}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showYearModal && <YearModal />}
        {showTermModal && <TermModal />}
        {showPhaseModal && <PhaseModal />}
        {showDailyBreakdownModal && <DailyBreakdownModal />}
        {showExceptionModal && <ExceptionModal />}
        {showLevelModal && <LevelModal />}
        {showClassModal && <ClassModal />}
        {showCombinationModal && <CombinationModal />}
        {showTVETModal && <TVETModal />}
        {showPhaseDetailModal && <PhaseDetailModal />}
        {selectedRow && selectedRow.type === 'exception' && <DayEventModal />}
        
        {/* Routine Selection Modal */}
        {showRoutineSelector && (
          <ModalBackdrop onClose={() => setShowRoutineSelector(false)}>
            <ModalShell 
              title="Select Routine Template"
              subtitle={`Configuration for ${activeDayForSelector}`}
              width="max-w-xl"
              onClose={() => setShowRoutineSelector(false)}
              footer={
                <div className="flex justify-between w-full items-center">
                  <button 
                    onClick={() => { setShowRoutineSelector(false); setShowRoutineCreator(true); }}
                    className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2 hover:underline"
                  >
                    <Plus size={14} /> Create New Template
                  </button>
                  <BtnGhost onClick={() => setShowRoutineSelector(false)}>Cancel</BtnGhost>
                </div>
              }
            >
              <div className="border border-slate-200 rounded overflow-hidden bg-white">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-800 text-[11px] font-bold bg-white">
                      <th className="px-4 py-2 w-12 border-r border-slate-100 text-center uppercase tracking-wider">Icon</th>
                      <th className="px-4 py-2 border-r border-slate-100 uppercase tracking-wider">Routine Name</th>
                      <th className="px-4 py-2 border-r border-slate-100 uppercase tracking-wider text-right">Activities</th>
                      <th className="px-4 py-2 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="text-[11px]">
                    {routineTemplates.map((rt, index) => (
                      <tr 
                        key={rt.id}
                        onClick={() => setShowRoutineSelector(false)}
                        className={`border-b border-slate-200 cursor-pointer transition-colors hover:bg-primary/5 ${index % 2 !== 0 ? 'bg-slate-50' : ''}`}
                      >
                        <td className="px-4 py-1.5 w-12">
                          <div className="w-6 h-6 mx-auto bg-primary/10 rounded flex items-center justify-center text-primary border border-primary/20 shadow-sm">
                            <Clock size={14} />
                          </div>
                        </td>
                        <td className="px-4 py-1.5">
                          <span className="font-medium text-slate-700 uppercase tracking-tight">{rt.name}</span>
                        </td>
                        <td className="px-4 py-1.5 text-right font-medium text-slate-600">
                          {rt.slots?.length || 0} Activities
                        </td>
                        <td className="px-4 py-1.5 text-right">
                          <ArrowRight size={14} className="text-slate-300 group-hover:text-primary transition-all inline" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ModalShell>
          </ModalBackdrop>
        )}

        {/* Routine Creator Modal */}
        {showRoutineCreator && (
          <ModalBackdrop onClose={() => setShowRoutineCreator(false)}>
            <ModalShell 
              title="Create New Routine Template"
              subtitle="Define daily timeline & activities"
              width="max-w-2xl"
              onClose={() => setShowRoutineCreator(false)}
              footer={
                <>
                  <BtnGhost onClick={() => setShowRoutineCreator(false)}>Cancel</BtnGhost>
                  <BtnPrimary onClick={() => setShowRoutineCreator(false)}>Save Template</BtnPrimary>
                </>
              }
            >
              <div className="space-y-6">
                <FieldRow label="Template Name" required>
                  <TextInput placeholder="e.g. Standard Academic Day" />
                </FieldRow>

                <div className="border-t border-slate-100 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Slots & Activities</h4>
                    <button className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:underline">
                      <Plus size={12} /> Add Slot
                    </button>
                  </div>

                  <div className="border border-slate-200 rounded overflow-hidden bg-white">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-800 text-[11px] font-bold bg-white">
                          <th className="px-4 py-2 w-24 border-r border-slate-100 uppercase tracking-wider">Time</th>
                          <th className="px-4 py-2 border-r border-slate-100 uppercase tracking-wider">Activity Name</th>
                          <th className="px-4 py-2 border-r border-slate-100 uppercase tracking-wider">Target</th>
                          <th className="px-4 py-2 w-10 uppercase tracking-wider"></th>
                        </tr>
                      </thead>
                      <tbody className="text-[11px]">
                        {[
                          { time: '06:30', activity: 'Wake Up', target: 'Boarding' },
                          { time: '07:30', activity: 'Breakfast', target: 'All' }
                        ].map((slot, idx) => (
                          <tr key={idx} className={`border-b border-slate-200 transition-colors hover:bg-primary/5 ${idx % 2 !== 0 ? 'bg-slate-50' : ''}`}>
                            <td className="px-4 py-1.5">
                              <input 
                                type="time" 
                                defaultValue={slot.time} 
                                className="w-full text-xs bg-transparent border-b border-slate-200 py-1 focus:outline-none focus:border-primary font-medium text-slate-700" 
                              />
                            </td>
                            <td className="px-4 py-1.5">
                              <input 
                                type="text" 
                                defaultValue={slot.activity} 
                                placeholder="Activity..." 
                                className="w-full text-xs bg-transparent border-b border-slate-200 py-1 focus:outline-none focus:border-primary font-medium text-slate-700" 
                              />
                            </td>
                            <td className="px-4 py-1.5">
                              <div className="relative">
                                <select className="w-full text-xs bg-transparent border-b border-slate-200 py-1 focus:outline-none focus:border-primary font-medium text-slate-700 appearance-none cursor-pointer">
                                  <option>All Students</option>
                                  <option>Boarding Only</option>
                                  <option>Day Students</option>
                                </select>
                                <ChevronDown size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                              </div>
                            </td>
                            <td className="px-4 py-1.5 text-right">
                              <button className="text-slate-300 hover:text-red-500 transition-colors">
                                <X size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </ModalShell>
          </ModalBackdrop>
        )}
      </AnimatePresence>
    </div>
  );
}
