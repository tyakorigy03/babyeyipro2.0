/* eslint-disable react-refresh/only-export-components -- paired hook exposes palette.mode switches */
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider as MuiMaterialThemeProvider } from "@mui/material/styles";
import { getTheme } from "../theme/theme.js";

const ThemeModeContext = createContext(null);

/** @typedef {"light" | "dark"} ThemeMode */

/** @typedef {{ mode: ThemeMode; setMode: (mode: ThemeMode) => void; toggleMode: () => void }} ThemeModeControls */

/** @returns {ThemeModeControls} */
export function useThemeMode() {
  const context = useContext(ThemeModeContext);
  if (context == null) {
    throw new Error("useThemeMode must be used within ThemeProvider");
  }

  return context;
}

/** @param {{ children?: import("react").ReactNode }} props */
export function ThemeProvider(props) {
  const { children } = props;

  /** @type {[ThemeMode, import("react").Dispatch<import("react").SetStateAction<ThemeMode>>]} */
  const [mode, setModeState] = useState(() => /** @type {ThemeMode} */ ("light"));

  const setMode = useCallback((next) => {
    setModeState(next === "dark" ? "dark" : "light");
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const controls = useMemo(
    () => ({
      mode,
      setMode,
      toggleMode,
    }),
    [mode, setMode, toggleMode],
  );

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeModeContext.Provider value={controls}>
      <MuiMaterialThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </MuiMaterialThemeProvider>
    </ThemeModeContext.Provider>
  );
}
