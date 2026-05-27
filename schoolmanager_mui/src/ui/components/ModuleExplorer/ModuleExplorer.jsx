import { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme, styled, alpha } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import ExplorerTree from "./ExplorerTree.jsx";
import ExplorerHeader from "./ExplorerHeader.jsx";
import InboxIcon from "@mui/icons-material/Inbox";

const SidebarContainer = styled(Box)(({ theme }) => ({
  width: 260,
  borderRight: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  height: '100%',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.palette.background.default,
  height: '100%',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
}));

const StripedTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
}));

/**
 * Generic card rendered when gridFields config is provided.
 * This is the standard card node used across all apps — students, parents, staff etc.
 */
function EntityCard({ item, gridFields }) {
  const primary = gridFields.find(f => f.isPrimary);
  const meta = gridFields.filter(f => !f.isPrimary);

  return (
    <Card elevation={0} variant="outlined" sx={{ borderRadius: 0, display: 'flex', height: 90, overflow: 'hidden' }}>
      <Box sx={{
        width: 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'action.hover',
        borderRight: '1px solid',
        borderColor: 'divider'
      }}>
        <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main', fontSize: '1.2rem' }}>
          {item[primary?.id]?.[0] || '?'}
        </Avatar>
      </Box>
      <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 0.2, overflow: 'hidden' }}>
        <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.75rem', color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {item[primary?.id] || '—'}
        </Typography>
        {meta.map(f => (
          <Typography key={f.id} variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {f.icon && <Box component="span" sx={{ mr: 0.5 }}>{f.icon}</Box>}
            <Box component="span" sx={{ fontWeight: 400, color: 'text.disabled', mr: 0.5 }}>{f.label}:</Box>
            {item[f.id] ?? '—'}
          </Typography>
        ))}
      </Box>
    </Card>
  );
}

/**
 * Generic Explorer Module Engine
 */
