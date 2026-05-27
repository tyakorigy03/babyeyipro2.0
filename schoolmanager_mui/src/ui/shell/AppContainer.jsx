import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import { appRegistry } from "../../core/apps/app-registry.js";
import { useLocation, useNavigate } from "react-router-dom";
import ModuleExplorer from "../components/ModuleExplorer/ModuleExplorer.jsx";
import DataEntryEngine from "../components/DataEntryEngine/DataEntryEngine.jsx";
import DynamicForm from "../components/DataEntryEngine/DynamicForm.jsx";
import { 
  StaffWorkForm, 
  StaffResumeForm, 
  StaffPersonalForm, 
  StaffPayrollForm 
} from "../components/DataEntryEngine/StaffOnboardingForms.jsx";
import { studentHierarchy, studentsList, parentsList, enrollmentList } from "../../mock/studentsMock.js";
import { parentHierarchy, allParentsList } from "../../mock/parentsMock.js";
import { staffHierarchy, mockStaffList } from "../../mock/staffMock.js";
import { 
  payrollHierarchy, 
  mockMonthlyPayrollList, 
  structuresHierarchy, 
  mockStructuresList, 
  advanceHierarchy, 
  mockAdvanceList, 
  statutoryHierarchy, 
  mockStatutoryList,
  calculatePayslip
} from "../../mock/payrollMock.js";
import { api } from "@/services";

/**
 * App detail renderer for a selected entity.
 */
