import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../theme/colors";
import { useForgotPassword } from "../../hooks/useAuth";
import { useAlert } from "../../hooks/useAlert";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const { showSuccess, showError } = useAlert();

  // mutations
  const { mutate: sendOtp, isPending: isSendingOtp } = useForgotPassword();

  const handleSendLink = () => {
    if (!email.trim() || !email.includes("@")) {
      showError("Error", "Please enter a valid email address");
      return;
    }

    sendOtp(
      { email },
      {
        onSuccess: (data) => {
          showSuccess(
            "Success",
            "Reset link sent! If the link doesn't open automatically, copy the token from your email.",
          );
          setTimeout(() => {
            router.push("/(auth)/resetPassword");
          }, 2000);
        },
        onError: (err) => {
          showError(
            "Error",
            err.response?.data?.message || "Failed to send reset link",
          );
        },
      },
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.Primary}
        translucent={false}
      />
      <LinearGradient
        colors={[Colors.Primary, Colors.Secondary, "#FFFFFF"]}
        locations={[0, 0.3, 0.7]}
        style={[styles.gradient, StyleSheet.absoluteFill]}
      />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.logoContainer}>
              <View style={styles.logoIcon}>
                <Ionicons name="key-outline" size={20} color="#fff" />
              </View>
              <Text style={styles.logoText}>Recovery</Text>
            </View>
          </View>

          {/* Form Container */}
          <View style={styles.formContainer}>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              Enter your email address and well send you a link to reset your
              password.
            </Text>

            <View style={styles.stepContainer}>
              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email Address</Text>
                <View
                  style={[styles.inputWrapper, email && styles.inputFocused]}
                >
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={email ? Colors.Secondary : "#999"}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.actionButton, isSendingOtp && { opacity: 0.7 }]}
                onPress={handleSendLink}
                disabled={isSendingOtp}
              >
                <Text style={styles.actionButtonText}>
                  {isSendingOtp ? "Sending..." : "Send Reset Link"}
                </Text>
                {!isSendingOtp && (
                  <Ionicons name="send" size={18} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardView: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 30,
  },
  stepContainer: {
    gap: 20,
  },
  inputContainer: {
    marginBottom: 0,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    gap: 12,
  },
  inputFocused: {
    borderColor: Colors.Secondary,
    backgroundColor: "#F0F8FF",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
  },
  actionButton: {
    backgroundColor: "#000000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 12,
    gap: 8,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  backLink: {
    alignSelf: "center",
    padding: 10,
  },
  backLinkText: {
    color: Colors.Secondary,
    fontWeight: "600",
  },
});