export default function ModuleExplorer(props) {
  const {
    title,
    hierarchy,
    data,
    renderItem,
    gridFields,       // drives the built-in EntityCard — same structure for all apps
    columns = [],
    onAddClick,
    onItemClick,
    addButtonLabel,
    onAddChildClick,
    canAddChild
  } = props;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [activeGroup, setActiveGroup] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState(isMobile ? 'grid' : 'list');
  const [mobileTreeOpen, setMobileTreeOpen] = useState(false);

  // Sync viewMode if screen size changes drastically (optional but helpful)
  const [lastIsMobile, setLastIsMobile] = useState(isMobile);
  if (isMobile !== lastIsMobile) {
    setViewMode(isMobile ? 'grid' : 'list');
    setLastIsMobile(isMobile);
  }

  const handleGroupSelect = (group) => {
    setActiveGroup(group.id);
    if (isMobile) setMobileTreeOpen(false);
  };

  const enrichedHierarchy = [
    { id: "all", name: "All", count: data.length },
    ...hierarchy
  ];

  // Find the currently selected node in the hierarchy tree
  const findNode = (nodes, id) => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNode(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const activeNode = findNode(enrichedHierarchy, activeGroup);
  const activeNodeIds = [];
  const activeNodeNames = [];

  const collectDetails = (node) => {
    if (node) {
      activeNodeIds.push(node.id.toLowerCase());
      activeNodeNames.push(node.name.toLowerCase());
      if (node.children) {
        node.children.forEach(collectDetails);
      }
    }
  };
  collectDetails(activeNode);

  const matchesGroup = (item) => {
    if (!activeGroup || activeGroup === 'all') return true;

    // Extract all string values of the item to match against
    const itemValues = Object.values(item)
      .filter(v => v !== null && v !== undefined)
      .map(v => String(v).toLowerCase());

    // 1. Check if any value of the item directly matches/contains the active node ids or names
    const hasDirectMatch = itemValues.some(val => {
      return activeNodeIds.some(id => val.includes(id) || id.includes(val)) ||
             activeNodeNames.some(name => {
               // Strip common noise words to make matches robust
               const normalized = name.replace(' department', '').replace(' staff', '').replace(' class', '').replace(' level', '');
               return val.includes(normalized) || normalized.includes(val);
             });
    });

    if (hasDirectMatch) return true;

    // 2. Shorthand level mapping rules (e.g. p1 -> Primary 1, s1 -> Senior 1)
    return activeNodeIds.some(id => {
      if (id.match(/^[p|s|g]\d+$/)) {
        const levelNum = id.substring(1);
        const levelLetter = id.charAt(0);
        return itemValues.some(val => {
          if (levelLetter === 'p' && (val.includes(`p${levelNum}`) || val.includes(`primary ${levelNum}`))) return true;
          if (levelLetter === 's' && (val.includes(`s${levelNum}`) || val.includes(`senior ${levelNum}`) || val.includes(`secondary ${levelNum}`))) return true;
          return false;
        });
      }
      return false;
    });
  };

  // Perform filtering
  const filteredData = data.filter(item => {
    // A. Filter by selected group
    if (!matchesGroup(item)) return false;

    // B. Filter by search input
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const searchableFields = [
        item.name, 
        item.staff_number, 
        item.role, 
        item.department, 
        item.class, 
        item.parent, 
        item.phone, 
        item.email, 
        item.location
      ];
      return searchableFields.some(val => val && String(val).toLowerCase().includes(searchLower));
    }

    return true;
  });

  const renderEmptyState = (isTable = false) => {
    const titleText = searchTerm ? "No matches found" : "No records found";
    const subtitleText = searchTerm 
      ? `We couldn't find any results matching "${searchTerm}". Please try a different search.` 
      : "There are currently no items under this division. Create a new record to get started.";

    const content = (
      <Box sx={{ py: 8, px: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', width: '100%' }}>
        <InboxIcon sx={{ fontSize: 52, color: 'text.disabled', mb: 2, opacity: 0.6 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
          {titleText}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 340, mx: 'auto' }}>
          {subtitleText}
        </Typography>
      </Box>
    );

    if (isTable) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
            {content}
          </TableCell>
        </TableRow>
      );
    }

    return content;
  };

  const sidebarContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 1.5, pb: 0.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.05em' }}>
          Groups / Categories
        </Typography>
      </Box>
      <ExplorerTree
        hierarchy={enrichedHierarchy}
        activeId={activeGroup}
        onSelect={handleGroupSelect}
        onAddChildClick={onAddChildClick}
        canAddChild={canAddChild}
      />
    </Box>
  );

  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
        overflow: 'hidden',
        height: '100%',
        width: '100%'
      }}
    >
      <ExplorerHeader
        title={title}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddClick={onAddClick}
        addButtonLabel={addButtonLabel}
        onToggleSidebar={isMobile ? () => setMobileTreeOpen(prev => !prev) : undefined}
      />

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* Sidebar Navigation */}
        {!isMobile ? (
          <SidebarContainer>
            {sidebarContent}
          </SidebarContainer>
        ) : (
          <AnimatePresence>
            {mobileTreeOpen && (
              <>
                {/* Backdrop scoped to the content area */}
                <Box
                  component={motion.div}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileTreeOpen(false)}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: 'rgba(0,0,0,0.4)',
                    zIndex: 10,
                  }}
                />
                {/* Sidebar scoped to the content area */}
                <Box
                  component={motion.div}
                  initial={{ x: -400 }}
                  animate={{ x: 0 }}
                  exit={{ x: -400 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: 260,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    zIndex: 11,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {sidebarContent}
                </Box>
              </>
            )}
          </AnimatePresence>
        )}

        {/* Main Content Area */}
        <ContentContainer>
          {viewMode === 'grid' ? (
            <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: 3,
                }}
              >
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <Box
                      key={item.id}
                      onClick={() => onItemClick?.(item)}
                      sx={{
                        cursor: onItemClick ? 'pointer' : 'default',
                        display: 'block',
                      }}
                    >
                      {gridFields
                        ? <EntityCard item={item} gridFields={gridFields} />
                        : renderItem?.(item, 'grid')}
                    </Box>
                  ))
                ) : renderEmptyState(false)}
              </Box>
            </Box>
          ) : (
            <TableContainer sx={{ flex: 1 }}>
              <Table stickyHeader size="small" aria-label="data table">
                <TableHead>
                  <TableRow>
                    {columns.map((col) => (
                      <TableCell
                        key={col.id}
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          textTransform: 'uppercase',
                          color: 'text.secondary',
                          bgcolor: 'background.paper',
                          borderRight: '1px solid',
                          borderColor: 'divider',
                          whiteSpace: 'nowrap',
                          '&:last-child': { borderRight: 'none' }
                        }}
                      >
                        {col.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <StripedTableRow
                        key={item.id}
                        hover={Boolean(onItemClick)}
                        onClick={() => onItemClick?.(item)}
                        sx={{ cursor: onItemClick ? 'pointer' : undefined }}
                      >
                        {columns.map((col) => (
                          <TableCell
                            key={col.id}
                            sx={{
                              fontSize: '0.8rem',
                              py: 1,
                              borderRight: '1px solid',
                              borderColor: 'divider',
                              '&:last-child': { borderRight: 'none' }
                            }}
                          >
                            {col.render ? col.render(item) : item[col.id]}
                          </TableCell>
                        ))}
                      </StripedTableRow>
                    ))
                  ) : renderEmptyState(true)}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </ContentContainer>
      </Box>
    </Paper>
  );
}
