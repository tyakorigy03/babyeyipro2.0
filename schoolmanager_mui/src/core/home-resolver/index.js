import { getPermissions, can } from "../permissions/index.js";
import { getTenant } from "../tenant/index.js";
import { buildHome } from "../home-engine/index.js";
import { getContextScore } from "../context-scorer/index.js";
import { calculateWidgetBudget } from "../widget-budget/index.js";

function toNumber(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function isAccessibleByPermission(maybePermission) {
  if (maybePermission == null || maybePermission === "") return true;
  if (typeof maybePermission !== "string") return false;
  return can(maybePermission);
}

function filterAccessible(list) {
  if (!Array.isArray(list)) return [];
  return list.filter((item) => {
    if (item == null || typeof item !== "object") return false;
    const permission = Reflect.get(item, "permission");
    return isAccessibleByPermission(permission);
  });
}

function sortByPriorityDesc(list) {
  return [...list].sort((a, b) => {
    const pa = toNumber(Reflect.get(a, "priority"), 0);
    const pb = toNumber(Reflect.get(b, "priority"), 0);
    return pb - pa;
  });
}

/**
 * Home resolver pipeline (data only, no UI).
 *
 * @param {import("../auth/index.js").MockAuthUser | null} user
 * @param {Array<unknown>} apps
 * @param {Array<unknown>} widgets
 * @returns {{ home: { widgets: { critical: unknown[]; context: unknown[] }; apps: unknown[] } }}
 */
export function resolveHome(user, apps, widgets) {
  const permissions = getPermissions();

  const accessibleApps = filterAccessible(apps);
  const accessibleWidgets = filterAccessible(widgets);

  const contextScore = getContextScore(user, accessibleApps, permissions);

  const hasCriticalActions = accessibleWidgets.some((w) => Reflect.get(w, "scope") === "critical");

  const budget = calculateWidgetBudget({
    contextScore,
    accessibleAppsCount: accessibleApps.length,
    permissionsCount: permissions.length,
    hasCriticalActions,
  });

  const tenant = getTenant();
  const config = {
    contextScore,
    tenantId: tenant?.id ?? null,
  };

  const built = buildHome(user, apps, widgets, config);

  const critical = sortByPriorityDesc(built.criticalWidgets).slice(0, budget.maxCriticalWidgets);
  const context = sortByPriorityDesc(built.contextWidgets).slice(0, budget.maxContextWidgets);
  const homeApps = sortByPriorityDesc(built.apps).slice(0, budget.maxAppsVisible);

  return {
    home: {
      widgets: {
        critical,
        context,
      },
      apps: homeApps,
    },
  };
}
