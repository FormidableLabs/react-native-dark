import { StyleSheet, Text, View } from "react-native";
import {
  createStyleSheet,
  useDynamicDarkModeStyles,
} from "react-native-easy-dark";

export default function App() {
  // Need this 👇 for dynamic styles
  //  (otherwise React won't re-render when color scheme pref changes)
  useDynamicDarkModeStyles();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Open up App.tsx to start working on your app!
      </Text>
    </View>
  );
}

const styles = createStyleSheet({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    // 🎉 dark mode 🎉
    $dark: {
      backgroundColor: "#000",
    },
  },

  title: {
    fontSize: 18,
    color: "#000",

    $dark: {
      color: "#fff",
    },
  },
});
