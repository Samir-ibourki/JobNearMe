import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: async (user, token) => {
    await AsyncStorage.setItem("token", token);
    set({
      user,
      token,
      isAuthenticated: true,
    });
  },

  logout: async () => {
    await AsyncStorage.removeItem("token");
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
}));
