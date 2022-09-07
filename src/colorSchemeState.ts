import { SimpleEventEmitter } from "./SimpleEventEmitter";
import { Appearance, ColorSchemeName } from "react-native";

type ColorSchemeOverride = "auto" | "dark" | "light";

// Event Emitter to emit when color scheme pref changes
export const colorSchemeEE = new SimpleEventEmitter<ColorSchemeName>();

// Combine override with system pref to derive actual value
let systemColorScheme = Appearance.getColorScheme();
let colorSchemeOverride: ColorSchemeOverride = "auto";
export const colorScheme = () =>
  colorSchemeOverride === "auto" ? systemColorScheme : colorSchemeOverride;
export const isDark = () => colorScheme() === "dark";

// Subscribe to Appearance changes.
// This handler is split out so that it can be called directly from tests.
export const onAppearanceChange: Appearance.AppearanceListener = (r) => {
  systemColorScheme = r.colorScheme;
  colorSchemeEE.emit(colorScheme());
};
Appearance.addChangeListener(onAppearanceChange);

// Manually override color scheme preference
export const setColorScheme = (o: ColorSchemeOverride) => {
  colorSchemeOverride = o;
};
