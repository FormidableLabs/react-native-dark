import * as React from "react";
import { View, StyleSheet as MyStyleSheet } from "react-native";

function App() {
  return React.createElement(View, { style: styles.container });
}

const styles = MyStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    $dark: {
      backgroundColor: "black",
    },
  },
});
