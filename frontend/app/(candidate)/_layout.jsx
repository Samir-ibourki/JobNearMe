import { Stack } from "expo-router";

export default function CandidateLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="map" />
      <Stack.Screen name="applications" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="job/[id]" />
    </Stack>
  );
}
