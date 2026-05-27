import { can } from "../permissions/index.js";

function toNumber(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Resolves widgets into a ready-to-render list (data only).
 *
 * - filters via `can(permission)`; empty permission is public
 * - sorts by priority (desc)
 *
 * @param {import("../auth/index.js").MockAuthUser | null} user
 * @param {Array<{ id: string; title: string; permission: string; priority: number; scope: "global" | "context" }>} widgetRegistry
 * @returns {Array<{ id: string; title: string; permission: string; priority: number; scope: "global" | "context" }>}
 */
export function resolveWidgets(user, widgetRegistry) {
  void user;
  const list = Array.isArray(widgetRegistry) ? widgetRegistry : [];

  const filtered = list.filter((w) => {
    const permission = w?.permission;
    if (permission == null || permission === "") return true;
    if (typeof permission !== "string") return false;
    return can(permission);
  });

  return [...filtered].sort((a, b) => {
    const pa = toNumber(a?.priority, 0);
    const pb = toNumber(b?.priority, 0);
    return pb - pa;
  });
}

