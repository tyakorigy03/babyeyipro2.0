import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  Tabs,
  Tab,
  IconButton,
  Avatar,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  alpha,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  InputBase,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Save as SaveIcon,
  Settings as SettingsIcon,
  Business as SchoolIcon,
  People as PeopleIcon,
  Security as SecurityIcon,
  Add as AddIcon,
  ChevronRight as ChevronRightIcon,
  MoreVert as MoreVertIcon,
  PictureAsPdf as PdfIcon,
  Description as ExcelIcon,
  FileUpload as ImportIcon,
  CheckCircle as CheckCircleIcon,
  CloudUpload as UploadIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/providers/AuthProvider';
import { API_BASE, getUploadUrl } from '@/config/api';

const INITIAL_SCHOOL_DATA = {
  name: '', motto: '', logo_url: null, address: '', email: '', phone: '', website: '', founded: '',
};

// --- Styled Components ---
const NavButton = styled(ListItemButton)(({ theme, active }) => ({
  padding: '10px 16px',
  backgroundColor: active ? alpha(theme.palette.secondary.main, 0.08) : 'transparent',
  color: active ? theme.palette.secondary.main : theme.palette.text.primary,
  borderLeft: active ? `3px solid ${theme.palette.secondary.main}` : '3px solid transparent',
  '&:hover': {
    backgroundColor: alpha(theme.palette.secondary.main, 0.04),
    '& .MuiListItemIcon-root': { color: theme.palette.secondary.main },
  },
  '& .MuiListItemIcon-root': {
    color: active ? theme.palette.secondary.main : theme.palette.text.disabled,
    transition: 'color 0.2s',
  },
  '& .MuiListItemText-primary': { fontWeight: active ? 700 : 500, fontSize: '0.875rem' }
}));

const CountBadge = styled(Box)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.secondary.main, 0.1),
  color: theme.palette.secondary.main,
  padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 700, minWidth: '20px', textAlign: 'center',
}));

const FormGrid = styled(Box)({ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', alignItems: 'center', marginBottom: '16px' });
const FormLabel = styled(Typography)({ fontSize: '0.875rem', fontWeight: 600, color: '#334155' });
const FormInput = styled(InputBase)(({ theme }) => ({
  gridColumn: 'span 2',
  '& .MuiInputBase-input': {
    fontSize: '0.875rem', padding: '6px 0', borderBottom: '1px solid #e2e8f0', transition: 'all 0.2s',
    '&:focus': { borderColor: theme.palette.primary.main },
  },
}));

// --- Sub-components ---
function ModuleOptions() {
  const [anchorEl, setAnchorEl] = useState(null);
  return (
    <>
      <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}><MoreVertIcon fontSize="small" /></IconButton>
      <Menu
        anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
        PaperProps={{ sx: { minWidth: 180, borderRadius: '10px', mt: 1, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: '1px solid', borderColor: 'divider' } }}
      >
        <Typography variant="overline" sx={{ px: 2, py: 0.5, display: 'block', color: 'text.disabled', fontWeight: 700 }}>Options</Typography>
        <MenuItem onClick={() => setAnchorEl(null)} sx={{ fontSize: '0.8rem', gap: 1.5, py: 1 }}><PdfIcon sx={{ fontSize: 16, color: 'error.main' }} /> Export as PDF</MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)} sx={{ fontSize: '0.8rem', gap: 1.5, py: 1 }}><ExcelIcon sx={{ fontSize: 16, color: 'success.main' }} /> Export to Excel</MenuItem>
      </Menu>
    </>
  );
}

function ProfileCategoryItem({ category, active, onSelect }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Box onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <NavButton active={active} onClick={onSelect}>
        <ListItemIcon sx={{ minWidth: 32 }}>
           {React.cloneElement(category.icon, { sx: { ...category.icon.props.sx, color: active ? 'secondary.main' : 'text.disabled' } })}
        </ListItemIcon>
        <ListItemText primary={category.name} primaryTypographyProps={{ variant: 'body2' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 24, justifyContent: 'center' }}>
           {active && !isHovered && <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'secondary.main' }} />}
           {isHovered && <ChevronRightIcon sx={{ fontSize: 16, color: 'secondary.main' }} />}
        </Box>
      </NavButton>
    </Box>
  );
}

