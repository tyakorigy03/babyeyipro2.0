/**
 * Widget registry metadata only (no UI, no fetching, no app coupling).
 *
 * Shape:
 * {
 *  id: string,
 *  title: string,
 *  permission: string,
 *  priority: number,
 *  scope: "global" | "context"
 * }
 */

export const widgetRegistry = Object.freeze([
  {
    id: "widget.pending-actions",
    title: "Pending actions",
    permission: "",
    priority: 90,
    scope: "global",
  },
  {
    id: "widget.system-alerts",
    title: "System alerts",
    permission: "",
    priority: 100,
    scope: "global",
  },
  {
    id: "widget.notifications",
    title: "Notifications",
    permission: "",
    priority: 70,
    scope: "global",
  },
  {
    id: "widget.quick-stats",
    title: "Quick stats",
    permission: "",
    priority: 60,
    scope: "context",
  },
  {
    id: "widget.activity-feed",
    title: "Activity feed",
    permission: "",
    priority: 50,
    scope: "context",
  },
]);

