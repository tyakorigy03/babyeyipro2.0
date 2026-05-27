import React, { useState, useEffect } from 'react';
import { api } from '@/services';
import { 
  Dialog, 
  DialogActions,
  DialogTitle,
  DialogContent,
  Box, 
  Typography, 
  Stack, 
  InputBase,
  Button,
  alpha,
  useTheme,
  MenuItem,
  Select,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  IconButton,
  Collapse,
  Chip,
  Checkbox,
  Menu,
  Popover
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import DiscoveryModal from './DiscoveryModal';

const StyledSelect = styled(Select)(({ theme }) => ({
  fontSize: '0.875rem',
  '&:before, &:after': {
    borderBottomColor: '#e2e8f0',
  },
  '&:hover:not(.Mui-disabled):before': {
    borderBottomColor: theme.palette.primary.main,
  },
}));

const NavButton = styled(ListItemButton)(({ theme, active, depth = 0 }) => ({
  padding: theme.spacing(0.4, 1.5),
  minHeight: 32,
  borderRadius: 0,
  borderLeft: active ? `3px solid ${theme.palette.primary.main}` : '3px solid transparent',
  backgroundColor: active ? theme.palette.action.selected : 'transparent',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  paddingLeft: theme.spacing(1.5 + depth * 2),
  '& .MuiTypography-root': {
    fontSize: depth === 0 ? '0.85rem' : '0.8rem',
    fontWeight: (active || depth === 0) ? 700 : 500,
    color: active ? theme.palette.text.primary : theme.palette.text.secondary,
  }
}));

function RecursivePathItem({ item, depth = 0, onDiscovery, rules = [], onToggleRule, onAddRule }) {
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);

  const hasChildren = item.children && item.children.length > 0;
  const hasFilters = item.filters && item.filters.length > 0;

  const isChecked = (item.instant && !item.multiple) ? rules.some(r => r.label === item.label) : false;

  const handleToggle = (e) => {
    e.stopPropagation();
    if (hasChildren || hasFilters) {  
      setIsOpen(!isOpen);
    } else if (item.instant && !item.multiple) {
      onToggleRule?.(item);
    } else if (item.instant) {
      onDiscovery({ type: item.type, multiple: item.multiple, label: item.label });
    }
  };

  const handleFilterClick = (e, f) => {
    e.stopPropagation();
    if (f.options || f.isInput || f.isDate) {
      setAnchorEl(e.currentTarget);
      setActiveFilter(f);
    } else {
      onDiscovery({ type: f.type, multiple: f.multiple, label: f.label });
    }
  };

  return (
    <Box>
      <NavButton depth={depth} onClick={handleToggle} active={isOpen && (hasChildren || hasFilters)}>
        <ListItemIcon sx={{ minWidth: 20 }}>
          {(hasChildren || hasFilters) && (
            <Box sx={{ display: 'flex', transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: '0.2s' }}>
              <ExpandMoreIcon sx={{ fontSize: 16 }} />
            </Box>
          )}
          {item.instant && !item.multiple && (
            <Checkbox 
              checked={isChecked} 
              size="small" 
              sx={{ p: 0, mr: 1, '& .MuiSvgIcon-root': { fontSize: 18 } }}
              disableRipple
            />
          )}
        </ListItemIcon>
        <ListItemText primary={item.label} />
        {!hasChildren && !hasFilters && !item.instant && (
          <ChevronRightIcon sx={{ fontSize: 14, opacity: 0.5 }} />
        )}
      </NavButton>

      <Collapse in={isOpen}>
        <Box sx={{ borderLeft: depth >= 0 ? '1px solid' : 'none', borderColor: 'divider', ml: 2.5 }}>
          {hasChildren && item.children.map(child => (
            <RecursivePathItem 
              key={child.label} 
              item={child} 
              depth={depth + 1} 
              onDiscovery={onDiscovery}
              rules={rules}
              onToggleRule={onToggleRule}
              onAddRule={onAddRule}
            />
          ))}
          {hasFilters && item.filters.map(f => (
            <NavButton 
              key={f.label} 
              depth={depth + 1}
              onClick={(e) => handleFilterClick(e, f)}
            >
              <ListItemIcon sx={{ minWidth: 20 }} />
              <ListItemText 
                primary={f.label} 
                primaryTypographyProps={{ sx: { fontSize: '0.75rem !important', fontWeight: 600 } }}
              />
              {(f.options || f.isInput || f.isDate) ? (
                <ExpandMoreIcon sx={{ fontSize: 12, opacity: 0.5 }} />
              ) : (
                <SearchIcon sx={{ fontSize: 12, opacity: 0.5 }} />
              )}
            </NavButton>
          ))}
        </Box>
      </Collapse>

      {/* Dropdown Menus for static option filters */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl) && activeFilter && !!activeFilter.options}
        onClose={() => { setAnchorEl(null); setActiveFilter(null); }}
      >
        {activeFilter?.options?.map(opt => (
          <MenuItem 
            key={opt} 
            onClick={() => {
              onAddRule?.(activeFilter.label, activeFilter.type, opt, opt);
              setAnchorEl(null);
              setActiveFilter(null);
            }}
          >
            {opt}
          </MenuItem>
        ))}
      </Menu>

      {/* Popovers for text inputs & dates */}
      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl) && activeFilter && (activeFilter.isInput || activeFilter.isDate)}
        onClose={() => { setAnchorEl(null); setActiveFilter(null); }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        PaperProps={{ sx: { p: 2, display: 'flex', flexDirection: 'column', gap: 1 } }}
      >
        {activeFilter?.isInput && (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <InputBase
              placeholder={activeFilter.placeholder || "Enter value..."}
              autoFocus
              sx={{ fontSize: '0.8rem', borderBottom: '1px solid #ccc', pb: 0.5 }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  onAddRule?.(activeFilter.label, activeFilter.type, e.target.value.trim(), e.target.value.trim());
                  setAnchorEl(null);
                  setActiveFilter(null);
                }
              }}
            />
          </Box>
        )}
        {activeFilter?.isDate && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>Select Date</Typography>
            <input 
              type="date" 
              style={{ fontSize: '0.85rem', padding: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
              onChange={(e) => {
                if (e.target.value) {
                  onAddRule?.(activeFilter.label, activeFilter.type, e.target.value, e.target.value);
                  setAnchorEl(null);
                  setActiveFilter(null);
                }
              }}
            />
          </Box>
        )}
      </Popover>
    </Box>
  );
}

