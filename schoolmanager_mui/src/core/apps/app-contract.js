/**
 * AppModule contract schema (structure only, no UI/rendering logic).
 *
 * @typedef {object} AppContractView
 * @property {string} id
 * @property {string} permission
 * @property {string} [label]
 * @property {"form" | "view" | "wizard" | string} [type]
 * @property {object} [metadata]
 *
 * @typedef {object} AppContractAction
 * @property {string} id
 * @property {string} permission
 *
 * @typedef {object} AppContractSubPage
 * @property {string} id
 * @property {string} name
 * @property {string} permission
 * @property {"form" | "view" | "wizard" | string} type
 * @property {object} [metadata]
 *
 * @typedef {object} AppContract
 * @property {string} id
 * @property {string} name
 * @property {string} icon
 * @property {string} permission
 * @property {string} defaultView
 * @property {AppContractView[]} views
 * @property {AppContractSubPage[]} [subPages]
 * @property {AppContractAction[]} actions
 * @property {object} metadata
 */

/**
 * Normalizes unknown input into a valid AppContract object.
 * Throws for missing required top-level string fields.
 *
 * @param {unknown} input
 * @returns {AppContract}
 */
export function defineAppContract(input) {
  if (input == null || typeof input !== "object") {
    throw new Error("AppContract must be an object.");
  }

  const id = String(Reflect.get(input, "id") ?? "").trim();
  const name = String(Reflect.get(input, "name") ?? "").trim();
  const icon = String(Reflect.get(input, "icon") ?? "").trim();
  const permission = String(Reflect.get(input, "permission") ?? "").trim();
  const defaultView = String(Reflect.get(input, "defaultView") ?? "").trim();

  if (!id || !name || !icon || !permission || !defaultView) {
    throw new Error("AppContract requires id, name, icon, permission, and defaultView.");
  }

  const viewsRaw = Reflect.get(input, "views");
  const subPagesRaw = Reflect.get(input, "subPages");
  const actionsRaw = Reflect.get(input, "actions");
  const metadataRaw = Reflect.get(input, "metadata");

  const views = Array.isArray(viewsRaw)
    ? viewsRaw.map((view) => {
        const id = String(Reflect.get(view, "id") ?? "").trim();
        const permission = String(Reflect.get(view, "permission") ?? "").trim();
        const labelRaw = Reflect.get(view, "label");
        const label = labelRaw != null ? String(labelRaw).trim() : undefined;
        const type = String(Reflect.get(view, "type") ?? "view").trim();
        const metadata = Reflect.get(view, "metadata") ?? {};

        return { id, permission, label, type, metadata };
      })
    : [];

  const mapSubPage = (page) => ({
    id: String(Reflect.get(page, "id") ?? "").trim(),
    name: String(Reflect.get(page, "name") ?? "").trim(),
    permission: String(Reflect.get(page, "permission") ?? "").trim(),
    type: String(Reflect.get(page, "type") ?? "view").trim(),
    metadata: Reflect.get(page, "metadata") ?? {},
    subPages: Array.isArray(Reflect.get(page, "subPages")) 
      ? Reflect.get(page, "subPages").map(mapSubPage) 
      : []
  });

  const subPages = Array.isArray(subPagesRaw)
    ? subPagesRaw.map(mapSubPage)
    : [];

  const actions = Array.isArray(actionsRaw)
    ? actionsRaw.map((action) => ({
        id: String(Reflect.get(action, "id") ?? "").trim(),
        permission: String(Reflect.get(action, "permission") ?? "").trim(),
      }))
    : [];

  return {
    id,
    name,
    icon,
    permission,
    defaultView,
    views: views.filter((v) => v.id.length > 0 && v.permission.length > 0),
    subPages: subPages.filter((p) => p.id.length > 0 && p.permission.length > 0),
    actions: actions.filter((a) => a.id.length > 0 && a.permission.length > 0),
    metadata:
      metadataRaw != null && typeof metadataRaw === "object" ? { ...metadataRaw } : {},
  };
}

