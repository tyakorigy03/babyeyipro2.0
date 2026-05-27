/**
 * Navigation state store (no UI, no routing library).
 *
 * State shape:
 * {
 *  activeAppId: string | null,
 *  activeViewId: string | null,
 *  history: Array<{ activeAppId: string | null; activeViewId: string | null; ts: number }>
 * }
 */

/** @type {{ activeAppId: string | null; activeViewId: string | null; history: Array<{ activeAppId: string | null; activeViewId: string | null; ts: number }> }} */
let state = {
  activeAppId: null,
  activeViewId: null,
  history: [],
};

/** @type {Set<() => void>} */
const listeners = new Set();

function notify() {
  listeners.forEach((listener) => listener());
}

function pushHistory(next) {
  state = {
    ...next,
    history: [
      ...state.history,
      { activeAppId: next.activeAppId, activeViewId: next.activeViewId, ts: Date.now() },
    ],
  };
}

/** @returns {{ activeAppId: string | null; activeViewId: string | null; history: Array<{ activeAppId: string | null; activeViewId: string | null; ts: number }> }} */
export function getNavigationState() {
  return {
    activeAppId: state.activeAppId,
    activeViewId: state.activeViewId,
    history: [...state.history],
  };
}

/** @returns {() => void} unsubscribe */
export function subscribeNavigation(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** @param {string} appId */
export function navigateToApp(appId) {
  if (typeof appId !== "string" || appId.length === 0) return;
  pushHistory({ activeAppId: appId, activeViewId: null, history: state.history });
  notify();
}

/** @param {string} appId @param {string} viewId */
export function navigateToView(appId, viewId) {
  if (typeof appId !== "string" || appId.length === 0) return;
  if (typeof viewId !== "string" || viewId.length === 0) return;
  pushHistory({ activeAppId: appId, activeViewId: viewId, history: state.history });
  notify();
}

export function goHome() {
  pushHistory({ activeAppId: null, activeViewId: null, history: state.history });
  notify();
}

/** @returns {{ activeAppId: string | null; activeViewId: string | null }} */
export function getActiveRoute() {
  return { activeAppId: state.activeAppId, activeViewId: state.activeViewId };
}

