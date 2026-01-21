import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Platform } from "react-native";

let API_URL;

if (
  Platform.OS === "android" &&
  !Constants.expoConfig?.hostUri?.includes("192.")
) {
  // Android Emulator - use 10.0.2.2 to reach host machine's localhost
  API_URL = "http://10.0.2.2:3030/api";
} else if (Constants.expoConfig?.hostUri) {
  // Physical Device (Expo Go / Dev Build) - use the host machine's IP
  const ip = Constants.expoConfig.hostUri.split(":").shift();
  API_URL = `http://${ip}:3030/api`;
} else {
  // Fallback for web or other platforms
  API_URL = "http://localhost:3030/api";
}

const API = axios.create({
  baseURL: "https://jobnearme.up.railway.app/api",
  timeout: 10000,
});

API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
