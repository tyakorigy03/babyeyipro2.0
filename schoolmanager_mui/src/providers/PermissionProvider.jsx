/* eslint-disable react-refresh/only-export-components -- provider + imperative mock API coupling */
import { createContext, useContext, useEffect, useState } from "react";
import {
  can,
  getPermissions,
  setPermissions as setPermissionsStore,
  subscribePermissions,
} from "../core/permissions/index.js";

/** @typedef {{ permissions: string[]; setPermissions: typeof import("../core/permissions/index.js").setPermissions; can: typeof import("../core/permissions/index.js").can }} PermissionControls */

/** @type {import("react").Context<PermissionControls | null>} */
const PermissionContext = createContext(null);

/** @returns {PermissionControls} */
export function usePermissionContext() {
  const context = useContext(PermissionContext);
  if (context == null) {
    throw new Error("usePermissionContext must be used within PermissionProvider");
  }

  return context;
}

/** @param {{ children?: import("react").ReactNode }} props */
export function PermissionProvider(props) {
  const { children } = props;
  const [, setVersion] = useState(0);

  useEffect(
    () => subscribePermissions(() => setVersion((value) => value + 1)),
    [],
  );

  const value = {
    permissions: getPermissions(),
    setPermissions: setPermissionsStore,
    can,
  };

  return (
    <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>
  );
}
