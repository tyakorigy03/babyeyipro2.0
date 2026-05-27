import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Button, 
  Stack, 
  TextField, 
  Dialog,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  alpha,
  useTheme,
  InputBase,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import InboxIcon from '@mui/icons-material/Inbox';

const DISCOVERY_CONFIGS = {
  parent: {
    title: 'Parent/Guardian',
    columns: [
      { id: 'name', label: 'Full Name' },
      { id: 'phone', label: 'Phone Number' },
      { id: 'location', label: 'Location' }
    ]
  },
  level: {
    title: 'Academic Level',
    columns: [
      { id: 'name', label: 'Level Name' },
      { id: 'category', label: 'Category' },
      { id: 'capacity', label: 'Capacity' }
    ]
  },
  grade: {
    title: 'Grade',
    columns: [
      { id: 'name', label: 'Grade Name' },
      { id: 'level', label: 'Academic Level' }
    ]
  },
  class: {
    title: 'Class',
    columns: [
      { id: 'name', label: 'Class Name' },
      { id: 'students', label: 'Total Students' }
    ]
  },
  student: {
    title: 'Student',
    columns: [
      { id: 'name', label: 'Student Name' },
      { id: 'code', label: 'Reg Code' },
      { id: 'class', label: 'Current Class' }
    ]
  },
  rooms: {
    title: 'Location',
    columns: [
      { id: 'name', label: 'Room Name' },
      { id: 'type', label: 'Type' },
      { id: 'capacity', label: 'Capacity' }
    ]
  },
  groups: {
    title: 'Profile',
    columns: [
      { id: 'name', label: 'Profile Name' },
      { id: 'description', label: 'Description' }
    ]
  },
  blocks: {
    title: 'Block',
    columns: [
      { id: 'name', label: 'Block Name' },
      { id: 'description', label: 'Description' }
    ]
  },
  staff: {
    title: 'Staff Member',
    columns: [
      { id: 'name', label: 'Staff Name' },
      { id: 'role', label: 'Role' },
      { id: 'department', label: 'Department' }
    ]
  },
  units: {
    title: 'Department / Unit',
    columns: [
      { id: 'name', label: 'Unit Name' },
      { id: 'type', label: 'Type' },
      { id: 'parent', label: 'Parent Unit' }
    ]
  },
  roles: {
    title: 'Staff Role',
    columns: [
      { id: 'name', label: 'Role Name' },
      { id: 'description', label: 'Description' }
    ]
  }
};

/**
 * DiscoveryModal provides a high-fidelity searchable table for entity selection.
 */
