import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import GridViewIcon from "@mui/icons-material/GridView";
import ListIcon from "@mui/icons-material/List";
import AddIcon from "@mui/icons-material/Add";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SettingsIcon from "@mui/icons-material/Settings";
import StarIcon from "@mui/icons-material/Star";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import GroupsIcon from '@mui/icons-material/Groups';
import FilterListIcon from '@mui/icons-material/FilterList';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import useMediaQuery from "@mui/material/useMediaQuery";
import Drawer from "@mui/material/Drawer";
import { styled, alpha, useTheme } from "@mui/material/styles";

const MenuNavItem = styled(ListItemButton)(({ theme, active }) => ({
  padding: theme.spacing(0.4, 1.5),
  minHeight: 28,
  borderRadius: 0,
  borderLeft: active ? `3px solid ${theme.palette.primary.main}` : '3px solid transparent',
  backgroundColor: active ? theme.palette.action.selected : 'transparent',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderLeft: active ? `3px solid ${theme.palette.primary.main}` : `3px solid ${theme.palette.action.selected}`,
  },
  '& .MuiTypography-root': {
    fontSize: '0.75rem',
    color: theme.palette.text.primary,
  }
}));

const SearchInput = styled(InputBase)(({ theme }) => ({
  '& .MuiInputBase-input': {
    padding: '8px 8px 8px 0',
    paddingLeft: 'calc(1em + 32px)',
    fontSize: '0.875rem',
    width: '100%',
    '&:focus': {
      outline: 'none',
    },
  },
}));

