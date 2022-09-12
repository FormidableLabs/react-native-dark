import { useDarkMode as _useDarkMode } from "react-native-dark";
import * as React from "react";
import { View, StyleSheet as MyStyleSheet } from "react-native";

function App() {
  const _REACT_NATIVE_DARK_isDark = _useDarkMode();

  return React.createElement(View, {
    style: _REACT_NATIVE_DARK_isDark
      ? __styles__container__$dark
      : styles.container,
  });
}

const styles = MyStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  __container__$dark: {
    backgroundColor: "black",
  },
});

const __styles__container__$dark = MyStyleSheet.compose(
  styles.container,
  styles.__container__$dark,
);
