import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AppGrid from "../apps/AppGrid.jsx";
import WidgetRenderer from "../widgets/WidgetRenderer.jsx";
import { useNavigation } from "../../providers/NavigationProvider.jsx";
import { widgetRegistry } from "../../core/widgets/widget-registry.js";
import { resolveWidgets } from "../../core/widgets/widget-resolver.js";
import { getUser } from "../../core/auth/index.js";

function toIdList(items) {
  if (!Array.isArray(items)) return [];
  return items
    .map((w) => (w && typeof w === "object" ? String(Reflect.get(w, "id") ?? "") : ""))
    .filter((id) => id.length > 0);
}

function pickDefinitionsById(ids) {
  const set = new Set(ids);
  return widgetRegistry.filter((def) => set.has(def.id));
}

/**
 * UI-only renderer for resolved home data (no filtering/permissions/logic).
 *
 * @param {{ home: { widgets?: { critical?: unknown[]; context?: unknown[] }; apps?: unknown[] } }} props
 */
export default function HomeRenderer(props) {
  const { home } = props;
  const { navigateToApp } = useNavigation();

  const critical = home?.widgets?.critical ?? [];
  const context = home?.widgets?.context ?? [];
  const apps = home?.apps ?? [];

  const criticalDefs = resolveWidgets(getUser(), pickDefinitionsById(toIdList(critical)));
  const contextDefs = resolveWidgets(getUser(), pickDefinitionsById(toIdList(context)));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 120px)' }}>
      <Stack spacing={3} sx={{ flexGrow: 1 }}>
        {Array.isArray(criticalDefs) && criticalDefs.length > 0 ? (
          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Critical
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              {criticalDefs.map((widget, idx) => (
                <Box key={idx} sx={{ flex: 1, minWidth: { sm: 220 } }}>
                  <WidgetRenderer widget={widget} />
                </Box>
              ))}
            </Stack>
          </Box>
        ) : null}

        {Array.isArray(contextDefs) && contextDefs.length > 0 ? (
          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Context
            </Typography>
            <Stack spacing={2}>
              {contextDefs.map((widget, idx) => (
                <WidgetRenderer key={idx} widget={widget} />
              ))}
            </Stack>
          </Box>
        ) : null}

        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <AppGrid apps={apps} onAppClick={(app) => navigateToApp(String(app?.id ?? ""))} />
        </Box>
      </Stack>

      <Box component="footer" sx={{ width: '100%', py: 8, mt: 'auto' }}>
        <Box sx={{ maxWidth: 'lg', mx: 'auto', px: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{ height: '1px', width: 48, background: (theme) => `linear-gradient(to right, transparent, ${theme.palette.primary.main}33)` }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ color: 'text.secondary', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 'bold', opacity: 0.7 }}>
                Managed by
              </Typography>
              <Typography sx={{ color: 'primary.main', fontWeight: 900, letterSpacing: '-0.05em', fontSize: '1.125rem', display: 'flex', alignItems: 'center' }}>
                EDU<Box component="span" sx={{ color: 'secondary.main' }}>POTO</Box>
              </Typography>
            </Box>
            <Box sx={{ height: '1px', width: 48, background: (theme) => `linear-gradient(to left, transparent, ${theme.palette.primary.main}33)` }} />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
            <Typography sx={{ color: 'text.secondary', fontSize: '11px', fontWeight: 500, letterSpacing: '0.025em', textTransform: 'uppercase', opacity: 0.8 }}>
              Elevating Education through Technology
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
              <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'secondary.main', opacity: 0.4 }} />
              <Typography sx={{ color: 'text.secondary', fontSize: '9px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.5 }}>
                © {new Date().getFullYear()} Edupoto Global. All rights reserved.
              </Typography>
              <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'secondary.main', opacity: 0.4 }} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

