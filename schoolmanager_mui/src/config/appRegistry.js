/**
 * Registry of apps (data only).
 *
 * Apps are filtered by permission and can be ordered by priority.
 * `homeVisibility` is included for future policies (no UI here).
 *
 * @type {Array<{
 *  id: string;
 *  icon?: unknown;
 *  permission?: string;
 *  priority?: number;
 *  homeVisibility?: "always" | "conditional";
 * }>}
 */
export const appRegistry = Object.freeze([]);

