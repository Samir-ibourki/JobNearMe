import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import Colors from "../../theme/colors";
import FormInput from "../../components/FormInput";
import { useCreateJob } from "../../hooks/useEmployer";
import { router } from "expo-router";
import CustomAlert from "../../components/CustomAlert";

export default function AddJob() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    salary: "",
    category: "",
    city: "",
    address: "",
  });
  const createMutation = useCreateJob();
  const [loading, setLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    type: "success",
    onClose: () => {},
  });

  const showAlert = (title, message, type = "success", onClose = null) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      type,
      onClose:
        onClose ||
        (() => setAlertConfig((prev) => ({ ...prev, visible: false }))),
    });
  };

  const handleCreate = async () => {
    if (!formData.title || !formData.description || !formData.city) {
      showAlert(
        "Error",
        "Please fill in all required fields: Title, Description, and City.",
        "error"
      );
      return;
    }

    if (!formData.address) {
      showAlert(
        "Error",
        "Please provide a full address so we can show the job on the map.",
        "error"
      );
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        salary: formData.salary,
        category: formData.category,
        city: formData.city,
        address: formData.address,
      };

      const res = await createMutation.mutateAsync(payload);
      if (res.success) {
        showAlert(
          "Success!",
          "Your job has been posted successfully.",
          "success",
          () => {
            router.push("/(employer)/my-jobs");
          }
        );
      }
    } catch (error) {
      showAlert(
        "Error",
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
          <Text style={styles.headerTitle}>Post a Job</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.form}
        >
          <Text style={styles.formSubtitle}>
            Enter job details to find the best candidates
          </Text>

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
            placeholder="e.g. Hospitality, IT, Sales"
            iconName="grid-outline"
          />

          <View style={styles.inputSpacing} />
          <FormInput
            label="Salary Range"
            value={formData.salary}
            onChangeText={(text) => setFormData({ ...formData, salary: text })}
            placeholder="e.g. 4000 - 5000 DH"
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
            label="Full Address"
            value={formData.address}
            onChangeText={(text) => setFormData({ ...formData, address: text })}
            placeholder="Street name, landmark..."
            iconName="map-outline"
          />

          <View style={styles.inputSpacing} />
          <View style={styles.inputSpacing} />
          <FormInput
            label="Job Description"
            value={formData.description}
            onChangeText={(text) =>
              setFormData({ ...formData, description: text })
            }
            placeholder="Describe the role, responsibilities, and requirements..."
            multiline={true}
            iconName="document-text-outline"
          />

          <TouchableOpacity
            style={[styles.submitButton, loading && { opacity: 0.7 }]}
            onPress={handleCreate}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? "Posting..." : "Post Job Now"}
            </Text>
            {!loading && (
              <Ionicons name="send-outline" size={18} color="#FFF" />
            )}
          </TouchableOpacity>
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={alertConfig.onClose}
      />
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
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
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
