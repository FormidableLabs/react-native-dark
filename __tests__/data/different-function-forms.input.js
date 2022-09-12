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
  return React.createElement(View, { style: styles.container });
}

const FE = function FuncExpression() {
  return React.createElement(View, { style: styles.container });
};

const ArrowFunc = () => {
  return React.createElement(View, { style: styles.container });
};

const ArrowFuncImplicitReturn = () =>
  React.createElement(View, { style: styles.container });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    $dark: {
      backgroundColor: "black",
    },
  },
});
