import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../theme/colors";
import useUserStore from "../../store/useStore";
import { useRegister } from "../../hooks/useAuth";
import FormInput from "../../components/FormInput";
import Divider from "../../components/Divider";
import Terms from "../../components/Terms";
import Logo from "../../components/Logo.jsx";
import { useAlert } from "../../hooks/useAlert";

export default function SignUp() {
  const {
    fullName,
    email,
    password,
    role,
    showPassword,
    phone,
    city,
    address,
    setFullName,
    setEmail,
    setPassword,
    setRole,
    setShowPassword,
    setPhone,
    setCity,
    setAddress,
    resetForm,
  } = useUserStore();

  const { mutate: register, isPending, isError, error } = useRegister();
  const { showSuccess, showError } = useAlert();

  const handleSignUp = () => {
    if (!fullName.trim()) {
      showError("Erreur", "Please enter your full name");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      showError("Erreur", "Please enter a valid email");
      return;
    }
    if (password.length < 6) {
      showError("Erreur", "Password must be at least 6 characters");
      return;
    }

    if (!phone.trim()) {
      showError("Erreur", "Please enter your phone number");
      return;
    }

    if (role === "employer") {
      if (!city.trim()) {
        showError("Erreur", "Please enter your city");
        return;
      }
      if (!address.trim()) {
        showError("Erreur", "Please enter your address/location");
        return;
      }
    }

    register(
      { fullname: fullName, email, password, role, phone, city, address },
      {
        onSuccess: () => {
          showSuccess("Succès", "Inscription réussie !", { autoClose: true });
          resetForm();
          setTimeout(() => {
            router.replace("/(auth)/logIn");
          }, 1500);
        },
        onError: (err) => {
          showError(
            "Erreur",
            err.response?.data?.message || "Échec de l'inscription",
          );
        },
      },
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["bottom", "top"]}>
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
          {/* header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Logo />
          </View>

          {/* form container */}
          <View style={styles.formContainer}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Sign up to start finding your dream job
            </Text>

            {/* role select */}
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
                    color={role === "candidate" ? "#FFFFFF" : Colors.Secondary}
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

            {/* fullname input */}
            <FormInput
              label="Full Name"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              iconName="person-outline"
              autoCapitalize="words"
            />

            {/* email input */}
            <FormInput
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              iconName="mail-outline"
              keyboardType="email-address"
            />

            {/* password input */}
            <FormInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              iconName="lock-closed-outline"
              secureTextEntry={true}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
            {/* phone input */}
            <FormInput
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              iconName="call-outline"
              keyboardType="phone-pad"
            />
            {/* employer Fields */}
            {role === "employer" && (
              <>
                {/* city input */}
                <FormInput
                  label="City"
                  value={city}
                  onChangeText={setCity}
                  placeholder="Enter your city"
                  iconName="location-outline"
                  autoCapitalize="words"
                />

                {/* address input */}
                <FormInput
                  label="Address"
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter your address"
                  iconName="map-outline"
                  autoCapitalize="words"
                />
              </>
            )}

            {/* sign up button */}
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

            {/* divider + login link */}
            <Divider text="or" />

            <TouchableOpacity
              onPress={() => router.push("(auth)/logIn")}
              style={styles.loginButton}
            >
              <Text style={styles.loginButtonText}>
                Already have an account? Log In
              </Text>
            </TouchableOpacity>

            {/* terms */}
            <Terms />
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
    marginBottom: 20,
  },
  //role input
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
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
});
