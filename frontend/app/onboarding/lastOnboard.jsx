import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import Colors from "../../theme/colors.js";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../../components/logo.jsx";

const image = require("../../assets/congrat.png");

const LaundrifyOnboardingScreen = () => {
  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.Primary} />

      <LinearGradient
        colors={[Colors.Primary, Colors.Secondary, "#FFFFFF"]}
        locations={[0, 0.5, 1]}
        style={styles.gradientBackground}
      >
        {/* header logo */}
        <View style={styles.header}>
          <Logo />
        </View>

        <View style={styles.illustrationContainer}>
          <Image
            source={image}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        <View style={styles.contentBottom}>
          <Text style={styles.title}>
            Your dream job is{"\n"}
            <Text style={styles.subtitle}>one tap away</Text>
          </Text>

          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={() => router.push("(auth)/signUp")}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => {
              router.push("(auth)/logIn");
            }}
          >
            <Text style={styles.loginText}>I already have an account</Text>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            By continuing you agree to our{" "}
            <Text style={styles.linkText}>Terms of Services</Text>
            {"\n"}and <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  gradientBackground: {
    flex: 1,
  },
  header: {
    marginBottom: 30,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  illustration: {
    width: 550,
    height: 550,
  },
  contentBottom: {
    paddingHorizontal: 30,
    paddingBottom: 50,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.textDark,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 32,
    fontWeight: "400",
    color: Colors.textDark,
  },
  getStartedButton: {
    width: "100%",
    backgroundColor: Colors.buttonPrimary,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  getStartedText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: "600",
  },
  loginButton: {
    width: "100%",
    backgroundColor: Colors.buttonSecondary,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  loginText: {
    color: Colors.textDark,
    fontSize: 16,
    fontWeight: "600",
  },
  termsText: {
    textAlign: "center",
    fontSize: 12,
    color: Colors.linkText,
    lineHeight: 18,
    fontWeight: "bold",
  },
  linkText: {
    color: Colors.linkText,
    fontWeight: "500",
  },
});

export default LaundrifyOnboardingScreen;
