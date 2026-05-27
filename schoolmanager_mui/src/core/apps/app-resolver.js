import { can } from "../permissions/index.js";

/**
 * Filters and normalizes app contracts to the subset accessible
 * for current permission state. Structure is preserved.
 *
 * Validation rules:
 * - apps without app permission are excluded
 * - views without permission are excluded
 * - actions without permission are excluded
 *
 * @param {import("../auth/index.js").MockAuthUser | null} user
 * @param {import("./app-contract.js").AppContract[]} registry
 * @returns {import("./app-contract.js").AppContract[]}
 */
export function resolveApps(user, registry) {
  void user;
  const list = Array.isArray(registry) ? registry : [];

  return list
    .filter((app) => app && typeof app === "object" && can(app.permission))
    .map((app) => {
      const views = Array.isArray(app.views)
        ? app.views.filter((view) => view && typeof view === "object" && can(view.permission))
        : [];

      const actions = Array.isArray(app.actions)
        ? app.actions.filter(
            (action) => action && typeof action === "object" && can(action.permission),
          )
        : [];

      const hasDefaultView = views.some((view) => view.id === app.defaultView);
      const defaultView = hasDefaultView ? app.defaultView : views[0]?.id ?? app.defaultView;

      return {
        ...app,
        defaultView,
        views: views.map((view) => ({ ...view })),
        actions: actions.map((action) => ({ ...action })),
        metadata:
          app.metadata != null && typeof app.metadata === "object"
            ? { ...app.metadata }
            : {},
      };
    });
}

