
import { View, Animated, StyleSheet, Image, Text } from "react-native";
//import { router } from "expo-router";

export default function logIn() {

  return (
    <View style={styles.container}>
      <Animated.View style={styles.header}>
        <Image style={{width:160,height:160}} source={require('../assets/AppIcon.png')} resizeMode='contain'  />
        <Text>Welcome Back</Text>
        <Text> Log in to find your next opportunity</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A84FF",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
   flex:1,
   alignItems:'center',
   marginTop:80
  },
});