function ProfileTab({ data, onChange, logoFile, setLogoFile }) {
  const [activeCategory, setActiveCategory] = useState('identity');
  const fileInputRef = useRef(null);
  
  const categories = [
    { id: 'identity', name: 'School Identity', icon: <SchoolIcon sx={{ fontSize: 18 }} /> },
    { id: 'contact', name: 'Contact Information', icon: <PeopleIcon sx={{ fontSize: 18 }} /> },
    { id: 'social', name: 'Social & Web', icon: <SettingsIcon sx={{ fontSize: 18 }} /> },
  ];

  return (
    <Box sx={{ display: 'flex', border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden', bgcolor: 'white', minHeight: 450 }}>
      <Box sx={{ width: 260, borderRight: '1px solid', borderColor: 'divider', bgcolor: 'grey.50', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="overline" color="text.secondary">Profile Sections</Typography>
        </Box>
        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          <List component="nav" disablePadding sx={{ py: 1 }}>
            {categories.map(cat => (
              <ProfileCategoryItem key={cat.id} category={cat} active={activeCategory === cat.id} onSelect={() => setActiveCategory(cat.id)} />
            ))}
          </List>
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
        <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'grey.25' }}>
          <Box>
            <Typography variant="h6">{categories.find(c => c.id === activeCategory)?.name}</Typography>
            <Typography variant="caption" color="text.secondary">Configure core institutional data</Typography>
          </Box>
          <ModuleOptions />
        </Box>

        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 4 }}>
          {activeCategory === 'identity' && (
            <Stack spacing={4}>
               <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', mb: 2 }}>
                  <Box sx={{ position: 'relative' }}>
                    <Avatar 
                      src={logoFile ? URL.createObjectURL(logoFile) : getUploadUrl(data.logo_url)} 
                      sx={{ width: 100, height: 100, bgcolor: 'primary.light', fontSize: 40 }}
                    >
                      {data.name?.charAt(0)}
                    </Avatar>
                    <input 
                      type="file" ref={fileInputRef} onChange={(e) => setLogoFile(e.target.files[0])} style={{ display: 'none' }} accept="image/*"
                    />
                    <IconButton size="small" onClick={() => fileInputRef.current.click()} sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: 'white', boxShadow: 1 }}>
                      <UploadIcon fontSize="small" color="primary" />
                    </IconButton>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>School Logo</Typography>
                    <Typography variant="caption" color="text.secondary">Upload a high-resolution logo for reports and ID cards</Typography>
                  </Box>
               </Box>
               <Box>
                  <FormGrid><FormLabel>Full School Name</FormLabel><FormInput value={data.name || ''} onChange={(e) => onChange({...data, name: e.target.value})} /></FormGrid>
                  <FormGrid><FormLabel>Institutional Motto</FormLabel><FormInput value={data.motto || ''} onChange={(e) => onChange({...data, motto: e.target.value})} /></FormGrid>
                  <FormGrid><FormLabel>Year Founded</FormLabel><FormInput value={data.founded || ''} onChange={(e) => onChange({...data, founded: e.target.value})} /></FormGrid>
               </Box>
            </Stack>
          )}
          {activeCategory === 'contact' && (
            <Box>
               <FormGrid><FormLabel>Official Email</FormLabel><FormInput value={data.email || ''} onChange={(e) => onChange({...data, email: e.target.value})} /></FormGrid>
               <FormGrid><FormLabel>Phone Number</FormLabel><FormInput value={data.phone || ''} onChange={(e) => onChange({...data, phone: e.target.value})} /></FormGrid>
               <FormGrid><FormLabel>Physical Address</FormLabel><FormInput multiline rows={2} value={data.address || ''} onChange={(e) => onChange({...data, address: e.target.value})} /></FormGrid>
            </Box>
          )}
          {activeCategory === 'social' && (
            <Box>
               <FormGrid><FormLabel>Official Website</FormLabel><FormInput value={data.website || ''} onChange={(e) => onChange({...data, website: e.target.value})} /></FormGrid>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

function RoleItem({ role, active, count, onSelect }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Box onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <NavButton active={active} onClick={onSelect}>
        <ListItemIcon sx={{ minWidth: 32 }}>
           <SecurityIcon sx={{ fontSize: 18, color: active ? 'secondary.main' : 'text.disabled' }} />
        </ListItemIcon>
        <ListItemText primary={role.name || role} secondary={role.is_system ? 'System Role' : 'User Group'} secondaryTypographyProps={{ sx: { fontSize: '10px' } }} primaryTypographyProps={{ variant: 'body2' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 24, justifyContent: 'center' }}>
          <CountBadge>{count}</CountBadge>
        </Box>
      </NavButton>
    </Box>
  );
}

function UserManagementTab({ orgId }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_BASE}/school/users/${orgId}`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } finally { setLoading(false); }
    };
    fetchUsers();
  }, [orgId]);

  if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}><Typography color="text.secondary">Loading users...</Typography></Box>;

  return (
    <Box sx={{ display: 'flex', border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden', bgcolor: 'white', minHeight: 450 }}>
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'grey.25' }}>
          <Box>
            <Typography variant="h6">User Directory</Typography>
            <Typography variant="caption" color="text.secondary">{users.length} Registered Users</Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic', mr: 2 }}>
              * Users are provisioned during Staff/Parent onboarding.
            </Typography>
            <ModuleOptions />
          </Stack>
        </Box>

        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>User Details</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', bgcolor: 'primary.main' }}>{user.name?.charAt(0)}</Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{user.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{user.email || user.phone}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip label={user.status || 'Active'} size="small" color={user.status === 'Active' ? 'success' : 'default'} sx={{ height: 18, fontSize: '9px' }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
}

function PermissionsTab({ orgId, setNotification }) {
  const [roles, setRoles] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesRes, permsRes] = await Promise.all([
          fetch(`${API_BASE}/school/roles/${orgId}`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }),
          fetch(`${API_BASE}/school/permissions/all`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
        ]);
        if (rolesRes.ok && permsRes.ok) {
          const rolesData = await rolesRes.json();
          // Transform role's complex permissions array into a simple flat array of permission IDs for local state
          const formattedRoles = rolesData.map(r => ({
             ...r,
             permissionIds: r.permissions ? r.permissions.map(p => p.id) : []
          }));
          setRoles(formattedRoles);
          setAllPermissions(await permsRes.json());
          if (formattedRoles.length > 0) setSelectedRoleId(formattedRoles[0].id);
        }
      } finally { setLoading(false); }
    };
    fetchData();
  }, [orgId]);

  const selectedRole = roles.find(r => r.id === selectedRoleId);

  // Group all available permissions by module
  const groupedPermissions = useMemo(() => {
    return allPermissions.reduce((acc, perm) => {
      if (!acc[perm.module]) acc[perm.module] = [];
      acc[perm.module].push(perm);
      return acc;
    }, {});
  }, [allPermissions]);

  const togglePermission = (permId) => {
    setRoles(roles.map(r => {
      if (r.id === selectedRoleId) {
        const hasPerm = r.permissionIds.includes(permId);
        return {
          ...r,
          permissionIds: hasPerm ? r.permissionIds.filter(id => id !== permId) : [...r.permissionIds, permId]
        };
      }
      return r;
    }));
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) return;
    try {
      setSaving(true);
      const res = await fetch(`${API_BASE}/school/roles/${selectedRole.id}/permissions`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ permissionIds: selectedRole.permissionIds })
      });
      if (res.ok) {
        setNotification({ open: true, message: 'Permissions saved successfully', severity: 'success' });
      } else {
        setNotification({ open: true, message: 'Failed to save permissions', severity: 'error' });
      }
    } catch (err) {
      setNotification({ open: true, message: 'Network error saving permissions', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}><Typography color="text.secondary">Loading access control matrix...</Typography></Box>;

  return (
    <Box sx={{ display: 'flex', border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden', bgcolor: 'white', minHeight: 450 }}>
      <Box sx={{ width: 260, borderRight: '1px solid', borderColor: 'divider', bgcolor: 'grey.50', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="overline" color="text.secondary">System Roles</Typography>
          <Button size="small" color="secondary" startIcon={<AddIcon />} sx={{ fontSize: '0.65rem' }}>Add</Button>
        </Box>
        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          <List component="nav" disablePadding sx={{ py: 1 }}>
            {roles.map(role => (
              <RoleItem key={role.id} role={role} active={selectedRoleId === role.id} count={role.permissionIds.length} onSelect={() => setSelectedRoleId(role.id)} />
            ))}
          </List>
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
        {selectedRole ? (
          <>
            <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'grey.25' }}>
              <Box>
                <Typography variant="h6">{selectedRole.name}</Typography>
                <Typography variant="caption" color="text.secondary">{selectedRole.description || 'No description provided'} • {selectedRole.permissionIds.length} Active Permissions</Typography>
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Button variant="contained" color="secondary" size="small" startIcon={<SaveIcon />} disabled={saving} onClick={handleSavePermissions} sx={{ color: 'white', fontSize: '0.7rem' }}>
                   {saving ? 'Saving...' : 'Save Access'}
                </Button>
              </Stack>
            </Box>

            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
              <Stack spacing={3}>
                {Object.entries(groupedPermissions).map(([moduleName, perms]) => (
                  <Box key={moduleName} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: 'primary.main', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {moduleName}
                    </Typography>
                    <Stack spacing={1}>
                      {perms.map(perm => {
                        const isChecked = selectedRole.permissionIds.includes(perm.id);
                        return (
                          <Box 
                            key={perm.id} onClick={() => togglePermission(perm.id)}
                            sx={{ 
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, borderRadius: 1, cursor: 'pointer',
                              '&:hover': { bgcolor: alpha('#000', 0.02) }, border: '1px solid transparent', borderColor: isChecked ? alpha('#000', 0.05) : 'transparent'
                            }}
                          >
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>{perm.name}</Typography>
                              <Typography variant="caption" color="text.secondary">{perm.description || 'System operation permission'}</Typography>
                            </Box>
                            <Box sx={{ width: 20, height: 20, borderRadius: '4px', border: '2px solid', borderColor: isChecked ? 'secondary.main' : 'divider', bgcolor: isChecked ? 'secondary.main' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                              {isChecked && <CheckCircleIcon sx={{ fontSize: 16, color: 'white' }} />}
                            </Box>
                          </Box>
                        );
                      })}
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Box>
          </>
        ) : (
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.disabled' }}>
             <Typography variant="body2">Select a role to manage permissions</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

// --- Main Component ---
export default function SystemSetup() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [tab, setTab] = useState(0);
  const [schoolData, setSchoolData] = useState(INITIAL_SCHOOL_DATA);
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchSchoolData = async () => {
      if (!user?.orgId) return;
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/school/profile/${user.orgId}`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
        if (response.ok) {
          const data = await response.json();
          setSchoolData(data);
        }
      } catch (err) {
        setNotification({ open: true, message: 'Could not load school profile.', severity: 'error' });
      } finally { setLoading(false); }
    };
    fetchSchoolData();
  }, [user?.orgId]);

  const handleSaveProfile = async () => {
    if (!user?.orgId) return;
    try {
      setSaving(true);
      const formData = new FormData();
      Object.keys(schoolData).forEach(key => {
        if (schoolData[key] !== null && schoolData[key] !== undefined && schoolData[key] !== '' && key !== 'logo_url') {
          formData.append(key, schoolData[key]);
        }
      });
      if (logoFile) formData.append('logo_url', logoFile);

      const response = await fetch(`${API_BASE}/school/profile/${user.orgId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData
      });
      if (response.ok) {
        setNotification({ open: true, message: 'Profile saved successfully!', severity: 'success' });
      } else {
        setNotification({ open: true, message: 'Failed to save configuration', severity: 'error' });
      }
    } catch (err) {
      setNotification({ open: true, message: 'Connection to backend failed', severity: 'error' });
    } finally { setSaving(false); }
  };

  const handleCloseNotification = () => setNotification({ ...notification, open: false });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', bgcolor: '#f8f9fa' }}>
        <Stack spacing={2} alignItems="center">
          <SettingsIcon className="animate-spin" sx={{ fontSize: 48, color: 'primary.main', opacity: 0.5 }} />
          <Typography color="text.secondary">Loading System Configuration...</Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#f8f9fa' }}>
      <Box sx={{ px: 3, py: 1, bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', sticky: 'top', zIndex: 1100 }}>
        <Typography variant="subtitle2" color="text.secondary">SYSTEM CONFIGURATION</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button variant="contained" color="secondary" startIcon={<SaveIcon />} onClick={handleSaveProfile} disabled={saving || tab !== 0} sx={{ fontSize: '0.7rem', px: 3, color: 'white' }}>
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </Stack>
      </Box>

      <Box sx={{ p: 4, flex: 1, overflowY: "auto", px: 6 }}>
        <Stack direction="row" spacing={4} alignItems="flex-start" sx={{ mb: 4 }}>
          <Box sx={{ position: 'relative' }}>
             <Box sx={{ width: 120, height: 120, bgcolor: 'white', borderRadius: 4, border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <SettingsIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
             </Box>
             <Typography variant="caption" sx={{ position: 'absolute', bottom: -20, width: '100%', textAlign: 'center', color: 'text.disabled', fontSize: '10px' }}>Setup Mode</Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" sx={{ color: 'text.primary', mb: 1 }}>System Configuration</Typography>
            <Grid container spacing={4} sx={{ mt: 2 }}>
               {[
                 { label: 'Security Level', value: 'High', icon: <SecurityIcon fontSize="small" /> },
                 { label: 'Global Status', value: 'Live', icon: <CheckCircleIcon fontSize="small" /> },
                ].map((stat, i) => (
                 <Grid item key={i} xs={3}>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ borderBottom: '1px solid transparent', '&:hover': { borderColor: 'divider' }, pb: 0.5, cursor: 'pointer' }}>
                      <Box sx={{ color: 'text.disabled', display: 'flex' }}>{stat.icon}</Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.primary' }}>
                          <Box component="span" sx={{ color: 'text.disabled', mr: 0.5 }}>{stat.label}:</Box>
                          <Box component="span">{stat.value}</Box>
                        </Typography>
                      </Box>
                    </Stack>
                 </Grid>
               ))}
            </Grid>
          </Box>
        </Stack>

        <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', mb: 3 }}>
          <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ '& .MuiTabs-indicator': { height: 2, bgcolor: 'primary.main' }, '& .MuiTab-root': { fontSize: '0.875rem', minHeight: 48, textTransform: 'none', color: 'text.secondary', '&.Mui-selected': { color: 'primary.main' } } }}>
            <Tab icon={<SchoolIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="School Profile" />
            <Tab icon={<PeopleIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="User Directory" />
            <Tab icon={<SecurityIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Permissions & Roles" />
          </Tabs>
        </Box>

        <Box sx={{ minHeight: 400 }}>
          {tab === 0 && <ProfileTab data={schoolData} onChange={setSchoolData} logoFile={logoFile} setLogoFile={setLogoFile} />}
          {tab === 1 && <UserManagementTab orgId={user?.orgId} />}
          {tab === 2 && <PermissionsTab orgId={user?.orgId} setNotification={setNotification} />}
        </Box>
      </Box>

      <Snackbar open={notification.open} autoHideDuration={4000} onClose={handleCloseNotification} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseNotification} severity={notification.severity} variant="filled" sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
