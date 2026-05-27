/**
 * Registry of home widgets (data only).
 *
 * Widget records are evaluated by permission + priority + scope.
 * No UI components are registered here.
 *
 * @type {Array<{
 *  id: string;
 *  permission?: string;
 *  priority?: number;
 *  scope?: "critical" | "context" | string;
 *  maxFrequency?: number;
 * }>}
 */
export const widgetRegistry = Object.freeze([]);

