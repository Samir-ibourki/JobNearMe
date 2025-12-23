import { create } from "zustand";

const useUserStore = create((set) => ({
  // state of loginScreen
  email: "",
  password: "",
  showPassword: false,

  //action of loginScreen
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setShowPassword: () =>
    set((state) => ({ showPassword: !state.showPassword })),
}));
export default useUserStore;
