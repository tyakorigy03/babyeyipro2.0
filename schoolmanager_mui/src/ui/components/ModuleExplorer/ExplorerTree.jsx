import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import { motion, AnimatePresence } from "framer-motion";
import { styled, alpha } from "@mui/material/styles";

const CountBadge = styled(Box)(({ theme }) => ({
  fontSize: '0.65rem',
  fontWeight: 600,
  backgroundColor: theme.palette.action.disabledBackground,
  color: theme.palette.text.secondary,
  padding: '1px 6px',
  borderRadius: '10px',
  marginLeft: theme.spacing(1),
}));

const NavButton = styled(ListItemButton)(({ theme, active, depth }) => ({
  padding: theme.spacing(0.4, 1.5),
  minHeight: 32,
  borderRadius: 0,
  borderLeft: active ? `3px solid ${theme.palette.primary.main}` : '3px solid transparent',
  backgroundColor: active ? theme.palette.action.selected : 'transparent',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  ...(depth === 0 && {
    '& .MuiTypography-root': {
      fontWeight: 600,
      fontSize: '0.75rem',
      color: theme.palette.text.secondary,
    }
  }),
  ...(depth > 0 && {
    '& .MuiTypography-root': {
      fontSize: '0.85rem',
      color: theme.palette.text.primary,
    }
  })
}));

function TreeItem({ item, depth = 0, activeId, onSelect, onAddChildClick, canAddChild }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = activeId === item.id;
  const showAddIcon = isHovered && onAddChildClick && (canAddChild ? canAddChild(item, depth) : true);

  const handleToggle = (e) => {
    e.stopPropagation();
    if (hasChildren) {
      setIsOpen(!isOpen);
    }
    onSelect(item);
  };

  const handleAddChild = (e) => {
    e.stopPropagation();
    if (onAddChildClick) {
      onAddChildClick(item, depth);
    }
  };

  return (
    <Box 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
    >
      <NavButton 
        active={isActive} 
        depth={depth} 
        onClick={handleToggle}
        sx={{ pl: depth * 2 + 1.5 }}
      >
        <ListItemIcon sx={{ minWidth: 20, mr: 0.5 }}>
          {hasChildren && (
            <motion.div
              animate={{ rotate: isOpen ? 0 : -90 }}
              transition={{ duration: 0.15 }}
              style={{ display: 'flex' }}
            >
              <ExpandMoreIcon sx={{ fontSize: 16 }} />
            </motion.div>
          )}
        </ListItemIcon>
        <ListItemText 
          primary={item.name} 
          primaryTypographyProps={{ noWrap: true }}
        />
        
        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 24, justifyContent: 'center' }}>
          {showAddIcon ? (
            <IconButton 
              size="small" 
              onClick={handleAddChild}
              sx={{ 
                p: 0, 
                color: 'primary.main',
                bgcolor: alpha('#000', 0.05),
                '&:hover': { bgcolor: alpha('#000', 0.1) }
              }}
            >
              <AddIcon sx={{ fontSize: 14 }} />
            </IconButton>
          ) : (
            item.count !== undefined && (
              <CountBadge>{item.count}</CountBadge>
            )
          )}
        </Box>
      </NavButton>

      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <List component="div" disablePadding>
              {item.children.map((child) => (
                <TreeItem 
                  key={child.id} 
                  item={child} 
                  depth={depth + 1} 
                  activeId={activeId} 
                  onSelect={onSelect} 
                  onAddChildClick={onAddChildClick}
                  canAddChild={canAddChild}
                />
              ))}
            </List>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}

export default function ExplorerTree({ hierarchy, activeId, onSelect, onAddChildClick, canAddChild }) {
  return (
    <List component="nav" disablePadding sx={{ py: 0.5 }}>
      {hierarchy.map((item) => (
        <TreeItem 
          key={item.id} 
          item={item} 
          depth={0}
          activeId={activeId} 
          onSelect={onSelect} 
          onAddChildClick={onAddChildClick}
          canAddChild={canAddChild}
        />
      ))}
    </List>
  );
}
