// import { useRouter } from "expo-router";
// import { useEffect } from "react";
// import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import Animated, {
//   useAnimatedStyle,
//   useSharedValue,
//   withSpring,
//   withTiming,
// } from "react-native-reanimated";
// import { SafeAreaView } from "react-native-safe-area-context";
// import icon from "../assets/AppIcon.png";

// export default function HomeScreen() {
//   const router = useRouter();

//   const progress = useSharedValue(0);
//   const translateY = useSharedValue(50);

//   const animatedStyle = useAnimatedStyle(() => ({
//     opacity: progress.value,
//     transform: [{ translateY: translateY.value }],
//   }));

//   useEffect(() => {
//     progress.value = withTiming(1, { duration: 1500 });
//     translateY.value = withSpring(0,{ damping: 10,stiffness: 100 });
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Animated.View style={[styles.center, animatedStyle]}>
//         <Image
//           source={icon}
//           resizeMode="contain"
//           style={{ width: 160, height: 160 }}
//         />
//         <Text style={styles.text}>JobNearMe</Text>
//         <Text style={styles.subtitel}>Find Jobs near you instantly.</Text>
//       </Animated.View>

//       <SafeAreaView style={styles.safeBtn}>
//         <Animated.View style={[animatedStyle]}>
//           <TouchableOpacity
//             onPress={() => router.push("/logIn")}
//             style={styles.btn}
//           >
//             <Text style={styles.btnText}>Log In</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => router.push("/signUp")}
//             style={styles.btn}
//           >
//             <Text style={styles.btnText}>Sign Up</Text>
//           </TouchableOpacity>
//         </Animated.View>
//       </SafeAreaView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   center: {
//     alignItems: "center",
//     gap: 10,
//   },
//   text: {
//     fontSize: 35,
//     fontWeight: "bold",
//   },
//   subtitel: {
//     fontSize: 20,
//     textAlign: "center",
//     color: "#555",
//   },
//   safeBtn: {
//     position: "absolute",
//     bottom: 0,
//     width: "100%",
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//   },
//   btn: {
//     backgroundColor: "#007BFF",
//     paddingVertical: 15,
//     borderRadius: 8,
//     width: "100%",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 15,
//   },
//   btnText: {
//     color: "white",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
// });
