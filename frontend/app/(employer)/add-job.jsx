import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import Colors from "../../theme/colors";
import FormInput from "../../components/FormInput";
import { useCreateJob } from "../../hooks/useEmployer";
import { router } from "expo-router";
import { useAlert } from "../../hooks/useAlert";

const JOB_CATEGORIES = [
  { id: "1", name: "Hospitality & Tourism", icon: "bed-outline" },
  { id: "2", name: "Retail & Sales", icon: "cart-outline" },
  { id: "3", name: "Food & Restaurant", icon: "restaurant-outline" },
  { id: "4", name: "Healthcare", icon: "medkit-outline" },
  { id: "5", name: "Education", icon: "school-outline" },
  { id: "6", name: "Technology & IT", icon: "laptop-outline" },
  { id: "7", name: "Construction", icon: "construct-outline" },
  { id: "8", name: "Transportation", icon: "car-outline" },
  { id: "9", name: "Security", icon: "shield-outline" },
  { id: "10", name: "Cleaning & Maintenance", icon: "sparkles-outline" },
  { id: "11", name: "Customer Service", icon: "headset-outline" },
  { id: "12", name: "Other", icon: "ellipsis-horizontal-outline" },
];

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
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const { showSuccess, showError } = useAlert();

  const handleCreate = async () => {
    if (!formData.title || !formData.description || !formData.city) {
      showError(
        "Error",
        "Please fill in all required fields: Title, Description, and City."
      );
      return;
    }

    if (!formData.address) {
      showError(
        "Error",
        "Please provide a full address so we can show the job on the map."
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
        showSuccess(
          "Success! ",
          "Your job has been posted successfully. Click OK to view your jobs.",
          {
            onConfirm: () => {
              router.push("/(employer)/my-jobs");
            },
          }
        );
      }
    } catch (error) {
      showError(
        "Error",
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

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
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Category</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowCategoryModal(true)}
            >
              <Ionicons name="briefcase-outline" size={20} color="#888" />
              <Text style={[
                styles.pickerText,
                formData.category && styles.pickerTextSelected
              ]}>
                {formData.category || "Select a category"}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#888" />
            </TouchableOpacity>
          </View>

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
            label="Full Address *"
            value={formData.address}
            onChangeText={(text) => setFormData({ ...formData, address: text })}
            placeholder="Street name, landmark... (required for map)"
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

    {/* Category Selection Modal */}
    <Modal
      visible={showCategoryModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowCategoryModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Category</Text>
            <TouchableOpacity
              onPress={() => setShowCategoryModal(false)}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={JOB_CATEGORIES}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryItem,
                  formData.category === item.name && styles.categoryItemActive
                ]}
                onPress={() => {
                  setFormData({ ...formData, category: item.name });
                  setShowCategoryModal(false);
                }}
              >
                <Ionicons
                  name={item.icon}
                  size={22}
                  color={formData.category === item.name ? Colors.Primary : "#666"}
                />
                <Text style={[
                  styles.categoryItemText,
                  formData.category === item.name && styles.categoryItemTextActive
                ]}>
                  {item.name}
                </Text>
                {formData.category === item.name && (
                  <Ionicons name="checkmark-circle" size={22} color={Colors.Primary} />
                )}
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
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
  inputContainer: {
    marginBottom: 20,
  },
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  pickerText: {
    flex: 1,
    fontSize: 15,
    color: "#999",
  },
  pickerTextSelected: {
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "70%",
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  modalCloseButton: {
    padding: 5,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  categoryItemActive: {
    backgroundColor: "#F0F8FF",
  },
  categoryItemText: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },
  categoryItemTextActive: {
    fontWeight: "600",
    color: Colors.Primary,
  },
});
