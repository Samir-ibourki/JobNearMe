// app/(auth)/signUp.js

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

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
import useUserStore from "../../store/useStore";
import { useRegister } from "../../hooks/useAuth";

export default function SignUp() {
  const {
    fullName,
    email,
    password,
    role,
    showPassword,
    setFullName,
    setEmail,
    setPassword,
    setRole,
    setShowPassword,
    resetForm,
  } = useUserStore();

  const { mutate: register, isPending, isError, error } = useRegister();

  const handleSignUp = () => {
    if (!fullName.trim()) {
      Alert.alert("Erreur", "Please enter your full name");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      Alert.alert("Erreur", "Please enter a valid email");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Erreur", "Password must be at least 6 characters");
      return;
    }

    register(
      { fullname: fullName, email, password, role },
      {
        onSuccess: () => {
          Alert.alert("Succès", "Inscription réussie !");
          resetForm();
          router.replace("/(auth)/logIn");
        },
        onError: (err) => {
          Alert.alert(
            "Erreur",
            err.response?.data?.message || "Échec de l'inscription"
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
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>

              <View style={styles.logoContainer}>
                <View style={styles.logoIcon}>
                  <Text style={styles.logoEmoji}>🔍</Text>
                </View>
                <Text style={styles.logoText}>JobNearMe</Text>
              </View>
            </View>

            {/* Form Container */}
            <View style={styles.formContainer}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Sign up to start finding your dream job
              </Text>

              {/* Role Selection */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>I am a</Text>
                <View style={styles.roleContainer}>
                  <TouchableOpacity
                    style={[
                      styles.roleButton,
                      role === "candidate" && styles.roleButtonActive,
                    ]}
                    onPress={() => setRole("candidate")}
                  >
                    <Ionicons
                      name="person"
                      size={24}
                      color={
                        role === "candidate" ? "#FFFFFF" : Colors.Secondary
                      }
                    />
                    <Text
                      style={[
                        styles.roleButtonText,
                        role === "candidate" && styles.roleButtonTextActive,
                      ]}
                    >
                      Job Seeker
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.roleButton,
                      role === "employer" && styles.roleButtonActive,
                    ]}
                    onPress={() => setRole("employer")}
                  >
                    <Ionicons
                      name="briefcase"
                      size={24}
                      color={role === "employer" ? "#FFFFFF" : Colors.Secondary}
                    />
                    <Text
                      style={[
                        styles.roleButtonText,
                        role === "employer" && styles.roleButtonTextActive,
                      ]}
                    >
                      Employer
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Full Name Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
                <View
                  style={[styles.inputWrapper, fullName && styles.inputFocused]}
                >
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={fullName ? Colors.Secondary : "#999"}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                    value={fullName}
                    onChangeText={setFullName}
                  />
                </View>
              </View>

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

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View
                  style={[styles.inputWrapper, password && styles.inputFocused]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={password ? Colors.Secondary : "#999"}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Create a password"
                    placeholderTextColor="#999"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={setShowPassword}>
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color="#999"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Sign Up Button */}
              <TouchableOpacity
                style={[
                  styles.signUpButton,
                  isPending && styles.signUpButtonDisabled,
                ]}
                onPress={handleSignUp}
                disabled={isPending}
                activeOpacity={0.8}
              >
                <Text style={styles.signUpButtonText}>
                  {isPending ? "Creating Account..." : "Sign Up"}
                </Text>
                {!isPending && (
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                )}
              </TouchableOpacity>

              {isError && (
                <Text
                  style={{ color: "red", textAlign: "center", marginTop: 10 }}
                >
                  {error?.response?.data?.message || "Erreur"}
                </Text>
              )}

              {/* Divider & Login Link */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                onPress={() => router.push("(auth)/logIn")}
                style={styles.loginButton}
              >
                <Text style={styles.loginButtonText}>
                  Already have an account? Log In
                </Text>
              </TouchableOpacity>

              {/* Terms */}
              <Text style={styles.termsText}>
                By continuing, you agree to our{" "}
                <Text style={styles.linkText}>Terms of Service</Text> and{" "}
                <Text style={styles.linkText}>Privacy Policy</Text>
              </Text>
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
  logoEmoji: {
    fontSize: 18,
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
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },

  //role input
  roleContainer: {
    flexDirection: "row",
    gap: 12,
  },
  roleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  roleButtonActive: {
    backgroundColor: Colors.Secondary,
    borderColor: Colors.Secondary,
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
  },
  roleButtonTextActive: {
    color: "#FFFFFF",
  },

  // Input Styles
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

  signUpButton: {
    backgroundColor: "#000000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 20,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  signUpButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 12,
    color: "#666666",
  },
  loginButton: {
    backgroundColor: "#F5F5F5",
    borderWidth: 2,
    borderColor: "#E0E0E0",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
  termsText: {
    textAlign: "center",
    fontSize: 12,
    color: "#666666",
    lineHeight: 18,
  },
  linkText: {
    color: Colors.Secondary,
    fontWeight: "500",
  },
});
