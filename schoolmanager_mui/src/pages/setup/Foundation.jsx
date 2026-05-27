import React, { useState, Fragment, useEffect } from 'react';
import { api } from '@/services';
import {
  Box,
  Typography,
  Stack,
  Button,
  Tabs,
  Tab,
  Paper,
  IconButton,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
  useTheme,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Save as SaveIcon,
  School as SchoolIcon,
  CalendarMonth as CalendarIcon,
  Settings as SettingsIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  KeyboardArrowRight as ChevronRightIcon,
  KeyboardArrowDown as ChevronDownIcon,
  ArrowForward as ArrowForwardIcon,
  Groups as GroupsIcon,
  Layers as LayersIcon,
  Assignment as AssignmentIcon,
  LocalOffer as TagIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Work as WorkIcon,
  Close as CloseIcon,
  LocationCity as CityIcon,
  MeetingRoom as RoomIcon,
  Science as ScienceIcon,
  Restaurant as DiningIcon,
  Church as ChapelIcon,
  AccessTime as ClockIcon,
  LocationOn as MapPinIcon,
  Person as PersonIcon,
  PictureAsPdf as PdfIcon,
  Description as ExcelIcon,
  FileUpload as ImportIcon,
  DirectionsBus as BusIcon,
  Route as RouteIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { alpha, styled } from '@mui/material/styles';
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import DiscoveryModal from '../../ui/components/DataEntryEngine/DiscoveryModal';
import QuickCreateModal from '../../ui/components/DataEntryEngine/QuickCreateModal';
import QuickCreateGroupModal from '../../ui/components/DataEntryEngine/QuickCreateGroupModal';

const filter = createFilterOptions();

// --- Constants & Utilities ---

const ROOM_TYPE_ICONS = {
  Classroom: <SchoolIcon fontSize="inherit" />,
  Laboratory: <ScienceIcon fontSize="inherit" />,
  Refectory: <DiningIcon fontSize="inherit" />,
  Chapel: <ChapelIcon fontSize="inherit" />,
  Office: <WorkIcon fontSize="inherit" />,
  Other: <RoomIcon fontSize="inherit" />
};




function ModuleOptions() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton size="small" onClick={handleClick}>
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{ 
          sx: { 
            minWidth: 180, 
            borderRadius: '10px', 
            mt: 1, 
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            border: '1px solid',
            borderColor: 'divider'
          } 
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Typography variant="overline" sx={{ px: 2, py: 0.5, display: 'block', color: 'text.disabled', fontWeight: 700 }}>Options</Typography>
        <MenuItem onClick={handleClose} sx={{ fontSize: '0.8rem', gap: 1.5, py: 1 }}>
          <PdfIcon sx={{ fontSize: 16, color: 'error.main' }} /> Export as PDF
        </MenuItem>
        <MenuItem onClick={handleClose} sx={{ fontSize: '0.8rem', gap: 1.5, py: 1 }}>
          <ExcelIcon sx={{ fontSize: 16, color: 'success.main' }} /> Export to Excel
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleClose} sx={{ fontSize: '0.8rem', gap: 1.5, py: 1 }}>
          <ImportIcon sx={{ fontSize: 16, color: 'primary.main' }} /> Import from File
        </MenuItem>
      </Menu>
    </>
  );
}

// --- Styled Components ---

const CountBadge = styled(Box)(({ theme }) => ({
  fontSize: '0.65rem',
  fontWeight: 600,
  backgroundColor: theme.palette.action.disabledBackground,
  color: theme.palette.text.secondary,
  padding: '1px 6px',
  borderRadius: '10px',
  marginLeft: theme.spacing(1),
}));

const NavButton = styled(ListItemButton)(({ theme, active }) => ({
  padding: theme.spacing(0.8, 1.5),
  minHeight: 40,
  borderRadius: 0,
  borderLeft: active ? `3px solid ${theme.palette.secondary.main}` : '3px solid transparent',
  backgroundColor: active ? alpha(theme.palette.secondary.main, 0.08) : 'transparent',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '& .MuiTypography-root': {
    fontSize: '0.85rem',
    color: active ? theme.palette.secondary.main : theme.palette.text.primary,
    fontWeight: active ? 600 : 400,
  }
}));

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
};

