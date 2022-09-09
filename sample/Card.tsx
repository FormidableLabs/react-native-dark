import * as React from "react";
import { createStyleSheet } from "../dist";
import { Text, View } from "react-native";

export const Card = () => {
  return (
    <View style={styles.title}>
      <Text>A card!</Text>
    </View>
  );
};

const styles = createStyleSheet({
  title: {
    backgroundColor: "red",
    borderRadius: 8,
    padding: 8,
    $dark: {
      backgroundColor: "pink",
    },
  },
});
