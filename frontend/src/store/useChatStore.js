
import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,

  isUsersLoading: false,
  isMessagesLoading: false,

  unreadMessages: {},

  currentMessageListener: null,
  globalMessageListener: null,

  // =========================
  // GET USERS
  // =========================
  getUsers: async () => {
    set({ isUsersLoading: true });

    try {
      const res = await axiosInstance.get("/messages/users");

      set({
        users: res.data,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load users"
      );
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // =========================
  // GET MESSAGES
  // =========================
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });

    try {
      const res = await axiosInstance.get(
        `/messages/${userId}`
      );

      set({
        messages: res.data,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load messages"
      );
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // =========================
  // SEND MESSAGE
  // =========================
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();

    if (!selectedUser) return;

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );

      set({
        messages: [...messages, res.data],
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to send message"
      );
    }
  },

  // =========================
  // CURRENT CHAT LISTENER
  // =========================
  subscribeToMessages: () => {
    const { selectedUser } = get();

    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    if (!socket) return;

    const oldListener = get().currentMessageListener;

    if (oldListener) {
      socket.off("newMessage", oldListener);
    }

    const handleNewMessage = (newMessage) => {
      const isFromSelectedUser =
        newMessage.senderId === selectedUser._id;

      if (!isFromSelectedUser) return;

      set((state) => ({
        messages: [
          ...state.messages,
          newMessage,
        ],
      }));
    };

    socket.on("newMessage", handleNewMessage);

    set({
      currentMessageListener: handleNewMessage,
    });
  },

  // =========================
  // UNSUBSCRIBE CURRENT CHAT
  // =========================
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    const listener = get().currentMessageListener;

    if (socket && listener) {
      socket.off("newMessage", listener);
    }

    set({
      currentMessageListener: null,
    });
  },

  // =========================
  // GLOBAL UNREAD LISTENER
  // =========================
  subscribeToUnreadMessages: () => {
    const socket = useAuthStore.getState().socket;

    if (!socket) return;

    const oldListener = get().globalMessageListener;

    if (oldListener) {
      socket.off("newMessage", oldListener);
    }

    const handleNewMessage = (newMessage) => {
      const selectedUser = get().selectedUser;

      // If chat with sender is already open,
      // don't show unread count.
      if (
        selectedUser &&
        newMessage.senderId === selectedUser._id
      ) {
        return;
      }

      const senderId = newMessage.senderId;

      set((state) => ({
        unreadMessages: {
          ...state.unreadMessages,
          [senderId]:
            (state.unreadMessages[senderId] || 0) + 1,
        },
      }));
    };

    socket.on("newMessage", handleNewMessage);

    set({
      globalMessageListener: handleNewMessage,
    });
  },

  // =========================
  // CLEAR UNREAD
  // =========================
  clearUnreadMessages: (userId) => {
    set((state) => {
      const updatedUnread = {
        ...state.unreadMessages,
      };

      delete updatedUnread[userId];

      return {
        unreadMessages: updatedUnread,
      };
    });
  },

  // =========================
  // SELECT USER
  // =========================
  setSelectedUser: (selectedUser) => {
    set({
      selectedUser,
    });

    if (selectedUser) {
      get().clearUnreadMessages(
        selectedUser._id
      );
    }
  },
}));