function RoutineSelect({ value, options = [], onSelect, onSearchMore, disabled }) {
  const theme = useTheme();
  const selectedValue = options.find(t => t.id === value || t.id === Number(value)) || null;

  return (
    <Autocomplete
      disabled={disabled}
      value={selectedValue}
      onChange={(event, newValue) => {
        if (newValue && newValue.id === 'search-more') {
          onSearchMore?.();
        } else {
          onSelect?.(newValue);
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
      options={options}
      getOptionLabel={(option) => {
        if (typeof option === 'string') return option;
        return option?.name || '';
      }}
      renderOption={(props, option) => (
        <li {...props} key={option.id || option.name}>
          {option.isAction ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
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
          placeholder="Not Routine Assigned"
          InputProps={{
            ...params.InputProps,
            disableUnderline: true,
            sx: { 
              fontSize: '0.75rem',
              borderBottom: '1px solid #e2e8f0',
              pb: 0.5,
              '&:focus-within': { borderColor: theme.palette.primary.main },
              '& .MuiInputBase-input': { py: 0.75 }
            }
          }}
        />
      )}
      sx={{
        '& .MuiAutocomplete-endAdornment': { top: '50%', transform: 'translateY(-50%)', right: 0 },
        '& .MuiAutocomplete-inputRoot': { pr: '30px !important' }
      }}
    />
  );
}

// --- Sub-components ---

function PhaseDayManagerModal({ phase, routines = [], open, onClose }) {
  const [discoveryOpen, setDiscoveryOpen] = useState(false);
  const [schedule, setSchedule] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && phase) {
      const loadExisting = async () => {
        try {
          const existing = await api.foundation.getSchoolCalendar({ 
            date_from: phase.start_date, 
            date_to: phase.end_date 
          });
          const map = {};
          existing.forEach(entry => {
            map[entry.date] = entry.routine_template_id;
          });
          setSchedule(map);
        } catch (err) {
          console.error("Failed to load existing calendar:", err);
        }
      };
      loadExisting();
    }
  }, [open, phase]);

  if (!phase) return null;

  // Generate days between start and end
  const days = [];
  let curr = new Date(phase.start_date);
  const end = new Date(phase.end_date);
  while (curr <= end) {
    days.push(new Date(curr));
    curr.setDate(curr.getDate() + 1);
  }

  const getDayName = (date) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
  const isWeekend = (date) => date.getDay() === 0 || date.getDay() === 6;

  const handleRoutineChange = (dateStr, routineId) => {
    setSchedule(prev => ({ ...prev, [dateStr]: routineId }));
  };

  const handleApply = async () => {
    try {
      setSaving(true);
      const entries = Object.entries(schedule)
        .filter(([_, routineId]) => routineId) // Only save days that have a routine assigned
        .map(([date, routineId]) => ({
          date,
          routine_template_id: routineId,
          is_academic_day: true,
        }));

      if (entries.length > 0) {
        await api.foundation.saveSchoolCalendar({ entries });
        alert("Schedule applied successfully!");
      }
      onClose();
    } catch (err) {
      console.error("Failed to save schedule:", err);
      alert(`Failed to save schedule: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: '12px', 
          overflow: 'hidden',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        px: 2.5,
        bgcolor: 'white', 
        borderBottom: '1px solid', 
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box>
          <Typography variant='h6' sx={{  color: 'text.primary' }}>
            {phase.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.disabled'}}>
            {formatDate(phase.start_date)} - {formatDate(phase.end_date)} ({days.length} days)
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0, flexGrow: 1, overflowY: 'auto' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ bgcolor: 'white', color: 'secondary.main',  width: 140 }}>Date</TableCell>
              <TableCell sx={{ bgcolor: 'white', color: 'secondary.main',  width: 100 }}>Day</TableCell>
              <TableCell sx={{ bgcolor: 'white', color: 'secondary.main',  }}>Routine Template</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {days.map((date, i) => {
              const dateStr = date.toISOString().split('T')[0];
              const weekend = isWeekend(date);
              return (
                <TableRow 
                  key={dateStr} 
                  hover
                  sx={{ 
                    bgcolor: weekend ? alpha('#f44336', 0.02) : (i % 2 === 0 ? 'white' : 'grey.50'),
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <TableCell  sx={{ }}>{formatDate(dateStr)}</TableCell>
                  <TableCell  sx={{ color: weekend ? 'error.main' : 'text.primary' }}>{getDayName(date)}</TableCell>
                  <TableCell sx={{  }}>
                    <RoutineSelect 
                      value={schedule[dateStr] || ""} 
                      options={routines}
                      disabled={false}
                      onSelect={(val) => handleRoutineChange(dateStr, val?.id)}
                      onSearchMore={() => setDiscoveryOpen(true)}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </DialogContent>

      <Box sx={{ p: 1.5, px: 2.5, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
        <Button 
          variant="text" 
          onClick={onClose}
          size="small"
          sx={{  color: 'text.secondary' }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          color="secondary"
          size="small"
          onClick={handleApply}
          disabled={saving}
        >
          {saving ? 'Applying...' : 'Apply Schedule'}
        </Button>
      </Box>

      <DiscoveryModal 
        open={discoveryOpen}
        type="routine"
        title="Routine Template"
        items={routines}
        onSelect={(item) => {
          console.log('Selected from discovery:', item);
          setDiscoveryOpen(false);
        }}
        onCreateClick={(type) => {
          console.log(`[DiscoveryModal] Create New button clicked for type: ${type}`);
        }}
        onClose={() => setDiscoveryOpen(false)}
      />
    </Dialog>
  );
}

function AcademicTab({ years, routines, onFetchTerms, onFetchPhases }) {
  const [expandedYears, setExpandedYears] = useState({});
  const [expandedTerms, setExpandedTerms] = useState({});
  const [selectedPhase, setSelectedPhase] = useState(null);

  const toggleYear = async (id) => {
    const isExpanding = !expandedYears[id];
    setExpandedYears(prev => ({ ...prev, [id]: isExpanding }));
    if (isExpanding) {
      await onFetchTerms(id);
    }
  };

  const toggleTerm = async (yearId, term) => {
    const isExpanding = !expandedTerms[term.id];
    setExpandedTerms(prev => ({ ...prev, [term.id]: isExpanding }));
    if (isExpanding) {
      await onFetchPhases(yearId, term);
    }
  };

  return (
    <Box sx={{ py: 2 }}>
      <PhaseDayManagerModal 
        phase={selectedPhase} 
        routines={routines}
        open={Boolean(selectedPhase)} 
        onClose={() => setSelectedPhase(null)} 
      />
      <Stack direction="row" sx={{ justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" color="secondary" startIcon={<AddIcon />} sx={{ borderRadius: '4px', fontSize: '0.75rem', color: 'white' }}>
          Create New Academic Year
        </Button>
      </Stack>

      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden', bgcolor: 'white' }}>
        {years.map((year) => (
          <Box key={year.id} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
            <Box 
              sx={{ p: 2, px: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', '&:hover': { bgcolor: 'grey.50' } }}
              onClick={() => toggleYear(year.id)}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <IconButton size="small">
                  {expandedYears[year.id] ? <ChevronDownIcon /> : <ChevronRightIcon />}
                </IconButton>
                <Box>
                  <Typography variant="subtitle1">{year.name}</Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="caption" color="text.secondary">{formatDate(year.start_date)} → {formatDate(year.end_date)}</Typography>
                    {year.status === 'active' && <Chip label="Active" size="small" color="success" sx={{ height: 16, fontSize: '0.65rem' }} />}
                  </Stack>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1}>
                <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                <IconButton size="small"><DeleteIcon fontSize="small" /></IconButton>
              </Stack>
            </Box>

            <Collapse in={expandedYears[year.id]}>
              <Box sx={{ p: 3, pl: 8, bgcolor: 'grey.50' }}>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="overline" color="text.secondary">Terms</Typography>
                  <Button size="small" color="secondary" startIcon={<AddIcon />} sx={{ fontSize: '0.65rem' }}>Add Term</Button>
                </Stack>
                <Stack spacing={2}>
                  {year.terms?.map((term) => (
                    <Paper key={term.id} variant="outlined" sx={{ borderRadius: 1, overflow: 'hidden' }}>
                      <Box 
                        sx={{ p: 1.5, px: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'white', cursor: 'pointer' }}
                        onClick={() => toggleTerm(year.id, term)}
                      >
                        <Stack direction="row" spacing={1} alignItems="center">
                          {expandedTerms[term.id] ? <ChevronDownIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
                          <Typography variant="body2">{term.name}</Typography>
                          {term.is_active && <Chip label="Current" size="small" color="primary" sx={{ height: 14, fontSize: '0.6rem' }} />}
                        </Stack>
                        <Typography variant="caption" color="text.secondary">{formatDate(term.start_date)} → {formatDate(term.end_date)}</Typography>
                      </Box>
                      <Collapse in={expandedTerms[term.id]}>
                        <Box sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid', borderColor: 'divider' }}>
                           <Table size="small">
                             <TableHead sx={{ bgcolor: 'grey.50', borderBottom: '1px solid', borderColor: 'divider' }}>
                               <TableRow>
                                 <TableCell sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>PERIOD</TableCell>
                                 <TableCell sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>PHASE NAME</TableCell>
                                 <TableCell />
                               </TableRow>
                             </TableHead>
                             <TableBody>
                               {term.phases?.length > 0 ? (
                                 term.phases.map(phase => (
                                   <TableRow
                                     key={phase.id}
                                     hover
                                     sx={{ cursor: 'pointer' }}
                                     onClick={(e) => { e.stopPropagation(); setSelectedPhase(phase); }}
                                   >
                                     <TableCell sx={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'text.secondary' }}>
                                       {formatDate(phase.start_date)} → {formatDate(phase.end_date)}
                                     </TableCell>
                                     <TableCell>
                                       <Typography variant="body2" sx={{ fontWeight: 500 }}>{phase.name}</Typography>
                                     </TableCell>
                                     <TableCell align="right"><ArrowForwardIcon sx={{ fontSize: 14, color: 'divider' }} /></TableCell>
                                   </TableRow>
                                 ))
                               ) : (
                                 <TableRow>
                                   <TableCell colSpan={3} align="center" sx={{ color: 'text.disabled', fontSize: '0.75rem', py: 2 }}>
                                     No phases defined yet. Add phases to organize this term.
                                   </TableCell>
                                 </TableRow>
                               )}
                             </TableBody>
                           </Table>
                           <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                              <Button size="small" color="secondary" startIcon={<AddIcon />} sx={{ fontSize: '0.6rem', fontWeight: 700 }}>Add Phase</Button>
                           </Stack>
                        </Box>
                      </Collapse>
                    </Paper>
                  ))}
                </Stack>
              </Box>
            </Collapse>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function LevelItem({ level, active, count, onSelect, onAddGrade }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
    >
      <NavButton active={active} onClick={onSelect}>
        <ListItemIcon sx={{ minWidth: 32 }}>
           <LayersIcon sx={{ fontSize: 18, color: active ? 'secondary.main' : 'text.disabled' }} />
        </ListItemIcon>
        <ListItemText 
          primary={level.name} 
          primaryTypographyProps={{ variant: 'body2' }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 24, justifyContent: 'center' }}>
          {isHovered ? (
            <IconButton 
              size="small" 
              sx={{ 
                p: 0, 
                color: 'secondary.main',
                bgcolor: alpha('#000', 0.05),
                '&:hover': { bgcolor: alpha('#000', 0.1) }
              }}
              onClick={(e) => {
                e.stopPropagation();
                onAddGrade();
              }}
            >
              <AddIcon sx={{ fontSize: 14 }} />
            </IconButton>
          ) : (
             <CountBadge>{count}</CountBadge>
          )}
        </Box>
      </NavButton>
    </Box>
  );
}

function StructureTab({ levels, grades, sections, onRefresh }) {
  const [selectedLevelId, setSelectedLevelId] = useState(null);
  const [selectedGradeId, setSelectedGradeId] = useState(null);

  // Modal State
  const [levelModal, setLevelModal] = useState({ open: false, data: null });
  const [gradeModal, setGradeModal] = useState({ open: false, data: null });

  useEffect(() => {
    if (levels.length > 0 && !selectedLevelId) {
      setSelectedLevelId(levels[0].level_id);
    }
  }, [levels, selectedLevelId]);

  const selectedLevel = levels.find(l => l.level_id === selectedLevelId);
  const levelGrades = grades.filter(g => g.level_id === selectedLevelId);

  const handleSaveLevel = async (data) => {
    try {
      if (levelModal.data) {
        await api.foundation.updateLevel(levelModal.data.id, data);
      } else {
        await api.foundation.createLevel(data);
      }
      setLevelModal({ open: false, data: null });
      onRefresh();
    } catch (err) {
      console.error("Save Level failed:", err);
    }
  };

  const handleDeleteLevel = async (id) => {
    if (window.confirm("Are you sure? Deleting a level will affect all associated grades and classes.")) {
      try {
        await api.foundation.deleteLevel(id);
        if (selectedLevelId === id) setSelectedLevelId(null);
        onRefresh();
      } catch (err) {
        console.error("Delete Level failed:", err);
      }
    }
  };

  const handleSaveGrade = async (data) => {
    try {
      const gradeData = { ...data, level_id: selectedLevelId };
      if (gradeModal.data) {
        await api.foundation.updateGrade(gradeModal.data.id, gradeData);
      } else {
        await api.foundation.createGrade(gradeData);
      }
      setGradeModal({ open: false, data: null });
      onRefresh();
    } catch (err) {
      console.error("Save Grade failed:", err);
    }
  };

  const handleDeleteGrade = async (id) => {
    if (window.confirm("Are you sure you want to delete this grade?")) {
      try {
        await api.foundation.deleteGrade(id);
        onRefresh();
      } catch (err) {
        console.error("Delete Grade failed:", err);
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden', bgcolor: 'white', minHeight: 450 }}>
      {/* Sidebar */}
      <Box sx={{ width: 260, borderRight: '1px solid', borderColor: 'divider', bgcolor: 'grey.50', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="overline" color="text.secondary">Levels</Typography>
          <Button 
            size="small" 
            color="secondary" 
            startIcon={<AddIcon />} 
            sx={{ fontSize: '0.65rem' }}
            onClick={() => setLevelModal({ open: true, data: null })}
          >
            Add
          </Button>
        </Box>
        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          <List component="nav" disablePadding sx={{ py: 1 }}>
            {levels.map(level => {
              const active = selectedLevelId === level.level_id;
              const gradeCount = grades.filter(g => g.level_id === level.level_id).length;
              return (
                <LevelItem 
                  key={level.level_id} 
                  level={level} 
                  active={active} 
                  count={gradeCount}
                  onSelect={() => { setSelectedLevelId(level.level_id); setSelectedGradeId(null); }} 
                  onAddGrade={() => {
                    setSelectedLevelId(level.level_id);
                    setGradeModal({ open: true, data: null });
                  }}
                />
              );
            })}
          </List>
        </Box>
      </Box>

      {/* Detail Panel */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
        {selectedLevel ? (
          <>
            <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'grey.25' }}>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h6" >{selectedLevel.name}</Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  {levelGrades.length} Grades Total
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <IconButton size="small" onClick={() => setLevelModal({ open: true, data: selectedLevel })}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => handleDeleteLevel(selectedLevel.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
                <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 1 }} />
                <ModuleOptions />
              </Stack>
            </Box>

            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: '0.65rem' }}>Grade</TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.65rem' }}>Capacity</TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.65rem' }}>Classes</TableCell>
                    <TableCell align="right" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {levelGrades.map(grade => {
                    const gradeSections = sections.filter(s => s.grade_id === grade.grade_id);
                    const isSelected = selectedGradeId === grade.grade_id;
                    return (
                      <Fragment key={grade.grade_id}>
                        <TableRow 
                          hover 
                          onClick={() => setSelectedGradeId(isSelected ? null : grade.grade_id)}
                          sx={{ 
                            cursor: 'pointer', 
                            bgcolor: isSelected ? 'rgba(37, 99, 235, 0.04)' : 'transparent',
                            borderLeft: isSelected ? '3px solid #2563eb' : 'none',
                            '&:hover .row-actions': { opacity: 1 }
                          }}
                        >
                          <TableCell sx={{ py: 1.5 }}>
                            <Typography variant="body2">{grade.name}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            {gradeSections.reduce((s, x) => s + x.capacity, 0)}
                          </TableCell>
                          <TableCell align="center">
                             <Chip label={`${gradeSections.length} classes`} size="small" sx={{ height: 18, fontSize: '0.65rem' }} />
                          </TableCell>
                          <TableCell align="right">
                             <Stack className="row-actions" direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end', opacity: 0, transition: 'opacity 0.2s' }}>
                                <IconButton size="small" onClick={(e) => { e.stopPropagation(); setGradeModal({ open: true, data: grade }); }}>
                                  <EditIcon sx={{ fontSize: 16 }} />
                                </IconButton>
                                <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDeleteGrade(grade.id); }}>
                                  <DeleteIcon sx={{ fontSize: 16 }} />
                                </IconButton>
                             </Stack>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={4} sx={{ p: 0, borderBottom: isSelected ? '1px solid' : 'none', borderColor: 'divider' }}>
                            <Collapse in={isSelected} timeout="auto" unmountOnExit>
                              <Box sx={{ p: 2, bgcolor: 'rgba(37, 99, 235, 0.02)', borderTop: '1px solid', borderColor: 'divider' }}>
                                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                  <Typography variant="caption" color="primary">Classes in {grade.name}</Typography>
                                  <Button size="small" color="secondary" startIcon={<AddIcon />} sx={{ fontSize: '0.6rem' }}>Add Class</Button>
                                </Stack>
                                <Table size="small">
                                  <TableHead>
                                    <TableRow sx={{ bgcolor: 'white' }}>
                                      <TableCell sx={{ fontSize: '0.6rem' }}>NAME</TableCell>
                                      <TableCell align="center" sx={{ fontSize: '0.6rem' }}>CAPACITY</TableCell>
                                      <TableCell sx={{ fontSize: '0.6rem' }}>TEACHER</TableCell>
                                      <TableCell />
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {gradeSections.map(s => (
                                      <TableRow key={s.section_id}>
                                        <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{grade.name} {s.stream}</TableCell>
                                        <TableCell align="center" sx={{ fontSize: '0.75rem' }}>{s.capacity}</TableCell>
                                        <TableCell sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Not Assigned</TableCell>
                                        <TableCell align="right">
                                          <IconButton size="small"><EditIcon sx={{ fontSize: 14 }} /></IconButton>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                    {gradeSections.length === 0 && (
                                      <TableRow>
                                        <TableCell colSpan={4} align="center" sx={{ py: 2, color: 'text.disabled', fontStyle: 'italic', fontSize: '0.75rem' }}>No classes yet</TableCell>
                                      </TableRow>
                                    )}
                                  </TableBody>
                                </Table>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </Fragment>
                    );
                  })}
                </TableBody>
              </Table>
              <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Button 
                  size="small" 
                  color="secondary" 
                  startIcon={<AddIcon />} 
                  sx={{ fontSize: '0.7rem' }}
                  onClick={() => setGradeModal({ open: true, data: null })}
                >
                  Add Grade to {selectedLevel.name}
                </Button>
              </Box>
            </Box>
          </>
        ) : (
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'text.disabled' }}>
             <SchoolIcon sx={{ fontSize: 48, opacity: 0.1, mb: 1 }} />
             <Typography variant="body2">Select a level to view details</Typography>
          </Box>
        )}
      </Box>

      {/* Modals */}
      <LevelModal 
        open={levelModal.open} 
        onClose={() => setLevelModal({ open: false, data: null })}
        onSave={handleSaveLevel}
        initialData={levelModal.data}
      />

      <GradeModal 
        open={gradeModal.open} 
        onClose={() => setGradeModal({ open: false, data: null })}
        onSave={handleSaveGrade}
        initialData={gradeModal.data}
      />
    </Box>
  );
}

function LevelModal({ open, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({ name: '', code: '', display_order: 0 });

  useEffect(() => {
    if (initialData) setFormData({ name: initialData.name, code: initialData.code, display_order: initialData.display_order || 0 });
    else setFormData({ name: '', code: '', display_order: 0 });
  }, [initialData, open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 1 }}>
        <Typography variant="subtitle1" fontWeight={700}>
          {initialData ? 'Edit Level' : 'Add New Level'}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Stack spacing={2}>
          <TextField 
            label="Level Name" 
            fullWidth 
            size="small" 
            variant="standard"
            value={formData.name} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            placeholder="e.g., Primary"
          />
          <TextField 
            label="Level Code" 
            fullWidth 
            size="small" 
            variant="standard"
            value={formData.code} 
            onChange={(e) => setFormData({ ...formData, code: e.target.value })} 
            placeholder="e.g., PRI"
          />
          <TextField 
            label="Display Order" 
            fullWidth 
            size="small" 
            variant="standard"
            type="number"
            value={formData.display_order} 
            onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })} 
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button onClick={onClose} size="small">Cancel</Button>
        <Button variant="contained" color="secondary" size="small" onClick={() => onSave(formData)}>
          {initialData ? 'Update Level' : 'Create Level'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function GradeModal({ open, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({ name: '', grade_number: 1, code: '' });

  useEffect(() => {
    if (initialData) setFormData({ name: initialData.name, grade_number: initialData.grade_number, code: initialData.code || '' });
    else setFormData({ name: '', grade_number: 1, code: '' });
  }, [initialData, open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 1 }}>
        <Typography variant="subtitle1" fontWeight={700}>
          {initialData ? 'Edit Grade' : 'Add New Grade'}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Stack spacing={2}>
          <TextField 
            label="Grade Name" 
            fullWidth 
            size="small" 
            variant="standard"
            value={formData.name} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            placeholder="e.g., P1"
          />
          <TextField 
            label="Grade Number" 
            fullWidth 
            size="small" 
            variant="standard"
            type="number"
            value={formData.grade_number} 
            onChange={(e) => setFormData({ ...formData, grade_number: parseInt(e.target.value) })} 
          />
          <TextField 
            label="Grade Code" 
            fullWidth 
            size="small" 
            variant="standard"
            value={formData.code} 
            onChange={(e) => setFormData({ ...formData, code: e.target.value })} 
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button onClick={onClose} size="small">Cancel</Button>
        <Button variant="contained" color="secondary" size="small" onClick={() => onSave(formData)}>
          {initialData ? 'Update Grade' : 'Create Grade'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function LocationItem({ block, active, count, onSelect, onAddRoom }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
    >
      <NavButton active={active} onClick={onSelect}>
        <ListItemIcon sx={{ minWidth: 32 }}>
           <CityIcon sx={{ fontSize: 18, color: active ? 'secondary.main' : 'text.disabled' }} />
        </ListItemIcon>
        <ListItemText 
          primary={block.name} 
          primaryTypographyProps={{ variant: 'body2' }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 24, justifyContent: 'center' }}>
          {isHovered ? (
            <IconButton 
              size="small" 
              sx={{ 
                p: 0, 
                color: 'secondary.main',
                bgcolor: alpha('#000', 0.05),
                '&:hover': { bgcolor: alpha('#000', 0.1) }
              }}
              onClick={(e) => {
                e.stopPropagation();
                onAddRoom();
              }}
            >
              <AddIcon sx={{ fontSize: 14 }} />
            </IconButton>
          ) : (
             <CountBadge>{count}</CountBadge>
          )}
        </Box>
      </NavButton>
    </Box>
  );
}

function LocationsTab({ blocks, rooms, onRefresh }) {
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  
  // Modal State
  const [blockModal, setBlockModal] = useState({ open: false, data: null });
  const [roomModal, setRoomModal] = useState({ open: false, data: null });

  useEffect(() => {
    if (blocks.length > 0 && !selectedBlockId) {
      setSelectedBlockId(blocks[0].id);
    }
  }, [blocks, selectedBlockId]);

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);
  const blockRooms = rooms.filter(r => r.blockId === selectedBlockId);

  const handleSaveBlock = async (data) => {
    try {
      if (blockModal.data) {
        await api.foundation.updateBlock(blockModal.data.id, data);
      } else {
        await api.foundation.createBlock(data);
      }
      setBlockModal({ open: false, data: null });
      onRefresh();
    } catch (err) {
      console.error("Save Block failed:", err);
    }
  };

  const handleDeleteBlock = async (id) => {
    if (window.confirm("Are you sure you want to delete this block? All associated rooms will also be removed.")) {
      try {
        await api.foundation.deleteBlock(id);
        if (selectedBlockId === id) setSelectedBlockId(null);
        onRefresh();
      } catch (err) {
        console.error("Delete Block failed:", err);
      }
    }
  };

  const handleSaveRoom = async (data) => {
    try {
      const roomData = { ...data, block_id: selectedBlockId };
      if (roomModal.data) {
        await api.foundation.updateRoom(roomModal.data.id, roomData);
      } else {
        await api.foundation.createRoom(roomData);
      }
      setRoomModal({ open: false, data: null });
      onRefresh();
    } catch (err) {
      console.error("Save Room failed:", err);
    }
  };

  const handleDeleteRoom = async (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await api.foundation.deleteRoom(id);
        onRefresh();
      } catch (err) {
        console.error("Delete Room failed:", err);
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden', bgcolor: 'white', minHeight: 450 }}>
      {/* Sidebar */}
      <Box sx={{ width: 260, borderRight: '1px solid', borderColor: 'divider', bgcolor: 'grey.50', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="overline" color="text.secondary">Buildings & Blocks</Typography>
          <Button 
            size="small" 
            color="secondary" 
            startIcon={<AddIcon />} 
            sx={{ fontSize: '0.65rem' }}
            onClick={() => setBlockModal({ open: true, data: null })}
          >
            Add
          </Button>
        </Box>
        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          <List component="nav" disablePadding sx={{ py: 1 }}>
            {blocks.map(block => (
              <LocationItem 
                key={block.id} 
                block={block} 
                active={selectedBlockId === block.id} 
                count={rooms.filter(r => r.blockId === block.id).length}
                onSelect={() => setSelectedBlockId(block.id)} 
                onAddRoom={() => {
                  setSelectedBlockId(block.id);
                  setRoomModal({ open: true, data: null });
                }}
              />
            ))}
          </List>
        </Box>
      </Box>

      {/* Detail Panel */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
        {selectedBlock ? (
          <>
            <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'grey.25' }}>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h6">{selectedBlock.name}</Typography>
                  <Chip label={selectedBlock.code} size="small" sx={{ height: 20, fontSize: '10px', fontWeight: 700 }} />
                </Stack>
                <Typography variant="caption" color="text.secondary">{selectedBlock.description}</Typography>
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <IconButton size="small" onClick={() => setBlockModal({ open: true, data: selectedBlock })}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => handleDeleteBlock(selectedBlock.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
                <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 1 }} />
                <ModuleOptions />
              </Stack>
            </Box>

            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: '0.65rem' }}>Room / Space Name</TableCell>
                    <TableCell sx={{ fontSize: '0.65rem' }}>Type</TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.65rem' }}>Capacity</TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.65rem' }}>Status</TableCell>
                    <TableCell align="right" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {blockRooms.map(room => (
                    <TableRow key={room.id} hover sx={{ '&:hover .row-actions': { opacity: 1 } }}>
                      <TableCell sx={{ py: 1.5 }}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Box sx={{ color: 'text.disabled', display: 'flex', fontSize: 18 }}>
                            {ROOM_TYPE_ICONS[room.type] || ROOM_TYPE_ICONS.Other}
                          </Box>
                          <Typography variant="body2">{room.name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>{room.type}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">{room.capacity}</Typography>
                      </TableCell>
                      <TableCell align="center">
                         <Chip 
                            label={room.status || 'Active'} 
                            size="small" 
                            variant="outlined"
                            sx={{ 
                              height: 18, 
                              fontSize: '0.6rem', 
                              borderColor: (room.status || 'Active') === 'Active' ? 'success.light' : 'divider',
                              color: (room.status || 'Active') === 'Active' ? 'success.main' : 'text.disabled',
                              bgcolor: (room.status || 'Active') === 'Active' ? alpha('#2e7d32', 0.05) : 'transparent'
                            }} 
                          />
                      </TableCell>
                      <TableCell align="right">
                         <Stack className="row-actions" direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end', opacity: 0, transition: 'opacity 0.2s' }}>
                            <IconButton size="small" onClick={() => setRoomModal({ open: true, data: room })}>
                              <EditIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleDeleteRoom(room.id)}>
                              <DeleteIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                         </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {blockRooms.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 8, color: 'text.disabled' }}>
                        <RoomIcon sx={{ fontSize: 48, opacity: 0.1, mb: 1 }} />
                        <Typography variant="body2">No rooms configured in this block</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
               <Button 
                size="small" 
                color="secondary" 
                startIcon={<AddIcon />} 
                sx={{ fontSize: '0.7rem' }}
                onClick={() => setRoomModal({ open: true, data: null })}
               >
                 Add Room to {selectedBlock.name}
               </Button>
            </Box>
          </>
        ) : (
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'text.disabled' }}>
             <RoomIcon sx={{ fontSize: 48, opacity: 0.1, mb: 1 }} />
             <Typography variant="body2">Select a building to view locations</Typography>
          </Box>
        )}
      </Box>

      {/* Modals */}
      <BlockModal 
        open={blockModal.open} 
        onClose={() => setBlockModal({ open: false, data: null })}
        onSave={handleSaveBlock}
        initialData={blockModal.data}
      />

      <RoomModal 
        open={roomModal.open} 
        onClose={() => setRoomModal({ open: false, data: null })}
        onSave={handleSaveRoom}
        initialData={roomModal.data}
      />
    </Box>
  );
}

function BlockModal({ open, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({ name: '', code: '', description: '' });

  useEffect(() => {
    if (initialData) setFormData({ name: initialData.name, code: initialData.code, description: initialData.description || '' });
    else setFormData({ name: '', code: '', description: '' });
  }, [initialData, open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 1 }}>
        <Typography variant="subtitle1" fontWeight={700}>
          {initialData ? 'Edit Block' : 'Add New Block'}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Stack spacing={2}>
          <TextField 
            label="Block Name" 
            fullWidth 
            size="small" 
            variant="standard"
            value={formData.name} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            placeholder="e.g., Academic Block A"
          />
          <TextField 
            label="Block Code" 
            fullWidth 
            size="small" 
            variant="standard"
            value={formData.code} 
            onChange={(e) => setFormData({ ...formData, code: e.target.value })} 
            placeholder="e.g., BLK-A"
          />
          <TextField 
            label="Description" 
            fullWidth 
            size="small" 
            variant="standard"
            multiline 
            rows={2} 
            value={formData.description} 
            onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button onClick={onClose} size="small">Cancel</Button>
        <Button variant="contained" color="secondary" size="small" onClick={() => onSave(formData)}>
          {initialData ? 'Update Block' : 'Create Block'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function RoomModal({ open, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({ name: '', type: 'Classroom', capacity: 40, status: 'Active' });

  useEffect(() => {
    if (initialData) setFormData({ name: initialData.name, type: initialData.type, capacity: initialData.capacity, status: initialData.status || 'Active' });
    else setFormData({ name: '', type: 'Classroom', capacity: 40, status: 'Active' });
  }, [initialData, open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 1 }}>
        <Typography variant="subtitle1" fontWeight={700}>
          {initialData ? 'Edit Room' : 'Add New Room'}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Stack spacing={2}>
          <TextField 
            label="Room/Space Name" 
            fullWidth 
            size="small" 
            variant="standard"
            value={formData.name} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            placeholder="e.g., Room 101"
          />
          <TextField
            select
            label="Room Type"
            fullWidth
            size="small"
            variant="standard"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            {Object.keys(ROOM_TYPE_ICONS).map(type => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </TextField>
          <TextField 
            label="Capacity" 
            fullWidth 
            size="small" 
            variant="standard"
            type="number"
            value={formData.capacity} 
            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })} 
          />
          <TextField
            select
            label="Status"
            fullWidth
            size="small"
            variant="standard"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Maintenance">Maintenance</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button onClick={onClose} size="small">Cancel</Button>
        <Button variant="contained" color="secondary" size="small" onClick={() => onSave(formData)}>
          {initialData ? 'Update Room' : 'Create Room'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
// --- Routines Components ---

function RoutineItem({ routine, active, onSelect }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
    >
      <NavButton active={active} onClick={onSelect}>
        <ListItemIcon sx={{ minWidth: 32 }}>
           <ClockIcon sx={{ fontSize: 18, color: active ? 'secondary.main' : 'text.disabled' }} />
        </ListItemIcon>
        <ListItemText 
          primary={routine.name} 
          primaryTypographyProps={{ variant: 'body2' }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 24, justifyContent: 'center' }}>
          {isHovered ? (
            <IconButton 
              size="small" 
              sx={{ 
                p: 0, 
                color: 'secondary.main',
                bgcolor: alpha('#000', 0.05),
                '&:hover': { bgcolor: alpha('#000', 0.1) }
              }}
            >
              <AddIcon sx={{ fontSize: 14 }} />
            </IconButton>
          ) : (
             <CountBadge>{routine.timeSlots.length}</CountBadge>
          )}
        </Box>
      </NavButton>
    </Box>
  );
}

function RoutinesTab({ initialData = [], rooms: propsRooms = [], roles = [], groups: propsGroups = [] }) {
  const [routines, setRoutines] = useState(initialData);
  const [selectedRoutine, setSelectedRoutine] = useState(initialData[0] || null);
  const [expandedSlotId, setExpandedSlotId] = useState(null);

  const [localRooms, setLocalRooms] = useState(propsRooms);
  const [localGroups, setLocalGroups] = useState(propsGroups);

  const [routineModal, setRoutineModal] = useState({ open: false, data: null });
  const [slotModal, setSlotModal] = useState({ open: false, data: null });
  const [activityModal, setActivityModal] = useState({ open: false, data: null, slotId: null });
  const [quickCreate, setQuickCreate] = useState({ type: null, open: false, context: null });
  const [groupCreate, setGroupCreate] = useState({ open: false });
  const [quickCreateCallback, setQuickCreateCallback] = useState(null);

  const handleQuickCreate = (type, callback) => {
    console.log(`[RoutinesTab] handleQuickCreate called for: ${type}`);
    
    if (type === 'groups') {
      setGroupCreate({ open: true });
    } else {
      setQuickCreate({ type, open: true });
    }
    
    setQuickCreateCallback(() => callback);
  };

  const handleSaveRoutine = async (formData) => {
    try {
      if (formData.id) {
        // Update existing
        const response = await api.foundation.updateRoutine(formData.id, formData);
        setRoutines(routines.map(r => r.id === formData.id ? response.data : r));
        setSelectedRoutine(response.data);
      } else {
        // Create new
        const payload = {
          name: formData.name,
          description: formData.description,
          is_active: true
        };
        const response = await api.foundation.createRoutine(payload);
        const newRoutine = { ...response.data, timeSlots: [] };
        setRoutines([...routines, newRoutine]);
        setSelectedRoutine(newRoutine);
      }
      setRoutineModal({ open: false, data: null });
    } catch (error) {
      console.error("Failed to save routine:", error);
      alert("Error saving routine template.");
    }
  };

  const handleSaveActivity = async (formData) => {
    try {
      if (formData.id) {
        // Update existing
        const response = await api.foundation.updateActivity(formData.id, formData);
        const updatedAct = response.data;
        const updatedRoutine = {
          ...selectedRoutine,
          timeSlots: selectedRoutine.timeSlots.map(s => ({
            ...s,
            activities: (s.activities || []).map(a => a.id === formData.id ? updatedAct : a)
          }))
        };
        setRoutines(routines.map(r => r.id === updatedRoutine.id ? updatedRoutine : r));
        setSelectedRoutine(updatedRoutine);
      } else {
        // Create new
        const payload = {
          ...formData,
          slot_id: activityModal.slotId, // Use the slotId we stored when opening the modal
          is_attendance_point: formData.is_attendance_point || false
        };
        const response = await api.foundation.createActivity(payload);
        const newAct = response.data;
        const updatedRoutine = {
          ...selectedRoutine,
          timeSlots: selectedRoutine.timeSlots.map(s => 
            s.id === activityModal.slotId 
              ? { ...s, activities: [...(s.activities || []), newAct] }
              : s
          )
        };
        setRoutines(routines.map(r => r.id === updatedRoutine.id ? updatedRoutine : r));
        setSelectedRoutine(updatedRoutine);
      }
      setActivityModal({ open: false, data: null, slotId: null });
    } catch (error) {
      console.error("Failed to save activity:", error);
      alert("Error saving activity.");
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (!window.confirm("Are you sure you want to delete this activity?")) return;
    try {
      await api.foundation.deleteActivity(activityId);
      const updatedRoutine = {
        ...selectedRoutine,
        timeSlots: selectedRoutine.timeSlots.map(s => ({
          ...s,
          activities: (s.activities || []).filter(a => a.id !== activityId)
        }))
      };
      setRoutines(routines.map(r => r.id === updatedRoutine.id ? updatedRoutine : r));
      setSelectedRoutine(updatedRoutine);
    } catch (error) {
      console.error("Failed to delete activity:", error);
      alert("Error deleting activity.");
    }
  };

  return (
    <Box sx={{ display: 'flex', border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden', bgcolor: 'white', minHeight: 450 }}>
      <RoutineEditorModal 
        open={routineModal.open} 
        routine={routineModal.data} 
        onClose={() => setRoutineModal({ open: false, data: null })} 
        onSave={handleSaveRoutine}
      />
      <TimeSlotEditorModal 
        open={slotModal.open} 
        slot={slotModal.data} 
        onClose={() => setSlotModal({ open: false, data: null })} 
        onSave={(d) => setSlotModal({ open: false, data: null })}
      />
      <ActivityEditorModal 
        open={activityModal.open} 
        activity={activityModal.data} 
        rooms={localRooms}
        roles={roles}
        groups={localGroups}
        onClose={() => setActivityModal({ open: false, data: null, slotId: null })} 
        onSave={handleSaveActivity}
        onQuickCreate={handleQuickCreate}
      />
      
      <QuickCreateModal 
        open={quickCreate.open}
        type={quickCreate.type}
        onSave={async (newData) => {
          try {
            console.log(`[QuickCreate] Saving ${quickCreate.type}:`, newData);
            const response = await api.foundation.createEntity(quickCreate.type, newData);
            const newItem = response.data || { id: Date.now(), ...newData };
            
            // Hydrate local rooms if applicable
            if (quickCreate.type === 'rooms') setLocalRooms(prev => [...prev, newItem]);
            
            // Handle callback if triggered from Discovery
            if (quickCreateCallback) {
              quickCreateCallback(newItem);
              setQuickCreateCallback(null);
            }
          } catch (err) {
            console.error('QuickCreate failed:', err);
          } finally {
            setQuickCreate({ type: null, open: false, context: null });
          }
        }}
        onClose={() => setQuickCreate({ type: null, open: false, context: null })}
      />

      <QuickCreateGroupModal 
        open={groupCreate.open}
        onSave={async (payload) => {
          try {
            console.log('[SpecializedGroupCreate] Saving:', payload);
            const response = await api.foundation.createEntity('groups', payload);
            const newItem = response.data || { id: Date.now(), ...payload };
            
            setLocalGroups(prev => [...prev, newItem]);
            
            if (quickCreateCallback) {
              quickCreateCallback(newItem);
              setQuickCreateCallback(null);
            }
          } catch (err) {
            console.error('Group creation failed:', err);
          } finally {
            setGroupCreate({ open: false });
          }
        }}
        onClose={() => setGroupCreate({ open: false })}
      />

      {/* Sidebar */}
      <Box sx={{ width: 260, borderRight: '1px solid', borderColor: 'divider', bgcolor: 'grey.50', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="overline" color="text.secondary">Routines</Typography>
          <Button 
            size="small" 
            color="secondary" 
            startIcon={<AddIcon />} 
            sx={{ fontSize: '0.65rem' }}
            onClick={() => setRoutineModal({ open: true, data: null })}
          >
            Add
          </Button>
        </Box>
        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          <List component="nav" disablePadding sx={{ py: 1 }}>
            {routines.map(r => (
              <RoutineItem 
                key={r.id} 
                routine={r} 
                active={selectedRoutine?.id === r.id} 
                onSelect={() => setSelectedRoutine(r)} 
              />
            ))}
          </List>
        </Box>
      </Box>

      {/* Detail Panel */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', bgcolor: 'white', overflow: 'hidden' }}>
        {selectedRoutine ? (
          <>
            <Box sx={{px:2,py:1, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'grey.25' }}>
              <Box>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center' }}>
                  <Typography variant="h6">{selectedRoutine.name}</Typography>
                </div>
                <Typography variant="caption" color="text.secondary">{selectedRoutine.description}</Typography>
              </Box>
              <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
                <IconButton size="small" onClick={() => setRoutineModal({ open: true, data: selectedRoutine })}><EditIcon fontSize="small" /></IconButton>
                <IconButton size="small"><DeleteIcon fontSize="small" /></IconButton>
                <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 1 }} />
                <ModuleOptions />
              </div>
            </Box>

            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
              <TimelineView 
                routine={selectedRoutine} 
                expandedSlotId={expandedSlotId} 
                setExpandedSlotId={setExpandedSlotId}
                onEditSlot={(slot) => setSlotModal({ open: true, data: slot })}
                onEditActivity={(act) => setActivityModal({ open: true, data: act, slotId: act.slot_id })}
                onAddActivity={(slotId) => setActivityModal({ open: true, data: null, slotId })}
                onDeleteActivity={handleDeleteActivity}
                setQuickCreate={setQuickCreate}
              />
            </Box>

            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Button 
                size="small" 
                color="secondary" 
                startIcon={<AddIcon />} 
                onClick={() => setQuickCreate({ type: 'time_slots', open: true })}
              >
                Add Time Slot to {selectedRoutine.name}
              </Button>
            </Box>
          </>
        ) : (
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'text.disabled' }}>
             <ClockIcon sx={{ fontSize: 48, opacity: 0.1, mb: 1 }} />
             <Typography variant="body2">Select a template to view details</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

function TimelineView({ routine, expandedSlotId, setExpandedSlotId, onEditSlot, onEditActivity, onAddActivity, onDeleteActivity, setQuickCreate }) {
  const formatTime = (time) => {
    if (!time) return '--:--';
    // Remove seconds if present (e.g., 08:00:00 -> 08:00)
    return time.split(':').slice(0, 2).join(':');
  };

  return (
    <Table stickyHeader size="small">
      <TableHead>
        <TableRow>
          <TableCell sx={{ color: 'text.secondary' }}>Time Range</TableCell>
          <TableCell sx={{ color: 'text.secondary' }}>Activities</TableCell>
          <TableCell sx={{ color: 'text.secondary', textAlign: 'center' }}>Duration</TableCell>
          <TableCell align="right" />
        </TableRow>
      </TableHead>
      <TableBody>
        {[...(routine.timeSlots || [])]
          .sort((a, b) => {
            const timeA = a.start_time || a.startTime || '';
            const timeB = b.start_time || b.startTime || '';
            return timeA.localeCompare(timeB);
          })
          .map((slot) => {
            const isExpanded = expandedSlotId === slot.id;
            const duration = slot.duration_minutes || slot.duration || '--';
            const startTime = formatTime(slot.start_time || slot.startTime);
            const endTime = formatTime(slot.end_time || slot.endTime);
          
          return (
            <Fragment key={slot.id}>
              <TableRow 
                hover 
                onClick={() => setExpandedSlotId(isExpanded ? null : slot.id)}
                sx={{ 
                  cursor: 'pointer', 
                  bgcolor: isExpanded ? (theme) => alpha(theme.palette.secondary.main, 0.04) : 'transparent',
                  borderLeft: isExpanded ? 3 : 0,
                  borderLeftStyle: 'solid',
                  borderLeftColor: isExpanded ? 'secondary.main' : 'transparent',
                  '&:hover .row-actions': { opacity: 1 }
                }}
              >
                <TableCell>
                  <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
                    <ClockIcon sx={{ fontSize: 14, color: 'secondary.main' }} />
                    <Typography variant="body2">
                      {startTime} - {endTime}
                    </Typography>
                  </div>
                </TableCell>
                <TableCell>
                  <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', flexWrap: 'wrap' }}>
                    {(slot.activities || []).map(a => (
                      <Chip 
                        key={a.id} 
                        label={a.name} 
                        size="small" 
                        sx={{ height: 20, fontSize: '10px', fontWeight: 600, bgcolor: 'grey.100' }} 
                      />
                    ))}
                  </div>
                </TableCell>
                <TableCell sx={{ textAlign: 'center', color: 'text.secondary' }}>{duration}m</TableCell>
                <TableCell align="right">
                  <div className="row-actions" style={{ display: 'flex', flexDirection: 'row', gap: '4px', justifyContent: 'flex-end', opacity: 0, transition: 'opacity 0.2s' }}>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); onEditSlot(slot); }}><EditIcon sx={{ fontSize: 16 }} /></IconButton>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); }}><DeleteIcon sx={{ fontSize: 16 }} /></IconButton>
                  </div>
                </TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell colSpan={4} sx={{ p: 0, border: 'none' }}>
                  <Collapse in={isExpanded}>
                    <Box sx={{ p: 3, bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.01), borderBottom: '1px solid', borderColor: 'divider' }}>
                      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>Parallel Activities</Typography>
                        <Button 
                          size="small" 
                          startIcon={<AddIcon />} 
                          sx={{ fontSize: '0.7rem' }}
                          onClick={() => onAddActivity(slot.id)}
                        >
                          Add Activity
                        </Button>
                      </div>
                      <Table size="small" sx={{ bgcolor: 'white', borderRadius: '8px', border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                        <TableHead sx={{ bgcolor: 'grey.50' }}>
                          <TableRow>
                            <TableCell>Activity</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Target Groups</TableCell>
                            <TableCell>Responsible</TableCell>
                            <TableCell />
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {(slot.activities || []).map(a => (
                            <TableRow key={a.id} hover>
                              <TableCell sx={{ fontWeight: 600 }}>{a.name}</TableCell>
                              <TableCell sx={{ color: 'text.secondary' }}>{a.location?.name || a.location || 'Not Set'}</TableCell>
                              <TableCell>
                                <div style={{ display: 'flex', flexDirection: 'row', gap: '4px', flexWrap: 'wrap' }}>
                                  {(a.targetGroups || []).map((tg, idx) => (
                                    <Chip 
                                      key={tg.id || idx} 
                                      label={tg.group?.name || tg} 
                                      size="small" 
                                      sx={{ height: 16, fontSize: '8px', bgcolor: alpha('#000', 0.05) }} 
                                    />
                                  ))}
                                  {(!a.targetGroups || a.targetGroups.length === 0) && <Typography variant="caption" color="text.disabled">All</Typography>}
                                </div>
                              </TableCell>
                              <TableCell sx={{ fontSize: '0.8rem', color: 'primary.main', fontWeight: 500 }}>
                                {a.responsibleGroup?.name || a.responsibleRole || 'None'}
                              </TableCell>
                              <TableCell align="right">
                                <IconButton size="small" onClick={() => onEditActivity(a)} sx={{ mr: 0.5 }}><EditIcon sx={{ fontSize: 14 }} /></IconButton>
                                <IconButton size="small" onClick={() => onDeleteActivity?.(a.id)} color="error"><DeleteIcon sx={{ fontSize: 14 }} /></IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
}

function TimeSlotEditorModal({ slot, open, onClose, onSave }) {
  const [data, setData] = useState(slot || { startTime: '08:00', endTime: '08:40', duration: 40 });
  if (!slot && !open) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '12px' } }}>
      <DialogTitle>Edit Time Slot</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '16px' }}>
          <TextField label="Start Time" type="time" fullWidth variant="standard" value={data.startTime} InputLabelProps={{ shrink: true }} onChange={(e) => setData({ ...data, startTime: e.target.value })} />
          <TextField label="End Time" type="time" fullWidth variant="standard" value={data.endTime} InputLabelProps={{ shrink: true }} onChange={(e) => setData({ ...data, endTime: e.target.value })} />
        </div>
        <Box sx={{ p: 1.5, bgcolor: 'grey.50', borderRadius: '8px', textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">Total Duration</Typography>
          <Typography variant="body2" color="secondary">40 minutes</Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 700 }}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={() => onSave(data)} sx={{ fontWeight: 700, color: 'white' }}>Save Slot</Button>
      </DialogActions>
    </Dialog>
  );
}

const CustomAutocomplete = ({ label, placeholder, value, options = [], onSelect, onSearchMore, disabled = false, multiple = false }) => {
  const theme = useTheme();
  
  // Handle multi-select vs single-select values
  const selectedOption = multiple 
    ? options.filter(o => value?.includes(o.id))
    : options.find(o => o.id === value) || null;

  return (
    <Box sx={{ mb: 1.5 }}>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5, display: 'block' }}>{label}</Typography>
      <Autocomplete
        multiple={multiple}
        disabled={disabled}
        value={selectedOption}
        onChange={(event, newValue) => {
          if (multiple) {
            const hasSearchMore = newValue.find(v => v.id === 'search-more');
            if (hasSearchMore) {
              onSearchMore?.();
            } else {
              onSelect?.(newValue.map(v => v.id));
            }
          } else {
            if (newValue && newValue.id === 'search-more') {
              onSearchMore?.();
            } else {
              onSelect?.(newValue?.id || '');
            }
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);
          const sliced = filtered.slice(0, 5);
          sliced.push({
            id: 'search-more',
            name: 'Search More...',
            isAction: true
          });
          return sliced;
        }}
        options={options}
        getOptionLabel={(option) => option?.name || ''}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            {option.isAction ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main', fontWeight: 900 }}>
                <SearchIcon sx={{ fontSize: 16 }} />
                <Typography sx={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase' }}>{option.name}</Typography>
              </Box>
            ) : (
              <Typography sx={{ fontSize: '0.875rem' }}>{option.name}</Typography>
            )}
          </li>
        )}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              label={option.name}
              size="small"
              {...getTagProps({ index })}
              sx={{ height: 24, fontSize: '11px', fontWeight: 600 }}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            placeholder={placeholder}
            InputProps={{
              ...params.InputProps,
              sx: { 
                fontSize: '0.875rem',
                pb: 0.5,
                '&:focus-within': { borderColor: theme.palette.primary.main },
              }
            }}
          />
        )}
      />
    </Box>
  );
};

function ActivityEditorModal({ activity, open, onClose, onSave, rooms = [], groups = [], onQuickCreate }) {
  const [data, setData] = useState({ 
    name: '', 
    location_id: '', 
    target_groups: [], 
    responsible_group_id: '', 
    is_attendance_point: false 
  });

  const [discovery, setDiscovery] = useState({ open: false, type: '', fieldId: '' });

  useEffect(() => {
    if (activity) {
      setData({
        id: activity.id,
        name: activity.name || '',
        location_id: activity.location_id || '',
        target_groups: activity.targetGroups?.map(tg => tg.group_id) || activity.target_groups || [],
        responsible_group_id: activity.responsible_group_id || '',
        is_attendance_point: activity.is_attendance_point || false
      });
    } else {
      setData({ 
        name: '', 
        location_id: '', 
        target_groups: [], 
        responsible_group_id: '', 
        is_attendance_point: false 
      });
    }
  }, [activity, open]);

  if (!activity && !open) return null;

  const handleDiscoverySelect = (itemOrItems) => {
    if (discovery.fieldId === 'target_groups') {
      // It's a multiple select field
      const newIds = Array.isArray(itemOrItems) ? itemOrItems.map(i => i.id) : [itemOrItems.id];
      const current = data.target_groups || [];
      const updated = Array.from(new Set([...current, ...newIds]));
      setData(prev => ({ ...prev, target_groups: updated }));
    } else {
      // It's a single select field
      const item = Array.isArray(itemOrItems) ? itemOrItems[0] : itemOrItems;
      setData(prev => ({ ...prev, [discovery.fieldId]: item.id }));
    }
    setDiscovery({ open: false, type: '', fieldId: '' });
  };

  const handleCreateNew = (type) => {
    console.log(`[ActivityEditorModal] Create New triggered for: ${type}`);
    // DO NOT close discovery immediately - it causes unmounting issues
    // Just trigger the parent. The parent's transition will naturally handle the UI.
    onQuickCreate?.(type, (newItem) => {
      console.log(`[ActivityEditorModal] QuickCreate finished, auto-selecting:`, newItem);
      if (discovery.fieldId === 'target_groups') {
        const current = data.target_groups || [];
        setData(prev => ({ ...prev, target_groups: Array.from(new Set([...current, newItem.id])) }));
      } else {
        setData(prev => ({ ...prev, [discovery.fieldId]: newItem.id }));
      }
      // NOW we can close the discovery if it was still open
      setDiscovery({ open: false, type: '', fieldId: '' });
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '12px' } }}>
      <DialogTitle sx={{ pb: 1 }}>{activity ? 'Edit Activity' : 'Add Activity'}</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 0 }}>
        <TextField label="Activity Name" fullWidth variant="standard" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
        
        <CustomAutocomplete 
          label="Location"
          placeholder="Select Location..."
          value={data.location_id}
          options={rooms}
          onSelect={(val) => setData({ ...data, location_id: val })}
          onSearchMore={() => setDiscovery({ open: true, type: 'rooms', fieldId: 'location_id' })}
        />

        <CustomAutocomplete 
          multiple
          label="Targets"
          placeholder="Select Targets..."
          value={data.target_groups}
          options={groups}
          onSelect={(val) => setData({ ...data, target_groups: val })}
          onSearchMore={() => setDiscovery({ open: true, type: 'groups', fieldId: 'target_groups' })}
        />

        <CustomAutocomplete 
          label="Responsible"
          placeholder="Select Responsible..."
          value={data.responsible_group_id}
          options={groups}
          onSelect={(val) => setData({ ...data, responsible_group_id: val })}
          onSearchMore={() => setDiscovery({ open: true, type: 'groups', fieldId: 'responsible_group_id' })}
        />

        <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
          <input type="checkbox" checked={data.is_attendance_point} onChange={(e) => setData({ ...data, is_attendance_point: e.target.checked })} />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>This is an attendance point</Typography>
        </div>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 700 }}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={() => onSave(data)} sx={{ fontWeight: 700, color: 'white' }}>
          {activity ? 'Save Changes' : 'Add Activity'}
        </Button>
      </DialogActions>

      <DiscoveryModal 
        open={discovery.open}
        type={discovery.type}
        multiple={discovery.fieldId === 'target_groups'}
        initialSelection={discovery.fieldId === 'target_groups' ? data.target_groups : [data[discovery.fieldId]]}
        items={discovery.type === 'rooms' ? rooms : groups}
        onSelect={handleDiscoverySelect}
        onCreateClick={handleCreateNew}
        onClose={() => setDiscovery({ open: false, type: '', fieldId: '' })}
      />
    </Dialog>
  );
}

function RoutineEditorModal({ routine, open, onClose, onSave }) {
  const [data, setData] = useState({ name: '', description: '', isActive: true });

  useEffect(() => {
    if (routine) {
      setData(routine);
    } else {
      setData({ name: '', description: '', isActive: true });
    }
  }, [routine, open]);

  if (!routine && !open) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '12px' } }}>
      <DialogTitle>{routine ? 'Edit Routine Template' : 'Create Routine Template'}</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
        <TextField label="Routine Name" fullWidth variant="standard" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
        <TextField label="Description" fullWidth multiline rows={2} variant="standard" value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} />
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 700 }}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={() => onSave(data)} sx={{ fontWeight: 700, color: 'white' }}>
          {routine ? 'Save Changes' : 'Create Template'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function BusItem({ bus, active, count, onSelect }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
    >
      <NavButton active={active} onClick={onSelect}>
        <ListItemIcon sx={{ minWidth: 32 }}>
           <BusIcon sx={{ fontSize: 18, color: active ? 'secondary.main' : 'text.disabled' }} />
        </ListItemIcon>
        <ListItemText 
          primary={bus.plateNumber} 
          secondary={bus.model}
          secondaryTypographyProps={{ sx: { fontSize: '10px' } }}
          primaryTypographyProps={{ variant: 'body2' }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 24, justifyContent: 'center' }}>
          {isHovered ? (
            <IconButton 
              size="small" 
              sx={{ 
                p: 0, 
                color: 'secondary.main',
                bgcolor: alpha('#000', 0.05),
                '&:hover': { bgcolor: alpha('#000', 0.1) }
              }}
            >
              <AddIcon sx={{ fontSize: 14 }} />
            </IconButton>
          ) : (
             <CountBadge>{count}</CountBadge>
          )}
        </Box>
      </NavButton>
    </Box>
  );
}

function TransportTab({ initialBuses = [], initialRoutes = [] }) {
  const [buses] = useState(initialBuses);
  const [routes] = useState(initialRoutes);
  const [selectedBusId, setSelectedBusId] = useState(initialBuses[0]?.id || null);
  const selectedBus = buses.find(b => b.id === selectedBusId);
  const busRoutes = routes.filter(r => r.busId === selectedBusId);

  return (
    <Box sx={{ display: 'flex', border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden', bgcolor: 'white', minHeight: 450 }}>
      {/* Sidebar */}
      <Box sx={{ width: 260, borderRight: '1px solid', borderColor: 'divider', bgcolor: 'grey.50', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="overline" color="text.secondary">School Fleet</Typography>
          <Button size="small" color="secondary" startIcon={<AddIcon />} sx={{ fontSize: '0.65rem' }}>Add Bus</Button>
        </Box>
        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          <List component="nav" disablePadding sx={{ py: 1 }}>
            {buses.map(bus => (
              <BusItem 
                key={bus.id} 
                bus={bus} 
                active={selectedBusId === bus.id} 
                count={routes.filter(r => r.busId === bus.id).length}
                onSelect={() => setSelectedBusId(bus.id)} 
              />
            ))}
          </List>
        </Box>
      </Box>

      {/* Detail Panel */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', bgcolor: 'white', overflow: 'hidden' }}>
        {selectedBus ? (
          <>
            <Box sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'grey.25' }}>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                   <BusIcon sx={{ fontSize: 20, color: 'secondary.main' }} />
                   <Typography variant="h6">{selectedBus.plateNumber}</Typography>
                   <Chip label={selectedBus.status} size="small" color={selectedBus.status === 'Active' ? 'success' : 'warning'} sx={{ height: 18, fontSize: '10px' }} />
                </Stack>
                <Typography variant="caption" color="text.secondary">Driver: {selectedBus.driver} | Capacity: {selectedBus.capacity} Students</Typography>
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                <IconButton size="small"><DeleteIcon fontSize="small" /></IconButton>
                <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 1 }} />
                <ModuleOptions />
              </Stack>
            </Box>

            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: '0.65rem' }}>Route Name</TableCell>
                    <TableCell sx={{ fontSize: '0.65rem' }}>Stops / Destinations</TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.65rem' }}>Morning</TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.65rem' }}>Afternoon</TableCell>
                    <TableCell align="right" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {busRoutes.map(route => (
                    <TableRow key={route.id} hover sx={{ '&:hover .row-actions': { opacity: 1 } }}>
                      <TableCell sx={{ py: 1.5 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                           <RouteIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                           <Typography variant="body2" sx={{ fontWeight: 600 }}>{route.name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{route.stops}</Typography>
                      </TableCell>
                      <TableCell align="center">
                         <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{route.morningTime}</Typography>
                      </TableCell>
                      <TableCell align="center">
                         <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{route.afternoonTime}</Typography>
                      </TableCell>
                      <TableCell align="right">
                         <Stack className="row-actions" direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end', opacity: 0, transition: 'opacity 0.2s' }}>
                            <IconButton size="small"><EditIcon sx={{ fontSize: 16 }} /></IconButton>
                            <IconButton size="small"><DeleteIcon sx={{ fontSize: 16 }} /></IconButton>
                         </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {busRoutes.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 8, color: 'text.disabled' }}>
                        <RouteIcon sx={{ fontSize: 48, opacity: 0.1, mb: 1 }} />
                        <Typography variant="body2">No routes assigned to this bus</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
               <Button size="small" color="secondary" startIcon={<AddIcon />} sx={{ fontSize: '0.7rem' }}>Add Route to {selectedBus.plateNumber}</Button>
            </Box>
          </>
        ) : (
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'text.disabled' }}>
             <BusIcon sx={{ fontSize: 48, opacity: 0.1, mb: 1 }} />
             <Typography variant="body2">Select a bus to view routes</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

// --- Main Component ---

export default function SetupFoundation() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Foundation Data State
  const [academicYears, setAcademicYears] = useState([]);
  const [levels, setLevels] = useState([]);
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [locations, setLocations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [roles, setRoles] = useState([]);
  const [studentGroups, setStudentGroups] = useState([]);

  const fetchFoundationData = async () => {
    try {
      setLoading(true);
      const [
        yearsData, 
        levelsData, 
        gradesData, 
        sectionsData, 
        locationsData, 
        roomsData, 
        routinesData, 
        busesData, 
        routesData,
        rolesData,
        groupsData
      ] = await Promise.all([
        api.foundation.getAcademicYears(),
        api.foundation.getLevels(),
        api.foundation.getGrades(),
        api.foundation.getSections(),
        api.foundation.getLocations(),
        api.foundation.getRooms(),
        api.foundation.getRoutines(),
        api.foundation.getBuses(),
        api.foundation.getTransportRoutes(),
        api.foundation.getRoles(),
        api.foundation.getStudentGroups()
      ]);
       console.log('years',yearsData);
       console.log('levels',levelsData);
       console.log('grades',gradesData);
       console.log('sections',sectionsData);
       console.log('locations',locationsData);
       console.log('rooms',roomsData);
       console.log('routines',routinesData);
       console.log('buses',busesData);
       console.log('routes',routesData);
     
      setAcademicYears(yearsData);
      setLevels(levelsData);
      setGrades(gradesData);
      setSections(sectionsData);
      setLocations(locationsData);
      setRooms(roomsData);
      setRoutines(routinesData);
      setBuses(busesData);
      setRoutes(routesData);
      setRoles(rolesData);
      setStudentGroups(groupsData);
    } catch (error) {
      console.error("Failed to fetch foundation data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchYearTerms = async (yearId) => {
    try {
      const termsData = await api.foundation.getTerms(yearId);
      
      // Update the academicYears state with the fetched terms
      setAcademicYears(prev => prev.map(y => 
        y.id === yearId ? { ...y, terms: termsData } : y
      ));

      // By default, if there's an active term, auto-fetch its phases
      const activeTerm = termsData.find(t => t.is_active);
      if (activeTerm) {
        await fetchTermPhases(yearId, activeTerm);
      }
    } catch (error) {
      console.error(`Failed to fetch terms for year ${yearId}:`, error);
    }
  };

  const fetchTermPhases = async (yearId, term) => {
    try {
      // Fetch named date-range phases for this term from the backend
      const phasesData = await api.foundation.getTermPhases(term.id);

      // Attach phases directly to the term object in state
      setAcademicYears(prev => prev.map(y => {
        if (y.id === yearId) {
          return {
            ...y,
            terms: y.terms.map(t =>
              t.id === term.id ? { ...t, phases: phasesData } : t
            )
          };
        }
        return y;
      }));
    } catch (error) {
      console.error(`Failed to fetch phases for term ${term.id}:`, error);
    }
  };

  useEffect(() => {
    fetchFoundationData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', bgcolor: '#f8f9fa' }}>
        <Stack spacing={2} alignItems="center">
          <SettingsIcon className="animate-spin" sx={{ fontSize: 48, color: 'primary.main', opacity: 0.5 }} />
          <Typography color="text.secondary">Loading System Foundation...</Typography>
        </Stack>
      </Box>
    );
  }

  const activeYear = academicYears.find(y => y.status === 'Active')?.name || 'None';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#f8f9fa' }}>
      {/* Top Action Bar */}
      <Box sx={{ px: 3, py: 1, bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', sticky: 'top', zIndex: 1100 }}>
        <Typography variant="subtitle2" color="text.secondary">SYSTEM FOUNDATION SETUP</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Divider orientation="vertical" flexItem sx={{ my: 1 }} />
          <Button 
            variant="contained" 
            color="secondary" 
            startIcon={<SaveIcon />} 
            onClick={() => navigate('/')}
            sx={{ fontSize: '0.7rem', px: 3, color: 'white' }}
          >
            Save & Exit
          </Button>
        </Stack>
      </Box>

      {/*  main  content */}
      <Box sx={{ p: 4,flex:1,overflowY:"auto", px: 6 }}>
        <Stack direction="row" spacing={4} alignItems="flex-start" sx={{ mb: 4 }}>
          <Box sx={{ position: 'relative' }}>
             <Box sx={{ width: 120, height: 120, bgcolor: 'white', borderRadius: 4, border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <SettingsIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
             </Box>
             <Typography variant="caption" sx={{ position: 'absolute', bottom: -20, width: '100%', textAlign: 'center', color: 'text.disabled', fontSize: '10px' }}>Setup Mode</Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" sx={{ color: 'text.primary', mb: 1 }}>
              Babyeyi System
            </Typography>
            <Grid container spacing={4} sx={{ mt: 2 }}>
               {[
                  { label: 'Active Year', value: activeYear, icon: <CalendarIcon fontSize="small" /> },
                  { label: 'Levels', value: `${levels.length} Levels`, icon: <LayersIcon fontSize="small" /> },
                  { label: 'Total Grades', value: `${grades.length} Grades`, icon: <GroupsIcon fontSize="small" /> },
                  { label: 'Total Sections', value: `${sections.length} Sections`, icon: <TagIcon fontSize="small" /> },
                  { label: 'Locations', value: `${rooms.length} Spaces`, icon: <RoomIcon fontSize="small" /> },
                  { label: 'Fleet', value: `${buses.length} Buses`, icon: <BusIcon fontSize="small" /> }
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

        {/* Tabs */}
        <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={tab} 
            onChange={(e, v) => setTab(v)} 
            sx={{ 
              '& .MuiTabs-indicator': { height: 2, bgcolor: 'primary.main' },
              '& .MuiTab-root': { 
                fontSize: '0.875rem', 
                minHeight: 48,
                textTransform: 'none',
                color: 'text.secondary',
                transition: 'all 0.2s',
                '&.Mui-selected': { color: 'primary.main' },
                '&:hover': { color: 'text.primary', bgcolor: alpha('#000', 0.02) }
              } 
            }}
          >
            <Tab icon={<CalendarIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Academic Years & Terms" />
            <Tab icon={<SchoolIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Levels & Classes" />
            <Tab icon={<RoomIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="School Locations" />
            <Tab icon={<ClockIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Routine Templates" />
            <Tab icon={<BusIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Transport & Fleet" />
          </Tabs>
        </Box>

        {/* Content Area */}
        <Box sx={{ minHeight: 400 }}>
    { tab === 0 && <AcademicTab years={academicYears} routines={routines} onFetchTerms={fetchYearTerms} onFetchPhases={fetchTermPhases} /> }
    { tab === 1 && <StructureTab levels={levels} grades={grades} sections={sections} onRefresh={fetchFoundationData} /> }
    { tab === 2 && <LocationsTab blocks={locations} rooms={rooms} onRefresh={fetchFoundationData} /> }
    { tab === 3 && <RoutinesTab initialData={routines} rooms={rooms} roles={roles} groups={studentGroups} /> }
    { tab === 4 && <TransportTab initialBuses={buses} initialRoutes={routes} /> }
        </Box>
      </Box>
    </Box>
  );
}
