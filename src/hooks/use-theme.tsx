/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import { ThemeProviderContext } from "./theme-context";

export { ThemeProvider } from "./theme-provider";

export function useTheme() {
  const context = React.useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
}
