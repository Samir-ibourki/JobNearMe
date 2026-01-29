import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../theme/colors";
import { useMyJobs, useDeleteJob } from "../../hooks/useEmployer";
import { router } from "expo-router";
import MyJobCard from "../../components/MyJobCard";
import { useAlert } from "../../hooks/useAlert";

export default function MyJobs() {
  const { data: jobs, isLoading, isFetching, refetch } = useMyJobs();
  const deleteMutation = useDeleteJob();
  const { showSuccess, showError, showConfirm } = useAlert();

  const onRefresh = () => {
    refetch();
  };

  const handleDelete = async (id) => {
    const confirmed = await showConfirm(
      "Delete Job",
      "Are you sure you want to delete this job offer? This action cannot be undone.",
      { confirmText: "Delete", cancelText: "Cancel" }
    );

    if (confirmed) {
      try {
        await deleteMutation.mutateAsync(id);
        showSuccess("Deleted!", "Job post has been successfully removed.", {
          autoClose: true,
        });
      } catch (error) {
        showError("Error", "Failed to delete job. Please try again.");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/(employer)/dashboard")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Job Offers</Text>
        <View style={{ width: 40 }} />
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.Primary} />
        </View>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <MyJobCard item={item} onDelete={handleDelete} />
          )}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={60} color="#EEE" />
              <Text style={styles.emptyTitle}>No jobs posted yet</Text>
              <Text style={styles.emptySubtitle}>
                Start by adding your first job offer!
              </Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => router.push("/(employer)/add-job")}
              >
                <Text style={styles.addButtonText}>Post a Job</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FE",
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  list: {
    padding: 20,
    paddingBottom: 40,
  },
  dateText: {
    fontSize: 11,
    color: "#888",
    fontWeight: "600",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    marginTop: 100,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    marginBottom: 30,
  },
  addButton: {
    backgroundColor: Colors.Primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 15,
  },
  addButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
