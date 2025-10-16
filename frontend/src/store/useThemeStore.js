// save theme to local storage so that even after refreshing theme stays
import { create } from "zustand";

export const useThemeStore = create((set) => ({
  //* state
  theme: localStorage.getItem("chat-theme") || "dark",
  //* setter function
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },
}));
