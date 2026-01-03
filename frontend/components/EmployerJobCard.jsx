import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { formatTimeAgo } from "../utils/dateFormatter";

const EmployerJobCard = ({ job }) => (
  <TouchableOpacity
    style={styles.card}
    onPress={() => router.push(`/(employer)/job/${job.id}`)}
    activeOpacity={0.9}
  >
    <View style={styles.header}>
      <View style={styles.titleInfo}>
        <Text style={styles.title}>{job.title}</Text>
        <Text style={styles.category}>{job.category}</Text>
      </View>
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>Active</Text>
      </View>
    </View>

    <View style={styles.footer}>
      <View style={styles.stat}>
        <Ionicons name="people-outline" size={16} color="#7F8C8D" />
        <Text style={styles.statText}>{job.applications} Apps</Text>
      </View>
      <View style={styles.stat}>
        <Ionicons name="time-outline" size={16} color="#7F8C8D" />
        <Text style={styles.statText}>{formatTimeAgo(job.postedAt)}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  titleInfo: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2C3E50",
    marginBottom: 4,
  },
  category: {
    fontSize: 13,
    color: "#95A5A6",
    fontWeight: "600",
  },
  statusBadge: {
    backgroundColor: "#E8F8F5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1ABC9C",
  },
  footer: {
    flexDirection: "row",
    gap: 20,
    borderTopWidth: 1,
    borderTopColor: "#F5F7FA",
    paddingTop: 15,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 13,
    color: "#7F8C8D",
    fontWeight: "500",
  },
});

export default EmployerJobCard;
