import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuthStore.js";
import {
  loginApi,
  registerApi,
  forgotPasswordApi,
  resetPasswordApi,
} from "../api/authApi.js";

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

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPasswordApi,
    onError: (error) => {
      console.error(
        "Forgot Password error:",
        error.response?.data || error.message
      );
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPasswordApi,
    onError: (error) => {
      console.error(
        "Reset Password error:",
        error.response?.data || error.message
      );
    },
  });
};
