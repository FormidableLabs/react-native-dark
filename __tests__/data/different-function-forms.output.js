import { useDarkMode as _useDarkMode } from "react-native-dark";
import * as React from "react";
import { View, StyleSheet } from "react-native";

function App() {
  return React.createElement(View, {}, [
    React.createElement(FuncDeclaration),
    React.createElement(FE),
    React.createElement(ArrowFunc),
    React.createElement(ArrowFuncImplicitReturn),
  ]);
}

function FuncDeclaration() {
  const _REACT_NATIVE_DARK_isDark = _useDarkMode();

  return React.createElement(View, {
    style: _REACT_NATIVE_DARK_isDark
      ? __styles__container__$dark
      : styles.container,
  });
}

const FE = function FuncExpression() {
  const _REACT_NATIVE_DARK_isDark2 = _useDarkMode();

  return React.createElement(View, {
    style: _REACT_NATIVE_DARK_isDark2
      ? __styles__container__$dark
      : styles.container,
  });
};

const ArrowFunc = () => {
  const _REACT_NATIVE_DARK_isDark3 = _useDarkMode();

  return React.createElement(View, {
    style: _REACT_NATIVE_DARK_isDark3
      ? __styles__container__$dark
      : styles.container,
  });
};

const ArrowFuncImplicitReturn = () => {
  const _REACT_NATIVE_DARK_isDark4 = _useDarkMode();

  return React.createElement(View, {
    style: _REACT_NATIVE_DARK_isDark4
      ? __styles__container__$dark
      : styles.container,
  });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  __container__$dark: {
    backgroundColor: "black",
  },
});

const __styles__container__$dark = StyleSheet.compose(
  styles.container,
  styles.__container__$dark,
);
