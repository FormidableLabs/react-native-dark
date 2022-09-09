import * as React from "react";
import { StyleSheet, Text, View } from "react-native";

const App = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello world!</Text>
    </View>
  );
};

export default App;

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
    fontSize: 24,

    $dark: {
      color: "white",
      fontWeight: "bold",
    },
  },
});
