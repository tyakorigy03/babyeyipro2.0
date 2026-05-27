/**
 * @typedef {object} Tenant
 * @property {unknown} id
 * @property {unknown} name
 * @property {object} [config]
 */

/** @type {Tenant | null} */
let tenant = null;

/** @type {Set<() => void>} */
const listeners = new Set();

function notify() {
  listeners.forEach((listener) => listener());
}

/**
 * @param {Tenant | null | undefined} next
 */
export function setTenant(next) {
  if (next == null) {
    tenant = null;
    notify();
    return;
  }

  tenant = {
    id: next.id ?? null,
    name: next.name ?? null,
    config:
      next.config != null && typeof next.config === "object"
        ? { ...next.config }
        : {},
  };
  notify();
}

/** @returns {Tenant | null} */
export function getTenant() {
  return tenant;
}

/** @returns {() => void} unsubscribe */
export function subscribeTenant(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