export default function ExplorerHeader(props) {
  const { 
    title,
    searchTerm, 
    onSearchChange, 
    viewMode, 
    onViewModeChange, 
    onAddClick,
    addButtonLabel = "Add New",
    onToggleSidebar
  } = props;

  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [opsMenuAnchor, setOpsMenuAnchor] = useState(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const isFilterMenuOpen = Boolean(filterMenuAnchor);
  const isOpsMenuOpen = Boolean(opsMenuAnchor);

  const handleFilterMenuOpen = (e) => setFilterMenuAnchor(e.currentTarget);
  const handleFilterMenuClose = () => setFilterMenuAnchor(null);
  
  const handleOpsMenuOpen = (e) => setOpsMenuAnchor(e.currentTarget);
  const handleOpsMenuClose = () => setOpsMenuAnchor(null);

  // ==========================================
  // DESKTOP VERSION
  // ==========================================
  if (!isMobile) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 24px',
        borderBottom: '1px solid',
        borderColor: 'rgba(0, 0, 0, 0.12)',
        backgroundColor: '#fff',
        gap: '24px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          minWidth: 'fit-content'
        }}>
          {onToggleSidebar && (
            <IconButton size="small" onClick={onToggleSidebar} sx={{ color: 'text.secondary' }}>
              <MenuOpenIcon sx={{ fontSize: 20 }} />
            </IconButton>
          )}
          {onAddClick && (
            <Button
              variant="contained"
              size="small"
              color="secondary"
              startIcon={<AddIcon />}
              onClick={onAddClick}
              sx={{ 
                textTransform: 'none', 
                fontWeight: 600,
                height: 32,
                px: 2,
                borderRadius: '6px',
                boxShadow: 'none',
                '&:hover': { boxShadow: 'none' },
              }}
            >
              {addButtonLabel}
            </Button>
          )}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 700, 
              fontSize: '1rem', 
              color: 'text.primary',
              lineHeight: 1,
              whiteSpace: 'nowrap'
            }}>
              {title}
            </Typography>
            <IconButton 
              size="small" 
              onClick={handleOpsMenuOpen}
              sx={{ 
                color: isOpsMenuOpen ? 'primary.main' : 'text.disabled', 
                '&:hover': { color: 'text.secondary' } 
              }}
            >
              <SettingsIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </div>
        </div>

        {/* Center: Search Input - FIXED with wrapper div */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: 400,
          }}>
            <SearchIcon style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 20,
              color: '#9e9e9e',
              pointerEvents: 'none',
              zIndex: 1,
            }} />
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{
                width: '100%',
                height: 36,
                padding: '0 36px 0 36px',
                fontSize: '0.875rem',
                backgroundColor: 'rgba(0,0,0,0.03)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                outline: 'none',
                fontFamily: 'inherit',
              }}
              onFocus={(e) => e.target.style.borderColor = theme.palette.primary.main}
              onBlur={(e) => e.target.style.borderColor = 'rgba(0, 0, 0, 0.1)'}
            />
            <div style={{
              position: 'absolute',
              right: 4,
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}>
              <Divider orientation="vertical" flexItem sx={{ height: 20, my: 'auto', borderColor: 'rgba(0,0,0,0.1)' }} />
              <IconButton 
                size="small"
                onClick={handleFilterMenuOpen}
                sx={{
                  padding: 0.5,
                  color: isFilterMenuOpen ? 'primary.main' : '#9e9e9e',
                }}
              >
                <ArrowDropDownIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </div>
          </div>
        </div>

        {/* Right: Pagination & View Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '8px' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, whiteSpace: 'nowrap' }}>
              1-50 of 200
            </Typography>
            <div style={{ display: 'flex', gap: '4px' }}>
              <IconButton size="small" disabled sx={{ width: 28, height: 28, bgcolor: 'rgba(0,0,0,0.03)' }}><ChevronLeftIcon sx={{ fontSize: 18 }} /></IconButton>
              <IconButton size="small" sx={{ width: 28, height: 28, bgcolor: 'rgba(0,0,0,0.03)' }}><ChevronRightIcon sx={{ fontSize: 18 }} /></IconButton>
            </div>
          </div>

          <Stack direction="row" spacing={0.5} sx={{ bgcolor: 'rgba(0,0,0,0.03)', p: 0.5, borderRadius: '6px' }}>
            <IconButton size="small" onClick={() => onViewModeChange('grid')} sx={{ width: 24, height: 24, borderRadius: '4px', bgcolor: viewMode === 'grid' ? '#fff' : 'transparent', color: viewMode === 'grid' ? 'primary.main' : 'text.secondary' }}><GridViewIcon sx={{ fontSize: 14 }} /></IconButton>
            <IconButton size="small" onClick={() => onViewModeChange('list')} sx={{ width: 24, height: 24, borderRadius: '4px', bgcolor: viewMode === 'list' ? '#fff' : 'transparent', color: viewMode === 'list' ? 'primary.main' : 'text.secondary' }}><ListIcon sx={{ fontSize: 14 }} /></IconButton>
          </Stack>
        </div>

        {/* Multi-Column Filter Menu */}
        <Menu
          anchorEl={filterMenuAnchor}
          open={isFilterMenuOpen}
          onClose={handleFilterMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{ paper: { elevation: 0, sx: { mt: 1.5, minWidth: 500, borderRadius: '12px', border: '1px solid', borderColor: 'divider', filter: "drop-shadow(0px 4px 20px rgba(0,0,0,0.08))" } } }}
        >
          <Box sx={{ p: 2 }}>
            <Stack direction="row" spacing={3}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, px: 1.5, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}><FilterListIcon sx={{ fontSize: 16 }} /> Filters</Typography>
                <List disablePadding>{['Status: Active', 'Type: Permanent', 'Role: Admin'].map((item, idx) => (<MenuNavItem key={item} active={idx === 0}><ListItemText primary={item} /></MenuNavItem>))}</List>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, px: 1.5, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}><GroupsIcon sx={{ fontSize: 16 }} /> Group By</Typography>
                <List disablePadding>{['Department', 'Join Date', 'Salary Grade'].map(item => (<MenuNavItem key={item}><ListItemText primary={item} /></MenuNavItem>))}</List>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, px: 1.5, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}><StarIcon sx={{ fontSize: 16 }} /> Favorites</Typography>
                <List disablePadding>{['My Direct Reports', 'Recent Hires', 'Under Review'].map(item => (<MenuNavItem key={item}><ListItemText primary={item} /></MenuNavItem>))}</List>
              </Box>
            </Stack>
          </Box>
        </Menu>

        {/* Operations Menu (Settings Icon) */}
        <Menu
          anchorEl={opsMenuAnchor}
          open={isOpsMenuOpen}
          onClose={handleOpsMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          slotProps={{ paper: { elevation: 0, sx: { mt: 1, minWidth: 180, borderRadius: '8px', border: '1px solid', borderColor: 'divider', filter: "drop-shadow(0px 4px 12px rgba(0,0,0,0.05))" } } }}
        >
          <MenuItem onClick={handleOpsMenuClose} sx={{ gap: 1.5, py: 1 }}>
            <FileUploadIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>Import Data</Typography>
          </MenuItem>
          <MenuItem onClick={handleOpsMenuClose} sx={{ gap: 1.5, py: 1 }}>
            <FileDownloadIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>Export CSV</Typography>
          </MenuItem>
          <MenuItem onClick={handleOpsMenuClose} sx={{ gap: 1.5, py: 1 }}>
            <PictureAsPdfIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>Export PDF</Typography>
          </MenuItem>
        </Menu>
      </div>
    );
  }

  // ==========================================
  // MOBILE VERSION
  // ==========================================
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1.5, py: 1, borderBottom: '1px solid', borderColor: 'divider', backgroundColor: '#fff', gap: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1 }}>
          {onToggleSidebar && (<IconButton size="small" onClick={onToggleSidebar} sx={{ color: 'text.secondary' }}><MenuOpenIcon sx={{ fontSize: 20 }} /></IconButton>)}
          {onAddClick && (<Button variant="contained" size="small" color="secondary" onClick={onAddClick} sx={{ textTransform: 'none', fontWeight: 700, height: 32, px: 1.5, minWidth: 'auto', borderRadius: '6px', boxShadow: 'none' }}>Add</Button>)}
        </Stack>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconButton size="small" onClick={() => setSearchModalOpen(true)} sx={{ color: 'text.secondary' }}><SearchIcon sx={{ fontSize: 22 }} /></IconButton>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <IconButton size="small" disabled sx={{ width: 24, height: 24, bgcolor: 'rgba(0,0,0,0.03)' }}><ChevronLeftIcon sx={{ fontSize: 14 }} /></IconButton>
            <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 700, color: 'text.secondary' }}>1/4</Typography>
            <IconButton size="small" sx={{ width: 24, height: 24, bgcolor: 'rgba(0,0,0,0.03)' }}><ChevronRightIcon sx={{ fontSize: 14 }} /></IconButton>
          </div>
          <Stack direction="row" spacing={0.5} sx={{ bgcolor: 'rgba(0,0,0,0.03)', p: 0.5, borderRadius: '6px' }}>
            <IconButton size="small" onClick={() => onViewModeChange('grid')} sx={{ width: 24, height: 24, bgcolor: viewMode === 'grid' ? '#fff' : 'transparent', color: viewMode === 'grid' ? 'primary.main' : 'text.secondary' }}><GridViewIcon sx={{ fontSize: 14 }} /></IconButton>
            <IconButton size="small" onClick={() => onViewModeChange('list')} sx={{ width: 24, height: 24, bgcolor: viewMode === 'list' ? '#fff' : 'transparent', color: viewMode === 'list' ? 'primary.main' : 'text.secondary' }}><ListIcon sx={{ fontSize: 14 }} /></IconButton>
          </Stack>
        </div>
      </Box>

      {isMobile && (
        <Box sx={{ px: 1.5, py: 1, borderBottom: '1px solid', borderColor: 'divider', bgcolor: '#fafafa', display: 'flex', gap: 1, overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}>
          <Button size="small" variant="outlined" startIcon={<FilterListIcon sx={{ fontSize: 14 }}/>} sx={{ fontSize: '0.7rem', height: 24, borderRadius: 12, textTransform: 'none', px: 1.5, color: 'text.secondary', borderColor: 'divider' }}>Filters</Button>
          <Button size="small" variant="outlined" startIcon={<GroupsIcon sx={{ fontSize: 14 }}/>} sx={{ fontSize: '0.7rem', height: 24, borderRadius: 12, textTransform: 'none', px: 1.5, color: 'text.secondary', borderColor: 'divider' }}>Group By</Button>
          <Button size="small" variant="outlined" startIcon={<StarIcon sx={{ fontSize: 14 }}/>} sx={{ fontSize: '0.7rem', height: 24, borderRadius: 12, textTransform: 'none', px: 1.5, color: 'text.secondary', borderColor: 'divider' }}>Favorites</Button>
        </Box>
      )}

      <Drawer anchor="top" open={searchModalOpen} onClose={() => setSearchModalOpen(false)} PaperProps={{ sx: { height: '100vh', bgcolor: 'background.paper' } }}>
        <Box sx={{ p: 2, pt: 2, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}><IconButton onClick={() => setSearchModalOpen(false)}><ChevronLeftIcon /></IconButton>
            <TextField
              variant="standard"
              placeholder="Search records..."
              fullWidth
              autoFocus
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              InputProps={{
                disableUnderline: true,
                sx: {
                  fontSize: '1.25rem',
                  fontWeight: 500,
                }
              }}
            />
          </Stack>
          <Typography variant="overline" sx={{ color: 'text.secondary', mb: 2, display: 'block' }}>Recent Searches</Typography>
          <List>{['Grade 10 - A', 'Alice Johnson', 'High Performance'].map(item => (<ListItemButton key={item} sx={{ px: 0, py: 1.5 }}><ListItemIcon><SearchIcon sx={{ fontSize: 18 }} /></ListItemIcon><ListItemText primary={item} primaryTypographyProps={{ fontSize: '0.9rem' }} /></ListItemButton>))}</List>
        </Box>
      </Drawer>
    </>
  );
}