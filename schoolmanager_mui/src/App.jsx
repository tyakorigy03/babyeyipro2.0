import { useEffect } from "react";
import { layoutConfig } from "./config/layoutConfig.js";
import { registerLayoutConfig } from "./core/layout-engine/index.js";
import { resolveHome } from "./core/home-resolver/index.js";
import { getUser, setUser } from "@/core/auth";
import { setTenant } from "./core/tenant/index.js";
import { AuthProvider } from "./providers/AuthProvider.jsx";
import { NavigationProvider } from "./providers/NavigationProvider.jsx";
import { PermissionProvider } from "./providers/PermissionProvider.jsx";
import { TenantProvider } from "./providers/TenantProvider.jsx";
import { ThemeProvider } from "./providers/ThemeProvider.jsx";
import AppShell from "./ui/shell/AppShell.jsx";
import HomeRoute from "./ui/shell/HomeRoute.jsx";
import AppRoute from "./ui/shell/AppRoute.jsx";
import SetupFoundation from "./pages/setup/Foundation.jsx";
import SystemSetup from "./pages/setup/SystemSetup.jsx";
import Login from "./pages/Login.jsx";
import { mockApps, mockWidgets } from "./mock/mockHomeData.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function LayoutConfigBootstrap() {
  useEffect(() => {
    registerLayoutConfig(layoutConfig);
  }, []);

  return null;
}

import { RequireAuth } from "./providers/RequireAuth.jsx";

export default function App() {
  const resolved = resolveHome(getUser(), mockApps, mockWidgets);

  return (
    <ThemeProvider>
      <TenantProvider>
        <AuthProvider>
          <PermissionProvider>
            <LayoutConfigBootstrap />
            <BrowserRouter>
              <NavigationProvider>
                <div id="app-root">
                  <Routes>
                    <Route element={<AppShell />}>
                      <Route path="/login" element={<Login />} />
                      <Route element={<RequireAuth />}>
                        <Route index element={<HomeRoute home={resolved.home} />} />
                        <Route path="/setup" element={<SetupFoundation />} />
                        <Route path="/setup/foundation" element={<SetupFoundation />} />
                        <Route path="/setup/system" element={<SystemSetup />} />
                        <Route path="/:appId" element={<AppRoute />} />
                        <Route path="/:appId/:pageId" element={<AppRoute />} />
                        <Route path="/:appId/:pageId/:entityId" element={<AppRoute />} />
                      </Route>
                    </Route>
                  </Routes>
                </div>
              </NavigationProvider>
            </BrowserRouter>
          </PermissionProvider>
        </AuthProvider>
      </TenantProvider>
    </ThemeProvider>
  );
}
