import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/layout';
import './index.css';

import Home from './pages/index';
import Apps from './pages/apps';

// People & HR
import Staff from './pages/staff';
import StaffCreate from './pages/staff_create';
import OrganisationStructure from './pages/organisation_structure';
import AttendanceHub from './pages/attendance_hub';
import AttendanceStudents from './pages/attendance';
import AttendanceTeachers from './pages/attendance_teachers';
import AttendanceConfig from './pages/attendance_config';
import AttendanceEvents from './pages/attendance_events';
import Payroll from './pages/payroll';

// Academic
import Students from './pages/students';
import StudentCreate from './pages/student_create';
import StudentEnrollment from './pages/student_enrollment';
import Parents from './pages/parents';
import ParentCreate from './pages/parent_create';
import Timetable from './pages/timetable';
import SchoolDays from './pages/school_days';

// ─── Nav Item Sets ──────────────────────────────────────────────────────────
const staffNavItems = [
  { label: 'Staff Members',          path: '/staff' },
  { label: 'Organisation Structure', path: '/staff/organisation-structure' },
  { label: 'Staff Reports',          path: '/staff/reports' },
];

const studentNavItems = [
  { label: 'All Students',  path: '/students' },
  { label: 'Parent Portal', path: '/students/parents' },
  { label: 'Enrollment',    path: '/students/enroll' },
];

const attendanceNavItems = [
  { label: 'Student Attendance', path: '/attendance/students' },
  { label: 'Teacher Attendance', path: '/attendance/teachers' },
  { label: 'Configurations',     path: '/attendance/config' },
];

const academicNavItems = [
  { label: 'Weekly Timetable',  path: '/academic/timetable' },
  { label: 'School Days Config',path: '/academic/school-days' },
];

const payrollNavItems = [
  { label: 'Monthly Processing', path: '/payroll' },
  { label: 'Salary Structures',  path: '/payroll/structures' },
  { label: 'ShuleAdvance',       path: '/payroll/advance' },
  { label: 'Statutory',          path: '/payroll/statutory' },
];

// ─── App Content ─────────────────────────────────────────────────────────────
function AppContent() {
  const location = useLocation();
  const p = location.pathname;

  const isHome       = p === '/';
  const isApps       = p === '/apps';
  const isStaff      = p.startsWith('/staff');
  const isStudents   = p.startsWith('/students');
  const isAttendance = p.startsWith('/attendance');
  const isAcademic   = p.startsWith('/academic');
  const isPayroll    = p.startsWith('/payroll');

  let navItems = [];
  let title = '';

  if (isStaff)          { navItems = staffNavItems;      title = 'Staff'; }
  else if (isStudents)  { navItems = studentNavItems;    title = 'Students'; }
  else if (isAttendance){ navItems = attendanceNavItems; title = 'Attendance'; }
  else if (isAcademic)  { navItems = academicNavItems;   title = 'Timetable'; }
  else if (isPayroll)   { navItems = payrollNavItems;    title = 'Payroll'; }
  else if (isApps)      { navItems = [];                 title = 'Apps'; }
  else if (!isHome)     { navItems = [{ label: 'Home', path: '/' }]; }

  return (
    <Layout userName="Alex Johnson" isHome={isHome} navItems={navItems} title={title}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apps" element={<Apps />} />

        {/* ── People & HR ─────────────────────────── */}
        <Route path="/staff"                           element={<Staff />} />
        <Route path="/staff/new"                       element={<StaffCreate />} />
        <Route path="/staff/organisation-structure"    element={<OrganisationStructure />} />

        <Route path="/payroll"                         element={<Payroll />} />

        <Route path="/attendance"                      element={<Navigate to="/attendance/students" replace />} />
        <Route path="/attendance/students"             element={<AttendanceStudents />} />
        <Route path="/attendance/teachers"             element={<AttendanceTeachers />} />
        <Route path="/attendance/events"               element={<AttendanceEvents />} />
        <Route path="/attendance/config"               element={<AttendanceConfig />} />

        {/* ── Academic ────────────────────────────── */}
        <Route path="/students"                        element={<Students />} />
        <Route path="/students/new"                    element={<StudentCreate />} />
        <Route path="/students/enroll"                 element={<StudentEnrollment />} />
        <Route path="/students/parents"                element={<Parents />} />
        <Route path="/students/parents/new"            element={<ParentCreate />} />

        <Route path="/academic/timetable"              element={<Timetable />} />
        <Route path="/academic/school-days"            element={<SchoolDays />} />

        {/* ── Fallback ────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
