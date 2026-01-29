import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import Colors from "../../../theme/colors";
import { useJobDetails, useApplyJob } from "../../../hooks/useCandidate";
import { formatDate } from "../../../utils/dateFormatter";
import { useAlert } from "../../../hooks/useAlert";

export default function CandidateJobDetails() {
  const { id } = useLocalSearchParams();
  const { data: detail, isLoading, error } = useJobDetails(id);
  const { mutate: apply, isPending: isApplying } = useApplyJob();
  const { showSuccess, showError } = useAlert();

  // Fixed requirements that apply to all jobs
  const requirements = [
    "Valid ID / CIN required",
    "Available for interview",
    "Willing to work weekends",
    "Good communication skills",
  ];

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={Colors.Primary} />
          <Text style={{ marginTop: 10, color: "#666" }}>
            Loading job details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !detail?.data) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Ionicons name="alert-circle" size={50} color="#E74C3C" />
          <Text style={{ marginTop: 10, color: "#666" }}>
            Failed to load job details
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginTop: 20 }}
          >
            <Text style={{ color: Colors.Primary }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const job = detail.data;
  const employerName = job.employer?.fullname || "Employer";
  const avatarLetter = employerName.charAt(0).toUpperCase();

  const handleApply = () => {
    apply(
      { jobId: id, coverLetter: "" },
      {
        onSuccess: () => {
          showSuccess(
            "Success! 🎉",
            "Your application has been sent to the employer. They will contact you soon!",
          );
          setTimeout(() => {
            router.push("/(candidate)/applications");
          }, 2000);
        },
        onError: (err) => {
          showError(
            "Error",
            err.response?.data?.message ||
              "Failed to send application. Please try again.",
          );
        },
      },
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Details</Text>
        <TouchableOpacity style={styles.shareBtn}>
          <Ionicons name="share-outline" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* job header */}
        <View style={styles.jobHeader}>
          <View style={styles.employerAvatar}>
            <Text style={styles.avatarText}>{avatarLetter}</Text>
          </View>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.employerName}>{employerName}</Text>
          <View style={styles.salaryBadge}>
            <Text style={styles.salaryText}>
              {job.salary ? `${job.salary} DH` : "Salary TBD"}
            </Text>
          </View>
        </View>

        {/* quick info */}
        <View style={styles.quickInfo}>
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="location" size={20} color={Colors.Primary} />
            </View>
            <View>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{job.city || "N/A"}</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="briefcase" size={20} color={Colors.Primary} />
            </View>
            <View>
              <Text style={styles.infoLabel}>Category</Text>
              <Text style={styles.infoValue}>{job.category || "General"}</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="time" size={20} color={Colors.Primary} />
            </View>
            <View>
              <Text style={styles.infoLabel}>Posted</Text>
              <Text style={styles.infoValue}>{formatDate(job.createdAt)}</Text>
            </View>
          </View>
        </View>

        {/* description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {job.description || "No description available."}
          </Text>
        </View>

        {/* requirements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          <View style={styles.requirements}>
            {requirements.map((req, index) => (
              <View key={index} style={styles.requirementItem}>
                <Ionicons name="checkmark-circle" size={20} color="#1ABC9C" />
                <Text style={styles.requirementText}>{req}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <View style={styles.contactCard}>
            <View style={styles.contactInfo}>
              <View style={styles.contactAvatar}>
                <Ionicons name="business" size={24} color={Colors.Primary} />
              </View>
              <View>
                <Text style={styles.contactName}>{employerName}</Text>
                <Text style={styles.contactPhone}>
                  {job.employer?.phone || "Phone not available"}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.callBtn}>
              <Ionicons name="call" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* bottom apply button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bookmarkBtnLarge}>
          <Ionicons name="bookmark-outline" size={24} color={Colors.Primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.applyBtn, isApplying && { opacity: 0.7 }]}
          onPress={handleApply}
          disabled={isApplying}
        >
          {isApplying ? (
            <>
              <ActivityIndicator size="small" color="#FFF" />
              <Text style={styles.applyBtnText}>Applying...</Text>
            </>
          ) : (
            <>
              <Text style={styles.applyBtnText}>Apply Now</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFF" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
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
  shareBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 20,
  },
  jobHeader: {
    alignItems: "center",
    marginBottom: 25,
  },
  employerAvatar: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: Colors.Primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
  },
  jobTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 5,
  },
  employerName: {
    fontSize: 15,
    color: "#888",
    marginBottom: 12,
  },
  salaryBadge: {
    backgroundColor: "#E8F8F5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  salaryText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1ABC9C",
  },
  quickInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F8F9FE",
    borderRadius: 16,
    padding: 16,
    marginBottom: 25,
  },
  infoItem: {
    alignItems: "center",
    gap: 8,
  },
  infoIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 11,
    color: "#888",
    textAlign: "center",
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1A1A1A",
    textAlign: "center",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: "#555",
    lineHeight: 24,
  },
  requirements: {
    gap: 10,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  requirementText: {
    fontSize: 15,
    color: "#555",
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8F9FE",
    borderRadius: 16,
    padding: 16,
  },
  contactInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  contactAvatar: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  contactName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  contactPhone: {
    fontSize: 13,
    color: "#888",
  },
  callBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#1ABC9C",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingBottom: 30,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  bookmarkBtnLarge: {
    width: 54,
    height: 54,
    borderRadius: 14,
    backgroundColor: "#F0F5FF",
    justifyContent: "center",
    alignItems: "center",
  },
  applyBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.Primary,
    height: 54,
    borderRadius: 14,
    gap: 8,
  },
  applyBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
  },
});
