import React from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Button, 
  Stack, 
  Divider, 
  useTheme, 
  useMediaQuery,
  TextField,
  Tabs,
  Tab,
  CircularProgress
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import TagIcon from '@mui/icons-material/Tag';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import GroupsIcon from '@mui/icons-material/Groups';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import EventIcon from '@mui/icons-material/Event';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { styled, alpha } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';

const BreadcrumbContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});

const BreadcrumbStep = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'completed'
})(({ theme, active, completed }) => ({
  position: 'relative',
  padding: '6px 20px 6px 30px',
  background: active ? theme.palette.primary.main : (completed ? alpha(theme.palette.primary.main, 0.1) : '#f1f5f9'),
  color: active ? 'white' : (completed ? theme.palette.primary.main : '#64748b'),
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  clipPath: 'polygon(0% 0%, calc(100% - 10px) 0%, 100% 50%, calc(100% - 10px) 100%, 0% 100%, 10px 50%)',
  marginRight: '-10px',
  transition: 'all 0.2s',
  cursor: 'pointer',
  zIndex: active ? 10 : 1,
  '&:first-of-type': {
    clipPath: 'polygon(0% 0%, calc(100% - 10px) 0%, 100% 50%, calc(100% - 10px) 100%, 0% 100%)',
    paddingLeft: '15px',
  },
}));

const ICON_MAP = {
  email: <EmailIcon sx={{ fontSize: 18 }} />,
  phone: <PhoneIcon sx={{ fontSize: 18 }} />,
  smartphone: <SmartphoneIcon sx={{ fontSize: 18 }} />,
  tag: <TagIcon sx={{ fontSize: 18 }} />,
  business: <BusinessIcon sx={{ fontSize: 18 }} />,
  person: <PersonIcon sx={{ fontSize: 18 }} />,
  school: <SchoolIcon sx={{ fontSize: 18 }} />,
  groups: <GroupsIcon sx={{ fontSize: 18 }} />,
  family: <FamilyRestroomIcon sx={{ fontSize: 18 }} />,
  calendar: <EventIcon sx={{ fontSize: 18 }} />,
};

/**
 * DataEntryEngine is a high-fidelity generic module for handling data entry.
 * It follows the pattern found in schoolmanager: Steps -> Identity -> Tabs -> Content.
 */
