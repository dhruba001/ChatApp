//* store for authentication
//* here we can have bunch of states and functions that we can use in different components

import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

//* this will return an object, and that object is out initial state
//* set is a setter function
//* authUser and isCheckingAuth are keys in the state object you’re initializing.
//* Zustand stores don’t need external data when created; you define what state exists and its initial value.

//* it returns a custom react hook name useAuthStore -> used in app.jsx
//* all these authuser and issignin are made by user here it's not coming from any other place

export const useAuthStore = create((set) => ({
  authUser: null, // initially authUser state is null as we don't know if user is authenticated or not
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true, // loading state, intially it is true, but as soon as we refresh page we are going to check
  // while checking we will show a loading spinner in the middle of the screen
  checkAuth: async () => {
    //* it'll set authUser
    //* full explanation : https://chatgpt.com/share/68ef76c0-5e0c-8012-a814-c3d7f57bc5df
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.error("error in checkauth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));
