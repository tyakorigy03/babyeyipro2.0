/** @type {string[]} */
let permissions = [];

/** @type {Set<() => void>} */
const listeners = new Set();

function notify() {
  listeners.forEach((listener) => listener());
}

/** @returns {string[]} shallow copy */
export function getPermissions() {
  return [...permissions];
}

/** @param {string[] | null | undefined} list */
export function setPermissions(list) {
  permissions = Array.isArray(list) ? [...list] : [];
  notify();
}

/** @param {string} permission */
export function can(permission) {
  if (typeof permission !== "string" || permission.length === 0) {
    return false;
  }
  return permissions.includes(permission);
}

/** @returns {() => void} unsubscribe */
export function subscribePermissions(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
