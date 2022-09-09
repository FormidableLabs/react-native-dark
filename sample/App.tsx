import * as React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Header />
    </View>
  );
}

const Header = () => {
  return (
    <View>
      <Text style={styles.title}>Hello world!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    $dark: {
      backgroundColor: "black",
    },
  },

  title: {
    color: "black",
    $dark: {
      color: "white",
      fontWeight: "bold",
      fontSize: 24,
    },
  },
});