export default function QuickCreateGroupModal({ open, onClose, onSave }) {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [step1, setStep1] = useState(''); 
  const [rules, setRules] = useState([]); // Odoo-style rule stack
  const [discovery, setDiscovery] = useState({ open: false, type: '', multiple: false, label: '' });
  const [discoveryItems, setDiscoveryItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (!discovery.open || !discovery.type) {
      setDiscoveryItems([]);
      setFetchError(null);
      return;
    }

    const fetchItems = async () => {
      setLoadingItems(true);
      setFetchError(null);
      try {
        let data = [];
        switch (discovery.type) {
          case 'level':
            {
              const levelsData = await api.foundation.getLevels();
              data = levelsData.map(l => ({
                id: l.id || l.level_id,
                name: l.name,
                category: l.category || 'Academic',
                capacity: l.capacity || 200
              }));
            }
            break;
          case 'grade':
            {
              const [gradesData, levelsData] = await Promise.all([
                api.foundation.getGrades(),
                api.foundation.getLevels()
              ]);
              data = gradesData.map(g => {
                const level = levelsData.find(l => l.id === g.level_id || l.level_id === g.level_id);
                return {
                  id: g.id,
                  name: g.name,
                  level: level ? level.name : 'N/A'
                };
              });
            }
            break;
          case 'class':
            {
              const [classesData, academicGroupsData, gradesData] = await Promise.all([
                api.foundation.getSections(),
                api.foundation.getAcademicGroups(),
                api.foundation.getGrades()
              ]);
              data = classesData.map(c => {
                const ag = academicGroupsData.find(g => g.id === c.academic_group_id);
                const grade = ag ? gradesData.find(g => g.id === ag.grade_id) : null;
                const gradeName = grade ? grade.name : '';
                return {
                  id: c.id,
                  name: c.custom_name || `${gradeName} ${c.stream}`.trim(),
                  level: gradeName || 'N/A',
                  students: c.capacity || 40
                };
              });
            }
            break;
          case 'student':
            {
              const [studentsData, enrollmentsData, classesData, academicGroupsData, gradesData] = await Promise.all([
                api.foundation.getStudents(),
                api.foundation.getEnrollments(),
                api.foundation.getSections(),
                api.foundation.getAcademicGroups(),
                api.foundation.getGrades()
              ]);
              data = studentsData.map(s => {
                const enrollment = enrollmentsData.find(e => e.student_id === s.id && e.status === 'Active');
                const cls = enrollment ? classesData.find(c => c.id === enrollment.class_id) : null;
                let className = 'N/A';
                if (cls) {
                  if (cls.custom_name) className = cls.custom_name;
                  else {
                    const ag = academicGroupsData.find(g => g.id === cls.academic_group_id);
                    const grade = ag ? gradesData.find(g => g.id === ag.grade_id) : null;
                    const gradeName = grade ? grade.name : '';
                    className = `${gradeName} ${cls.stream}`.trim();
                  }
                }
                return {
                  id: s.id,
                  name: s.full_name || s.name || 'Unknown',
                  code: s.student_id_number || 'N/A',
                  class: className
                };
              });
            }
            break;
          case 'rooms':
            {
              const roomsData = await api.foundation.getRooms();
              data = roomsData.map(r => ({
                id: r.id,
                name: r.name,
                type: r.type || 'Classroom',
                capacity: r.capacity || 'N/A'
              }));
            }
            break;
          case 'blocks':
            {
              const blocksData = await api.foundation.getLocations();
              data = blocksData.map(b => ({
                id: b.id,
                name: b.name,
                description: b.description || 'Building Block / Area'
              }));
            }
            break;
          case 'groups':
            {
              const groupsData = await api.foundation.getStudentGroups();
              data = groupsData.map(g => ({
                id: g.id,
                name: g.name,
                description: g.description || 'Logic Profile / Group'
              }));
            }
            break;
          case 'staff':
            {
              const [staffData, rolesData, deptsData] = await Promise.all([
                api.foundation.getStaff(),
                api.foundation.getRoles(),
                api.foundation.getDepartments()
              ]);
              data = staffData.map(s => {
                const name = s.full_name || s.name || (s.user ? s.user.full_name : null) || `Staff #${s.staff_number || s.id.substring(0, 8)}`;
                const role = s.designation || (s.role ? s.role.name : 'Staff');
                const dept = deptsData.find(d => d.id === s.department_id);
                const deptName = dept ? dept.name : 'N/A';
                return {
                  id: s.id,
                  name,
                  role,
                  department: deptName
                };
              });
            }
            break;
          case 'units':
            {
              const deptsData = await api.foundation.getDepartments();
              data = deptsData.map(d => ({
                id: d.id,
                name: d.name,
                type: d.type || 'Department',
                parent: d.parent ? d.parent.name : 'None'
              }));
            }
            break;
          case 'roles':
            {
              const rolesData = await api.foundation.getRoles();
              data = rolesData.map(r => ({
                id: r.id,
                name: r.name,
                description: r.description || 'Staff Role'
              }));
            }
            break;
          case 'parent':
            {
              const parentsData = await api.foundation.getParents();
              data = parentsData.map(p => ({
                id: p.id,
                name: p.full_name || p.name || 'Unknown',
                phone: p.phone_number || p.phone || 'N/A',
                location: p.residence || 'N/A'
              }));
            }
            break;
          default:
            data = [];
        }

        setDiscoveryItems(data);
      } catch (err) {
        console.error('Error fetching discovery items:', err);
        setFetchError('An error occurred while fetching records from the server.');
        setDiscoveryItems([]);
      } finally {
        setLoadingItems(false);
      }
    };

    fetchItems();
  }, [discovery.open, discovery.type]);

  const BRANCHES = {
    student: {
      label: 'Students',
      options: [
        { label: 'Academic Placement & Residency', children: [
          { label: 'Academic Placement', filters: [
            { label: 'By Level', type: 'level' },
            { label: 'By Grade', type: 'grade' },
            { label: 'By Class', type: 'class' }
          ]},
          { label: 'Physical Environment', filters: [
            { label: 'By Location', type: 'rooms' },
            { label: 'By Building Block', type: 'blocks' }
          ]},
          { label: 'Residential Status', children: [
            { label: 'Day Students', type: 'student', instant: true, preset: 'Day Student' },
            { label: 'Boarding Students', children: [
              { label: 'All Boarding Students', type: 'student', instant: true, preset: 'Boarding' },
              { label: 'By Hostel / House', type: 'blocks' }
            ]}
          ]}
        ]},
        { label: 'Status & Enrollment', children: [
          { label: 'Active Students', type: 'status', instant: true, preset: 'active' },
          { label: 'Inactive Students', type: 'status', instant: true, preset: 'inactive' },
          { label: 'Suspended Students', type: 'status', instant: true, preset: 'suspended' },
          { label: 'Transferred Students', type: 'status', instant: true, preset: 'transferred' },
          { label: 'Dropped Students', type: 'status', instant: true, preset: 'dropped' },
          { label: 'Withdrawn Students', type: 'status', instant: true, preset: 'withdrawn' },
          { label: 'Completed Students', type: 'status', instant: true, preset: 'completed' }
        ]},
        { label: 'Personal & Origin', children: [
          { label: 'Basic Info', children: [
            { label: 'Male Students', type: 'gender', instant: true, preset: 'Male' },
            { label: 'Female Students', type: 'gender', instant: true, preset: 'Female' },
            { label: 'Other Gender', type: 'gender', instant: true, preset: 'Other' }
          ], filters: [
            { label: 'By Date of Birth', type: 'dob', isDate: true }
          ]},
          { label: 'Origin Details', filters: [
            { label: 'By Nationality', type: 'nationality', isInput: true, placeholder: 'e.g. Rwandan' },
            { label: 'By Residence Area', type: 'residence', isInput: true, placeholder: 'e.g. Kigali' }
          ]}
        ]},
        { label: 'Transport & Dismissal', children: [
          { label: 'By Dismissal Mode', children: [
            { label: 'Bus Riders', type: 'dismissal_mode', instant: true, preset: 'Bus' },
            { label: 'Parent Pickup', type: 'dismissal_mode', instant: true, preset: 'Parent Pickup' },
            { label: 'Self Departure', type: 'dismissal_mode', instant: true, preset: 'Self' },
            { label: 'Other Departure', type: 'dismissal_mode', instant: true, preset: 'Other' }
          ]},
          { label: 'By Transport Route', filters: [
            { label: 'Search Routes', type: 'blocks' }
          ]},
          { label: 'By Transport Vehicle', filters: [
            { label: 'Search Vehicles', type: 'blocks' }
          ]}
        ]},
        { label: 'Existing Profiles & Groups', instant: true, type: 'groups', multiple: true },
        { label: 'Specific Individuals', instant: true, type: 'student', multiple: true }
      ]
    },
    staff: {
      label: 'Staff',
      options: [
        { label: 'Org Units & Roles', filters: [
          { label: 'By Department', type: 'units' },
          { label: 'By Role', type: 'roles' }
        ]},
        { label: 'Status & Employment', children: [
          { label: 'Employment Status', children: [
            { label: 'Active Staff', type: 'staff_status', instant: true, preset: 'active' },
            { label: 'On Leave Staff', type: 'staff_status', instant: true, preset: 'on_leave' },
            { label: 'Suspended Staff', type: 'staff_status', instant: true, preset: 'suspended' },
            { label: 'Terminated Staff', type: 'staff_status', instant: true, preset: 'terminated' }
          ]},
          { label: 'Employment Type', children: [
            { label: 'Full-time Staff', type: 'employment_type', instant: true, preset: 'Full-time' },
            { label: 'Part-time Staff', type: 'employment_type', instant: true, preset: 'Part-time' },
            { label: 'Contract Staff', type: 'employment_type', instant: true, preset: 'Contract' },
            { label: 'Intern Staff', type: 'employment_type', instant: true, preset: 'Intern' }
          ]}
        ]},
        { label: 'Specific Individuals', instant: true, type: 'staff', multiple: true }
      ]
    }
  };

  const handleDiscoverySelect = (items) => {
    const displayValue = Array.isArray(items) 
      ? (items.length === 1 ? items[0].name : `${items.length} items`)
      : (items.name || items);
    
    const newRule = {
      id: Date.now(),
      label: discovery.label,
      type: discovery.type,
      value: Array.isArray(items) ? items.map(i => i.id || i) : (items.id || items),
      displayValue
    };

    setRules([...rules, newRule]);
    setDiscovery({ ...discovery, open: false });
  };

  const removeRule = (id) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const handleToggleRule = (item) => {
    const exists = rules.some(r => r.label === item.label);
    if (exists) {
      setRules(rules.filter(r => r.label !== item.label));
    } else {
      const newRule = {
        id: Date.now(),
        label: item.label,
        type: item.type || 'preset',
        value: item.preset || item.label,
        displayValue: item.preset || item.label
      };
      setRules([...rules, newRule]);
    }
  };

  const handleAddRule = (label, type, value, displayValue) => {
    const exists = rules.some(r => r.label === label && r.value === value);
    if (exists) return; // avoid duplicate exact rules
    
    const newRule = {
      id: Date.now(),
      label,
      type,
      value,
      displayValue: displayValue || value
    };
    setRules([...rules, newRule]);
  };

  const handleSave = () => {
    onSave?.({
      name,
      type: 'Custom',
      resolution_strategy: 'dynamic',
      resolution_config: {
        entity: step1,
        rules: rules.map(({ label, type, value }) => ({ label, type, value })),
        _display: { entity: step1, rulesCount: rules.length }
      }
    });
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xs" 
      fullWidth
      PaperProps={{ sx: { borderRadius: '12px' } }}
    >
      <DialogTitle sx={{ pb: 1, fontWeight: 700 }}>Logic Profile Builder</DialogTitle>
      
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 0 }}>
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5, display: 'block' }}>Profile Name</Typography>
          <InputBase 
            fullWidth
            placeholder="e.g. Science Block Girls"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ fontSize: '0.875rem', fontWeight: 500, borderBottom: '1px solid #e2e8f0', pb: 0.5, '&:focus-within': { borderColor: theme.palette.primary.main } }}
          />
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5, display: 'block' }}>1. Target Entity</Typography>
          <StyledSelect
            fullWidth
            variant="standard"
            value={step1}
            onChange={(e) => { setStep1(e.target.value); setRules([]); }}
            displayEmpty
          >
            <MenuItem value="" disabled>Select target...</MenuItem>
            {Object.entries(BRANCHES).map(([key, config]) => (
              <MenuItem key={key} value={key}>{config.label}</MenuItem>
            ))}
          </StyledSelect>
        </Box>

        {step1 && (
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>2 . Add filter rules</Typography>
            <List disablePadding sx={{ border: '1px solid #f1f5f9', borderRadius: '8px', bgcolor: '#fafafa' }}>
              <RecursivePathItem 
                item={{ label: `Discover ${BRANCHES[step1].label} Logic`, children: BRANCHES[step1].options }} 
                onDiscovery={(d) => setDiscovery({ open: true, ...d })}
                rules={rules}
                onToggleRule={handleToggleRule}
                onAddRule={handleAddRule}
              />
            </List>
          </Box>
        )}

        {rules.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="primary.main" sx={{ fontWeight: 700, display: 'block', mb: 1, textTransform: 'uppercase', fontSize: '0.65rem' }}>Active Logic Stack</Typography>
            <Stack direction="row" sx={{ flexWrap: 'wrap' }} gap={1}>
              {rules.map((rule) => (
                <Chip 
                  key={rule.id}
                  size="small"
                  label={`${rule.label}: ${rule.displayValue}`}
                  onDelete={() => removeRule(rule.id)}
                  sx={{ 
                    borderRadius: '6px', 
                    fontWeight: 600, 
                    fontSize: '0.75rem',
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    color: 'primary.main',
                    borderColor: alpha(theme.palette.primary.main, 0.1),
                    '& .MuiChip-deleteIcon': { color: 'primary.main' }
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: '#fafafa', borderTop: '1px solid #f1f5f9' }}>
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 700, textTransform: 'none' }}>Cancel</Button>
        <Button 
          variant="contained" 
          disableElevation
          onClick={handleSave}
          disabled={!name || rules.length === 0}
          sx={{ borderRadius: '6px', px: 3, fontWeight: 700, textTransform: 'none', color: 'white' }}
        >
          Finalize Logic Profile
        </Button>
      </DialogActions>

      <DiscoveryModal 
        open={discovery.open}
        type={discovery.type}
        multiple={discovery.multiple}
        items={discoveryItems}
        loading={loadingItems}
        error={fetchError}
        onSelect={handleDiscoverySelect}
        onClose={() => setDiscovery({ ...discovery, open: false })}
      />
    </Dialog>
  );
}
