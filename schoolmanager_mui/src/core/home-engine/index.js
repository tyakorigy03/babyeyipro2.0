import { can } from "../permissions/index.js";

function toNumber(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function isAccessibleByPermission(maybePermission) {
  if (maybePermission == null || maybePermission === "") return true;
  if (typeof maybePermission !== "string") return false;
  return can(maybePermission);
}

/**
 * Pure home composition builder (data only).
 *
 * @param {import("../auth/index.js").MockAuthUser | null} user
 * @param {Array<unknown>} apps
 * @param {Array<unknown>} widgets
 * @param {object} [config]
 * @returns {{ criticalWidgets: unknown[]; contextWidgets: unknown[]; apps: unknown[] }}
 */
export function buildHome(user, apps, widgets, config) {
  void user;
  void config;

  const safeApps = Array.isArray(apps) ? apps : [];
  const safeWidgets = Array.isArray(widgets) ? widgets : [];

  const accessibleApps = safeApps.filter((app) => {
    if (app == null || typeof app !== "object") return false;
    const permission = Reflect.get(app, "permission");
    return isAccessibleByPermission(permission);
  });

  const accessibleWidgets = safeWidgets.filter((widget) => {
    if (widget == null || typeof widget !== "object") return false;
    const permission = Reflect.get(widget, "permission");
    return isAccessibleByPermission(permission);
  });

  const sortedWidgets = [...accessibleWidgets].sort((a, b) => {
    const pa = toNumber(Reflect.get(a, "priority"), 0);
    const pb = toNumber(Reflect.get(b, "priority"), 0);
    return pb - pa;
  });

  const criticalWidgets = [];
  const contextWidgets = [];

  for (const widget of sortedWidgets) {
    const scope = Reflect.get(widget, "scope");
    if (scope === "critical") criticalWidgets.push(widget);
    else contextWidgets.push(widget);
  }

  return {
    criticalWidgets,
    contextWidgets,
    apps: accessibleApps,
  };
}
