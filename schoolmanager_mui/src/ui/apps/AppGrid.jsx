import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { alpha, useTheme } from "@mui/material/styles";

// MUI Icons for apps
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import FamilyRestroomRoundedIcon from "@mui/icons-material/FamilyRestroomRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import GavelRoundedIcon from "@mui/icons-material/GavelRounded";
import AutoGraphRoundedIcon from "@mui/icons-material/AutoGraphRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import TimerRoundedIcon from "@mui/icons-material/TimerRounded";
import LocalActivityRoundedIcon from "@mui/icons-material/LocalActivityRounded";

const APP_ICONS = {
  dashboards: <DashboardRoundedIcon />,
  students: <SchoolRoundedIcon />,
  staff: <GroupsRoundedIcon />,
  attendance: <EventAvailableRoundedIcon />,
  timetable: <CalendarMonthRoundedIcon />,
  fees: <AccountBalanceWalletRoundedIcon />,
  payroll: <PaymentsRoundedIcon />,
  parents: <FamilyRestroomRoundedIcon />,
  babyeyi: <AssessmentRoundedIcon />,
  discipline: <GavelRoundedIcon />,
  shuleadvance: <AutoGraphRoundedIcon />,
  shulecard: <BadgeRoundedIcon />,
  setup: <SettingsRoundedIcon />,
  routines: <AccessTimeRoundedIcon />,
  time_slots: <TimerRoundedIcon />,
  activities: <LocalActivityRoundedIcon />,
};

/**
 * Renders apps as cards (UI only).
 *
 * @param {{ apps: Array<{ id: string; icon?: unknown; label?: unknown; name?: unknown }>; onAppClick?: (app: unknown) => void }} props
 */
export default function AppGrid(props) {
  const { apps, onAppClick } = props;
  const list = Array.isArray(apps) ? apps : [];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ py: isMobile ? 2 : 4, display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          columnGap: isMobile ? 2 : 4,
          rowGap: isMobile ? 3 : 5,
          maxWidth: 'md',
          px: isMobile ? 2 : 3,
          height: 'fit-content',
          width: '100%'
        }}
      >
        {list.map((app) => {
          const label = String(app?.label ?? app?.name ?? app?.id ?? "app");
          // const icon = app?.icon; // Original image icon
          const muiIcon = APP_ICONS[app.id] || <HelpOutlineRoundedIcon />;

          return (
            <Box
              key={String(app?.id ?? label)}
              onClick={onAppClick ? () => onAppClick(app) : undefined}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1.5,
                cursor: 'pointer',
                textDecoration: 'none',
                width: 96,
                '&:hover': {
                  '& .app-icon-container': {
                    boxShadow: (theme) => `0 20px 25px -5px ${alpha(theme.palette.primary.main, 0.1)}, 0 8px 10px -6px ${alpha(theme.palette.primary.main, 0.1)}`,
                    transform: 'translateY(-6px)',
                    borderColor: (theme) => alpha(theme.palette.primary.main, 0.2),
                  },
                  '& .app-icon': {
                    transform: 'scale(1.1)',
                  }
                }
              }}
            >
              <Box
                className="app-icon-container"
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 2,
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? alpha(theme.palette.grey[800], 0.7) : alpha(theme.palette.grey[200], 0.7),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 1,
                  transition: 'all 0.3s ease',
                  border: '1px solid transparent',
                }}
              >
                {/* 
                Original Image Icon Structure (Preserved for possible reversal)
                {typeof icon === 'string' ? (
                  <Box
                    component="img"
                    src={icon}
                    alt={label}
                    className="app-icon"
                    sx={{
                      width: 48,
                      height: 48,
                      objectFit: 'contain',
                      transition: 'transform 0.3s ease',
                    }}
                  />
                ) : (
                  <Box
                    className="app-icon"
                    sx={{
                      display: 'flex',
                      transition: 'transform 0.3s ease',
                      '& > svg': { fontSize: 32, color: 'text.primary' }
                    }}
                  >
                    {icon}
                  </Box>
                )} 
                */}

                {/* New MUI Icon Structure */}
                <Box
                  className="app-icon"
                  sx={{
                    display: 'flex',
                    transition: 'transform 0.3s ease',
                    '& > svg': { 
                      fontSize: 32, 
                      color: 'primary.main', // Primary color for the icon
                    }
                  }}
                >
                  {muiIcon}
                </Box>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.primary',
                  textAlign: 'center',
                  transition: 'color 0.2s ease',
                  whiteSpace: 'nowrap',
                  opacity: 0.8,
                  fontWeight: 600, // Make text a bit bolder for better contrast with icons
                }}
              >
                {label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
