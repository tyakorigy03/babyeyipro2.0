import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/layout';
import './index.css';

import { SetupProvider } from './pages/setup/SetupContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import Home from './pages/index';
import Apps from './pages/apps';
import Login from './pages/login';

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
import SetupFoundation from './pages/setup/foundation';
import SetupRoutines from './pages/setup/routines_page';
import SetupFinance from './pages/setup/finance';
import SetupSystem from './pages/setup/system';
import SetupTransport from './pages/setup/transport';
import RoutineTemplatesLibrary from './pages/setup/routines_page';

// SuperAdmin
import SuperAdminDashboard from './pages/superadmin/dashboard';
import SchoolsPage from './pages/superadmin/schools';
import OnboardSchool from './pages/superadmin/onboard_school';
import AgentsPage from './pages/superadmin/agents';

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
];

const payrollNavItems = [
  { label: 'Monthly Processing', path: '/payroll' },
  { label: 'Salary Structures',  path: '/payroll/structures' },
  { label: 'ShuleAdvance',       path: '/payroll/advance' },
  { label: 'Statutory',          path: '/payroll/statutory' },
];

const setupNavItems = [
  { label: 'Foundation',               path: '/setup' },
  { label: 'Daily Routines', path: '/setup/routines' },
  { label: 'Finance',                  path: '/setup/finance' },
  { label: 'System',                   path: '/setup/system' },
  { label: 'Transport',                path: '/setup/transport' },
];

// ─── App Content ─────────────────────────────────────────────────────────────
function AppContent() {
  const location = useLocation();
  const p = location.pathname;
  const { isAuthenticated, isLoading, user } = useAuth();

  const isSuperAdmin = p.startsWith('/superadmin');
  const isHome       = p === '/';
  const isApps       = p === '/apps';
  const isStaff      = p.startsWith('/staff');
  const isStudents   = p.startsWith('/students');
  const isAttendance = p.startsWith('/attendance');
  const isAcademic   = p.startsWith('/academic');
  const isPayroll    = p.startsWith('/payroll');
  const isLogin      = p === '/login';
  const isSetup      = p.startsWith('/setup');

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-sm text-gray-600">
        Checking authentication...
      </div>
    );
  }

  if (!isAuthenticated && !isLogin) {
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated && isLogin) {
    return <Navigate to="/" replace />;
  }

  // SuperAdmin has its own self-contained layout — skip the school Layout
  if (isSuperAdmin) {
    return (
      <Routes>
        <Route path="/superadmin" element={<SuperAdminDashboard />} />
        <Route path="/superadmin/schools" element={<SchoolsPage />} />
        <Route path="/superadmin/schools/onboard" element={<OnboardSchool />} />
        <Route path="/superadmin/agents" element={<AgentsPage />} />
        <Route path="/superadmin/stations" element={<AgentsPage />} />
        <Route path="*" element={<Navigate to="/superadmin" replace />} />
      </Routes>
    );
  }

  let navItems = [];
  let title = '';

  if (isStaff)          { navItems = staffNavItems;      title = 'Staff'; }
  else if (isStudents)  { navItems = studentNavItems;    title = 'Students'; }
  else if (isAttendance){ navItems = attendanceNavItems; title = 'Attendance'; }
  else if (isAcademic)  { navItems = academicNavItems;   title = 'Timetable'; }
  else if (isPayroll)   { navItems = payrollNavItems;    title = 'Payroll'; }
  else if (isSetup)     { navItems = setupNavItems;      title = 'Setup'; }
  else if (isApps)      { navItems = [];                 title = 'Apps'; }
  else if (!isHome)     { navItems = [{ label: 'Home', path: '/' }]; }

  return (
    <Layout userName={isLogin ? "" : user?.name ?? "Alex Johnson"} isHome={isHome || isLogin} navItems={isLogin ? [] : navItems} title={isLogin ? "" : title}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
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

        {/* ── Setup ───────────────────────────────── */}
        <Route path="/setup"                           element={<SetupFoundation />} />
        <Route path="/setup/routines"                  element={<RoutineTemplatesLibrary />} />
        <Route path="/setup/finance"                   element={<SetupFinance />} />
        <Route path="/setup/system"                    element={<SetupSystem />} />
        <Route path="/setup/transport"                 element={<SetupTransport />} />

        {/* ── Fallback ────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <SetupProvider>
          <AppContent />
        </SetupProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
