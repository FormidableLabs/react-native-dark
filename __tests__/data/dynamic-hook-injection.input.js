import * as React from "react";
import { View, StyleSheet } from "react-native";

function App() {
  console.log(styles.title);
  return React.createElement(Body);
}

function Body() {
  return React.createElement(View, { style: styles.container });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    $dark: {
      backgroundColor: "black",
    },
  },
  title: {},
});
