import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../theme/colors";

const ApplicantCard = ({ item }) => (
  <View style={styles.card}>
    <View style={styles.avatar}>
      <Ionicons name="person" size={24} color={Colors.Primary} />
    </View>
    <View style={styles.info}>
      <Text style={styles.name}>{item.candidate?.fullname || "Unknown"}</Text>
      <Text style={styles.email}>{item.candidate?.email}</Text>
      {item.candidate?.phone && (
        <Text style={styles.phone}>{item.candidate?.phone}</Text>
      )}
    </View>
    <View
      style={[
        styles.statusBadge,
        item.status === "pending" && styles.pendingBadge,
        item.status === "accepted" && styles.acceptedBadge,
        item.status === "rejected" && styles.rejectedBadge,
      ]}
    >
      <Text
        style={[
          styles.statusText,
          item.status === "pending" && styles.pendingText,
          item.status === "accepted" && styles.acceptedText,
          item.status === "rejected" && styles.rejectedText,
        ]}
      >
        {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F0F5FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  email: {
    fontSize: 13,
    color: "#666",
  },
  phone: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  pendingBadge: {
    backgroundColor: "#FFF8E7",
  },
  acceptedBadge: {
    backgroundColor: "#E8F8F5",
  },
  rejectedBadge: {
    backgroundColor: "#FFF5F5",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  pendingText: {
    color: "#F5A623",
  },
  acceptedText: {
    color: "#1ABC9C",
  },
  rejectedText: {
    color: "#FF6B6B",
  },
});

export default ApplicantCard;
