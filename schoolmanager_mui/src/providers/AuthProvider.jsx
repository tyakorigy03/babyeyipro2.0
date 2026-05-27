/* eslint-disable react-refresh/only-export-components -- provider + imperative mock API coupling */
import { createContext, useContext, useEffect, useState } from "react";
import { getUser, setUser as setUserStore, subscribeAuth } from "../core/auth/index.js";

/** @typedef {import("../core/auth/index.js").MockAuthUser | null} AuthUserRef */

/** @typedef {{ user: AuthUserRef; setUser: typeof import("../core/auth/index.js").setUser }} AuthControls */

/** @type {import("react").Context<AuthControls | null>} */
const AuthContext = createContext(null);

/** @returns {AuthControls} */
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context == null) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }

  return context;
}

/** @param {{ children?: import("react").ReactNode }} props */
export function AuthProvider(props) {
  const { children } = props;
  const [, setVersion] = useState(0);

  useEffect(() => subscribeAuth(() => setVersion((value) => value + 1)), []);

  const value = {
    user: getUser(),
    setUser: setUserStore,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
