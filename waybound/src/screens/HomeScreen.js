import React from "react";
import { View, Text } from "react-native";
import AppNavigator from "../navigation/AppNavigator";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>HomeScreen</Text>
      <AppNavigator />
    </View>
  );
}
