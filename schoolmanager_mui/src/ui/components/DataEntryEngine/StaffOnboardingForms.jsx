import React, { useState, useEffect } from 'react';
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  Button,
  IconButton,
  Switch,
  Paper,
  LinearProgress,
  Avatar,
  Typography,
  Autocomplete,
  createFilterOptions,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import {
  FolderOpen as FileTextIcon,
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  People as UsersIcon,
  Calculate as CalcIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import DiscoveryModal from './DiscoveryModal';
import { api } from '@/services';

const SLATE_800 = '#1e293b';
const SLATE_700 = '#334155';
const SLATE_400 = '#94a3b8';
const SLATE_300 = '#cbd5e1';
const SLATE_200 = '#e2e8f0';
const SLATE_100 = '#f1f5f9';
const SLATE_50 = '#f8fafc';

const TEXT_XS_BOLD_UPPER = {
  fontSize: '11px',
  fontWeight: 900,
  color: SLATE_800,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  borderBottom: `1px solid ${SLATE_100}`,
  paddingBottom: '8px',
  marginBottom: '24px',
};

// --- WORK FORM ---
export function StaffWorkForm({ data, onChange, readOnly }) {
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);
  const [roles, setRoles] = useState([]);
  
  const [discoveryOpen, setDiscoveryOpen] = useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptDesc, setNewDeptDesc] = useState('');
  const [isCreatingDept, setIsCreatingDept] = useState(false);

  const [managerDiscoveryOpen, setManagerDiscoveryOpen] = useState(false);
  const [managerQuickCreateOpen, setManagerQuickCreateOpen] = useState(false);
  const [newManagerName, setNewManagerName] = useState('');
  const [newManagerRole, setNewManagerRole] = useState('');
  const [newManagerDept, setNewManagerDept] = useState('');
  const [isCreatingManager, setIsCreatingManager] = useState(false);

  const [positionDiscoveryOpen, setPositionDiscoveryOpen] = useState(false);
  const [quickCreatePositionOpen, setQuickCreatePositionOpen] = useState(false);
  const [newPositionName, setNewPositionName] = useState('');
  const [newPositionDesc, setNewPositionDesc] = useState('');
  const [isCreatingPosition, setIsCreatingPosition] = useState(false);

  useEffect(() => {
    // Fetch departments, staff, and roles
    Promise.all([
      api.foundation.getDepartments().catch(() => []),
      api.foundation.getStaff().catch(() => []),
      api.foundation.getRoles().catch(() => [])
    ])
      .then(([depts, staffList, rolesList]) => {
        const mappedDepts = depts.map(item => ({
          id: item.id,
          name: item.name,
          type: item.type || 'Department',
          parent: item.parent || 'N/A'
        }));
        setDepartments(mappedDepts);

        const mappedStaff = staffList.map(s => {
          const name = s.user?.name || s.name || `Staff #${s.staff_number || s.id.toString().substring(0, 8)}`;
          const role = s.designation || s.user?.role?.name || 'Staff';
          const dept = depts.find(d => d.id === s.department_id || d.id === s.organization_unit_id);
          const deptName = dept ? dept.name : 'N/A';
          return {
            id: s.id,
            name,
            role,
            department: deptName
          };
        });
        setManagers(mappedStaff);

        setRoles(rolesList || []);
      })
      .catch((err) => {
        console.error("Failed to load work form lists:", err);
        setDepartments([
          { id: '1', name: 'Administration', type: 'Department', parent: 'N/A' },
          { id: '2', name: 'Academic', type: 'Department', parent: 'N/A' },
          { id: '3', name: 'Discipline', type: 'Department', parent: 'N/A' },
          { id: '4', name: 'Support Staff', type: 'Department', parent: 'N/A' }
        ]);
        setManagers([
          { id: 'm1', name: 'Dr. John Kalisa (HM)', role: 'Headmaster', department: 'Administration' },
          { id: 'm2', name: 'Mrs. Sarah Uwase (DOS)', role: 'Dean of Studies', department: 'Academic' }
        ]);
        setRoles([
          { id: 'r1', name: 'Teacher', description: 'Academic Instructor' },
          { id: 'r2', name: 'Accountant', description: 'Financial Officer' },
          { id: 'r3', name: 'Administrator', description: 'System Administrator' },
          { id: 'r4', name: 'Registrar', description: 'Records Officer' }
        ]);
      });
  }, []);

  const filter = createFilterOptions();

  const handleCreateDept = async () => {
    if (!newDeptName.trim()) return;
    setIsCreatingDept(true);
    try {
      const res = await api.foundation.createDepartment({
        name: newDeptName,
        description: newDeptDesc || `${newDeptName} Department`
      });
      const created = {
        id: res.data?.id || String(Date.now()),
        name: newDeptName,
        type: 'Department',
        parent: 'N/A'
      };
      setDepartments(prev => [...prev, created]);
      onChange('department', newDeptName);
      setDiscoveryOpen(false);
      setQuickCreateOpen(false);
      setNewDeptName('');
      setNewDeptDesc('');
    } catch (err) {
      console.error("Failed to create department, fallback:", err);
      const created = {
        id: String(Date.now()),
        name: newDeptName,
        type: 'Department',
        parent: 'N/A'
      };
      setDepartments(prev => [...prev, created]);
      onChange('department', newDeptName);
      setDiscoveryOpen(false);
      setQuickCreateOpen(false);
      setNewDeptName('');
      setNewDeptDesc('');
    } finally {
      setIsCreatingDept(false);
    }
  };

  const handleCreateManager = async () => {
    if (!newManagerName.trim()) return;
    setIsCreatingManager(true);
    try {
      const res = await api.foundation.createEntity('staff', {
        name: newManagerName,
        designation: newManagerRole || 'Staff Member',
        status: 'active',
        user: {
          name: newManagerName,
          role: { name: newManagerRole || 'Staff Member' }
        }
      });
      const created = {
        id: res.data?.id || String(Date.now()),
        name: newManagerName,
        role: newManagerRole || 'Staff Member',
        department: newManagerDept || 'N/A'
      };
      setManagers(prev => [...prev, created]);
      onChange('reportingTo', newManagerName);
      setManagerDiscoveryOpen(false);
      setManagerQuickCreateOpen(false);
      setNewManagerName('');
      setNewManagerRole('');
      setNewManagerDept('');
    } catch (err) {
      console.error("Failed to create manager, fallback:", err);
      const created = {
        id: String(Date.now()),
        name: newManagerName,
        role: newManagerRole || 'Staff Member',
        department: newManagerDept || 'N/A'
      };
      setManagers(prev => [...prev, created]);
      onChange('reportingTo', newManagerName);
      setManagerDiscoveryOpen(false);
      setManagerQuickCreateOpen(false);
      setNewManagerName('');
      setNewManagerRole('');
      setNewManagerDept('');
    } finally {
      setIsCreatingManager(false);
    }
  };

  const handleCreatePosition = async () => {
    if (!newPositionName.trim()) return;
    setIsCreatingPosition(true);
    try {
      const res = await api.foundation.createEntity('roles', {
        name: newPositionName,
        description: newPositionDesc || `${newPositionName} Role`
      });
      const created = {
        id: res.data?.id || String(Date.now()),
        name: newPositionName,
        description: newPositionDesc || `${newPositionName} Role`
      };
      setRoles(prev => [...prev, created]);
      onChange('jobPosition', newPositionName);
      onChange('jobTitle', newPositionName);
      setPositionDiscoveryOpen(false);
      setQuickCreatePositionOpen(false);
      setNewPositionName('');
      setNewPositionDesc('');
    } catch (err) {
      console.error("Failed to create role, fallback:", err);
      const created = {
        id: String(Date.now()),
        name: newPositionName,
        description: newPositionDesc || `${newPositionName} Role`
      };
      setRoles(prev => [...prev, created]);
      onChange('jobPosition', newPositionName);
      onChange('jobTitle', newPositionName);
      setPositionDiscoveryOpen(false);
      setQuickCreatePositionOpen(false);
      setNewPositionName('');
      setNewPositionDesc('');
    } finally {
      setIsCreatingPosition(false);
    }
  };

  const getFilteredRoles = () => {
    if (!roles) return [];
    if (!data.department) return roles;
    const deptLower = data.department.toLowerCase();
    
    const filtered = roles.filter(role => {
      if (!role || !role.name) return false;
      const nameLower = role.name.toLowerCase();
      if (deptLower.includes('academic')) {
        return nameLower.includes('teacher') || nameLower.includes('instructor') || nameLower.includes('dean') || nameLower.includes('academic') || nameLower.includes('dos') || nameLower.includes('educator');
      }
      if (deptLower.includes('admin') || deptLower.includes('operation') || deptLower.includes('support')) {
        return nameLower.includes('admin') || nameLower.includes('account') || nameLower.includes('registrar') || nameLower.includes('bursar') || nameLower.includes('principal') || nameLower.includes('director') || nameLower.includes('manager') || nameLower.includes('staff') || nameLower.includes('officer');
      }
      return true;
    });

    return filtered.length > 0 ? filtered : roles;
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '48px', animation: 'fadeIn 0.3s ease' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px' }}>
        {/* Left Column: Work Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h3 style={TEXT_XS_BOLD_UPPER}>Work Information</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Department */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center' }}>
              <label style={{ fontSize: '14px', fontWeight: 600, color: SLATE_700 }}>Department</label>
              <Autocomplete
                disabled={readOnly}
                value={departments.find(d => d.name === data.department) || (data.department ? { name: data.department } : null)}
                onChange={(event, newValue) => {
                  if (newValue && newValue.id === 'search-more') {
                    setDiscoveryOpen(true);
                  } else {
                    onChange('department', newValue ? newValue.name : '');
                  }
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);
                  filtered.push({
                    id: 'search-more',
                    name: 'Search More...',
                    isAction: true
                  });
                  return filtered;
                }}
                options={departments}
                getOptionLabel={(option) => {
                  if (typeof option === 'string') return option;
                  return option?.name || '';
                }}
                renderOption={(props, option) => (
                  <li {...props} key={option.id || option.name}>
                    {option.isAction ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main', fontWeight: 900 }}>
                        <SearchIcon sx={{ fontSize: 16 }} />
                        <Typography sx={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase' }}>{option.name}</Typography>
                      </Box>
                    ) : (
                      <Typography sx={{ fontSize: '0.875rem' }}>{option.name || option}</Typography>
                    )}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    placeholder="Select Department..."
                    InputProps={{
                      ...params.InputProps,
                      disableUnderline: false,
                      sx: { 
                        fontSize: '14px',
                        pb: 0.5,
                        '& .MuiInputBase-input': { py: 0.75 }
                      }
                    }}
                  />
                )}
                sx={{
                  gridColumn: 'span 1',
                  '& .MuiAutocomplete-endAdornment': { top: '50%', transform: 'translateY(-50%)', right: 0 },
                  '& .MuiAutocomplete-inputRoot': { pr: '30px !important' }
                }}
              />
            </div>

            {/* Job Position */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center' }}>
              <label style={{ fontSize: '14px', fontWeight: 600, color: SLATE_700 }}>Job Position</label>
              <Autocomplete
                disabled={readOnly}
                value={getFilteredRoles().find(r => r.name === data.jobPosition) || (data.jobPosition ? { name: data.jobPosition } : null)}
                onChange={(event, newValue) => {
                  if (newValue && newValue.id === 'search-more-position') {
                    setPositionDiscoveryOpen(true);
                  } else {
                    onChange('jobPosition', newValue ? newValue.name : '');
                    if (newValue) {
                      onChange('jobTitle', newValue.name);
                    }
                  }
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);
                  filtered.push({
                    id: 'search-more-position',
                    name: 'Search More...',
                    isAction: true
                  });
                  return filtered;
                }}
                options={getFilteredRoles()}
                getOptionLabel={(option) => {
                  if (typeof option === 'string') return option;
                  return option?.name || '';
                }}
                renderOption={(props, option) => (
                  <li {...props} key={option.id || option.name}>
                    {option.isAction ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main', fontWeight: 900 }}>
                        <SearchIcon sx={{ fontSize: 16 }} />
                        <Typography sx={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase' }}>{option.name}</Typography>
                      </Box>
                    ) : (
                      <Typography sx={{ fontSize: '0.875rem' }}>{option.name || option}</Typography>
                    )}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    placeholder="Select Job Position..."
                    InputProps={{
                      ...params.InputProps,
                      disableUnderline: false,
                      sx: { 
                        fontSize: '14px',
                        pb: 0.5,
                        '& .MuiInputBase-input': { py: 0.75 }
                      }
                    }}
                  />
                )}
                sx={{
                  gridColumn: 'span 1',
                  '& .MuiAutocomplete-endAdornment': { top: '50%', transform: 'translateY(-50%)', right: 0 },
                  '& .MuiAutocomplete-inputRoot': { pr: '30px !important' }
                }}
              />
            </div>

            {/* Job Title */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center' }}>
              <label style={{ fontSize: '14px', fontWeight: 600, color: SLATE_700 }}>Job Title</label>
              <TextField
                disabled={readOnly}
                fullWidth
                variant="standard"
                placeholder="e.g. Senior Teacher"
                value={data.jobTitle || ''}
                onChange={(e) => onChange('jobTitle', e.target.value)}
                inputProps={{ style: { fontSize: '14px', padding: '6px 0' } }}
              />
            </div>

            {/* Reporting To */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center' }}>
              <label style={{ fontSize: '14px', fontWeight: 600, color: SLATE_700 }}>Reporting To</label>
              <Autocomplete
                disabled={readOnly}
                value={managers.find(m => m.name === data.reportingTo) || (data.reportingTo ? { name: data.reportingTo } : null)}
                onChange={(event, newValue) => {
                  if (newValue && newValue.id === 'search-more-manager') {
                    setManagerDiscoveryOpen(true);
                  } else {
                    onChange('reportingTo', newValue ? newValue.name : '');
                  }
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);
                  filtered.push({
                    id: 'search-more-manager',
                    name: 'Search More...',
                    isAction: true
                  });
                  return filtered;
                }}
                options={managers}
                getOptionLabel={(option) => {
                  if (typeof option === 'string') return option;
                  return option?.name || '';
                }}
                renderOption={(props, option) => (
                  <li {...props} key={option.id || option.name}>
                    {option.isAction ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main', fontWeight: 900 }}>
                        <SearchIcon sx={{ fontSize: 16 }} />
                        <Typography sx={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase' }}>{option.name}</Typography>
                      </Box>
                    ) : (
                      <Typography sx={{ fontSize: '0.875rem' }}>{option.name || option}</Typography>
                    )}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    placeholder="Select Reporting Manager..."
                    InputProps={{
                      ...params.InputProps,
                      disableUnderline: false,
                      sx: { 
                        fontSize: '14px',
                        pb: 0.5,
                        '& .MuiInputBase-input': { py: 0.75 }
                      }
                    }}
                  />
                )}
                sx={{
                  gridColumn: 'span 1',
                  '& .MuiAutocomplete-endAdornment': { top: '50%', transform: 'translateY(-50%)', right: 0 },
                  '& .MuiAutocomplete-inputRoot': { pr: '30px !important' }
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Organization Chart */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h3 style={TEXT_XS_BOLD_UPPER}>Organization Chart</h3>
          <div style={{
            padding: '24px',
            backgroundColor: `${SLATE_50}80`,
            borderRadius: '4px',
            border: `1px solid ${SLATE_100}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '12px',
            minHeight: '180px'
          }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: SLATE_200, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
              <UsersIcon style={{ color: SLATE_400 }} />
            </div>
            <div>
              <p style={{ fontSize: '12px', color: SLATE_400, fontStyle: 'italic', margin: 0 }}>
                "Set a manager or reports to show in org chart."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Department Discovery Modals */}
      <DiscoveryModal 
        open={discoveryOpen}
        type="units"
        items={departments}
        onSelect={(item) => {
          onChange('department', item ? item.name : '');
          setDiscoveryOpen(false);
        }}
        onCreateClick={() => {
          setQuickCreateOpen(true);
        }}
        onClose={() => setDiscoveryOpen(false)}
      />

      <Dialog 
        open={quickCreateOpen} 
        onClose={() => setQuickCreateOpen(false)}
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
            Create New Department
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ py: 1 }}>
          <Box sx={{ mt: 1 }}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  Department Name <Box component="span" sx={{ color: 'error.main' }}>*</Box>
                </Typography>
                <TextField
                  fullWidth
                  variant="standard"
                  placeholder="e.g. Science Department"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
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
                  value={newDeptDesc}
                  onChange={(e) => setNewDeptDesc(e.target.value)}
                />
              </Box>
            </Stack>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3, pt: 1.5, gap: 1 }}>
          <Button 
            onClick={() => setQuickCreateOpen(false)} 
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
            onClick={handleCreateDept} 
            variant="contained" 
            disabled={isCreatingDept || !newDeptName.trim()}
            sx={{
              fontWeight: 700,
              fontSize: '11px',
              px: 3,
              borderRadius: 1.5,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {isCreatingDept ? 'Creating...' : 'Create Department'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reporting To Discovery Modals */}
      <DiscoveryModal 
        open={managerDiscoveryOpen}
        type="staff"
        items={managers}
        onSelect={(item) => {
          onChange('reportingTo', item ? item.name : '');
          setManagerDiscoveryOpen(false);
        }}
        onCreateClick={() => {
          setManagerQuickCreateOpen(true);
        }}
        onClose={() => setManagerDiscoveryOpen(false)}
      />

      <Dialog 
        open={managerQuickCreateOpen} 
        onClose={() => setManagerQuickCreateOpen(false)}
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
            Create New Manager / Staff
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ py: 1 }}>
          <Box sx={{ mt: 1 }}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  Manager / Staff Name <Box component="span" sx={{ color: 'error.main' }}>*</Box>
                </Typography>
                <TextField
                  fullWidth
                  variant="standard"
                  placeholder="e.g. Dr. John Kalisa"
                  value={newManagerName}
                  onChange={(e) => setNewManagerName(e.target.value)}
                />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  Role / Designation
                </Typography>
                <TextField
                  fullWidth
                  variant="standard"
                  placeholder="e.g. Headmaster"
                  value={newManagerRole}
                  onChange={(e) => setNewManagerRole(e.target.value)}
                />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  Department
                </Typography>
                <FormControl fullWidth variant="standard">
                  <Select
                    value={newManagerDept}
                    onChange={(e) => setNewManagerDept(e.target.value)}
                    displayEmpty
                    sx={{ fontSize: '14px', py: '6px' }}
                  >
                    <MenuItem value="">Select Department</MenuItem>
                    {departments.map((d) => (
                      <MenuItem key={d.id} value={d.name}>{d.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Stack>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3, pt: 1.5, gap: 1 }}>
          <Button 
            onClick={() => setManagerQuickCreateOpen(false)} 
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
            onClick={handleCreateManager} 
            variant="contained" 
            disabled={isCreatingManager || !newManagerName.trim()}
            sx={{
              fontWeight: 700,
              fontSize: '11px',
              px: 3,
              borderRadius: 1.5,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {isCreatingManager ? 'Creating...' : 'Create Manager'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Position Discovery Modals */}
      <DiscoveryModal 
        open={positionDiscoveryOpen}
        type="roles"
        items={roles}
        onSelect={(item) => {
          onChange('jobPosition', item ? item.name : '');
          if (item) {
            onChange('jobTitle', item.name);
          }
          setPositionDiscoveryOpen(false);
        }}
        onCreateClick={() => {
          setQuickCreatePositionOpen(true);
        }}
        onClose={() => setPositionDiscoveryOpen(false)}
      />

      <Dialog 
        open={quickCreatePositionOpen} 
        onClose={() => setQuickCreatePositionOpen(false)}
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
            Create New Job Position
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ py: 1 }}>
          <Box sx={{ mt: 1 }}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  Position Name <Box component="span" sx={{ color: 'error.main' }}>*</Box>
                </Typography>
                <TextField
                  fullWidth
                  variant="standard"
                  placeholder="e.g. Science Teacher"
                  value={newPositionName}
                  onChange={(e) => setNewPositionName(e.target.value)}
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
                  value={newPositionDesc}
                  onChange={(e) => setNewPositionDesc(e.target.value)}
                />
              </Box>
            </Stack>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3, pt: 1.5, gap: 1 }}>
          <Button 
            onClick={() => setQuickCreatePositionOpen(false)} 
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
            onClick={handleCreatePosition} 
            variant="contained" 
            disabled={isCreatingPosition || !newPositionName.trim()}
            sx={{
              fontWeight: 700,
              fontSize: '11px',
              px: 3,
              borderRadius: 1.5,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {isCreatingPosition ? 'Creating...' : 'Create Position'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

// --- RESUME FORM ---
export function StaffResumeForm({ data, onChange, readOnly }) {
  const theme = useTheme();
  const [skills, setSkills] = useState(data.skills || []);

  const [newSkill, setNewSkill] = useState({ category: 'Languages', name: '', level: 'Intermediate', progress: 50 });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    onChange('skills', skills);
  }, [skills]);

  const handleAddSkill = () => {
    if (!newSkill.name.trim()) return;
    setSkills([...skills, { ...newSkill }]);
    setNewSkill({ category: 'Languages', name: '', level: 'Intermediate', progress: 50 });
    setShowAddForm(false);
  };

  const handleDeleteSkill = (idx) => {
    setSkills(skills.filter((_, i) => i !== idx));
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', animation: 'fadeIn 0.3s ease' }}>
      {/* Left Column: Resume Upload */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <h3 style={TEXT_XS_BOLD_UPPER}>Resume</h3>
        
        <div style={{
          padding: '24px',
          backgroundColor: `${SLATE_50}80`,
          borderRadius: '8px',
          border: `1px dashed ${SLATE_300}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: 'white',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${SLATE_100}`
          }}>
            <FileTextIcon style={{ fontSize: '32px', color: alpha(theme.palette.primary.main, 0.4) }} />
          </div>
          <div>
            <p style={{ fontSize: '14px', fontWeight: 700, color: SLATE_700, margin: '0 0 4px 0' }}>
              {data.resumeName || 'Resume_John_Doe.pdf'}
            </p>
            <p style={{ fontSize: '10px', color: SLATE_400, fontWeight: 500, margin: 0 }}>
              Uploaded on 22 April 2026
            </p>
          </div>
          
          {!readOnly && (
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadIcon style={{ fontSize: '14px' }} />}
              sx={{
                textTransform: 'uppercase',
                fontSize: '10px',
                fontWeight: 900,
                borderRadius: '9999px',
                px: '16px',
                py: '8px',
                borderColor: alpha(theme.palette.primary.main, 0.2),
                color: theme.palette.primary.main,
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: alpha(theme.palette.primary.main, 0.05)
                }
              }}
            >
              Upload Another
              <input type="file" hidden onChange={(e) => onChange('resumeName', e.target.files[0]?.name)} />
            </Button>
          )}
        </div>
      </div>

      {/* Right Column: Skills */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${SLATE_100}`, paddingBottom: '8px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '11px', fontWeight: 900, color: SLATE_800, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
            Skills & Certifications
          </h3>
          {!readOnly && !showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              style={{
                backgroundColor: SLATE_100,
                border: 'none',
                color: SLATE_700,
                padding: '4px 12px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = SLATE_200}
              onMouseOut={(e) => e.target.style.backgroundColor = SLATE_100}
            >
              Add
            </button>
          )}
        </div>

        {showAddForm && (
          <Paper variant="outlined" style={{ padding: '16px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Typography variant="subtitle2" style={{ fontWeight: 700 }}>New Skill</Typography>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <FormControl fullWidth variant="standard">
                <Select
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                >
                  <MenuItem value="Languages">Languages</MenuItem>
                  <MenuItem value="Soft Skills">Soft Skills</MenuItem>
                  <MenuItem value="IT">IT</MenuItem>
                  <MenuItem value="Programming">Programming</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                variant="standard"
                placeholder="Skill Name"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              />
              <FormControl fullWidth variant="standard">
                <Select
                  value={newSkill.level}
                  onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                >
                  <MenuItem value="Beginner">Beginner</MenuItem>
                  <MenuItem value="Intermediate">Intermediate</MenuItem>
                  <MenuItem value="Advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                variant="standard"
                type="number"
                placeholder="Progress %"
                value={newSkill.progress}
                onChange={(e) => setNewSkill({ ...newSkill, progress: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <Button size="small" onClick={() => setShowAddForm(false)}>Cancel</Button>
              <Button size="small" variant="contained" color="secondary" onClick={handleAddSkill}>Save</Button>
            </div>
          </Paper>
        )}

        {skills.length === 0 ? (
          <div style={{
            padding: '24px',
            textAlign: 'center',
            color: SLATE_400,
            fontSize: '13px',
            fontStyle: 'italic',
            backgroundColor: 'white',
            border: `1px solid ${SLATE_100}`,
            borderRadius: '8px'
          }}>
            No skills or certifications added yet.
          </div>
        ) : (
          <div style={{ border: `1px solid ${SLATE_100}`, borderRadius: '8px', overflow: 'hidden' }}>
            {skills.map((skill, idx) => (
              <div
                key={skill.name}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '3fr 2fr 3fr 1fr',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '12px',
                  backgroundColor: idx % 2 === 0 ? 'white' : `${SLATE_50}80`,
                  borderBottom: idx < skills.length - 1 ? `1px solid ${SLATE_100}` : 'none'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: SLATE_400, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: '2px' }}>
                    {skill.category}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: SLATE_700 }}>
                    {skill.name}
                  </span>
                </div>
                
                <span style={{ fontSize: '10px', fontWeight: 700, color: SLATE_400, textTransform: 'uppercase' }}>
                  {skill.level}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ flexGrow: 1, height: '6px', backgroundColor: `${SLATE_200}80`, borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', backgroundColor: alpha(theme.palette.primary.main, 0.6), borderRadius: '9999px', width: `${skill.progress}%` }} />
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 900, color: SLATE_800, width: '32px' }}>
                    {skill.progress} %
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  {!readOnly && (
                    <IconButton size="small" onClick={() => handleDeleteSkill(idx)} style={{ color: SLATE_300 }}>
                      <DeleteIcon style={{ fontSize: '16px' }} />
                    </IconButton>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- PERSONAL FORM ---
export function StaffPersonalForm({ data, onChange, readOnly }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', animation: 'fadeIn 0.3s ease' }}>
      {/* Left Column: Private Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <h3 style={TEXT_XS_BOLD_UPPER}>Private Information</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center' }}>
            <label style={{ fontSize: '14px', fontWeight: 600, color: SLATE_700 }}>Address</label>
            <TextField
              disabled={readOnly}
              fullWidth
              variant="standard"
              placeholder="Street, Sector, District"
              value={data.address || ''}
              onChange={(e) => onChange('address', e.target.value)}
              inputProps={{ style: { fontSize: '14px', padding: '6px 0' } }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center' }}>
            <label style={{ fontSize: '14px', fontWeight: 600, color: SLATE_700 }}>Bank Account</label>
            <TextField
              disabled={readOnly}
              fullWidth
              variant="standard"
              placeholder="Account Number"
              value={data.bankAccount || ''}
              onChange={(e) => onChange('bankAccount', e.target.value)}
              inputProps={{ style: { fontSize: '14px', padding: '6px 0' } }}
            />
          </div>
        </div>
      </div>

      {/* Right Column: Citizenship */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <h3 style={TEXT_XS_BOLD_UPPER}>Citizenship</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center' }}>
            <label style={{ fontSize: '14px', fontWeight: 600, color: SLATE_700 }}>Nationality</label>
            <TextField
              disabled={readOnly}
              fullWidth
              variant="standard"
              placeholder="e.g. Rwandan"
              value={data.nationality || ''}
              onChange={(e) => onChange('nationality', e.target.value)}
              inputProps={{ style: { fontSize: '14px', padding: '6px 0' } }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center' }}>
            <label style={{ fontSize: '14px', fontWeight: 600, color: SLATE_700 }}>National ID</label>
            <TextField
              disabled={readOnly}
              fullWidth
              variant="standard"
              placeholder="ID / Passport Number"
              value={data.nationalId || ''}
              onChange={(e) => onChange('nationalId', e.target.value)}
              inputProps={{ style: { fontSize: '14px', padding: '6px 0' } }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- PAYROLL FORM ---
export function StaffPayrollForm({ data, onChange, readOnly }) {
  const theme = useTheme();

  // Handle defaults
  const basicSalary = parseFloat(data.basicSalary) || 0;
  const paymentFrequency = data.paymentFrequency || 'Monthly (Standard)';
  const payDay = data.payDay || 'Last day of month';
  const housingAllowance = parseFloat(data.housingAllowance) || 0;
  const transportAllowance = parseFloat(data.transportAllowance) || 0;
  const responsibilityAllowance = parseFloat(data.responsibilityAllowance) || 0;
  const otherAllowance = parseFloat(data.otherAllowance) || 0;
  const rssbEnabled = data.rssbEnabled !== false; // default true
  const ramaEnabled = data.ramaEnabled !== false; // default true
  const bankName = data.bankName || 'BK (Bank of Kigali)';
  const bankAccount = data.bankAccount || '';

  // Real-time Net Salary Calculation
  const grossSalary = basicSalary + housingAllowance + transportAllowance + responsibilityAllowance + otherAllowance;
  const rssbContribution = rssbEnabled ? grossSalary * 0.03 : 0;
  const ramaContribution = ramaEnabled ? grossSalary * 0.075 : 0;
  
  let paye = 0;
  const taxableSalary = Math.max(0, grossSalary - rssbContribution);
  if (taxableSalary > 1000000) {
    paye = (60000 * 0) + (40000 * 0.10) + (900000 * 0.20) + ((taxableSalary - 1000000) * 0.30);
  } else if (taxableSalary > 100000) {
    paye = (60000 * 0) + (40000 * 0.10) + ((taxableSalary - 100000) * 0.20);
  } else if (taxableSalary > 60000) {
    paye = (60000 * 0) + ((taxableSalary - 60000) * 0.10);
  }
  
  const netSalary = grossSalary - rssbContribution - ramaContribution - paye;

  const [payeBreakdown, setPayeBreakdown] = useState(null);

  const handleCalculatePAYE = () => {
    setPayeBreakdown({
      gross: grossSalary,
      rssb: rssbContribution,
      rama: ramaContribution,
      taxable: taxableSalary,
      paye: paye,
      net: netSalary,
    });
  };

  const sectionHeaderStyle = (text, mt = 0) => (
    <h3 style={{
      fontSize: '11px',
      fontWeight: 900,
      color: SLATE_800,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      borderBottom: `1px solid ${SLATE_100}`,
      paddingBottom: '8px',
      marginBottom: '24px',
      marginTop: mt,
      marginRight: 0,
      marginLeft: 0,
    }}>
      {text}
    </h3>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', maxWidth: '896px', animation: 'fadeIn 0.3s ease' }}>
      <style>{`
        .payroll-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
        }
        @media (min-width: 768px) {
          .payroll-grid {
            grid-template-columns: 1fr 1fr;
            gap: 64px;
          }
        }
      `}</style>
      <div className="payroll-grid">
        {/* Left Side: Salary & Allowances */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Salary & Schedule */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {sectionHeaderStyle("Salary & Schedule", 0)}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: SLATE_700 }}>Basic Salary</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TextField
                    disabled={readOnly}
                    fullWidth
                    variant="standard"
                    type="number"
                    placeholder="0"
                    value={data.basicSalary || ''}
                    onChange={(e) => onChange('basicSalary', e.target.value)}
                    inputProps={{ style: { fontSize: '14px', padding: '6px 0', fontWeight: 'bold' } }}
                  />
                  <span style={{ fontSize: '10px', fontWeight: 900, color: SLATE_400 }}>RWF</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: SLATE_700 }}>Payment Freq.</label>
                <FormControl fullWidth variant="standard">
                  <Select
                    disabled={readOnly}
                    value={paymentFrequency}
                    onChange={(e) => onChange('paymentFrequency', e.target.value)}
                    sx={{ fontSize: '14px', py: '6px' }}
                  >
                    <MenuItem value="Monthly (Standard)">Monthly (Standard)</MenuItem>
                    <MenuItem value="Bi-weekly">Bi-weekly</MenuItem>
                    <MenuItem value="Weekly">Weekly</MenuItem>
                    <MenuItem value="Daily / Contractual">Daily / Contractual</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: SLATE_700 }}>Scheduled Pay Day</label>
                <FormControl fullWidth variant="standard">
                  <Select
                    disabled={readOnly}
                    value={payDay}
                    onChange={(e) => onChange('payDay', e.target.value)}
                    sx={{ fontSize: '14px', py: '6px' }}
                  >
                    <MenuItem value="Last day of month">Last day of month</MenuItem>
                    <MenuItem value="20th of month">20th of month</MenuItem>
                    <MenuItem value="24th of month">24th of month</MenuItem>
                    <MenuItem value="25th of month">25th of month</MenuItem>
                    <MenuItem value="28th of month">28th of month</MenuItem>
                    <MenuItem value="1st of month">1st of month</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>

          {/* Monthly Allowances */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${SLATE_100}`, paddingBottom: '8px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '11px', fontWeight: 900, color: SLATE_800, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                Monthly Allowances
              </h3>
              <button style={{ border: 'none', backgroundColor: 'transparent', color: theme.palette.primary.main, fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', cursor: 'pointer' }}>
                Add Custom
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: SLATE_700 }}>Housing Allowance</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TextField
                    disabled={readOnly}
                    fullWidth
                    variant="standard"
                    type="number"
                    placeholder="0"
                    value={data.housingAllowance || ''}
                    onChange={(e) => onChange('housingAllowance', e.target.value)}
                    inputProps={{ style: { fontSize: '14px', padding: '6px 0' } }}
                  />
                  <span style={{ fontSize: '10px', fontWeight: 700, color: SLATE_300 }}>RWF</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: SLATE_700 }}>Transport Allowance</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TextField
                    disabled={readOnly}
                    fullWidth
                    variant="standard"
                    type="number"
                    placeholder="0"
                    value={data.transportAllowance || ''}
                    onChange={(e) => onChange('transportAllowance', e.target.value)}
                    inputProps={{ style: { fontSize: '14px', padding: '6px 0' } }}
                  />
                  <span style={{ fontSize: '10px', fontWeight: 700, color: SLATE_300 }}>RWF</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: SLATE_700 }}>Responsibility Allow.</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TextField
                    disabled={readOnly}
                    fullWidth
                    variant="standard"
                    type="number"
                    placeholder="0"
                    value={data.responsibilityAllowance || ''}
                    onChange={(e) => onChange('responsibilityAllowance', e.target.value)}
                    inputProps={{ style: { fontSize: '14px', padding: '6px 0' } }}
                  />
                  <span style={{ fontSize: '10px', fontWeight: 700, color: SLATE_300 }}>RWF</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Deductions & Bank */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Statutory Deductions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {sectionHeaderStyle("Statutory Deductions", 0)}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                padding: '12px',
                backgroundColor: SLATE_50,
                borderRadius: '4px',
                border: `1px solid ${SLATE_100}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 700, color: SLATE_700, margin: 0 }}>RSSB Contribution</p>
                  <p style={{ fontSize: '10px', color: SLATE_400, margin: 0 }}>Automatic calculation enabled (3%)</p>
                </div>
                <Switch
                  disabled={readOnly}
                  checked={rssbEnabled}
                  onChange={(e) => onChange('rssbEnabled', e.target.checked)}
                />
              </div>

              <div style={{
                padding: '12px',
                backgroundColor: SLATE_50,
                borderRadius: '4px',
                border: `1px solid ${SLATE_100}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 700, color: SLATE_700, margin: 0 }}>RAMA / Medical</p>
                  <p style={{ fontSize: '10px', color: SLATE_400, margin: 0 }}>Standard medical deduction (7.5%)</p>
                </div>
                <Switch
                  disabled={readOnly}
                  checked={ramaEnabled}
                  onChange={(e) => onChange('ramaEnabled', e.target.checked)}
                />
              </div>
            </div>
          </div>

          {/* Bank Information */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {sectionHeaderStyle("Bank Information", 0)}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: SLATE_700 }}>Bank Name</label>
                <FormControl fullWidth variant="standard">
                  <Select
                    disabled={readOnly}
                    value={bankName}
                    onChange={(e) => onChange('bankName', e.target.value)}
                    sx={{ fontSize: '14px', py: '6px' }}
                  >
                    <MenuItem value="BK (Bank of Kigali)">BK (Bank of Kigali)</MenuItem>
                    <MenuItem value="Equity Bank">Equity Bank</MenuItem>
                    <MenuItem value="Cogebanque">Cogebanque</MenuItem>
                    <MenuItem value="Access Bank">Access Bank</MenuItem>
                    <MenuItem value="Urwego Bank">Urwego Bank</MenuItem>
                    <MenuItem value="Mwalimu SACCO">Mwalimu SACCO</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: SLATE_700 }}>Account No.</label>
                <TextField
                  disabled={readOnly}
                  fullWidth
                  variant="standard"
                  placeholder="e.g. 00045-0697..."
                  value={data.bankAccount || ''}
                  onChange={(e) => onChange('bankAccount', e.target.value)}
                  inputProps={{ style: { fontSize: '14px', padding: '6px 0' } }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PAYE Breakdown */}
      {payeBreakdown && (
        <Paper variant="outlined" style={{ padding: '24px', borderRadius: '8px', backgroundColor: '#fafafa', borderStyle: 'dashed' }}>
          <h4 style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', color: SLATE_400, marginTop: 0, marginBottom: '16px' }}>PAYE Breakdown</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', fontSize: '13px' }}>
            <div>
              <div style={{ color: SLATE_400, marginBottom: '4px' }}>Gross Salary</div>
              <div style={{ fontWeight: 700, color: SLATE_800 }}>{payeBreakdown.gross.toLocaleString()} RWF</div>
            </div>
            <div>
              <div style={{ color: SLATE_400, marginBottom: '4px' }}>RSSB Contribution</div>
              <div style={{ fontWeight: 700, color: '#ef4444' }}>-{payeBreakdown.rssb.toLocaleString()} RWF</div>
            </div>
            <div>
              <div style={{ color: SLATE_400, marginBottom: '4px' }}>RAMA Contribution</div>
              <div style={{ fontWeight: 700, color: '#ef4444' }}>-{payeBreakdown.rama.toLocaleString()} RWF</div>
            </div>
            <div>
              <div style={{ color: SLATE_400, marginBottom: '4px' }}>PAYE Tax</div>
              <div style={{ fontWeight: 700, color: '#ef4444' }}>-{payeBreakdown.paye.toLocaleString()} RWF</div>
            </div>
          </div>
          <div style={{ height: '1px', backgroundColor: SLATE_200, margin: '16px 0' }} />
          <div style={{ fontWeight: 800, fontSize: '15px', color: theme.palette.primary.main }}>
            Estimated Net Pay: {payeBreakdown.net.toLocaleString()} RWF / month
          </div>
        </Paper>
      )}

      {/* Net Salary Summary Block */}
      <div style={{
        padding: '24px',
        backgroundColor: alpha(theme.palette.primary.main, 0.05),
        border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '10px', fontWeight: 900, color: theme.palette.primary.main, textTransform: 'uppercase', letterSpacing: '0.1rem', marginBottom: '4px' }}>
            Estimated Net Salary
          </span>
          <span style={{ fontSize: '24px', fontWeight: 900, color: SLATE_800 }}>
            {netSalary.toLocaleString()} <span style={{ fontSize: '14px', fontWeight: 700, color: SLATE_400 }}>RWF / Month</span>
          </span>
        </div>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CalcIcon />}
          onClick={handleCalculatePAYE}
          sx={{
            textTransform: 'uppercase',
            fontSize: '10px',
            fontWeight: 900,
            borderRadius: '4px',
            px: '24px',
            py: '12px',
            boxShadow: 'none',
            color: 'white',
            '&:hover': { boxShadow: 'none' }
          }}
        >
          Calculate PAYE
        </Button>
      </div>
    </div>
  );
}
