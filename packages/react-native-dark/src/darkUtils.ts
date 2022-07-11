import * as React from "react";
import {
  Appearance,
  ColorSchemeName,
  ImageStyle,
  StyleSheet,
  TextStyle,
  useColorScheme,
  ViewStyle,
} from "react-native";
import { SimpleEventEmitter } from "./SimpleEventEmitter";
import { omit } from "./omit";
import { colorScheme, colorSchemeEE, isDark } from "./colorSchemeState";

/**
 * Replacement for StyleSheet.create, with $dark option
 */
export const createStyleSheet = <T extends NamedStyles>(styles: T) => {
  // We split the $dark style declarations out before creating StyleSHeet
  const $styles = {} as { [K in keyof T]: T[K] } & {
    [K in `${NonSymbol<keyof T>}$dark`]: T[K];
  };
  for (const key in styles) {
    if (styles[key]["$dark"]) {
      // @ts-ignore
      $styles[key] = omit(styles[key], "$dark");
      // @ts-ignore
      $styles[`${key}$dark`] = styles[key]["$dark"];
    } else {
      $styles[key] = styles[key];
    }
  }

  // Create StyleSheet with $dark declarations split out.
  const stylesheet = StyleSheet.create($styles);

  // Hold a cache, just to have some referential equality between renders.
  // This is lightweight. The objects already exist, just caching the arrays of them
  const cache = {} as Record<string, unknown>;

  // Return a proxy that's responsible for "trapping" the access calls.
  return new Proxy({} as { [K in keyof T]: GetStyleType<T[K]>[] }, {
    get(target, p, receiver) {
      // First check if we already have the value in cache
      const key = `${String(p)}${isDark() ? "$dark" : ""}`;
      const cacheVal = cache[key];
      if (cacheVal) return cacheVal;

      // Grab "light-mode" version, and conditionally append "dark-mode" styles to it.
      const val = [stylesheet[String(p)]].concat(
        stylesheet[`${String(p)}$dark`] && isDark()
          ? stylesheet[`${String(p)}$dark`]
          : [],
      );

      // Cache value and return.
      cache[key] = val;
      return val;
    },
  });
};

/**
 * Hook required to trigger re-render when color scheme preference changes.
 */
export const useDynamicDarkModeStyles = () => {
  const [s, setS] = React.useState(colorScheme);

  React.useEffect(() => {
    return colorSchemeEE.subscribe((v) => {
      setS(v);
    }).unsubscribe;
  }, []);
};

/**
 * Util types
 */
// Exclude symbols
type NonSymbol<T> = Exclude<T, symbol>;

type AddDark<T> = T & { $dark?: T };

type NamedStyles = Record<
  string,
  AddDark<ViewStyle> | AddDark<TextStyle> | AddDark<ImageStyle>
>;

// Generalize literal type out to the broader `*Style` type it extends.
type GetStyleType<T> = T extends ViewStyle
  ? ViewStyle
  : T extends TextStyle
  ? TextStyle
  : ImageStyle;
