import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

//android Studio
let API_URL = "http://10.0.2.2:3030/api";

// Dynamic for Physical Device (Expo Go / Dev Build)
if (Constants.expoConfig?.hostUri) {
  const ip = Constants.expoConfig.hostUri.split(":").shift();
  API_URL = `http://${ip}:3030/api`;
}

const API = axios.create({
  baseURL: API_URL,
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
