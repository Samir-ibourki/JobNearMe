import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="/" />
      <Stack.Screen name="/logIn" />
      <Stack.Screen name="/signUp" />
    </Stack>
  );
}