export default function DataEntryEngine(props) {
  const { 
    title,
    steps = [],
    activeStep = 0,
    onStepClick,
    tabs = [],
    activeTab = 0,
    onTabChange,
    headerFields = [],
    data = {},
    onDataChange,
    onBack, 
    onSave, 
    children, 
    saveLabel = "Finish & Save",
    isSaving = false,
    isSuccess = false 
  } = props;
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const primaryField = headerFields.find(f => f.isPrimary) || headerFields[0];
  const secondaryFields = headerFields.filter(f => !f.isPrimary);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      width: '100%',
      bgcolor: '#f8f9fa',
      overflow: 'hidden'
    }}>
      {/* STICKY HEADER */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: '#fff',
        minHeight: 56,
        zIndex: 10,
        position: 'sticky',
        top: 0,
        justifyContent: 'space-between'
      }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton size="small" onClick={onBack} sx={{ color: 'text.secondary' }}>
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {title}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={3}>
          {!isMobile && steps.length > 0 && (
            <BreadcrumbContainer>
              {steps.map((step, idx) => (
                <BreadcrumbStep 
                  key={step} 
                  active={activeStep === idx} 
                  completed={activeStep > idx}
                  onClick={() => onStepClick?.(idx)}
                >
                  {step}
                </BreadcrumbStep>
              ))}
            </BreadcrumbContainer>
          )}
          
          <Divider orientation="vertical" flexItem sx={{ height: 24, my: 'auto' }} />
          
          <Button
            variant="contained"
            size="small"
            color={isSuccess ? "success" : "secondary"}
            startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : isSuccess ? <CheckCircleIcon sx={{ fontSize: 16 }} /> : <SaveIcon sx={{ fontSize: 16 }} />}
            onClick={onSave}
            disabled={isSaving || isSuccess}
            sx={{ 
              textTransform: 'none', 
              fontWeight: 700,
              height: 32,
              px: 3,
              borderRadius: '4px',
              boxShadow: 'none',
              color: 'white',
              '&:hover': { boxShadow: 'none' },
            }}
          >
            {isSaving ? "Saving..." : isSuccess ? "Saved!" : saveLabel}
          </Button>
        </Stack>
      </Box>

      {/* SCROLLABLE CONTENT */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: { xs: 2, md: 5 } }}>
        
        {/* IDENTITY SECTION (DYNAMIC) */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} sx={{ mb: 6 }}>
          {/* Photo Placeholder */}
          <Box sx={{ 
            width: 128, 
            height: 128, 
            bgcolor: 'grey.100', 
            borderRadius: 1, 
            border: '2px dashed', 
            borderColor: 'grey.300',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'grey.400',
            flexShrink: 0,
            '&:hover': { borderColor: 'primary.main', color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.02) }
          }}>
            <CameraAltIcon sx={{ fontSize: 32, mb: 0.5 }} />
            <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: 10 }}>Add Photo</Typography>
          </Box>

          {/* Dynamic Header Fields */}
          <Box sx={{ flexGrow: 1 }}>
            {primaryField && (
              <input
                type="text"
                placeholder={primaryField.label}
                value={data[primaryField.id] || ''}
                onChange={(e) => onDataChange?.(primaryField.id, e.target.value)}
                style={{
                  width: '100%',
                  fontSize: '1.875rem',
                  fontWeight: 500,
                  color: '#1e293b',
                  border: 'none',
                  borderBottom: '1px solid #cbd5e1',
                  paddingBottom: '8px',
                  marginBottom: '24px',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderBottomColor = theme.palette.primary.main}
                onBlur={(e) => e.target.style.borderBottomColor = '#cbd5e1'}
              />
            )}

            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
              columnGap: 8, 
              rowGap: 1.5 
            }}>
              {secondaryFields.map((field) => {
                const value = data[field.id] || 'N/A';
                return (
                  <Box 
                    key={field.id}
                    onClick={() => console.log('Navigate to field section', field.id)}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1.5,
                      py: 0.5,
                      cursor: 'pointer',
                      borderBottom: '1px solid transparent',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: 'divider',
                        '& .field-arrow': { opacity: 1, transform: 'translateX(0)' },
                        '& .field-icon': { color: 'primary.main' }
                      }
                    }}
                  >
                    <Box className="field-icon" sx={{ color: 'text.disabled', display: 'flex', transition: 'color 0.2s' }}>
                      {ICON_MAP[field.icon] || <TagIcon sx={{ fontSize: 16 }} />}
                    </Box>
                    
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'text.primary' }}>
                        <Box component="span" sx={{ color: 'text.disabled', mr: 0.5 }}>{field.label}:</Box>
                        <Box component="span" sx={{ fontWeight: 700 }}>{value}</Box>
                      </Typography>
                      
                      <ArrowForwardIcon 
                        className="field-arrow" 
                        sx={{ 
                          fontSize: 14, 
                          color: 'primary.main', 
                          opacity: 0, 
                          transform: 'translateX(-4px)', 
                          transition: 'all 0.2s' 
                        }} 
                      />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Stack>

        {/* TABS NAVIGATION */}
        {tabs.length > 0 && (
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 6 }}>
            <Tabs 
              value={activeTab} 
              onChange={(e, val) => onTabChange?.(val)}
              sx={{
                '& .MuiTabs-indicator': { height: 2, bgcolor: 'primary.main' },
                '& .MuiTab-root': { 
                  textTransform: 'none', 
                  fontWeight: 600, 
                  minWidth: 100,
                  fontSize: '0.875rem',
                  color: 'text.secondary',
                  px: 3,
                  py: 1.25,
                  transition: 'all 0.2s',
                  '&.Mui-selected': { color: 'primary.main' },
                  '&:hover': { color: 'text.primary', bgcolor: alpha(theme.palette.action.hover, 0.4) }
                }
              }}
            >
              {tabs.map((tab, idx) => (
                <Tab key={tab} label={tab} />
              ))}
            </Tabs>
          </Box>
        )}

        {/* MAIN CONTENT AREA (STYLED AS INSPIRATION) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            style={{ minHeight: 400 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>

      </Box>
    </Box>
  );
}
