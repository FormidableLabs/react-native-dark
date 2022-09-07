import { StyleSheet, Text, View } from "react-native";
import { createStyleSheet, useDynamicDarkModeStyles } from "react-native-dark";

export default function App() {
  useDynamicDarkModeStyles();

  return (
    <View style={styles.container}>
      <Text>Foo bar baz</Text>
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
