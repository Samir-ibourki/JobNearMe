import { View, Text, StyleSheet } from "react-native";
export default function Logo() {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <View style={styles.logoIcon}>
          <Text style={styles.logoEmoji}>🔍</Text>
        </View>
        <Text style={styles.logoText}>JobNearMe</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  logoEmoji: {
    fontSize: 18,
  },
  logoText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