export default function DiscoveryModal({ 
  open, 
  onClose, 
  type, 
  items = [], 
  onSelect, 
  onCreateClick, 
  multiple = false, 
  initialSelection = [],
  loading = false,
  error = null
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const theme = useTheme();

  // Reset selection when opening
  React.useEffect(() => {
    if (open) {
      setSelectedIds(multiple ? [...initialSelection] : []);
    }
  }, [open, multiple]);

  const config = DISCOVERY_CONFIGS[type] || { title: 'Selection', columns: [] };

  const filteredItems = items.filter(item => 
    Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const toggleSelection = (id) => {
    if (multiple) {
      setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    } else {
      const item = items.find(i => i.id === id);
      onSelect(item);
    }
  };

  const handleConfirm = () => {
    if (multiple) {
      const selectedItems = items.filter(i => selectedIds.includes(i.id));
      onSelect(selectedItems);
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
          height: '65vh',
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
          <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: 'text.primary' }}>
            Discover {config.title}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 700, textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.05em' }}>
            {multiple ? 'Select one or more records' : 'Browse and select from existing records'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* Search Bar */}
      <Box sx={{ p: 1.5, px: 2.5, bgcolor: 'grey.50', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          alignItems: 'center', 
          bgcolor: 'white', 
          border: '1px solid', 
          borderColor: 'divider',
          borderRadius: '6px',
          px: 1,
          py: 0.25,
          '&:focus-within': { borderColor: 'primary.main' }
        }}>
          <SearchIcon sx={{ color: 'text.disabled', mr: 1, fontSize: 16 }} />
          <InputBase 
            placeholder={`Filter ${type}s...`}
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ fontSize: '0.75rem' }}
          />
        </Box>
        {multiple && selectedIds.length > 0 && (
          <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main' }}>
            {selectedIds.length} SELECTED
          </Typography>
        )}
      </Box>

      {/* Table Content */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {multiple && <TableCell sx={{ bgcolor: 'white', width: 40 }} />}
              {config.columns.map(col => (
                <TableCell key={col.id} sx={{ bgcolor: 'white', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: 'primary.main', py: 1 }}>
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={multiple ? config.columns.length + 1 : config.columns.length} sx={{ py: 6, textAlign: 'center' }}>
                  <CircularProgress size={32} />
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, fontWeight: 500 }}>
                    Loading data...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={multiple ? config.columns.length + 1 : config.columns.length} sx={{ py: 6, textAlign: 'center' }}>
                  <Box sx={{ color: 'error.main', mb: 1 }}>
                    <InboxIcon sx={{ fontSize: 40, color: 'inherit' }} />
                  </Box>
                  <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 600 }}>
                    Failed to load data
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                    {typeof error === 'string' ? error : 'An error occurred while fetching records from the server.'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={multiple ? config.columns.length + 1 : config.columns.length} sx={{ py: 6, textAlign: 'center' }}>
                  <InboxIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    No records found
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                    Try adjusting your search filter or create a new entry below.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item, idx) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <TableRow 
                    key={item.id || idx} 
                    hover
                    onClick={() => toggleSelection(item.id)}
                    sx={{ 
                      cursor: 'pointer',
                      bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.04) : 'transparent',
                      '&:nth-of-type(odd)': { bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.06) : 'grey.50' }
                    }}
                  >
                    {multiple && (
                      <TableCell sx={{ py: 0.75 }}>
                        <Box sx={{ 
                          width: 18, 
                          height: 18, 
                          border: '2px solid', 
                          borderColor: isSelected ? 'primary.main' : 'divider',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: isSelected ? 'primary.main' : 'transparent',
                          transition: 'all 0.2s'
                        }}>
                          {isSelected && <Box sx={{ width: 8, height: 8, borderRadius: '1px', bgcolor: 'white' }} />}
                        </Box>
                      </TableCell>
                    )}
                    {config.columns.map(col => (
                      <TableCell key={col.id} sx={{ fontSize: '0.8rem', fontWeight: 500, py: 0.75 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {col.id === 'name' && (
                            <Box sx={{ 
                              width: 24, 
                              height: 24, 
                              borderRadius: '50%', 
                              bgcolor: isSelected ? 'primary.main' : alpha(theme.palette.primary.main, 0.1),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '9px',
                              fontWeight: 800,
                              color: isSelected ? 'white' : 'primary.main',
                              border: '1px solid',
                              borderColor: alpha(theme.palette.primary.main, 0.2)
                            }}>
                              {(item[col.id] || '').toString().charAt(0).toUpperCase() || '?'}
                            </Box>
                          )}
                          <Typography sx={{ fontSize: '0.8rem', fontWeight: isSelected ? 700 : 500 }}>
                            {item[col.id]}
                          </Typography>
                        </Box>
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 1.5, px: 2.5, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Button 
          variant="contained" 
          color="primary"
          size="small"
          onClick={() => {
            console.log(`[DiscoveryModal] Create New button clicked for type: ${type}`);
            onCreateClick?.(type);
          }}
          sx={{ 
            fontSize: '10px', 
            fontWeight: 800, 
            textTransform: 'uppercase', 
            borderRadius: '4px',
            boxShadow: 'none'
          }}
        >
          Create New {config.title}
        </Button>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="text" 
            onClick={onClose}
            sx={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: 'text.secondary' }}
          >
            Cancel
          </Button>
          {multiple ? (
            <Button 
              variant="contained" 
              color="primary"
              size="small"
              onClick={handleConfirm}
              disabled={selectedIds.length === 0}
              sx={{ 
                fontSize: '10px', 
                fontWeight: 800, 
                textTransform: 'uppercase', 
                borderRadius: '4px',
                px: 3
              }}
            >
              Confirm Selection
            </Button>
          ) : (
             <Typography variant="caption" sx={{ color: 'text.disabled', alignSelf: 'center', fontWeight: 700 }}>
               CLICK ROW TO SELECT
             </Typography>
          )}
        </Box>
      </Box>
    </Dialog>
  );
}
