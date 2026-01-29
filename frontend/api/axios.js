import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Platform } from "react-native";

let API_URL;

if (
  Platform.OS === "android" &&
  !Constants.expoConfig?.hostUri?.includes("192.")
) {
  API_URL = "http://10.0.2.2:3030/api";
} else if (Constants.expoConfig?.hostUri) {
  const ip = Constants.expoConfig.hostUri.split(":").shift();
  API_URL = `http://${ip}:3030/api`;
} else {
  // eslint-disable-next-line no-unused-vars
  API_URL = "http://localhost:3030/api";
}

const API = axios.create({
  // TODO: Revert to production after testing: "https://jobnearme.up.railway.app/api"
  baseURL: "https://jobnearme.up.railway.app/api",
  timeout: 10000,
});

API.interceptors.request.use(async (config) => {
  try {
    const authStorage = await AsyncStorage.getItem("auth-storage");
    if (authStorage) {
      const { state } = JSON.parse(authStorage);
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    }
  } catch (error) {
    console.error("Error reading auth token:", error);
  }
  return config;
});

export default API;

//baseURL: "https://jobnearme.up.railway.app/api"
