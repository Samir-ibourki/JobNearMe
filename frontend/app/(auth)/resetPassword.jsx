import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
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
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../theme/colors";
import { useResetPassword } from "../../hooks/useAuth";

export default function ResetPassword() {
  const params = useLocalSearchParams();
  const [token, setToken] = useState(params.token || "");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (params.token && params.token !== token) {
    setToken(params.token);
  }
  const { mutate: resetPass, isPending: isResetting } = useResetPassword();

  const handleReset = () => {
    if (!token) {
      Alert.alert("Error", "Please enter the reset token.");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    resetPass(
      { token, newPassword },
      {
        onSuccess: () => {
          Alert.alert("Success", "Password reset successfully! Please login.", [
            { text: "OK", onPress: () => router.replace("(auth)/logIn") },
          ]);
        },
        onError: (err) => {
          Alert.alert(
            "Error",
            err.response?.data?.message || "Failed to reset password"
          );
        },
      }
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.Primary}
        translucent={false}
      />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <LinearGradient
          colors={[Colors.Primary, Colors.Secondary, "#FFFFFF"]}
          locations={[0, 0.3, 0.7]}
          style={styles.gradient}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <View style={styles.logoIcon}>
                  <Ionicons name="lock-open-outline" size={20} color="#fff" />
                </View>
                <Text style={styles.logoText}>Reset Password</Text>
              </View>
            </View>

            {/* form container */}
            <View style={styles.formContainer}>
              <Text style={styles.title}>New Password</Text>
              <Text style={styles.subtitle}>
                Enter your token (from email) and new password.
              </Text>

              <View style={styles.stepContainer}>
                {/*token input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Reset Token</Text>
                  <View
                    style={[styles.inputWrapper, token && styles.inputFocused]}
                  >
                    <Ionicons
                      name="key-outline"
                      size={20}
                      color={token ? Colors.Secondary : "#999"}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Paste token here"
                      placeholderTextColor="#999"
                      value={token}
                      onChangeText={setToken}
                    />
                  </View>
                </View>

                {/* new password input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>New Password</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      newPassword && styles.inputFocused,
                    ]}
                  >
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={newPassword ? Colors.Secondary : "#999"}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter new password"
                      placeholderTextColor="#999"
                      secureTextEntry={!showPassword}
                      value={newPassword}
                      onChangeText={setNewPassword}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Ionicons
                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                        size={20}
                        color="#999"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.actionButton, isResetting && { opacity: 0.7 }]}
                  onPress={handleReset}
                  disabled={isResetting}
                >
                  <Text style={styles.actionButtonText}>
                    {isResetting ? "Resetting..." : "Set New Password"}
                  </Text>
                  {!isResetting && (
                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
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
    paddingTop: 40,
    paddingBottom: 40,
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
});
