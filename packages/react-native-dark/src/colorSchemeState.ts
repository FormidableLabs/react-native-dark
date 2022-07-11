import { SimpleEventEmitter } from "./SimpleEventEmitter";
import { Appearance, ColorSchemeName } from "react-native";

type ColorSchemeOverride = "auto" | "dark" | "light";

export const colorSchemeEE = new SimpleEventEmitter<ColorSchemeName>();
let systemColorScheme = Appearance.getColorScheme();
let colorSchemeOverride: ColorSchemeOverride = "auto";
export const colorScheme = () =>
  colorSchemeOverride === "auto" ? systemColorScheme : colorSchemeOverride;

export const isDark = () => colorScheme() === "dark";

export const onAppearanceChange: Appearance.AppearanceListener = (r) => {
  systemColorScheme = r.colorScheme;
  colorSchemeEE.emit(colorScheme());
};
Appearance.addChangeListener(onAppearanceChange);

export const setColorScheme = (o: ColorSchemeOverride) => {
  colorSchemeOverride = o;
};
