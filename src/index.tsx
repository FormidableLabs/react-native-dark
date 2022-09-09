import * as React from "react";
import { useColorScheme } from "react-native";

export type ColorSchemeMode = "light" | "dark" | "auto";
const DarkModeContext = React.createContext<ColorSchemeMode>("auto");

export const useDarkMode = () => {
  const colorMode = React.useContext(DarkModeContext) || "auto";
  const deviceColorScheme = useColorScheme();

  return (
    colorMode === "dark" ||
    (colorMode === "auto" && deviceColorScheme === "dark")
  );
};

export const DarkModeProvider = ({
  colorMode,
  children,
}: React.PropsWithChildren<{ colorMode: ColorSchemeMode }>) => {
  return (
    <DarkModeContext.Provider value={colorMode}>
      {children}
    </DarkModeContext.Provider>
  );
};
