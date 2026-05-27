import React, { useState } from 'react';
import { 
  Dialog, 
  Box, 
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import DataEntryEngine from './DataEntryEngine';
import DynamicForm from './DynamicForm';
import { appRegistry } from '../../../core/apps/app-registry';
import { api } from '@/services';

/**
 * QuickCreateModal allows creating a new entity (e.g. Parent, Class) directly from a discovery modal.
 * It renders a simplified DataEntryEngine inside a modal and saves to the REAL backend.
 */
export default function QuickCreateModal({ open, onClose, type, onSave }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Reset form state every time the modal opens
  React.useEffect(() => {
    if (open) {
      setFormData({});
      setActiveTab(0);
      setError('');
      setSaving(false);
    }
  }, [open, type]);

  // Find the relevant app contract and its "new" subpage metadata
  let app, subPage, metadata = {};
  try {
    app = appRegistry.find(a => a.id === (type === 'parent' ? 'parents' : type));
    subPage = app?.subPages.find(s => s.id === 'new');
    metadata = subPage?.metadata || {};
  } catch (err) {
    console.error(`[QuickCreateModal] Registry Error:`, err);
  }

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      // Map the type to what createEntity expects
      const entityType = type === 'parent' ? 'parents' : type;
      const result = await api.foundation.createEntity(entityType, formData);
      const savedEntity = result?.data || result;
      // Pass back the saved entity so the field that triggered this modal gets auto-filled
      onSave?.({
        ...formData,
        id: savedEntity?.id,
        // Always provide a display-ready 'name' for field auto-fill in DynamicForm
        name: formData.full_name || formData.name || savedEntity?.full_name || 'New Entry'
      });
      onClose();
    } catch (err) {
      console.error('[QuickCreateModal] Save failed:', err);
      setError(err.message || 'Failed to save. Please check all required fields.');
    } finally {
      setSaving(false);
    }
  };

  const handleDataChange = (fieldId, value) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  if (!app || !subPage) {
    return null;
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullScreen={isMobile}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { 
          height: '90vh',
          borderRadius: isMobile ? 0 : '12px',
          overflow: 'hidden'
        }
      }}
    >
      <Box sx={{ height: '100%', position: 'relative' }}>
        {error && (
          <Box sx={{ px: 3, pt: 2, pb: 0 }}>
            <Typography color="error" variant="body2" sx={{ fontWeight: 600 }}>
              ⚠ {error}
            </Typography>
          </Box>
        )}
        <DataEntryEngine
          title={subPage.name}
          onBack={onClose}
          onSave={handleSave}
          saveLabel={saving ? 'Saving...' : 'Finish & Create'}
          steps={metadata.steps || []}
          activeStep={0}
          tabs={(metadata.tabs || []).map(t => typeof t === 'string' ? t : t.id)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          headerFields={metadata.headerFields || []}
          data={formData}
          onDataChange={handleDataChange}
        >
          <DynamicForm 
            sections={typeof metadata.tabs?.[activeTab] === 'object' ? metadata.tabs[activeTab].sections : []}
            data={formData}
            onChange={handleDataChange}
          />
        </DataEntryEngine>
      </Box>
    </Dialog>
  );
}
