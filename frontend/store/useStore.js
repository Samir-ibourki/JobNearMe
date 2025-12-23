import { create } from "zustand";

const useUserStore = create((set) => ({
  // state of loginScreen and signUp screen
  fullName: "",
  email: "",
  password: "",
  role: "candidate",
  showPassword: false,

  //action of loginScreen and signUp screen
  setFullName: (fullName) => set({ fullName }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setRole: (role) => set({ role }),
  setShowPassword: () =>
    set((state) => ({ showPassword: !state.showPassword })),

  resetForm: () =>
    set({
      fullName: "",
      email: "",
      password: "",
      role: "candidate",
      showPassword: false,
    }),
}));
export default useUserStore;
