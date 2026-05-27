import { createTheme } from "@mui/material/styles";

const PRIMARY_MAIN = "#f59e0b";
const SECONDARY_MAIN = "#000435";

const LIGHT_BACKGROUND = {
  default: "#f9fafb",
  paper: "#ffffff",
};

const DARK_BACKGROUND = {
  default: "#000435",
  paper: "#0a0f6a",
};

/**
 * @param {"light" | "dark"} mode
 */
export function getTheme(mode) {
  const paletteMode = mode === "dark" ? "dark" : "light";

  return createTheme({
    palette: {
      mode: paletteMode,
      primary: { main: PRIMARY_MAIN },
      secondary: { main: SECONDARY_MAIN },
      background:
        paletteMode === "dark" ? { ...DARK_BACKGROUND } : { ...LIGHT_BACKGROUND },
    },
  });
}
