import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import Colors from "../../theme/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useProfile, useUpdateProfile } from "../../hooks/useCandidate";
import { useAlert } from "../../hooks/useAlert";

export default function CandidateProfile() {
  const { data: user, isLoading, error, refetch } = useProfile();
  const updateMutation = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
  });
  const { showSuccess, showError, showConfirm } = useAlert();

  useEffect(() => {
    if (user) {
      setFormData({
        fullname: user.fullname || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync(formData);
      showSuccess("Success", "Profile updated successfully!", { autoClose: true });
      setIsEditing(false);
    } catch (err) {
      showError("Error", err.message || "Failed to update profile");
    }
  };

  const handleLogout = async () => {
    const confirmed = await showConfirm(
      "Switch Account",
      "You will be logged out to switch account.",
      { confirmText: "Continue", cancelText: "Cancel" }
    );
    if (confirmed) {
      // Clear both storages to avoid conflicts
      await AsyncStorage.multiRemove(["token", "user", "auth-storage"]);
      router.replace("/(auth)/logIn");
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.Primary} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#FF6B6B" />
          <Text style={styles.errorText}>Failed to load profile</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.retryBtn, { backgroundColor: "#666", marginTop: 10 }]}
            onPress={handleLogout}
          >
            <Text style={styles.retryBtnText}>Switch Account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity
          onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
          style={styles.editBtn}
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? (
            <ActivityIndicator size="small" color={Colors.Primary} />
          ) : (
            <Text style={styles.editBtnText}>
              {isEditing ? "Save" : "Edit"}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.fullname?.charAt(0)?.toUpperCase() || "?"}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.fullname || "User"}</Text>
          <View style={styles.roleBadge}>
            <Ionicons name="person" size={14} color={Colors.Primary} />
            <Text style={styles.roleText}>Candidate</Text>
          </View>
        </View>

        {/* Profile Fields */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={formData.fullname}
                onChangeText={(text) =>
                  setFormData({ ...formData, fullname: text })
                }
                placeholder="Enter your name"
              />
            ) : (
              <View style={styles.fieldValue}>
                <Ionicons name="person-outline" size={18} color="#888" />
                <Text style={styles.fieldText}>
                  {user?.fullname || "Not set"}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Email</Text>
            <View style={styles.fieldValue}>
              <Ionicons name="mail-outline" size={18} color="#888" />
              <Text style={styles.fieldText}>{user?.email || "Not set"}</Text>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Phone</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) =>
                  setFormData({ ...formData, phone: text })
                }
                placeholder="Enter your phone"
                keyboardType="phone-pad"
              />
            ) : (
              <View style={styles.fieldValue}>
                <Ionicons name="call-outline" size={18} color="#888" />
                <Text style={styles.fieldText}>{user?.phone || "Not set"}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => router.push("/(candidate)/applications")}
          >
            <View style={styles.actionIcon}>
              <Ionicons
                name="document-text-outline"
                size={22}
                color={Colors.Primary}
              />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>My Applications</Text>
              <Text style={styles.actionSubtitle}>
                View your job applications
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => router.push("/(candidate)")}
          >
            <View style={styles.actionIcon}>
              <Ionicons
                name="briefcase-outline"
                size={22}
                color={Colors.Primary}
              />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Browse Jobs</Text>
              <Text style={styles.actionSubtitle}>Find new opportunities</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>
        </View>

        {/* Switch Account / Logout */}
        <TouchableOpacity style={styles.switchBtn} onPress={handleLogout}>
          <Ionicons name="swap-horizontal" size={20} color="#FFF" />
          <Text style={styles.switchBtnText}>Switch Account</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FE",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  retryBtn: {
    marginTop: 16,
    backgroundColor: Colors.Primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryBtnText: {
    color: "#FFF",
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  editBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#F0F5FF",
  },
  editBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.Primary,
  },
  content: {
    padding: 20,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 30,
    paddingVertical: 20,
    backgroundColor: "#FFF",
    borderRadius: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.Primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFF",
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F5FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    gap: 6,
  },
  roleText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.Primary,
  },
  section: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  field: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    color: "#888",
    marginBottom: 8,
  },
  fieldValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F8F9FE",
    padding: 14,
    borderRadius: 12,
  },
  fieldText: {
    fontSize: 15,
    color: "#1A1A1A",
  },
  input: {
    backgroundColor: "#F8F9FE",
    padding: 14,
    borderRadius: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: Colors.Primary,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F0F5FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  actionSubtitle: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  switchBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.Primary,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 12,
  },
  switchBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
});
