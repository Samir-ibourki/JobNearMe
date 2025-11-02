import icon from "@/assets/AppIcon.png";
import { Image, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={icon}
        resizeMode="contain"
        style={{ width: 160, height: 160 }}
      />
      <Text style={styles.text}>JobNearMe</Text>
      <Text style={styles.subtitel}>Find Jobs near you instantly.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    gap: 10,
  },
  text: {
    fontSize: 35,
    fontWeight: "bold",
  },
  subtitel: {
    fontSize: 20,
  },
});
