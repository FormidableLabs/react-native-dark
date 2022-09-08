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
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={() => setC((v) => (v === "dark" ? "light" : "dark"))}
      />
      <Text style={s.title}>Hey</Text>
    </>
  );
}

StyleSheet.foo();

const s = StyleSheet.create({
  t: {
    fontWeight: "bold",
  },
  title: {
    color: "red",
    $dark: {
      color: "pink",
      fontWeight: "bold",
    },
  },
});

const boo = s.title;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // $dark: {
    //   backgroundColor: "#000",
    // },
  },
  title: {
    fontWeight: "bold",
  },
});

const t = styles.title;
