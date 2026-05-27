/* eslint-disable react-refresh/only-export-components -- provider + imperative mock API coupling */
import { createContext, useContext, useEffect, useState } from "react";
import {
  getTenant,
  setTenant as setTenantStore,
  subscribeTenant,
} from "../core/tenant/index.js";

/** @typedef {import("../core/tenant/index.js").Tenant | null} TenantRef */

/** @typedef {{ tenant: TenantRef; setTenant: typeof import("../core/tenant/index.js").setTenant }} TenantControls */

/** @type {import("react").Context<TenantControls | null>} */
const TenantContext = createContext(null);

/** @returns {TenantControls} */
export function useTenantContext() {
  const context = useContext(TenantContext);
  if (context == null) {
    throw new Error("useTenantContext must be used within TenantProvider");
  }

  return context;
}

/** @param {{ children?: import("react").ReactNode }} props */
export function TenantProvider(props) {
  const { children } = props;
  const [, setVersion] = useState(0);

  useEffect(() => subscribeTenant(() => setVersion((value) => value + 1)), []);

  const value = {
    tenant: getTenant(),
    setTenant: setTenantStore,
  };

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}
