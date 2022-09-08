import * as React from "react";
import { StyleSheet, View } from "react-native";

export default function App() {
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "red",
    $dark: {
      fontWeight: "bold",
    },
  },

  title: {
    fontSize: 24,
    $dark: {
      fontSize: 18,
    },
  },

  banner: {
    padding: 8,
    $dark: {
      padding: 12,
    },
  },
});
