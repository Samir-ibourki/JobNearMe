import { Stack } from "expo-router";

export default function EmployerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="my-jobs" />
      <Stack.Screen name="add-job" />
    </Stack>
  );
}
