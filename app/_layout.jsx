import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="/splashScrn" />
      <Stack.Screen name="/welcomeScrn" />
    </Stack>
  );
}
