import { can } from "../permissions/index.js";

/**
 * @typedef {object} LayoutConfig
 * @property {unknown[]} [sidebar]
 * @property {unknown[]} [topbar]
 * @property {unknown[]} [widgets]
 */

/**
 * @typedef {object} ResolvedLayoutConfig
 * @property {unknown[]} sidebar
 * @property {unknown[]} topbar
 * @property {unknown[]} widgets
 */

/** @type {LayoutConfig} */
let rawLayout = {
  sidebar: [],
  topbar: [],
  widgets: [],
};

/**
 * Whether a config entry is visible based on dynamic permissions.
 * Objects without `permission` (or blank) pass through (public entry).
 *
 * @param {unknown} item
 */
function passesPermissionGate(item) {
  if (item == null || typeof item !== "object") {
    return false;
  }
  if (!("permission" in item)) {
    return true;
  }
  const permission = Reflect.get(item, "permission");

  if (permission == null || permission === "") {
    return true;
  }
  if (typeof permission !== "string") {
    return false;
  }
  return can(permission);
}

/**
 * @param {unknown} section
 */
function filterSection(section) {
  if (!Array.isArray(section)) {
    return [];
  }

  const out = [];
  for (const item of section) {
    if (passesPermissionGate(item)) {
      out.push(item);
    }
  }
  return out;
}

/** @returns {ResolvedLayoutConfig} */
function cloneResolved() {
  return {
    sidebar: filterSection(rawLayout.sidebar),
    topbar: filterSection(rawLayout.topbar),
    widgets: filterSection(rawLayout.widgets),
  };
}

/** @returns {ResolvedLayoutConfig} immutable snapshot based on latest permissions store */
export function getResolvedLayoutConfig() {
  return Object.freeze(cloneResolved());
}

/**
 * Register raw layout sections; resolution is recomputed lazily via getResolvedLayoutConfig.
 *
 * @param {Partial<LayoutConfig> | undefined | null} config
 */
export function registerLayoutConfig(config) {
  if (config == null) {
    rawLayout = {
      sidebar: [],
      topbar: [],
      widgets: [],
    };
    return;
  }

  rawLayout = {
    sidebar: Array.isArray(config.sidebar) ? [...config.sidebar] : [],
    topbar: Array.isArray(config.topbar) ? [...config.topbar] : [],
    widgets: Array.isArray(config.widgets) ? [...config.widgets] : [],
  };
}
