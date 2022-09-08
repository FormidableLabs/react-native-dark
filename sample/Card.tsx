import * as React from "react";
import { createStyleSheet } from "../dist";
import { Text, View } from "react-native";

export const Card = () => {
  return (
    <View style={styles.container}>
      <Text>A card!</Text>
    </View>
  );
};

const styles = createStyleSheet({
  container: {
    backgroundColor: "red",
    borderRadius: 8,
    padding: 8,
    $dark: {
      backgroundColor: "pink",
    },
  },
});
