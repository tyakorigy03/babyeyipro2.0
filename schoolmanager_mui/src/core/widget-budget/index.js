function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function toNumber(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Budget is derived from complexity signals only (no roles).
 *
 * @param {{ contextScore?: number; accessibleAppsCount?: number; permissionsCount?: number; hasCriticalActions?: boolean }} userContext
 * @returns {{ maxCriticalWidgets: number; maxContextWidgets: number; maxAppsVisible: number }}
 */
export function calculateWidgetBudget(userContext) {
  const apps = toNumber(userContext?.accessibleAppsCount, 0);
  const perms = toNumber(userContext?.permissionsCount, 0);
  const hasCriticalActions = Boolean(userContext?.hasCriticalActions);
  const score = clamp(toNumber(userContext?.contextScore, 0), 0, 100);

  // Additional pressure from raw counts, independent of the 0–100 score.
  const appsPressure = clamp(apps / 25, 0, 1); // ~0..1 as apps grows
  const permsPressure = clamp(perms / 120, 0, 1); // ~0..1 as permissions grows
  const combinedPressure = clamp(score / 100 + appsPressure * 0.35 + permsPressure * 0.35, 0, 1);

  // Higher pressure => smaller budgets.
  const maxCriticalWidgets = clamp(
    Math.round(6 - combinedPressure * 4 + (hasCriticalActions ? 1 : 0)),
    1,
    8,
  );

  const maxContextWidgets = clamp(Math.round(14 - combinedPressure * 10), 2, 20);
  const maxAppsVisible = clamp(Math.round(24 - combinedPressure * 18), 3, 30);

  return {
    maxCriticalWidgets,
    maxContextWidgets,
    maxAppsVisible,
  };
}
