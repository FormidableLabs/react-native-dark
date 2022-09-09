import { describe, expect, it } from "vitest";
import plugin from "./plugin";
import babel from "@babel/core";

/**
 * Transform code with plugin
 */
const transform = (code: string) => {
  const transformed = babel.transform(code, {
    filename: "foobar.ts",
    presets: ["@babel/preset-react"],
    plugins: [plugin],
  });

  const output = transformed?.code || "";
  return output.replace(StripPure, "React.createElement");
};
const StripPure = /\/\*(.*)PURE(.*)React\.createElement/g;

describe("babel-plugin", () => {
  it("transforms", () => {
    const code = `
    import { StyleSheet } from "react-native";

    function App() {
      return <View style={styles.container} />;
    }

    const styles = StyleSheet({
      title: {
        flex: 1,
        backgroundColor: "white",
        $dark: {
          backgroundColor: "black"
        }
      }
    });
    `.trim();

    const expected = `
    import { useDark as _useDark } from "react-native-dark";
    import { StyleSheet } from "react-native";
    
    function App() {
      const __REACT_NATIVE_DARK_IS_DARK = _useDark();
      
      return <View style={__REACT_NATIVE_DARK_IS_DARK ? __styles_container__$dark : styles.container} />;
    }
    
    const styles = StyleSheet({
      title: {
        flex: 1,
        backgroundColor: "white"
      },
      __container__$dark: {
        backgroundColor: "black"
      }
    });
    
    const __styles_container__$dark = StyleSheet.compose(styles.container, styles.__container__$dark);
    `.trim();

    const output = transform(code);
    expect(output).toEqual(expected);
  });

  // it("transforms a thing", () => {
  //   const transformed = babel.transform("const x = 13", { plugins: [plugin] });
  //   console.log(transformed?.code);
  //
  //   expect(false).toBe(true);
  // });
});
