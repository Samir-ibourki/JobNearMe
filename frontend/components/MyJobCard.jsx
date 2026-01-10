import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Colors from "../theme/colors";

const MyJobCard = ({ item, onDelete }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.jobTitle}>{item.title}</Text>
          <Text style={styles.categoryText}>{item.category || "General"}</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={() => router.push(`/(employer)/edit-job/${item.id}`)}
            style={styles.editButton}
          >
            <Ionicons name="pencil-outline" size={18} color={Colors.Primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDelete(item.id)}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={14} color="#888" />
          <Text style={styles.infoText}>{item.city}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="cash-outline" size={14} color="#888" />
          <Text style={styles.infoText}>{item.salary || "Negotiable"}</Text>
        </View>
        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* View Applicants Button */}
      <TouchableOpacity
        style={styles.applicantsBtn}
        onPress={() => router.push(`/(employer)/applicants/${item.id}`)}
      >
        <Ionicons name="people-outline" size={18} color="#FFF" />
        <Text style={styles.applicantsBtnText}>View Applicants</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  titleContainer: {
    flex: 1,
    paddingRight: 10,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 13,
    color: Colors.Primary,
    fontWeight: "600",
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0F5FF",
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
    paddingTop: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  infoText: {
    fontSize: 13,
    color: "#666",
  },
  dateBadge: {
    marginLeft: "auto",
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dateText: {
    fontSize: 11,
    color: "#888",
    fontWeight: "600",
  },
  applicantsBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1ABC9C",
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 15,
    gap: 8,
  },
  applicantsBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
  },
});

export default MyJobCard;
