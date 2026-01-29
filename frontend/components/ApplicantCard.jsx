import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../theme/colors";
import { useUpdateApplicationStatus } from "../hooks/useEmployer";
import { useAlert } from "../hooks/useAlert";

const ApplicantCard = ({ item }) => {
  const updateStatusMutation = useUpdateApplicationStatus();
  const { showSuccess, showError, showConfirm } = useAlert();

  const handleAccept = async () => {
    const confirmed = await showConfirm(
      "Accept Application",
      `Are you sure you want to accept ${item.candidate?.fullname}?`,
      { confirmText: "Accept", cancelText: "Cancel" }
    );
    if (confirmed) {
      try {
        await updateStatusMutation.mutateAsync({
          applicationId: item.id,
          status: "accepted",
        });
        showSuccess("Success", "Application accepted!", { autoClose: true });
      } catch (err) {
        showError("Error", err.message || "Failed to update status");
      }
    }
  };

  const handleReject = async () => {
    const confirmed = await showConfirm(
      "Reject Application",
      `Are you sure you want to reject ${item.candidate?.fullname}?`,
      { confirmText: "Reject", cancelText: "Cancel" }
    );
    if (confirmed) {
      try {
        await updateStatusMutation.mutateAsync({
          applicationId: item.id,
          status: "rejected",
        });
        showSuccess("Done", "Application rejected", { autoClose: true });
      } catch (err) {
        showError("Error", err.message || "Failed to update status");
      }
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.candidate?.fullname?.charAt(0)?.toUpperCase() || "?"}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>
            {item.candidate?.fullname || "Unknown"}
          </Text>
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

      {/* Action buttons - only show if pending */}
      {item.status === "pending" && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.rejectBtn}
            onPress={handleReject}
            disabled={updateStatusMutation.isPending}
          >
            <Ionicons name="close" size={18} color="#FF6B6B" />
            <Text style={styles.rejectText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.acceptBtn}
            onPress={handleAccept}
            disabled={updateStatusMutation.isPending}
          >
            <Ionicons name="checkmark" size={18} color="#FFF" />
            <Text style={styles.acceptText}>Accept</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
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
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.Primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
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
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 14,
  },
  rejectBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#FFF5F5",
    gap: 6,
  },
  rejectText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF6B6B",
  },
  acceptBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#1ABC9C",
    gap: 6,
  },
  acceptText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
  },
});

export default ApplicantCard;
