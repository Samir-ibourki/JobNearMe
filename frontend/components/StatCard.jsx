import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const StatCard = ({ icon, label, value, color }) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>
    <View style={styles.content}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
    <View style={[styles.iconContainer, { backgroundColor: color + "10" }]}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  statCard: {
    backgroundColor: "#FFF",
    width: "48%",
    padding: 20,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeftWidth: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 10,
  },
  content: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: "#7F8C8D",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2C3E50",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
});

export default StatCard;
