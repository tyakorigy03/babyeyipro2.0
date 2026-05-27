import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  MenuItem, 
  Stack, 
  Divider,
  Button,
  IconButton,
  alpha,
  useTheme,
  Select,
  InputBase,
  Autocomplete,
  createFilterOptions,
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ChevronDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';

import DiscoveryModal from './DiscoveryModal';
import QuickCreateModal from './QuickCreateModal';

const filter = createFilterOptions();

/**
 * Styled components to match the schoolmanager pattern
 */
const FormGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  alignItems: 'center',
  marginBottom: '16px'
});

const FormLabel = styled(Typography)({
  fontSize: '0.875rem',
  fontWeight: 600,
  color: '#334155', // slate-700
});

const FormInputBase = styled(InputBase)(({ theme }) => ({
  gridColumn: 'span 2',
  '& .MuiInputBase-input': {
    fontSize: '0.875rem',
    padding: '6px 0',
    borderBottom: '1px solid #e2e8f0',
    transition: 'all 0.2s',
    '&:focus': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

/**
 * CustomAutocomplete implements the built-in MUI filterable select
 * but preserves the 'Search More' requirement.
 */
function CustomAutocomplete({ label, placeholder, value, options = [], onSelect, onSearchMore, disabled = false }) {
  const theme = useTheme();

  return (
    <FormGrid>
      <FormLabel>{label}</FormLabel>
      <Box sx={{ gridColumn: 'span 2' }}>
        <Autocomplete
          disabled={disabled}
          value={value}
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
              placeholder={placeholder}
              InputProps={{
                ...params.InputProps,
                disableUnderline: true,
                sx: { 
                  fontSize: '0.875rem',
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
      </Box>
    </FormGrid>
  );
}

/**
 * DynamicForm renders a list of sections and fields based on a configuration.
 */
export default function DynamicForm({ sections = [], data = {}, onChange, readOnly = false }) {
  const theme = useTheme();
  const [discoveryState, setDiscoveryState] = useState({ open: false, type: '', fieldId: '', items: [], repeaterIndex: -1 });
  const [quickCreateState, setQuickCreateState] = useState({ open: false, type: '' });

  const handleDiscoverySelect = (item) => {
    if (readOnly) {
      setDiscoveryState({ ...discoveryState, open: false });
      return;
    }

    const value = typeof item === 'string' ? item : item.name;
    const itemId = typeof item === 'string' ? item : item.id;

    if (discoveryState.isBuilder) {
      const criteria = Object.keys(data.resolution_config || {})[0] || 'field';
      onChange?.('resolution_config', { [criteria]: itemId, _displayName: value });
    } else if (discoveryState.repeaterIndex !== -1) {
      handleRepeaterChange(discoveryState.sectionId, discoveryState.repeaterIndex, discoveryState.fieldId, value);
    } else {
      onChange?.(discoveryState.fieldId, value);
    }
    setDiscoveryState({ ...discoveryState, open: false });
  };

  const handleQuickCreateSave = (newEntity) => {
    // When a new entity is created, we auto-select it in the field that triggered the discovery
    const value = newEntity.name || 'New Entity';
    if (discoveryState.repeaterIndex !== -1) {
      handleRepeaterChange(discoveryState.sectionId, discoveryState.repeaterIndex, discoveryState.fieldId, value);
    } else {
      onChange?.(discoveryState.fieldId, value);
    }
    setDiscoveryState({ ...discoveryState, open: false });
    setQuickCreateState({ open: false, type: '' });
  };

  const handleRepeaterChange = (sectionId, index, fieldId, value) => {
    const currentList = data[sectionId] || [{}];
    const newList = [...currentList];
    newList[index] = { ...newList[index], [fieldId]: value };
    onChange?.(sectionId, newList);
  };

  const addRepeaterItem = (sectionId) => {
    const currentList = data[sectionId] || [];
    onChange?.(sectionId, [...currentList, {}]);
  };

  const removeRepeaterItem = (sectionId, index) => {
    const currentList = data[sectionId] || [];
    const newList = currentList.filter((_, i) => i !== index);
    onChange?.(sectionId, newList);
  };

  const renderField = (field, sectionId, index = -1) => {
    const isRepeated = index !== -1;
    const currentData = isRepeated ? (data[sectionId]?.[index] || {}) : data;
    const value = currentData[field.id] || '';
    const handleChange = (val) => {
      if (isRepeated) handleRepeaterChange(sectionId, index, field.id, val);
      else onChange?.(field.id, val);
    };

    switch (field.type) {
      case 'select':
        return (
          <FormGrid>
            <FormLabel>{field.label}</FormLabel>
            <Box sx={{ gridColumn: 'span 2' }}>
              <Select
                disabled={readOnly}
                variant="standard"
                fullWidth
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                IconComponent={ChevronDownIcon}
                sx={{ 
                  fontSize: '0.875rem',
                  '&:before': { borderBottom: '1px solid #e2e8f0' },
                  '& .MuiSelect-select': { py: 0.75 }
                }}
              >
                {field.options.map((opt) => (
                  <MenuItem key={typeof opt === 'string' ? opt : opt.id || opt.name} value={typeof opt === 'string' ? opt : opt.id || opt.name}>
                    {typeof opt === 'string' ? opt : opt.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </FormGrid>
        );

      case 'date':
        return (
          <FormGrid>
            <FormLabel>{field.label}</FormLabel>
            <FormInputBase
              disabled={readOnly}
              type="date"
              fullWidth
              value={value}
              onChange={(e) => handleChange(e.target.value)}
            />
          </FormGrid>
        );

      case 'discovery':
        return (
          <CustomAutocomplete 
            label={field.label}
            placeholder={field.placeholder || `Select ${field.label}...`}
            value={value}
            options={field.options || []}
            disabled={readOnly}
            onSelect={(val) => handleChange(typeof val === 'string' ? val : val?.name || '')}
            onSearchMore={() => {
              if (!readOnly) {
                setDiscoveryState({ 
                  open: true, 
                  type: field.discoveryType, 
                  fieldId: field.id, 
                  sectionId,
                  repeaterIndex: index,
                  items: field.options || [] 
                });
              }
            }}
          />
        );

      case 'resolution-builder':
        return (
          <Box sx={{ gridColumn: '1 / -1', mt: 1, mb: 3 }}>
            <Paper variant="outlined" sx={{ p: 2.5, bgcolor: alpha(theme.palette.primary.main, 0.02), borderColor: alpha(theme.palette.primary.main, 0.1), borderRadius: '12px' }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main', mb: 1.5, display: 'block', textTransform: 'uppercase' }}>
                Resolution Rule Builder
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap', gap: 1.5 }}>
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>Members are</Typography>
                
                {/* Member Type Selection */}
                <Box 
                  onClick={() => onChange?.('member_type', data.member_type === 'Student' ? 'Staff' : 'Student')}
                  sx={{ 
                    px: 1.5, py: 0.5, borderRadius: '20px', bgcolor: 'white', border: '1px solid', borderColor: 'divider', 
                    cursor: 'pointer', '&:hover': { borderColor: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.02) }
                  }}
                >
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: 'primary.main' }}>
                    {data.member_type || 'Universal'}s
                  </Typography>
                </Box>

                <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>where</Typography>

                {/* Criteria Selection */}
                <Box 
                  onClick={() => {
                    const criteria = data.member_type === 'Staff' ? 'role' : 'grade';
                    onChange?.('resolution_config', { [criteria]: '' });
                  }}
                  sx={{ 
                    px: 1.5, py: 0.5, borderRadius: '20px', bgcolor: 'white', border: '1px solid', borderColor: 'divider',
                    cursor: 'pointer', '&:hover': { borderColor: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.02) }
                  }}
                >
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: 'text.secondary' }}>
                    {Object.keys(data.resolution_config || {})[0] || 'Field'}
                  </Typography>
                </Box>

                <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>is</Typography>

                {/* Value Selection */}
                <Box 
                  onClick={() => {
                    const currentCriteria = Object.keys(data.resolution_config || {})[0];
                    if (currentCriteria) {
                      setDiscoveryState({ 
                        open: true, 
                        type: currentCriteria === 'grade' ? 'level' : 'groups', 
                        fieldId: 'resolution_config',
                        isBuilder: true 
                      });
                    }
                  }}
                  sx={{ 
                    px: 1.5, py: 0.5, borderRadius: '20px', bgcolor: alpha(theme.palette.primary.main, 0.1), border: '1px solid', borderColor: 'primary.main',
                    cursor: 'pointer', '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.15) }
                  }}
                >
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: 'primary.main' }}>
                    {Object.values(data.resolution_config || {})[0] || 'Select Value...'}
                  </Typography>
                </Box>
              </Stack>
              
              <Typography variant="caption" sx={{ mt: 2, display: 'block', color: 'text.disabled', fontStyle: 'italic' }}>
                * This group will automatically update as records change in the system.
              </Typography>
            </Paper>
          </Box>
        );

      default:
        return (
          <FormGrid>
            <FormLabel>{field.label}</FormLabel>
            <FormInputBase
              disabled={readOnly}
              fullWidth
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleChange(e.target.value)}
            />
          </FormGrid>
        );
    }
  };

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 8 }}>
      {sections.map((section, sIdx) => {
        const isRepeater = section.isRepeater;
        const sectionId = section.id || `section_${sIdx}`;
        const repeaterItems = isRepeater ? (data[sectionId] || [{}]) : [{}];

        return (
          <Box key={sectionId} sx={{ mb: 4, gridColumn: isRepeater ? '1 / -1' : 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, borderBottom: '1px solid', borderColor: 'grey.100', pb: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {section.title}
              </Typography>
              {isRepeater && (
                <Button 
                  size="small" 
                  startIcon={<AddIcon />} 
                  onClick={() => addRepeaterItem(sectionId)}
                  sx={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}
                >
                  Add Another
                </Button>
              )}
            </Box>

            <Stack spacing={isRepeater ? 4 : 0}>
              {repeaterItems.map((_, index) => (
                <Box key={index} sx={{ position: 'relative' }}>
                  {isRepeater && repeaterItems.length > 1 && (
                    <IconButton 
                      size="small" 
                      onClick={() => removeRepeaterItem(sectionId, index)}
                      sx={{ position: 'absolute', right: -40, top: 0, color: 'error.light' }}
                    >
                      <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  )}
                  {isRepeater && <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 700, mb: 2, display: 'block' }}>Entry #{index + 1}</Typography>}
                  
                  <Box sx={{ display: 'grid', gridTemplateColumns: isRepeater ? { xs: '1fr', lg: '1fr 1fr' } : '1fr', gap: isRepeater ? 8 : 0 }}>
                    {section.fields.map((field) => (
                      <Box key={field.id}>
                        {renderField(field, sectionId, isRepeater ? index : -1)}
                      </Box>
                    ))}
                  </Box>
                  {isRepeater && index < repeaterItems.length - 1 && <Divider sx={{ my: 4, borderStyle: 'dashed' }} />}
                </Box>
              ))}
            </Stack>
          </Box>
        );
      })}

      <DiscoveryModal 
        open={discoveryState.open}
        type={discoveryState.type}
        items={discoveryState.items}
        onSelect={handleDiscoverySelect}
        onCreateClick={(type) => setQuickCreateState({ open: true, type })}
        onClose={() => setDiscoveryState({ ...discoveryState, open: false })}
      />

      <QuickCreateModal 
        open={quickCreateState.open}
        type={quickCreateState.type}
        onSave={handleQuickCreateSave}
        onClose={() => setQuickCreateState({ ...quickCreateState, open: false })}
      />
    </Box>
  );
}
