import { useColorScheme } from "react-native";

export const useDarkMode = () => {
  return useColorScheme() === "dark";
};
