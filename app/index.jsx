import React, { useRef, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Easing } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import icon from "@/assets/AppIcon.png";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();
  // Animated values
  const fadeAnim = useRef(new Animated.Value(0)).current; 
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current; 

  useEffect(() => {

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 800,
      delay: 800,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, scaleAnim, slideAnim]);

  return (
    <View style={styles.container}>

      <Animated.View
        style={[
          styles.center,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image source={icon} resizeMode="contain" style={{ width: 160, height: 160 }} />
        <Text style={styles.text}>JobNearMe</Text>
        <Text style={styles.subtitel}>Find Jobs near you instantly.</Text>
      </Animated.View>


      <SafeAreaView style={styles.safeBtn}>
        <Animated.View
          style={[
            {
              transform: [{ translateY: slideAnim }],
              opacity: fadeAnim,
              width: "100%",
            },
          ]}
        >
          <TouchableOpacity onPress={()=>router.push('/logIn')} style={styles.btn}>
            <Text style={styles.btnText}>Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>router.push('/signUp')} style={styles.btn}>
            <Text style={styles.btnText}>Sign Up</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  center: {
    alignItems: "center",
    gap: 10,
  },
  text: {
    fontSize: 35,
    fontWeight: "bold",
  },
  subtitel: {
    fontSize: 20,
    textAlign: "center",
    color: "#555",
  },
  safeBtn: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 20, 
  },
  btn: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 8,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  btnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
