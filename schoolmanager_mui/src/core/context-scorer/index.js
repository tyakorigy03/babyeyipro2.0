function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function toNumber(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Returns a 0–100 score that approximates system complexity/exposure.
 *
 * Inputs are intentionally generic: counts + density (no roles, no UI).
 *
 * @param {import("../auth/index.js").MockAuthUser | null} user
 * @param {Array<unknown>} apps
 * @param {string[]} permissions
 * @returns {number}
 */
export function getContextScore(user, apps, permissions) {
  void user;

  const appCount = Array.isArray(apps) ? apps.length : 0;
  const permCount = Array.isArray(permissions) ? permissions.length : 0;

  const density = permCount / Math.max(1, appCount);

  // Exposure grows with breadth (apps), depth (permissions), and density (per-app permissions).
  const breadth = clamp(appCount * 4, 0, 40);
  const depth = clamp(permCount * 1.5, 0, 45);
  const permDensity = clamp(density * 10, 0, 25);

  const score = breadth + depth + permDensity;
  return clamp(toNumber(score, 0), 0, 100);
}
