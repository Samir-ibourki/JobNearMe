import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import Colors from "../../../theme/colors";
import FormInput from "../../../components/FormInput";
import { useUpdateJob, useJobById } from "../../../hooks/useEmployer";
import { router, useLocalSearchParams } from "expo-router";
import { useAlert } from "../../../hooks/useAlert";

export default function EditJob() {
  const { id } = useLocalSearchParams();
  const { data: jobData, isLoading: fetching, error } = useJobById(id);
  const { showSuccess, showError } = useAlert();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    salary: "",
    category: "",
    city: "",
    address: "",
    latitude: "",
    longitude: "",
  });
  const [loading, setLoading] = useState(false);
  const updateMutation = useUpdateJob();

  // Populate form when job data is loaded
  useEffect(() => {
    if (jobData?.data) {
      const job = jobData.data;
      setFormData({
        title: job.title || "",
        description: job.description || "",
        salary: job.salary || "",
        category: job.category || "",
        city: job.city || "",
        address: job.address || "",
        latitude: String(job.latitude) || "",
        longitude: String(job.longitude) || "",
      });
    }
  }, [jobData]);

  useEffect(() => {
    if (error) {
      showError("Error", "Failed to load job data.", {
        onClose: () => router.back(),
      });
    }
  }, [error]);

  const handleUpdate = async () => {
    if (!formData.title || !formData.description || !formData.city) {
      showError(
        "Error",
        "Please fill in all required fields: Title, Description, and City."
      );
      return;
    }

    setLoading(true);
    try {

      const originalJob = jobData?.data;
      const addressChanged = formData.address !== (originalJob?.address || "");
      const cityChanged = formData.city !== (originalJob?.city || "");
      
      const payload = {
        title: formData.title,
        description: formData.description,
        salary: formData.salary,
        category: formData.category,
        city: formData.city,
        address: formData.address,
      };
      
      // Only include coordinates if address/city didn't change
      if (!addressChanged && !cityChanged) {
        payload.latitude = parseFloat(formData.latitude);
        payload.longitude = parseFloat(formData.longitude);
      }

      const res = await updateMutation.mutateAsync({ id, data: payload });
      if (res.success) {
        showSuccess(
          "Success!",
          "Your job has been updated successfully.",
          {
            onConfirm: () => {
              router.push("/(employer)/my-jobs");
            },
          }
        );
      }
    } catch (err) {
      showError(
        "Error",
        err.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.Primary} />
          <Text style={{ marginTop: 10, color: "#666" }}>
            Loading job data...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={"dark-content"} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Job</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.form}
        >
          <Text style={styles.formSubtitle}>Update the job details below</Text>

          <FormInput
            label="Job Title"
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
            placeholder="e.g. Senior Waiter"
            iconName="briefcase-outline"
          />

          <View style={styles.inputSpacing} />

          <FormInput
            label="Category"
            value={formData.category}
            onChangeText={(text) =>
              setFormData({ ...formData, category: text })
            }
            placeholder="e.g. Restaurant, Retail"
            iconName="pricetag-outline"
          />

          <View style={styles.inputSpacing} />

          <FormInput
            label="Job Description"
            value={formData.description}
            onChangeText={(text) =>
              setFormData({ ...formData, description: text })
            }
            placeholder="Describe the role and responsibilities..."
            iconName="document-text-outline"
            multiline={true}
            numberOfLines={5}
          />

          <View style={styles.inputSpacing} />

          <FormInput
            label="Salary (Optional)"
            value={formData.salary}
            onChangeText={(text) => setFormData({ ...formData, salary: text })}
            placeholder="e.g. 3000 MAD/month"
            iconName="cash-outline"
          />

          <View style={styles.inputSpacing} />

          <FormInput
            label="City"
            value={formData.city}
            onChangeText={(text) => setFormData({ ...formData, city: text })}
            placeholder="e.g. Casablanca"
            iconName="location-outline"
          />

          <View style={styles.inputSpacing} />

          <FormInput
            label="Address (Optional)"
            value={formData.address}
            onChangeText={(text) => setFormData({ ...formData, address: text })}
            placeholder="e.g. 123 Boulevard Mohammed V"
            iconName="map-outline"
          />

          <TouchableOpacity
            style={[styles.submitButton, loading && { opacity: 0.7 }]}
            onPress={handleUpdate}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? "Updating..." : "Save Changes"}
            </Text>
            {!loading && (
              <Ionicons name="checkmark-outline" size={18} color="#FFF" />
            )}
          </TouchableOpacity>
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  form: {
    padding: 24,
  },
  formSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 25,
  },
  inputSpacing: {
    height: 10,
  },
  submitButton: {
    backgroundColor: Colors.Primary,
    flexDirection: "row",
    height: 58,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 30,
    shadowColor: Colors.Primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
