
import { View, Animated, StyleSheet } from "react-native";
//import { router } from "expo-router";

export default function welcomeScrn() {

  return (
    <View style={styles.container}>
      <Animated.Text style={styles.text}>
        Welcome to MyApp 🚀
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A84FF",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
  },
});
