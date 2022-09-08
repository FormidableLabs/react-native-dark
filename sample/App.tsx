import * as React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { createStyleSheet, setColorScheme } from "react-native-dark";

export default function App() {
  const [c, setC] = React.useState(
    "dark" as Parameters<typeof setColorScheme>[0],
  );

  React.useEffect(() => {
    setColorScheme(c);
  }, [c]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => setC((v) => (v === "dark" ? "light" : "dark"))}
    />
  );
}

const styles = createStyleSheet({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    $dark: {
      backgroundColor: "#000",
    },
  },
});
