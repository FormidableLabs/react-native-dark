import * as React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createStyleSheet, useDynamicDarkModeStyles } from "./easyDark";
import { onAppearanceChange } from "./colorSchemeState";
import { render } from "@testing-library/react-native";
import { View } from "react-native";

const MockView = vi.fn();

vi.mock("react-native", () => ({
  Appearance: {
    getColorScheme: () => "light",
    addChangeListener: () => ({ remove: () => null }),
  },
  StyleSheet: {
    create: (x: unknown) => x,
  },
  View: (...args: unknown[]) => MockView(...args),
}));

describe("createStyleSheet", () => {
  beforeEach(() => {
    onAppearanceChange({ colorScheme: "light" });
  });

  const styles = createStyleSheet({
    container: {
      backgroundColor: "#fff",
      $dark: {
        backgroundColor: "#000",
      },
    },
  });

  it("returns just original style in light mode", () => {
    // light mode, just return main styles
    expect(styles.container).toEqual([{ backgroundColor: "#fff" }]);
  });

  it("returns original + dark in dark mode", () => {
    onAppearanceChange({ colorScheme: "dark" });
    expect(styles.container).toEqual([
      { backgroundColor: "#fff" },
      { backgroundColor: "#000" },
    ]);
  });
});

describe("useDynamicDarkModeStyles", () => {
  it("does a thing", () => {
    // Start in light mode, mount component
    onAppearanceChange({ colorScheme: "light" });
    render(<MyComponent />);

    // @ts-ignore
    expect(MockView.calls?.at(-1)?.[0].style).toEqual([
      { backgroundColor: "#fff" },
    ]);

    // Switch to dark mode.
    onAppearanceChange({ colorScheme: "dark" });
    // @ts-ignore
    expect(MockView.calls?.at(-1)?.[0].style).toEqual([
      { backgroundColor: "#fff" },
      { backgroundColor: "#000" },
    ]);
  });
});

const MyComponent = () => {
  useDynamicDarkModeStyles();

  return <View style={styles.container} testID="container" />;
};

const styles = createStyleSheet({
  container: {
    backgroundColor: "#fff",
    $dark: {
      backgroundColor: "#000",
    },
  },
});
