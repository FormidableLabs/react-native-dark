import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { createStyleSheet, useDynamicStyles } from "react-native-easy-dark";

export default function App() {
  useDynamicStyles();

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = createStyleSheet({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",

    $dark: {
      backgroundColor: "#000",
    },
  },
});
