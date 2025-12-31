import API from "./axios.js";

export const loginApi = (data) => API.post("/auth/login", data);

export const registerApi = (data) => API.post("/auth/register", data);

export const profileApi = () => API.get("/auth/profile");

export const forgotPasswordApi = (data) =>
  API.post("/auth/forgot-password", data);

export const resetPasswordApi = ({ token, newPassword }) =>
  API.post(`/auth/reset-password/${token}`, { newPassword });
