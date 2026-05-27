import AppsRoundedIcon from "@mui/icons-material/AppsRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";

/**
 * Mock-mode data only (no backend, no domain assumptions).
 * Permissions are blank so everything is visible by default.
 */

export const mockApps = Object.freeze([
  { id: "dashboards", label: "Dashboards", icon: "/icons/dashboards.png", permission: "", priority: 120, homeVisibility: "always" },
  { id: "students", label: "Students", icon: "/icons/students.png", permission: "", priority: 110, homeVisibility: "always" },
  { id: "staff", label: "Staff", icon: "/icons/staff.png", permission: "", priority: 100, homeVisibility: "always" },
  { id: "attendance", label: "Attendance", icon: "/icons/attendance.png", permission: "", priority: 90, homeVisibility: "always" },
  { id: "timetable", label: "Timetable", icon: "/icons/timetable.png", permission: "", priority: 80, homeVisibility: "always" },
  { id: "fees", label: "Fees", icon: "/icons/fees.png", permission: "", priority: 70, homeVisibility: "always" },
  { id: "payroll", label: "Payroll", icon: "/icons/payroll.png", permission: "", priority: 60, homeVisibility: "always" },
  { id: "parents", label: "Parents", icon: "/icons/parents.png", permission: "", priority: 50, homeVisibility: "always" },
  { id: "babyeyi", label: "Babyeyi", icon: "/icons/assessment.png", permission: "", priority: 40, homeVisibility: "always" },
  { id: "discipline", label: "Discipline", icon: "/icons/displine.png", permission: "", priority: 30, homeVisibility: "always" },
  { id: "shuleadvance", label: "ShuleAdvance", icon: "/icons/shuleavance.png", permission: "", priority: 20, homeVisibility: "always" },
  { id: "shulecard", label: "ShuleCard", icon: "/icons/icard.png", permission: "", priority: 10, homeVisibility: "always" },
]);

export const mockWidgets = Object.freeze([
  // Emptied to test layout logic when user has no widgets
]);

