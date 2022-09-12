import { useDarkMode as _useDarkMode } from "react-native-dark";
import * as React from "react";
import { View, Text, StyleSheet } from "react-native";

function App() {
  const _REACT_NATIVE_DARK_isDark = _useDarkMode();

  return React.createElement(
    View,
    {
      style: _REACT_NATIVE_DARK_isDark
        ? __styles__container__$dark
        : styles.container,
    },
    React.createElement(Text, {
      style: _REACT_NATIVE_DARK_isDark
        ? __otherStyles__title__$dark
        : otherStyles.title,
    }),
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  __container__$dark: {
    backgroundColor: "black",
  },
});
const otherStyles = StyleSheet.create({
  title: {
    color: "black",
  },
  __title__$dark: {
    color: "white",
  },
});

const __styles__container__$dark = StyleSheet.compose(
  styles.container,
  styles.__container__$dark,
);

const __otherStyles__title__$dark = StyleSheet.compose(
  otherStyles.title,
  otherStyles.__title__$dark,
);
