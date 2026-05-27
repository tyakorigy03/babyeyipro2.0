import { getActiveRoute } from "../navigation/navigation-engine.js";

/**
 * Resolves the current active app contract by id.
 *
 * Can be called with explicit activeAppId, or without it
 * to read current navigation state through navigation-engine.
 *
 * @param {import("./app-contract.js").AppContract[]} registry
 * @param {string | null | undefined} [activeAppId]
 * @returns {import("./app-contract.js").AppContract | null}
 */
export function getActiveApp(registry, activeAppId) {
  const list = Array.isArray(registry) ? registry : [];

  const routeId =
    typeof activeAppId === "string" && activeAppId.length > 0
      ? activeAppId
      : getActiveRoute().activeAppId;

  if (typeof routeId !== "string" || routeId.length === 0) {
    return null;
  }

  const match = list.find((app) => app && typeof app === "object" && app.id === routeId);
  return match ? { ...match } : null;
}

