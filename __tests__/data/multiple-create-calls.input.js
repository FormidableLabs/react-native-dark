import * as React from "react";
import { View, Text, StyleSheet } from "react-native";

function App() {
  return React.createElement(
    View,
    { style: styles.container },
    React.createElement(Text, { style: otherStyles.title }),
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    $dark: {
      backgroundColor: "black",
    },
  },
});

const otherStyles = StyleSheet.create({
  title: {
    color: "black",
    $dark: {
      color: "white",
    },
  },
});
