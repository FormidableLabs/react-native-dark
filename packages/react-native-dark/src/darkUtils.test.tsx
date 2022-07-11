import * as React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createStyleSheet, useDynamicDarkModeStyles } from "./darkUtils";
import { onAppearanceChange, setColorScheme } from "./colorSchemeState";
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
  beforeEach(reset);

  it("returns just original style in light mode", () => {
    // light mode, just return main styles
    expect(styles.container).toEqual([{ backgroundColor: "white" }]);
  });

  it("returns original + dark in dark mode", () => {
    goDark();
    expect(styles.container).toEqual([
      { backgroundColor: "white" },
      { backgroundColor: "black" },
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
      { backgroundColor: "white" },
    ]);

    // Switch to dark mode.
    onAppearanceChange({ colorScheme: "dark" });
    // @ts-ignore
    expect(MockView.calls?.at(-1)?.[0].style).toEqual([
      { backgroundColor: "white" },
      { backgroundColor: "black" },
    ]);
  });
});

describe("setColorScheme", () => {
  beforeEach(reset);

  it("overrides dark system color with light", () => {
    reset();
    setColorScheme("dark");

    expect(styles.container).toEqual([
      { backgroundColor: "white" },
      { backgroundColor: "black" },
    ]);
  });

  it("overrides light system color with dark", () => {
    goDark();
    setColorScheme("light");

    expect(styles.container).toEqual([{ backgroundColor: "white" }]);
  });

  it("doesnt affect system color pref when set to auto", () => {
    setColorScheme("auto");

    expect(styles.container).toEqual([{ backgroundColor: "white" }]);

    goDark();
    expect(styles.container).toEqual([
      { backgroundColor: "white" },
      { backgroundColor: "black" },
    ]);
  });
});

const reset = () => {
  setColorScheme("auto");
  onAppearanceChange({ colorScheme: "light" });
};
const goDark = () => {
  onAppearanceChange({ colorScheme: "dark" });
};

// For testing hook
const MyComponent = () => {
  useDynamicDarkModeStyles();

  return <View style={styles.container} testID="container" />;
};

const styles = createStyleSheet({
  container: {
    backgroundColor: "white",
    $dark: {
      backgroundColor: "black",
    },
  },
});