function EntityDetail({ title, item, fields, onBack }) {
  return (
    <Box sx={{ p: 4 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <Button variant="outlined" size="small" onClick={onBack}>
          Back
        </Button>
      </Stack>
      <Card variant="outlined" sx={{ p: 3 }}>
        <Stack spacing={2}>
          {fields.map((field) => (
            <Box key={field.id} sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                {field.label}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.primary' }}>
                {item[field.id] ?? '—'}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Card>
    </Box>
  );
}

/**
 * App container that renders the active feature view.
 */
export default function AppContainer(props) {
  const { activeAppId, activePageId, activeEntityId } = props;
  const location = useLocation();
  const navigate = useNavigate();
  
  const app = appRegistry.find((a) => a.id === activeAppId);
  
  if (!app) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">App "{activeAppId}" not found or under construction.</Typography>
      </Box>
    );
  }

  const studentGridFields = [
    { id: 'name', label: 'Name', isPrimary: true },
    { id: 'class', label: 'Class' },
    { id: 'parent', label: 'Parent' },
  ];

  const studentColumns = [
    { 
      id: 'name', 
      label: 'Student Name',
      render: (s) => (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>{s.name[0]}</Avatar>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>{s.name}</Typography>
        </Stack>
      )
    },
    { id: 'class', label: 'Class' },
    { id: 'parent', label: 'Parent' }
  ];

  const activeRouteId = activePageId || app.defaultView;
  const activeView = app.views.find((v) => v.id === activeRouteId);
  const activeSubPage = app.subPages?.find((p) => p.id === activeRouteId);

  const activeFormPage = activeSubPage || (activeView && (activeView.type === 'form' || (activeView.metadata && typeof activeView.metadata === 'object' && Object.keys(activeView.metadata).length > 0))
    ? {
        id: activeView.id,
        name: activeView.label || activeView.id,
        type: activeView.type || 'view',
        metadata: activeView.metadata || {},
      }
    : null);

  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [detailMode, setDetailMode] = useState('view');
  const [formData, setFormData] = useState({ name: "" });
  const [dbStaff, setDbStaff] = useState([]);
  const [isLoadingStaff, setIsLoadingStaff] = useState(false);
  const [dbLocations, setDbLocations] = useState([]);
  const [dbStudents, setDbStudents] = useState([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [dbParents, setDbParents] = useState([]);
  const [isLoadingParents, setIsLoadingParents] = useState(false);
  const [dbStudentHierarchy, setDbStudentHierarchy] = useState([]);
  const [dbLevels, setDbLevels] = useState([]);
  const [dbClasses, setDbClasses] = useState([]);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const [addChildModal, setAddChildModal] = useState({ open: false, parentNode: null, depth: 0 });
  const [modalFields, setModalFields] = useState({});
  const [isSavingChild, setIsSavingChild] = useState(false);

  const handleAddChildClick = (node, depth) => {
    const resolvedDepth = typeof depth === 'number' ? depth : 0;
    setAddChildModal({ open: true, parentNode: node, depth: resolvedDepth });

    if (activeAppId === 'students') {
      if (node.id === 'all') {
        setModalFields({
          type: 'level',
          name: '',
          code: ''
        });
      } else if (resolvedDepth === 0) {
        setModalFields({
          type: 'grade',
          name: '',
          code: '',
          levelId: node.id
        });
      } else {
        setModalFields({
          type: 'class',
          name: '',
          gradeId: node.id,
          locationId: '',
          teacher: '',
          capacity: 40
        });
      }
    } else if (activeAppId === 'staff') {
      if (node.id === 'all') {
        setModalFields({
          type: 'department',
          name: '',
          description: ''
        });
      } else {
        setModalFields({
          type: 'role',
          name: '',
          department: node.name,
          departmentId: node.id,
          description: '',
          permission: 'Teacher'
        });
      }
    } else {
      if (node.id === 'all') {
        setModalFields({
          type: 'region',
          name: '',
          type_name: 'Residential Zone'
        });
      } else {
        setModalFields({
          type: 'location',
          name: '',
          parent: node.name,
          type_name: 'Residential Zone'
        });
      }
    }
  };

  const handleSaveChildNode = async () => {
    if (!modalFields.name?.trim()) return;
    setIsSavingChild(true);
    try {
      const parent = addChildModal.parentNode;
      
      if (activeAppId === 'students') {
        if (modalFields.type === 'level') {
          await api.foundation.createLevel({
            name: modalFields.name,
            code: modalFields.code || modalFields.name.substring(0, 3).toUpperCase()
          });
          alert(`Level "${modalFields.name}" successfully created!`);
        } else if (modalFields.type === 'grade') {
          const levels = await api.foundation.getLevels();
          let matchedLevel = levels.find(l => String(l.id) === String(modalFields.levelId) || l.name.toLowerCase() === parent.name.toLowerCase());
          if (!matchedLevel && levels.length > 0) {
            matchedLevel = levels[0];
          }
          await api.foundation.createGrade({
            name: modalFields.name,
            level_id: matchedLevel ? matchedLevel.id : modalFields.levelId,
            code: modalFields.code || modalFields.name.substring(0, 3).toUpperCase(),
            grade_number: 1
          });
          alert(`Grade "${modalFields.name}" successfully created under level "${matchedLevel ? matchedLevel.name : 'Unknown'}"!`);
        } else {
          const grades = await api.foundation.getGrades();
          let matchedGrade = grades.find(g => String(g.id) === String(modalFields.gradeId) || g.name.toLowerCase() === parent.name.toLowerCase());
          
          if (matchedGrade) {
            const academicGroups = await api.foundation.getAcademicGroups();
            let matchedGroup = academicGroups.find(g => String(g.grade_id) === String(matchedGrade.id));
            
            if (!matchedGroup) {
              const years = await api.foundation.getAcademicYears();
              const activeYear = years.find(y => y.is_active) || years[0];
              
              if (activeYear) {
                const groupRes = await api.foundation.createAcademicGroup({
                  grade_id: matchedGrade.id,
                  academic_year_id: activeYear.id,
                  name: `${matchedGrade.name} ${activeYear.name}`
                });
                matchedGroup = groupRes.data || groupRes;
              }
            }

            if (matchedGroup) {
              let stream = 'A';
              const nameParts = modalFields.name.split(' ');
              if (nameParts.length > 1) {
                stream = nameParts[nameParts.length - 1];
              } else {
                stream = modalFields.name;
              }

              await api.foundation.createClass({
                academic_group_id: matchedGroup.id,
                stream: stream,
                custom_name: modalFields.name,
                capacity: parseInt(modalFields.capacity) || 40,
                location_id: modalFields.locationId || null,
                class_teacher_id: null
              });
              alert(`Class "${modalFields.name}" successfully created under grade "${matchedGrade.name}"!`);
            } else {
              alert(`Failed to create class: No academic year found to set up academic group.`);
            }
          } else {
            alert(`Could not find Grade in database.`);
          }
        }
      } else if (activeAppId === 'staff') {
        if (modalFields.type === 'department') {
          await api.foundation.createDepartment({
            name: modalFields.name,
            description: modalFields.description || `Department for ${modalFields.name}`
          });
          alert(`Department "${modalFields.name}" successfully created!`);
        } else {
          const depts = await api.foundation.getDepartments();
          const selectedDeptName = modalFields.department || parent.name;
          const matchedDept = depts.find(d => 
            String(d.id) === String(modalFields.departmentId) || d.name.toLowerCase() === selectedDeptName.toLowerCase()
          );

          await api.foundation.createRole({
            name: modalFields.name,
            description: modalFields.description || `Role in ${selectedDeptName}`,
            department_id: matchedDept ? matchedDept.id : null
          });
          alert(`Role "${modalFields.name}" successfully created under department "${selectedDeptName}"!`);
        }
      } else {
        await api.foundation.createEntity('rooms', {
          name: modalFields.name,
          type: modalFields.type_name || 'Other',
          capacity: '0'
        });
        alert(`Location "${modalFields.name}" successfully created under region "${modalFields.parent || parent.name}"!`);
      }
      setAddChildModal({ open: false, parentNode: null });
    } catch (err) {
      console.error("Error creating child node:", err);
      alert("Failed to save. Please make sure the backend server is running and try again.");
    } finally {
      setIsSavingChild(false);
    }
  };

  const renderAddChildDialog = () => {
    if (!addChildModal.open) return null;
    const parent = addChildModal.parentNode;

    let modalTitle = "";
    let actionLabel = "";
    let fieldsBody = null;

    const handleFieldChange = (key, val) => {
      setModalFields((prev) => ({ ...prev, [key]: val }));
    };

    if (activeAppId === 'students') {
      if (modalFields.type === 'level') {
        modalTitle = "Create New Level";
        actionLabel = "Create Level";
        fieldsBody = (
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                Level Name <Box component="span" sx={{ color: 'error.main' }}>*</Box>
              </Typography>
              <TextField
                fullWidth
                variant="standard"
                placeholder="e.g. Primary Section"
                value={modalFields.name || ""}
                onChange={(e) => handleFieldChange("name", e.target.value)}
              />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                Level Code
              </Typography>
              <TextField
                fullWidth
                variant="standard"
                placeholder="e.g. PRI"
                value={modalFields.code || ""}
                onChange={(e) => handleFieldChange("code", e.target.value)}
              />
            </Box>
          </Stack>
        );
      } else if (modalFields.type === 'grade') {
        modalTitle = `Create New Grade under ${parent?.name}`;
        actionLabel = "Create Grade";
        fieldsBody = (
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                Grade Name <Box component="span" sx={{ color: 'error.main' }}>*</Box>
              </Typography>
              <TextField
                fullWidth
                variant="standard"
                placeholder="e.g. Primary 1"
                value={modalFields.name || ""}
                onChange={(e) => handleFieldChange("name", e.target.value)}
              />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                Grade Code
              </Typography>
              <TextField
                fullWidth
                variant="standard"
                placeholder="e.g. P1"
                value={modalFields.code || ""}
                onChange={(e) => handleFieldChange("code", e.target.value)}
              />
            </Box>
          </Stack>
        );
      } else {
        modalTitle = `Create New Class under ${parent?.name}`;
        actionLabel = "Create Class";
        const teachers = dbStaff.length > 0 
          ? dbStaff 
          : [
              { name: "Mr. Robert Ntaganda" },
              { name: "Ms. Diane Umutoni" }
            ];

        fieldsBody = (
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                Class Stream Name <Box component="span" sx={{ color: 'error.main' }}>*</Box>
              </Typography>
              <TextField
                fullWidth
                variant="standard"
                placeholder="e.g. P1 A"
                value={modalFields.name || ""}
                onChange={(e) => handleFieldChange("name", e.target.value)}
              />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                Classroom Location <Box component="span" sx={{ color: 'error.main' }}>*</Box>
              </Typography>
              <FormControl fullWidth variant="standard">
                <Select
                  value={modalFields.locationId || ""}
                  onChange={(e) => {
                    const locId = e.target.value;
                    const selectedLoc = dbLocations.find(l => String(l.id) === String(locId));
                    setModalFields(prev => ({
                      ...prev,
                      locationId: locId,
                      capacity: selectedLoc ? (selectedLoc.capacity || 40) : 40
                    }));
                  }}
                  displayEmpty
                >
                  <MenuItem value="">Select classroom room...</MenuItem>
                  {dbLocations.map((loc) => (
                    <MenuItem key={loc.id} value={loc.id}>
                      {loc.name} (Capacity: {loc.capacity || 'N/A'})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                Class Capacity (Defined by Room)
              </Typography>
              <TextField
                fullWidth
                disabled
                variant="standard"
                type="number"
                value={modalFields.capacity || 40}
              />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                Class Teacher
              </Typography>
              <FormControl fullWidth variant="standard">
                <Select
                  value={modalFields.teacher || ""}
                  onChange={(e) => handleFieldChange("teacher", e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">Select teacher...</MenuItem>
                  {teachers.map((t, idx) => (
                    <MenuItem key={idx} value={t.name}>{t.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Stack>
        );
      }
    } else if (activeAppId === 'staff') {
      if (modalFields.type === 'department') {
        modalTitle = "Create New Department";
        actionLabel = "Create Department";
        fieldsBody = (
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                Department Name <Box component="span" sx={{ color: 'error.main' }}>*</Box>
              </Typography>
              <TextField
                fullWidth
                variant="standard"
                placeholder="e.g. Academic Department"
                value={modalFields.name || ""}
                onChange={(e) => handleFieldChange("name", e.target.value)}
              />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                Description
              </Typography>
              <TextField
                fullWidth
                variant="standard"
                placeholder="Brief description..."
                value={modalFields.description || ""}
                onChange={(e) => handleFieldChange("description", e.target.value)}
              />
            </Box>
          </Stack>
        );
      } else {
        modalTitle = `Create New Role under ${parent?.name}`;
        actionLabel = "Create Role";
        fieldsBody = (
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                Designation / Role Name <Box component="span" sx={{ color: 'error.main' }}>*</Box>
              </Typography>
              <TextField
                fullWidth
                variant="standard"
                placeholder="e.g. Physics Teacher"
                value={modalFields.name || ""}
                onChange={(e) => handleFieldChange("name", e.target.value)}
              />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                Responsibilities / Description
              </Typography>
              <TextField
                fullWidth
                variant="standard"
                multiline
                rows={2}
                placeholder="List core responsibilities..."
                value={modalFields.description || ""}
                onChange={(e) => handleFieldChange("description", e.target.value)}
              />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                Permission Level
              </Typography>
              <FormControl fullWidth variant="standard">
                <Select
                  value={modalFields.permission || ""}
                  onChange={(e) => handleFieldChange("permission", e.target.value)}
                >
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Teacher">Teacher</MenuItem>
                  <MenuItem value="Registrar">Registrar</MenuItem>
                  <MenuItem value="Read-Only">Read-Only</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Stack>
        );
      }
    } else {
      modalTitle = modalFields.type === 'region' ? "Create Region Zone" : `Create Location under ${parent?.name}`;
      actionLabel = modalFields.type === 'region' ? "Create Region" : "Create Location";
      fieldsBody = (
        <Stack spacing={2}>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
              Name <Box component="span" sx={{ color: 'error.main' }}>*</Box>
            </Typography>
            <TextField
              fullWidth
              variant="standard"
              placeholder="e.g. Gasabo"
              value={modalFields.name || ""}
              onChange={(e) => handleFieldChange("name", e.target.value)}
            />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
              Location Type
            </Typography>
            <FormControl fullWidth variant="standard">
              <Select
                value={modalFields.type_name || ""}
                onChange={(e) => handleFieldChange("type_name", e.target.value)}
              >
                <MenuItem value="Residential Zone">Residential Zone</MenuItem>
                <MenuItem value="Classroom">Classroom</MenuItem>
                <MenuItem value="Laboratory">Laboratory</MenuItem>
                <MenuItem value="Office">Office</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Stack>
      );
    }

    return (
      <Dialog 
        open={addChildModal.open} 
        onClose={() => setAddChildModal({ open: false, parentNode: null })}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 420,
            overflow: 'hidden',
            borderTop: '4px solid',
            borderColor: 'primary.main',
            boxShadow: '0px 10px 30px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1, pt: 2.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem', color: 'text.primary', lineHeight: 1.2 }}>
            {modalTitle}
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ py: 1 }}>
          <Box sx={{ mt: 1 }}>
            {fieldsBody}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3, pt: 1.5, gap: 1 }}>
          <Button 
            onClick={() => setAddChildModal({ open: false, parentNode: null })} 
            variant="outlined" 
            color="inherit"
            sx={{
              fontWeight: 700,
              fontSize: '11px',
              px: 3,
              borderRadius: 1.5,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderColor: 'divider'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveChildNode} 
            variant="contained" 
            disabled={isSavingChild || !modalFields.name?.trim()}
            sx={{
              fontWeight: 700,
              fontSize: '11px',
              px: 3,
              borderRadius: 1.5,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {isSavingChild ? 'Saving...' : actionLabel}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  useEffect(() => {
    // Hydrate locations
    api.foundation.getLocations()
      .then((locs) => {
        setDbLocations(locs || []);
      })
      .catch((err) => {
        console.error("Failed to load locations:", err);
        setDbLocations([]);
      });

    if (activeAppId === 'staff') {
      setIsLoadingStaff(true);
      Promise.all([
        api.foundation.getStaff(),
        api.foundation.getDepartments(),
        api.foundation.getRoles()
      ])
        .then(([staff, depts, roles]) => {
          const mapped = staff.map(s => {
            const name = s.user?.name || s.name || `Staff #${s.staff_number || s.id.substring(0, 8)}`;
            const role = s.designation || s.user?.role?.name || 'Staff';
            const primaryAssignment = s.user?.assignments?.find(a => a.is_primary) || s.user?.assignments?.[0];
            const deptName = primaryAssignment?.unit?.name || 'N/A';
            return {
              id: s.id,
              name,
              staff_number: s.staff_number || 'N/A',
              role,
              department: deptName,
              employment_type: s.employment_type || 'Full-time',
              status: s.status === 'active' ? 'Active' : s.status || 'Active',
              email: s.user?.email || 'N/A',
              phone: s.user?.phone || 'N/A',
              joinDate: s.joining_date || 'N/A',
              jobTitle: s.designation || 'Staff Member',
              reportingTo: s.reportingToUser?.name || 'N/A'
            };
          });
          setDbStaff(mapped);
        })
        .catch(err => {
          console.error("Failed to load staff from DB, falling back to mock:", err);
          setDbStaff([]);
        })
        .finally(() => {
          setIsLoadingStaff(false);
        });
    }

    if (activeAppId === 'students' || activeAppId === 'parents') {
      setIsLoadingStudents(true);
      setIsLoadingParents(true);
      Promise.all([
        api.foundation.getStudents(),
        api.foundation.getParents(),
        api.foundation.getLevels(),
        api.foundation.getGrades(),
        api.foundation.getSections(),
        api.foundation.getAcademicGroups(),
        api.foundation.getEnrollments()
      ])
        .then(([students, parents, levels, grades, classes, academicGroups, enrollments]) => {
          const mappedStudents = students.map(s => {
            const name = s.full_name || s.name || `${s.first_name || ''} ${s.last_name || ''}`.trim() || `Student #${s.student_id_number || s.student_number || s.id.substring(0, 8)}`;
            const studentNumber = s.student_id_number || s.student_number || 'N/A';
            
            // Resolve class mapping via active enrollment!
            const enrollment = enrollments.find(e => e && String(e.student_id) === String(s.id) && e.status === 'Active');
            const classId = enrollment?.class_id || s.class_id || s.class?.id;
            
            // Client-side relation resolution: find class in classes list to find academic group & grade
            const cls = classes.find(c => c && String(c.id) === String(classId));
            const className = cls ? (cls.custom_name || `Stream ${cls.stream}`) : (s.class?.custom_name || s.class?.stream || 'N/A');
            
            const academicGroupId = cls?.academic_group_id;
            const group = academicGroups.find(g => g && String(g.id) === String(academicGroupId));
            const gradeId = group?.grade_id || cls?.grade_id || s.class?.grade_id;
            
            const grade = grades.find(g => g && String(g.id) === String(gradeId));
            const levelId = grade?.level_id || s.class?.level_id;

            const parentName = s.parents && s.parents.length > 0
              ? s.parents.map(p => p.full_name || p.name || p.user?.name || `Parent #${p.id.substring(0, 8)}`).join(', ')
              : (s.parent?.full_name || s.parent?.name || s.parent?.user?.name || 'N/A');

            return {
              id: s.id,
              full_name: name,          // DB column name — used by form field id="full_name"
              name,                     // kept for grid/list display (column id: 'name')
              student_id_number: studentNumber,
              student_number: studentNumber,
              class: className,
              parent: parentName,
              status: s.status === 'active' ? 'Active' : s.status || 'Active',
              dob: s.dob || s.date_of_birth || 'N/A',
              gender: s.gender || 'N/A',
              admission_date: s.admission_date || 'N/A',
              blood_group: s.blood_group || 'N/A',
              nationality: s.nationality || 'N/A',
              residence: s.residence || '',
              allergies: s.allergies || '',
              classId,
              gradeId,
              levelId
            };
          });
          setDbStudents(mappedStudents);

          const mappedParents = parents.map(p => {
            const name = p.full_name || p.name || p.user?.name || `Parent #${p.id.substring(0, 8)}`;
            const phone = p.phone || p.user?.phone || 'N/A';
            const address = p.address || 'N/A';
            return {
              id: p.id,
              full_name: name,    // DB column — used by form field id="full_name"
              name,               // kept for grid/list display
              email: p.email || '',
              phone,
              occupation: p.occupation || '',
              address: p.address || '',
              province: address,
              status: 'Active'
            };
          });
          setDbParents(mappedParents);
          setDbLevels(levels);
          setDbClasses(classes);

          // Build Dynamic Student Hierarchy Tree
          const levelNodes = [];

          levels.forEach(lvl => {
            if (!lvl) return;
            const levelStudents = mappedStudents.filter(s => s && String(s.levelId) === String(lvl.id));
            const levelNode = {
              id: `level_${lvl.id}`,
              name: lvl.name,
              count: levelStudents.length,
              children: []
            };

            const levelGrades = grades.filter(g => g && String(g.level_id) === String(lvl.id));
            levelGrades.forEach(grd => {
              if (!grd) return;
              const gradeStudents = mappedStudents.filter(s => s && String(s.gradeId) === String(grd.id));
              const gradeNode = {
                id: `grade_${grd.id}`,
                name: grd.name,
                count: gradeStudents.length,
                children: []
              };

              const gradeClasses = classes.filter(c => {
                if (!c) return false;
                const group = academicGroups.find(g => g && String(g.id) === String(c.academic_group_id));
                return (group && String(group.grade_id) === String(grd.id)) || String(c.grade_id) === String(grd.id);
              });

              gradeClasses.forEach(c => {
                if (!c) return;
                const classStudents = mappedStudents.filter(s => s && String(s.classId) === String(c.id));
                gradeNode.children.push({
                  id: `class_${c.id}`,
                  name: c.custom_name || `Stream ${c.stream}`,
                  count: classStudents.length
                });
              });

              levelNode.children.push(gradeNode);
            });

            levelNodes.push(levelNode);
          });

          setDbStudentHierarchy(levelNodes);
        })
        .catch(err => {
          console.error("Failed to load student explorer data:", err);
          setDbStudents([]);
          setDbParents([]);
          setDbStudentHierarchy([]);
        })
        .finally(() => {
          setIsLoadingStudents(false);
          setIsLoadingParents(false);
        });
    }
  }, [activeAppId, reloadTrigger]);

  // Reset steps/tabs and detail state when page or selected entity changes
  useEffect(() => {
    setActiveStep(0);
    setActiveTab(0);
    setDetailMode('view');
    setFormData({});
  }, [activePageId, activeEntityId]);

  // 1. Handle Generic Sub-Pages and View-based form pages
  if (activeFormPage) {
    let meta = activeFormPage.metadata || {};
    if (activeAppId === 'students' && meta.tabs) {
      meta = JSON.parse(JSON.stringify(meta));
      meta.tabs.forEach(tab => {
        if (tab.sections) {
          tab.sections.forEach(section => {
            if (section.fields) {
              section.fields.forEach(field => {
                if (field.id === 'parent' && field.discoveryType === 'parent') {
                  field.options = dbParents.map(p => ({
                    name: p.name,
                    phone: p.phone || 'N/A'
                  }));
                }
                if (field.id === 'level' && field.discoveryType === 'level') {
                  field.options = dbLevels.map(l => ({
                    name: l.name,
                    category: l.category || 'Standard'
                  }));
                }
                if (field.id === 'class' && field.discoveryType === 'class') {
                  field.options = dbClasses.map(c => ({
                    name: c.custom_name || `Stream ${c.stream}`,
                    level: c.level_id || 'N/A'
                  }));
                }
              });
            }
          });
        }
      });
    }
    const tabs = meta.tabs || [];
    const currentTab = tabs[activeTab];
    const currentTabId = currentTab && typeof currentTab === 'object' ? currentTab.id : (typeof currentTab === 'string' ? currentTab : '');

    let formContent = null;
    if (activeAppId === 'staff') {
      if (currentTabId === 'Work') {
        formContent = <StaffWorkForm data={formData} onChange={(id, val) => setFormData(prev => ({ ...prev, [id]: val }))} readOnly={false} />;
      } else if (currentTabId === 'Resume') {
        formContent = <StaffResumeForm data={formData} onChange={(id, val) => setFormData(prev => ({ ...prev, [id]: val }))} readOnly={false} />;
      } else if (currentTabId === 'Personal') {
        formContent = <StaffPersonalForm data={formData} onChange={(id, val) => setFormData(prev => ({ ...prev, [id]: val }))} readOnly={false} />;
      } else if (currentTabId === 'Payroll') {
        formContent = <StaffPayrollForm data={formData} onChange={(id, val) => setFormData(prev => ({ ...prev, [id]: val }))} readOnly={false} />;
      }
    } else {
      if (currentTab && typeof currentTab === 'object') {
        formContent = (
          <DynamicForm 
            sections={currentTab.sections}
            data={formData}
            onChange={(id, val) => setFormData((prev) => ({ ...prev, [id]: val }))}
          />
        );
      } else {
        formContent = (
          <Box sx={{ p: 4, border: '2px dashed', borderColor: 'divider', borderRadius: 2, textAlign: 'center' }}>
             <Typography color="text.disabled">No form sections defined for this tab.</Typography>
          </Box>
        );
      }
    }

    const handleSave = () => {
      if (activeAppId === 'staff') {
        const savePayload = {
          name: formData.name,
          designation: formData.jobTitle || 'Staff Member',
          joining_date: formData.joinDate || new Date().toISOString().split('T')[0],
          employment_type: formData.employeeType || 'Full-time',
          status: 'active',
          user: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            role: { name: formData.jobTitle || 'Staff Member' }
          },
          department_id: formData.department === 'Administration' ? 1 : formData.department === 'Academic' ? 2 : 3,
          department: formData.department,
          reportingTo: formData.reportingTo,
          address: formData.address,
          bank_account: formData.bankAccount || formData.bank_account,
          nationality: formData.nationality,
          national_id: formData.nationalId || formData.national_id,
          basic_salary: formData.basicSalary,
          housing_allowance: formData.housingAllowance,
          transport_allowance: formData.transportAllowance,
          responsibility_allowance: formData.responsibilityAllowance,
          rssb_enabled: formData.rssbEnabled,
          rama_enabled: formData.ramaEnabled,
          bank_name: formData.bankName,
        };

        api.foundation.createEntity('staff', savePayload)
          .then((res) => {
            const newStaffObj = {
              id: res.data?.id || String(Date.now()),
              name: formData.name || 'Unnamed Staff',
              staff_number: res.data?.staff_number || `STF-${Math.floor(1000 + Math.random() * 9000)}`,
              role: formData.jobTitle || 'Staff Member',
              department: formData.department || 'N/A',
              reportingTo: formData.reportingTo || 'N/A',
              employment_type: formData.employeeType || 'Full-time',
              status: 'Active',
              email: formData.email || 'N/A',
              phone: formData.phone || 'N/A',
              joinDate: formData.joinDate || new Date().toISOString().split('T')[0],
            };
            setDbStaff(prev => [newStaffObj, ...prev]);
            navigate('/staff/all');
          })
          .catch(err => {
            console.error("Failed to save staff member, fallback:", err);
            const newStaffObj = {
              id: String(Date.now()),
              name: formData.name || 'Unnamed Staff',
              staff_number: `STF-${Math.floor(1000 + Math.random() * 9000)}`,
              role: formData.jobTitle || 'Staff Member',
              department: formData.department || 'N/A',
              reportingTo: formData.reportingTo || 'N/A',
              employment_type: formData.employeeType || 'Full-time',
              status: 'Active',
              email: formData.email || 'N/A',
              phone: formData.phone || 'N/A',
              joinDate: formData.joinDate || new Date().toISOString().split('T')[0],
            };
            setDbStaff(prev => [newStaffObj, ...prev]);
            navigate('/staff/all');
          });
      } else if (activeAppId === 'students' || activeAppId === 'parents') {
        const type = activeAppId === 'parents' ? 'parents' : 'students';
        api.foundation.createEntity(type, formData)
          .then((res) => {
            alert(`${type === 'parents' ? 'Parent' : 'Student'} successfully created!`);
            setReloadTrigger(prev => prev + 1);
            navigate(-1);
          })
          .catch((err) => {
            console.error(`Failed to create ${type}:`, err);
            alert(`Failed to save online. Navigating back.`);
            navigate(-1);
          });
      } else {
        console.log('Saving generic form', activeFormPage.id, formData);
        navigate(-1);
      }
    };

    return (
      <DataEntryEngine 
        title={activeFormPage.name}
        steps={meta.steps || []}
        activeStep={activeStep}
        onStepClick={setActiveStep}
        tabs={tabs.map((t) => (typeof t === 'string' ? t : t.id))}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        headerFields={meta.headerFields || []}
        data={formData}
        onDataChange={(id, val) => setFormData((prev) => ({ ...prev, [id]: val }))}
        onBack={() => navigate(-1)}
        onSave={handleSave}
        saveLabel={activeFormPage.type === 'form' ? `Finish & Save` : 'Save'}
      >
        <Box sx={{ py: 2 }}>
          {formContent}
        </Box>
      </DataEntryEngine>
    );
  }

  // 2. Handle Students App (Exploration View)
  if (activeAppId === 'students') {
    const viewIdFromUrl = activePageId || app.defaultView;
    
    let displayData = dbStudents;
    let displayColumns = studentColumns;
    let displayGridFields = studentGridFields;
    let displayTitle = "Students";

    if (viewIdFromUrl === 'parents') {
      displayData = dbParents;
      displayTitle = "Parents";
      displayColumns = [
        { id: 'name', label: 'Parent Name' },
        { id: 'phone', label: 'Phone' },
        { id: 'location', label: 'Location' }
      ];
    } else if (viewIdFromUrl === 'enroll') {
      displayData = enrollmentList;
      displayTitle = "Admissions";
      displayColumns = [
        { id: 'name', label: 'Applicant' },
        { id: 'date', label: 'Date' },
        { id: 'level', label: 'Applied Level' },
        { 
          id: 'status', 
          label: 'Status',
          render: (s) => (
            <Chip 
              label={s.status} 
              size="small" 
              color={s.status === 'Review' ? 'secondary' : 'default'} 
              sx={{ fontSize: '10px', fontWeight: 700 }}
            />
          )
        }
      ];
    }

    const studentNewSubPage = app.subPages?.find((p) => p.id === 'new');
    const parentApp = appRegistry.find((a) => a.id === 'parents');
    const parentNewSubPage = parentApp?.subPages?.find((p) => p.id === 'new');
    let detailsMetadata = null;
    const rawDetailsMeta = viewIdFromUrl === 'parents'
      ? parentNewSubPage?.metadata || null
      : studentNewSubPage?.metadata || null;

    if (rawDetailsMeta) {
      detailsMetadata = JSON.parse(JSON.stringify(rawDetailsMeta));
      if (activeAppId === 'students' && detailsMetadata.tabs) {
        detailsMetadata.tabs.forEach(tab => {
          if (tab.sections) {
            tab.sections.forEach(section => {
              if (section.fields) {
                section.fields.forEach(field => {
                  if (field.id === 'parent' && field.discoveryType === 'parent') {
                    field.options = dbParents.map(p => ({
                      name: p.name,
                      phone: p.phone || 'N/A'
                    }));
                  }
                  if (field.id === 'level' && field.discoveryType === 'level') {
                    field.options = dbLevels.map(l => ({
                      name: l.name,
                      category: l.category || 'Standard'
                    }));
                  }
                  if (field.id === 'class' && field.discoveryType === 'class') {
                    field.options = dbClasses.map(c => ({
                      name: c.custom_name || `Stream ${c.stream}`,
                      level: c.level_id || 'N/A'
                    }));
                  }
                });
              }
            });
          }
        });
      }
    }

    if (activeEntityId) {
      const entity = displayData.find((item) => String(item.id) === String(activeEntityId));
      if (!entity) {
        return (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">Record not found.</Typography>
          </Box>
        );
      }

      const initialEntityData = Object.keys(formData).length > 0 ? formData : entity;
      const isEditing = detailMode === 'edit';

      if (detailsMetadata) {
        const tabs = detailsMetadata.tabs || [];
        const currentTab = tabs[activeTab];
        const sections = currentTab && typeof currentTab === 'object' ? currentTab.sections || [] : [];

        return (
          <DataEntryEngine
            title={`${displayTitle} Details`}
            steps={isEditing ? detailsMetadata.steps || [] : []}
            activeStep={activeStep}
            onStepClick={setActiveStep}
            tabs={tabs.map((t) => (typeof t === 'string' ? t : t.id || t.title || ''))}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            headerFields={detailsMetadata.headerFields || []}
            data={initialEntityData}
            onDataChange={(id, val) => setFormData((prev) => ({ ...prev, [id]: val }))}
            onBack={() => navigate(`/${activeAppId}/${viewIdFromUrl}`)}
            onSave={async () => {
              if (!isEditing) {
                setDetailMode('edit');
                setFormData({ ...entity, ...formData });
                return;
              }
              try {
                const type = viewIdFromUrl === 'parents' ? 'parents' : 'students';
                await api.foundation.updateEntity(type, activeEntityId, formData);
                alert(`${viewIdFromUrl === 'parents' ? 'Parent' : 'Student'} successfully updated!`);
                
                setReloadTrigger(prev => prev + 1);
                setDetailMode('view');
              } catch (err) {
                console.error("Failed to update entity:", err);
                alert("Failed to save changes. Please make sure the backend is running.");
              }
            }}
            saveLabel={isEditing ? 'Update' : 'Edit'}
          >
            <Box sx={{ py: 2 }}>
              <DynamicForm
                sections={sections}
                data={initialEntityData}
                onChange={(id, val) => setFormData((prev) => ({ ...prev, [id]: val }))}
                readOnly={!isEditing}
              />
            </Box>
          </DataEntryEngine>
        );
      }

      const detailFields = displayGridFields.map((field) => ({
        id: field.id,
        label: field.label,
        type: field.type || 'text',
        placeholder: field.label,
      }));

      return (
        <DataEntryEngine
          title={`${displayTitle} Details`}
          steps={[]}
          activeStep={activeStep}
          onStepClick={setActiveStep}
          tabs={[]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          headerFields={displayGridFields}
          data={initialEntityData}
          onDataChange={(id, val) => setFormData((prev) => ({ ...prev, [id]: val }))}
          onBack={() => navigate(`/${activeAppId}/${viewIdFromUrl}`)}
          onSave={() => {
            if (!isEditing) {
              setDetailMode('edit');
              return;
            }
            console.log('Updating', activeAppId, activeEntityId, formData);
            setDetailMode('view');
          }}
          saveLabel={isEditing ? 'Update' : 'Edit'}
        >
          <Box sx={{ py: 2 }}>
            <DynamicForm
              sections={[{ id: 'details', title: 'Details', fields: detailFields }]}
              data={initialEntityData}
              onChange={(id, val) => setFormData((prev) => ({ ...prev, [id]: val }))}
              readOnly={!isEditing}
            />
          </Box>
        </DataEntryEngine>
      );
    }

    let onAddClick = () => navigate(`/${activeAppId}/new`);
    let addButtonLabel = app.subPages?.find(p => p.id === 'new')?.name || "New";

    if (viewIdFromUrl === 'parents') {
      onAddClick = () => navigate(`/parents/new`);
      addButtonLabel = "Register Parent";
    }

    return (
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%' }}>
        <ModuleExplorer 
          title={displayTitle}
          hierarchy={dbStudentHierarchy}
          data={displayData}
          columns={displayColumns}
          gridFields={studentGridFields}
          onAddClick={onAddClick}
          onItemClick={(item) => navigate(`/${activeAppId}/${viewIdFromUrl}/${item.id}`)}
          addButtonLabel={addButtonLabel}
          onAddChildClick={handleAddChildClick}
          canAddChild={(node, depth) => depth < 2}
        />
        {renderAddChildDialog()}
      </Box>
    );
  }

  // 2b. Handle Staff App (Exploration & Onboarding View)
  if (activeAppId === 'staff') {
    const viewIdFromUrl = activePageId || app.defaultView;
    const displayData = dbStaff.length > 0 ? dbStaff : mockStaffList;
    const displayTitle = "Staff Members";

    const staffGridFields = [
      { id: 'name', label: 'Name', isPrimary: true },
      { id: 'role', label: 'Role' },
      { id: 'department', label: 'Department' },
    ];

    const staffColumns = [
      { 
        id: 'name', 
        label: 'Staff Name',
        render: (s) => (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: 'primary.main' }}>{s.name[0]}</Avatar>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>{s.name}</Typography>
          </Stack>
        )
      },
      { id: 'staff_number', label: 'Staff ID' },
      { id: 'role', label: 'Role' },
      { id: 'department', label: 'Department' },
      { id: 'employment_type', label: 'Type' },
      { 
        id: 'status', 
        label: 'Status',
        render: (s) => (
          <Chip 
            label={s.status} 
            size="small" 
            color={s.status === 'Active' ? 'success' : 'warning'} 
            sx={{ fontSize: '10px', fontWeight: 700 }}
          />
        )
      }
    ];

    const onboardingSubPage = app.subPages?.find((p) => p.id === 'new');
    const detailsMetadata = onboardingSubPage?.metadata || null;

    if (activeEntityId) {
      const entity = displayData.find((item) => String(item.id) === String(activeEntityId));
      if (!entity) {
        return (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">Staff member not found.</Typography>
          </Box>
        );
      }

      const initialEntityData = Object.keys(formData).length > 0 ? formData : entity;
      const isEditing = detailMode === 'edit';

      if (detailsMetadata) {
        const tabs = detailsMetadata.tabs || [];
        const currentTab = tabs[activeTab];
        const sections = currentTab && typeof currentTab === 'object' ? currentTab.sections || [] : [];
        const currentTabId = currentTab && typeof currentTab === 'object' ? currentTab.id : (typeof currentTab === 'string' ? currentTab : '');

        let formContent = null;
        if (activeAppId === 'staff') {
          if (currentTabId === 'Work') {
            formContent = <StaffWorkForm data={initialEntityData} onChange={(id, val) => setFormData(prev => ({ ...prev, [id]: val }))} readOnly={!isEditing} />;
          } else if (currentTabId === 'Resume') {
            formContent = <StaffResumeForm data={initialEntityData} onChange={(id, val) => setFormData(prev => ({ ...prev, [id]: val }))} readOnly={!isEditing} />;
          } else if (currentTabId === 'Personal') {
            formContent = <StaffPersonalForm data={initialEntityData} onChange={(id, val) => setFormData(prev => ({ ...prev, [id]: val }))} readOnly={!isEditing} />;
          } else if (currentTabId === 'Payroll') {
            formContent = <StaffPayrollForm data={initialEntityData} onChange={(id, val) => setFormData(prev => ({ ...prev, [id]: val }))} readOnly={!isEditing} />;
          }
        } else {
          formContent = (
            <DynamicForm
              sections={sections}
              data={initialEntityData}
              onChange={(id, val) => setFormData((prev) => ({ ...prev, [id]: val }))}
              readOnly={!isEditing}
            />
          );
        }

        return (
          <DataEntryEngine
            title="Staff Member Profile"
            steps={isEditing ? detailsMetadata.steps || [] : []}
            activeStep={activeStep}
            onStepClick={setActiveStep}
            tabs={tabs.map((t) => (typeof t === 'string' ? t : t.id || t.title || ''))}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            headerFields={detailsMetadata.headerFields || []}
            data={initialEntityData}
            onDataChange={(id, val) => setFormData((prev) => ({ ...prev, [id]: val }))}
            onBack={() => navigate(`/${activeAppId}/${viewIdFromUrl}`)}
            onSave={() => {
              if (!isEditing) {
                setDetailMode('edit');
                setFormData({ ...entity, ...formData });
                return;
              }
              const updatedStaff = {
                ...entity,
                ...formData,
              };
              if (activeAppId === 'staff') {
                const savePayload = {
                  name: formData.name || entity.name,
                  designation: formData.jobTitle || entity.role || 'Staff Member',
                  joining_date: formData.joinDate || entity.joinDate || new Date().toISOString().split('T')[0],
                  employment_type: formData.employeeType || entity.employment_type || 'Full-time',
                  status: 'active',
                  user: {
                    name: formData.name || entity.name,
                    email: formData.email || entity.email,
                    phone: formData.phone || entity.phone,
                    role: { name: formData.jobTitle || entity.role || 'Staff Member' }
                  },
                  department_id: formData.department === 'Administration' ? 1 : formData.department === 'Academic' ? 2 : 3,
                  address: formData.address || entity.address,
                  bank_account: formData.bankAccount || formData.bank_account || entity.bankAccount || entity.bank_account,
                  nationality: formData.nationality || entity.nationality,
                  national_id: formData.nationalId || formData.national_id || entity.nationalId || entity.national_id,
                  basic_salary: formData.basicSalary || entity.basicSalary,
                  housing_allowance: formData.housingAllowance || entity.housingAllowance,
                  transport_allowance: formData.transportAllowance || entity.transportAllowance,
                  responsibility_allowance: formData.responsibilityAllowance || entity.responsibilityAllowance,
                  rssb_enabled: formData.rssbEnabled !== undefined ? formData.rssbEnabled : entity.rssbEnabled,
                  rama_enabled: formData.ramaEnabled !== undefined ? formData.ramaEnabled : entity.ramaEnabled,
                  bank_name: formData.bankName || entity.bankName,
                };

                api.foundation.updateEntity('staff', activeEntityId, savePayload)
                  .then(() => {
                    setDbStaff(prev => prev.map(s => s.id === activeEntityId ? { ...s, ...updatedStaff } : s));
                    setDetailMode('view');
                  })
                  .catch(err => {
                    console.error("Failed to update staff member in backend:", err);
                    setDbStaff(prev => prev.map(s => s.id === activeEntityId ? { ...s, ...updatedStaff } : s));
                    setDetailMode('view');
                  });
              } else {
                setDbStaff(prev => prev.map(s => s.id === activeEntityId ? updatedStaff : s));
                setDetailMode('view');
              }
            }}
            saveLabel={isEditing ? 'Update' : 'Edit'}
          >
            <Box sx={{ py: 2 }}>
              {formContent}
            </Box>
          </DataEntryEngine>
        );
      }

      // Fallback details if metadata is not resolved
      const detailFields = staffGridFields.map((field) => ({
        id: field.id,
        label: field.label,
        type: field.type || 'text',
        placeholder: field.label,
      }));

      return (
        <DataEntryEngine
          title="Staff Details"
          steps={[]}
          activeStep={activeStep}
          onStepClick={setActiveStep}
          tabs={[]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          headerFields={staffGridFields}
          data={initialEntityData}
          onDataChange={(id, val) => setFormData((prev) => ({ ...prev, [id]: val }))}
          onBack={() => navigate(`/${activeAppId}/${viewIdFromUrl}`)}
          onSave={() => {
            if (!isEditing) {
              setDetailMode('edit');
              return;
            }
            console.log('Updating Staff', activeEntityId, formData);
            setDetailMode('view');
          }}
          saveLabel={isEditing ? 'Update' : 'Edit'}
        >
          <Box sx={{ py: 2 }}>
            <DynamicForm
              sections={[{ id: 'details', title: 'Details', fields: detailFields }]}
              data={initialEntityData}
              onChange={(id, val) => setFormData((prev) => ({ ...prev, [id]: val }))}
              readOnly={!isEditing}
            />
          </Box>
        </DataEntryEngine>
      );
    }

    const onAddClick = () => navigate(`/${activeAppId}/new`);
    const addButtonLabel = "Onboard Staff";

    return (
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%' }}>
        <ModuleExplorer 
          title={displayTitle}
          hierarchy={staffHierarchy}
          data={displayData}
          columns={staffColumns}
          gridFields={staffGridFields}
          onAddClick={onAddClick}
          onItemClick={(item) => navigate(`/${activeAppId}/${viewIdFromUrl}/${item.id}`)}
          addButtonLabel={addButtonLabel}
          onAddChildClick={handleAddChildClick}
          canAddChild={(node, depth) => depth < 1}
        />
        {renderAddChildDialog()}
      </Box>
    );
  }

  // 3b. Handle Payroll App (Exploration & Payouts View)
  if (activeAppId === 'payroll') {
    const viewIdFromUrl = activePageId || app.defaultView;
    let displayTitle = "Monthly Payroll";
    let displayHierarchy = payrollHierarchy;
    let displayData = mockMonthlyPayrollList;
    let displayColumns = [];
    let displayGridFields = [
      { id: 'name', label: 'Name', isPrimary: true },
      { id: 'role', label: 'Role' },
      { id: 'department', label: 'Department' },
    ];

    const monthlyColumns = [
      {
        id: 'name',
        label: 'Staff Name',
        render: (s) => (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: 'primary.main' }}>{s.name[0]}</Avatar>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>{s.name}</Typography>
          </Stack>
        )
      },
      { id: 'role', label: 'Role' },
      { id: 'department', label: 'Department' },
      { 
        id: 'grossSalary', 
        label: 'Gross Salary', 
        render: (s) => `${s.grossSalary.toLocaleString()} RWF` 
      },
      { 
        id: 'deductions', 
        label: 'Deductions', 
        render: (s) => `-${s.deductions.toLocaleString()} RWF` 
      },
      { 
        id: 'netSalary', 
        label: 'Net Pay', 
        render: (s) => (
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
            {s.netSalary.toLocaleString()} RWF
          </Typography>
        )
      },
      {
        id: 'status',
        label: 'Status',
        render: (s) => (
          <Chip 
            label={s.status} 
            size="small" 
            color={s.status === 'Paid' ? 'success' : 'warning'} 
            sx={{ fontSize: '10px', fontWeight: 700 }}
          />
        )
      }
    ];

    const structuresColumns = [
      { id: 'name', label: 'Component Name' },
      { id: 'type', label: 'Type' },
      { id: 'calculationType', label: 'Calculation' },
      { id: 'value', label: 'Rate/Value' },
      { id: 'status', label: 'Status', render: (c) => <Chip label={c.status} size="small" color={c.status === 'Active' ? 'success' : 'default'} sx={{ fontSize: '10px', fontWeight: 700 }} /> },
      { id: 'description', label: 'Description' }
    ];

    const advanceColumns = [
      {
        id: 'name',
        label: 'Staff Name',
        render: (s) => (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: 'secondary.main' }}>{s.name[0]}</Avatar>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>{s.name}</Typography>
          </Stack>
        )
      },
      { id: 'role', label: 'Role' },
      { id: 'amount', label: 'Requested Amount', render: (s) => `${s.amount.toLocaleString()} RWF` },
      { id: 'monthlyDeduction', label: 'Monthly Repay', render: (s) => `${s.monthlyDeduction.toLocaleString()} RWF` },
      { id: 'term', label: 'Term' },
      { id: 'remaining', label: 'Remaining Balance', render: (s) => `${s.remaining.toLocaleString()} RWF` },
      { 
        id: 'status', 
        label: 'Status', 
        render: (s) => (
          <Chip 
            label={s.status} 
            size="small" 
            color={s.status === 'Active Repayments' ? 'success' : s.status === 'Pending Requests' ? 'warning' : 'default'} 
            sx={{ fontSize: '10px', fontWeight: 700 }} 
          />
        ) 
      }
    ];

    const statutoryColumns = [
      { id: 'name', label: 'Declaration Filing' },
      { id: 'type', label: 'Filing Category' },
      { id: 'period', label: 'Period' },
      { id: 'declarantsCount', label: 'Declarants' },
      { id: 'totalGrossContribution', label: 'Gross Declared' },
      { id: 'employerShare', label: 'Employer Contribution' },
      { id: 'employeeShare', label: 'Employee Contribution' },
      { 
        id: 'status', 
        label: 'Filing Status', 
        render: (s) => (
          <Chip 
            label={s.status} 
            size="small" 
            color={s.status.includes('Paid') ? 'success' : s.status.includes('Declared') ? 'info' : 'warning'} 
            sx={{ fontSize: '10px', fontWeight: 700 }} 
          />
        ) 
      }
    ];

    if (viewIdFromUrl === 'monthly') {
      displayTitle = "Monthly Payroll Payouts";
      displayHierarchy = payrollHierarchy;
      displayData = mockMonthlyPayrollList;
      displayColumns = monthlyColumns;
    } else if (viewIdFromUrl === 'structures') {
      displayTitle = "Salary Structures & Components";
      displayHierarchy = structuresHierarchy;
      displayData = mockStructuresList;
      displayColumns = structuresColumns;
      displayGridFields = [
        { id: 'name', label: 'Component', isPrimary: true },
        { id: 'type', label: 'Type' },
        { id: 'calculationType', label: 'Calculation' },
      ];
    } else if (viewIdFromUrl === 'advance') {
      displayTitle = "Salary Advance Requests";
      displayHierarchy = advanceHierarchy;
      displayData = mockAdvanceList;
      displayColumns = advanceColumns;
      displayGridFields = [
        { id: 'name', label: 'Name', isPrimary: true },
        { id: 'amount', label: 'Amount' },
        { id: 'status', label: 'Status' },
      ];
    } else if (viewIdFromUrl === 'statutory') {
      displayTitle = "Statutory Compliance Declarants";
      displayHierarchy = statutoryHierarchy;
      displayData = mockStatutoryList;
      displayColumns = statutoryColumns;
      displayGridFields = [
        { id: 'name', label: 'Declaration', isPrimary: true },
        { id: 'period', label: 'Period' },
        { id: 'status', label: 'Status' },
      ];
    }

    if (activeEntityId) {
      if (viewIdFromUrl === 'monthly') {
        const entity = displayData.find((item) => String(item.id) === String(activeEntityId));
        if (!entity) {
          return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">Payslip not found.</Typography>
            </Box>
          );
        }

        const initialEntityData = Object.keys(formData).length > 0 ? formData : entity;
        const isEditing = detailMode === 'edit';

        return (
          <DataEntryEngine
            title="Payslip & Payroll Details"
            steps={[]}
            activeStep={0}
            onStepClick={() => {}}
            tabs={["Payroll Details"]}
            activeTab={0}
            onTabChange={() => {}}
            headerFields={[
              { id: 'name', label: 'Staff Legal Name', isPrimary: true },
              { id: 'role', label: 'Designation' },
              { id: 'department', label: 'Department' }
            ]}
            data={initialEntityData}
            onDataChange={(id, val) => setFormData((prev) => ({ ...prev, [id]: val }))}
            onBack={() => navigate(`/${activeAppId}/${viewIdFromUrl}`)}
            onSave={() => {
              if (!isEditing) {
                setDetailMode('edit');
                setFormData({ ...entity, ...formData });
                return;
              }
              const basic = parseFloat(formData.basicSalary !== undefined ? formData.basicSalary : entity.basicSalary) || 0;
              const housing = parseFloat(formData.housingAllowance !== undefined ? formData.housingAllowance : entity.housingAllowance) || 0;
              const transport = parseFloat(formData.transportAllowance !== undefined ? formData.transportAllowance : entity.transportAllowance) || 0;
              const responsibility = parseFloat(formData.responsibilityAllowance !== undefined ? formData.responsibilityAllowance : entity.responsibilityAllowance) || 0;
              const other = parseFloat(formData.otherAllowance !== undefined ? formData.otherAllowance : entity.otherAllowance) || 0;
              
              const statutoryConfig = {
                rssbEnabled: formData.rssbEnabled !== undefined ? formData.rssbEnabled : entity.rssbEnabled,
                ramaEnabled: formData.ramaEnabled !== undefined ? formData.ramaEnabled : entity.ramaEnabled,
              };

              const calculated = calculatePayslip(basic, { housing, transport, responsibility, other }, statutoryConfig);
              const updatedPayslip = {
                ...entity,
                ...formData,
                ...calculated
              };

              const idx = mockMonthlyPayrollList.findIndex(s => String(s.id) === String(activeEntityId));
              if (idx !== -1) {
                mockMonthlyPayrollList[idx] = updatedPayslip;
              }
              setDetailMode('view');
            }}
            saveLabel={isEditing ? 'Update' : 'Edit'}
          >
            <Box sx={{ py: 2 }}>
              <StaffPayrollForm 
                data={initialEntityData} 
                onChange={(id, val) => setFormData(prev => ({ ...prev, [id]: val }))} 
                readOnly={!isEditing} 
              />
            </Box>
          </DataEntryEngine>
        );
      }
      
      // Fallback detail card for structures, advances, statutory
      const entity = displayData.find((item) => String(item.id) === String(activeEntityId));
      if (entity) {
        const detailFields = displayGridFields.map((field) => ({
          id: field.id,
          label: field.label,
          type: 'text'
        }));
        return (
          <DataEntryEngine
            title={`${displayTitle} Details`}
            steps={[]}
            activeStep={0}
            onStepClick={() => {}}
            tabs={[]}
            activeTab={0}
            onTabChange={() => {}}
            headerFields={displayGridFields}
            data={entity}
            onDataChange={() => {}}
            onBack={() => navigate(`/${activeAppId}/${viewIdFromUrl}`)}
            onSave={() => navigate(`/${activeAppId}/${viewIdFromUrl}`)}
            saveLabel="Ok"
          >
            <Box sx={{ py: 2 }}>
              <DynamicForm
                sections={[{ id: 'details', title: 'Details', fields: detailFields }]}
                data={entity}
                onChange={() => {}}
                readOnly={true}
              />
            </Box>
          </DataEntryEngine>
        );
      }
    }

    const onAddClick = () => {
      alert(`Action 'New ${displayTitle}' triggered! In production, this launches the standard Creation Drawer.`);
    };

    return (
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%' }}>
        <ModuleExplorer 
          title={displayTitle}
          hierarchy={displayHierarchy}
          data={displayData}
          columns={displayColumns}
          gridFields={displayGridFields}
          onAddClick={onAddClick}
          onItemClick={(item) => navigate(`/${activeAppId}/${viewIdFromUrl}/${item.id}`)}
          addButtonLabel={`New ${viewIdFromUrl === 'monthly' ? 'Run' : viewIdFromUrl === 'structures' ? 'Component' : 'Request'}`}
          onAddChildClick={handleAddChildClick}
          canAddChild={() => false}
        />
        {renderAddChildDialog()}
      </Box>
    );
  }

  // 3. Handle Parents App
  if (activeAppId === 'parents') {
    const parentGridFields = [
      { id: 'name', label: 'Name', isPrimary: true },
      { id: 'phone', label: 'Phone' },
      { id: 'province', label: 'Province' },
    ];
    const parentColumns = [
      { 
        id: 'name', 
        label: 'Guardian Name',
        render: (p) => (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: 'secondary.main' }}>{p.name[0]}</Avatar>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>{p.name}</Typography>
          </Stack>
        )
      },
      { id: 'phone', label: 'Phone' },
      { id: 'email', label: 'Email' },
      { id: 'province', label: 'Province' },
      { 
        id: 'children', 
        label: 'Children',
        render: (p) => (
          <Chip label={p.children} size="small" sx={{ fontSize: '10px', fontWeight: 700, minWidth: 28 }} />
        )
      }
    ];

    if (activeEntityId) {
      const entity = allParentsList.find((item) => String(item.id) === String(activeEntityId));
      if (!entity) {
        return (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">Record not found.</Typography>
          </Box>
        );
      }

      const parentNewSubPage = app.subPages?.find((p) => p.id === 'new');
      const detailsMetadata = parentNewSubPage?.metadata || null;
      const initialEntityData = Object.keys(formData).length > 0 ? formData : entity;
      const isEditing = detailMode === 'edit';

      if (detailsMetadata) {
        const tabs = detailsMetadata.tabs || [];
        const currentTab = tabs[activeTab];
        const sections = currentTab && typeof currentTab === 'object' ? currentTab.sections || [] : [];

        return (
          <DataEntryEngine
            title={`Guardian Details`}
            steps={isEditing ? detailsMetadata.steps || [] : []}
            activeStep={activeStep}
            onStepClick={setActiveStep}
            tabs={tabs.map((t) => (typeof t === 'string' ? t : t.id || t.title || ''))}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            headerFields={detailsMetadata.headerFields || []}
            data={initialEntityData}
            onDataChange={(id, val) => setFormData((prev) => ({ ...prev, [id]: val }))}
            onBack={() => navigate(`/${activeAppId}`)}
            onSave={() => {
              if (!isEditing) {
                setDetailMode('edit');
                return;
              }
              console.log('Updating parent', activeEntityId, formData);
              setDetailMode('view');
            }}
            saveLabel={isEditing ? 'Update' : 'Edit'}
          >
            <Box sx={{ py: 2 }}>
              <DynamicForm
                sections={sections}
                data={initialEntityData}
                onChange={(id, val) => setFormData((prev) => ({ ...prev, [id]: val }))}
                readOnly={!isEditing}
              />
            </Box>
          </DataEntryEngine>
        );
      }

      const detailFields = parentGridFields.map((field) => ({
        id: field.id,
        label: field.label,
        type: field.type || 'text',
        placeholder: field.label,
      }));

      return (
        <DataEntryEngine
          title={`Guardian Details`}
          steps={[]}
          activeStep={activeStep}
          onStepClick={setActiveStep}
          tabs={[]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          headerFields={parentGridFields}
          data={initialEntityData}
          onDataChange={(id, val) => setFormData((prev) => ({ ...prev, [id]: val }))}
          onBack={() => navigate(`/${activeAppId}`)}
          onSave={() => {
            if (!isEditing) {
              setDetailMode('edit');
              return;
            }
            console.log('Updating parent', activeEntityId, formData);
            setDetailMode('view');
          }}
          saveLabel={isEditing ? 'Update' : 'Edit'}
        >
          <Box sx={{ py: 2 }}>
            <DynamicForm
              sections={[{ id: 'details', title: 'Details', fields: detailFields }]}
              data={initialEntityData}
              onChange={(id, val) => setFormData((prev) => ({ ...prev, [id]: val }))}
              readOnly={!isEditing}
            />
          </Box>
        </DataEntryEngine>
      );
    }

    return (
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%' }}>
        <ModuleExplorer 
          title="Parents & Guardians"
          hierarchy={parentHierarchy}
          data={allParentsList}
          columns={parentColumns}
          gridFields={parentGridFields}
          onAddClick={() => navigate('/parents/new')}
          onItemClick={(item) => navigate(`/${activeAppId}/${app.defaultView}/${item.id}`)}
          addButtonLabel="Register Parent"
        />
        {renderAddChildDialog()}
      </Box>
    );
  }

  // Fallback for other apps
  const viewIdFromUrl = activePageId || app.defaultView;
  const currentView = app.views.find(v => v.id === viewIdFromUrl);
  const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);
  const viewLabel = currentView?.label || capitalize(viewIdFromUrl);

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Card variant="outlined" sx={{ minHeight: 400, borderRadius: 2 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 400 }}>
          <Typography variant="h5" color="text.primary" gutterBottom>
            {app.name} - {viewLabel}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Internal content placeholder.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}


