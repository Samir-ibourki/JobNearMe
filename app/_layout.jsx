import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="/" />
      <Stack.Screen name="/onboarding" />
      <Stack.Screen name="/logIn" />
      <Stack.Screen name="/signUp" />
      <Stack.Screen
        name="/forgotPassword"
        options={{
          presentation: "transparentModal",
          animation: "fade_from_bottom",
        }}
      />
    </Stack>
  );
}
