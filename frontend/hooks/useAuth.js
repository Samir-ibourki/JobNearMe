import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuthStore.js";
import { loginApi, registerApi } from "../api/authApi.js";

export const useLogin = () => {
  const loginStore = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (res) => {
      const { user, token } = res.data.data;
      loginStore(user, token);
    },
    onError: (error) => {
      console.error("Login error:", error.response?.data || error.message);
    },
  });
};

export const useRegister = () => {
  const loginStore = useAuthStore((state) => state.login);
  return useMutation({
    mutationFn: registerApi,
    onSuccess: (res) => {
      const { user, token } = res.data.data;
      loginStore(user, token);
    },
    onError: (error) => {
      console.error("Register error:", error.response?.data || error.message);
    },
  });
};
