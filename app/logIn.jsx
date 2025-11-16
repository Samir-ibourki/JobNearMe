
import { View, Animated, StyleSheet, Image } from "react-native";
//import { router } from "expo-router";

export default function logIn() {

  return (
    <View style={styles.container}>
      <Animated.View style={styles.text}>
        <Image source={require('../assets/')} />
      </Animated.View>
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
