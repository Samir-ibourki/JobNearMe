import { create } from "zustand";

const useUserStore = create((set) => ({
  // state of loginScreen and signUp screen
  fullName: "",
  email: "",
  password: "",
  role: "candidate",
  showPassword: false,
  phone: "",
  city: "",
  address: "",

  //action of loginScreen and signUp screen
  setFullName: (fullName) => set({ fullName }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setRole: (role) => set({ role }),
  setShowPassword: () =>
    set((state) => ({ showPassword: !state.showPassword })),
  setPhone: (phone) => set({ phone }),
  setCity: (city) => set({ city }),
  setAddress: (address) => set({ address }),

  resetForm: () =>
    set({
      fullName: "",
      email: "",
      password: "",
      role: "candidate",
      showPassword: false,
      phone: "",
      city: "",
      address: "",
    }),
}));
export default useUserStore;
