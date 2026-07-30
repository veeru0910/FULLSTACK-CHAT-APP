import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,

  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  onlineUsers: [],
  socket: null,

  // Admin notification state
  pendingRequests: [],
  adminNotificationCount: 0,

  // =========================
  // CHECK AUTH
  // =========================
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({
        authUser: res.data,
      });

      get().connectSocket();

    } catch (error) {
      console.log("Error in checkAuth", error);

      set({
        authUser: null,
      });

    } finally {
      set({
        isCheckingAuth: false,
      });
    }
  },

  // =========================
  // SIGNUP
  // =========================
  signup: async (data) => {
    set({
      isSigningUp: true,
    });

    try {
      await axiosInstance.post(
        "/auth/signup",
        data
      );

      // Do NOT set authUser here.
      // User must wait for admin approval.

      toast.success(
        "Account request submitted! Wait for approval."
      );

      return true;

    } catch (error) {
      console.log(
        "Signup error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to create account"
      );

      return false;

    } finally {
      set({
        isSigningUp: false,
      });
    }
  },

  // =========================
  // LOGIN
  // =========================
  login: async (data) => {
    set({
      isLoggingIn: true,
    });

    try {
      const res = await axiosInstance.post(
        "/auth/login",
        data
      );

      set({
        authUser: res.data,
      });

      toast.success(
        "Logged in successfully"
      );

      get().connectSocket();

      return true;

    } catch (error) {
      console.log(
        "Login error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to login"
      );

      return false;

    } finally {
      set({
        isLoggingIn: false,
      });
    }
  },

  // =========================
  // LOGOUT
  // =========================
  logout: async () => {
    try {
      await axiosInstance.post(
        "/auth/logout"
      );

      get().disconnectSocket();

      set({
        authUser: null,
        pendingRequests: [],
        adminNotificationCount: 0,
      });

      toast.success(
        "Logged out successfully"
      );

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Logout failed"
      );
    }
  },

  // =========================
  // UPDATE PROFILE
  // =========================
  updateProfile: async (data) => {
    set({
      isUpdatingProfile: true,
    });

    try {
      const res = await axiosInstance.put(
        "/auth/update-profile",
        data
      );

      if (res.data) {

        set({
          authUser: res.data,
        });

        toast.success(
          "Profile updated successfully"
        );

      } else {

        toast.error(
          "Failed to update profile"
        );

      }

    } catch (error) {

      console.log(
        "Update profile error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "An unexpected error occurred"
      );

    } finally {

      set({
        isUpdatingProfile: false,
      });
    }
  },

  // =========================
  // CONNECT SOCKET
  // =========================
  connectSocket: () => {
    const { authUser } = get();

    if (!authUser) return;

    if (get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
        email: authUser.email,
      },
    });

    socket.connect();

    set({
      socket,
    });

    // =========================
    // ONLINE USERS
    // =========================
    socket.on(
      "getOnlineUsers",
      (userIds) => {
        set({
          onlineUsers: userIds,
        });
      }
    );

    // =========================
    // NEW ADMIN REQUEST
    // =========================
    socket.on(
      "newAccountRequest",
      (newUser) => {

        console.log(
          "New account request:",
          newUser
        );

        set((state) => ({
          pendingRequests: [
            newUser,
            ...state.pendingRequests,
          ],

          adminNotificationCount:
            state.adminNotificationCount + 1,
        }));

        toast.success(
          `New account request from ${newUser.fullName}`
        );
      }
    );
  },

  // =========================
  // DISCONNECT SOCKET
  // =========================
  disconnectSocket: () => {

    if (get().socket?.connected) {
      get().socket.disconnect();
    }

    set({
      socket: null,
      onlineUsers: [],
      pendingRequests: [],
      adminNotificationCount: 0,
    });
  },
}));