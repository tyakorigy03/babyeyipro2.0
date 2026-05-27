/* eslint-disable react-refresh/only-export-components -- provider exposes navigation hook */
import { createContext, useContext, useMemo } from "react";
import { useLocation, useNavigate, matchPath } from "react-router-dom";

/** @typedef {{ activeAppId: string | null; activeViewId: string | null; history: Array<{ path: string; ts: number }> }} NavigationState */

/**
 * @typedef {{
 *  state: NavigationState;
 *  navigateToApp: (appId: string) => void;
 *  navigateToView: (appId: string, viewId: string) => void;
 *  goHome: () => void;
 *  getActiveRoute: () => { activeAppId: string | null; activeViewId: string | null };
 * }} NavigationControls
 */

/** @type {import("react").Context<NavigationControls | null>} */
const NavigationContext = createContext(null);

/** @returns {NavigationControls} */
export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context == null) {
    throw new Error("useNavigation must be used within NavigationProvider");
  }
  return context;
}

/** @param {{ children?: import("react").ReactNode }} props */
export function NavigationProvider(props) {
  const { children } = props;
  const navigate = useNavigate();
  const location = useLocation();

  const pathParts = location.pathname.split('/');
  const possibleAppId = (pathParts[1] && pathParts[1] !== 'home' && pathParts[1] !== 'login') ? pathParts[1] : null;
  const activePageId = pathParts[2] || null;

  const activeAppId = possibleAppId;
  const activeViewId = activePageId;
  
  // Minimal history snapshot: React Router already owns navigation history.
  const history = useMemo(
    () => [{ path: location.pathname, ts: 0 }],
    [location.pathname],
  );

  const value = useMemo(
    () => ({
      state: {
        activeAppId,
        activeViewId,
        history,
      },
      navigateToApp: (appId) => {
        if (typeof appId !== "string" || appId.length === 0) return;
        navigate(`/${encodeURIComponent(appId)}`);
      },
      navigateToView: (appId, viewId) => {
        if (typeof appId !== "string" || appId.length === 0) return;
        if (typeof viewId !== "string" || viewId.length === 0) return;
        navigate(`/${encodeURIComponent(appId)}/${encodeURIComponent(viewId)}`);
      },
      goHome: () => {
        navigate("/");
      },
      getActiveRoute: () => ({ activeAppId, activeViewId }),
    }),
    [activeAppId, activeViewId, history, navigate],
  );

  return (
    <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>
  );
}

