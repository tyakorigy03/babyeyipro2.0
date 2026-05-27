import { setPermissions } from "../permissions/index.js";

/**
 * Generic mock user envelope (tenant-scoped, permission strings only).
 *
 * @typedef {object} MockAuthUser
 * @property {unknown} id
 * @property {unknown} orgId
 * @property {string[]} permissions
 * @property {object} metadata
 */

/** @type {MockAuthUser | null} */
let user = (() => {
  const saved = localStorage.getItem('user');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return null;
    }
  }
  return null;
})();

/** @type {Set<() => void>} */
const listeners = new Set();

function notify() {
  listeners.forEach((listener) => listener());
}

/**
 * Missing fields coerce to sane defaults (`permissions` → `[]`, `metadata` → `{}`).
 *
 * @param {(Partial<MockAuthUser> & { id?: unknown; orgId?: unknown }) | null | undefined} next
 */
export function setUser(next) {
  if (next == null) {
    user = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setPermissions([]);
    notify();
    return;
  }

  const perm = Array.isArray(next.permissions) ? [...next.permissions] : [];
  user = {
    id: next.id ?? null,
    orgId: next.orgId ?? null,
    permissions: perm,
    metadata:
      next.metadata != null && typeof next.metadata === "object"
        ? { ...next.metadata }
        : {},
  };
  
  localStorage.setItem('user', JSON.stringify(user));
  setPermissions(perm);
  notify();
}

/** @returns {MockAuthUser | null} */
export function getUser() {
  return user;
}

/** @returns {() => void} unsubscribe */
export function subscribeAuth(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

