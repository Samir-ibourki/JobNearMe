// import { Ionicons } from "@expo/vector-icons";
// import {
//   Animated,
//   Image,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// //import { router } from "expo-router";

// export default function logIn() {
//   return (
//     <View style={styles.container}>
//       <Animated.View style={styles.header}>
//         <Image
//           style={{ width: 160, height: 160 }}
//           source={require("../assets/AppIcon.png")}
//           resizeMode="contain"
//         />
//         <Text style={styles.back}>Welcome Back</Text>
//         <Text style={styles.subtitle}>
//           {" "}
//           Log in to find your next opportunity
//         </Text>
//       </Animated.View>

//       <Animated.View style={styles.form}>
//         {/* Email Input */}
//         <View>
//           <Text style={styles.label}>Email</Text>
//           <View style={styles.inputContainer}>
//             <Ionicons name="mail-outline" size={20} color="#666" />
//             <TextInput
//               style={styles.input}
//               placeholder="Email"
//               keyboardType="email-address"
//               autoCapitalize="none"
//             />
//           </View>
//         </View>

//         {/* Password Input */}
//         <View>
//           <Text style={styles.label}>Password</Text>
//           <View style={styles.inputContainer}>
//             <Ionicons name="lock-closed-outline" size={20} color="#666" />
//             <TextInput
//               style={styles.input}
//               placeholder="Password"
//               secureTextEntry
//             />
//           </View>
//         </View>
//       </Animated.View>

//       <Animated.View style={styles.btns}>

//         <TouchableOpacity>
//           <Text>Login</Text>
//         </TouchableOpacity>

//         <TouchableOpacity>
//           <Text>Register</Text>
//         </TouchableOpacity>

//       </Animated.View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   header: {
//     flex: 1,
//     justifyContent: "flex-start",
//     alignItems: "center",
//     marginTop: 80,
//   },
//   back: {
//     fontSize: 30,
//     fontWeight: "700",
//     letterSpacing: 3,
//   },
//   subtitle: {
//     fontSize: 20,
//     color: "#585656ff",
//     marginTop: 5,
//   },
//   form: {
//     flex: 1,
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     marginBottom: 16,
//     backgroundColor: "#ebdfdfff",
//   },
//   input: {
//     flex: 1,
//     paddingVertical: 12,
//     paddingHorizontal: 8,
//     fontSize: 16,
//   },
//   btns:{
//     flex:1,
//   }
// });
import { Ionicons } from "@expo/vector-icons";

import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LogIn() {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View style={styles.header}>
          <Image
            style={styles.logo}
            source={require("../assets/AppIcon.png")}
            resizeMode="contain"
          />
          <Text style={styles.welcomeBack}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Log in to find your next opportunity
          </Text>
        </Animated.View>

        {/* Form */}
        <Animated.View style={styles.form}>
          {/* Email Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Email Address</Text>
            <View style={[styles.inputContainer, styles.inputFocused]}>
              <Ionicons name="mail-outline" size={22} color="#0A84FF" />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputContainer, styles.inputFocused]}>
              <Ionicons name="lock-closed-outline" size={22} color="#0A84FF" />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                secureTextEntry
              />
              <TouchableOpacity>
                {/* showPassword ? "eye-outline" : "eye-off-outline" */}
                <Ionicons name={"eye-outline"} size={22} color="#999" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Buttons */}
        <Animated.View style={styles.btns}>
          {/* Login Button */}
          <TouchableOpacity style={styles.loginBtn} activeOpacity={0.8}>
            <Text style={styles.loginBtnText}>Log In</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Register Button */}
          <TouchableOpacity style={styles.registerBtn} activeOpacity={0.8}>
            <Text style={styles.registerBtnText}>Create New Account</Text>
          </TouchableOpacity>

          {/* Footer */}
          <Text style={styles.footer}>
            By continuing, you agree to our{" "}
            <Text style={styles.link}>Terms of Service</Text> and{" "}
            <Text style={styles.link}>Privacy Policy</Text>
          </Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  welcomeBack: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  form: {
    marginBottom: 24,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputFocused: {
    borderColor: "#0A84FF",
    backgroundColor: "#F0F8FF",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1A1A1A",
    marginLeft: 12,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#0A84FF",
    fontWeight: "600",
  },
  btns: {
    marginTop: 8,
    marginBottom: 40,
  },
  loginBtn: {
    backgroundColor: "#0A84FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#0A84FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginRight: 8,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E5E5",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#999",
    fontSize: 14,
    fontWeight: "500",
  },
  registerBtn: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#0A84FF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  registerBtnText: {
    color: "#0A84FF",
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    lineHeight: 18,
  },
  link: {
    color: "#0A84FF",
    fontWeight: "600",
  },
});
