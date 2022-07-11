import { describe, it, expect, vi } from "vitest";
import { createStyleSheet } from "./easyDark";

vi.mock("react-native", () => ({
  Appearance: {
    getColorScheme: () => "light",
    addChangeListener: () => ({ remove: () => null }),
  },
  StyleSheet: {
    create: (x: unknown) => x,
  },
}));

describe("createStyleSheet", () => {
  it("creates StyleSheet object, returning array with values depending on color scheme preference", () => {
    const styles = createStyleSheet({
      container: {
        backgroundColor: "#fff",
        $dark: {
          backgroundColor: "#000",
        },
      },
    });

    expect(styles.container).toEqual([{ backgroundColor: "#fff" }]);
  });
});
