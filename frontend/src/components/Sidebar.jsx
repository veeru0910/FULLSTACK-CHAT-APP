import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    unreadMessages,
  } = useChatStore();

  const { onlineUsers } = useAuthStore();

  const [showOnlineOnly, setShowOnlineOnly] =
    useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Start global unread-message listener
  useEffect(() => {
    const timer = setTimeout(() => {
      useChatStore
        .getState()
        .subscribeToUnreadMessages();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) =>
        onlineUsers.includes(user._id)
      )
    : users;

  if (isUsersLoading) {
    return <SidebarSkeleton />;
  }

  return (
    <aside
      className="
        h-full w-20 lg:w-72
        border-r border-base-300
        flex flex-col
        transition-all duration-200
      "
    >

      {/* HEADER */}
      <div className="border-b border-base-300 w-full p-5">

        <div className="flex items-center gap-2">
          <Users className="size-6" />

          <span className="font-medium hidden lg:block">
            Contacts
          </span>
        </div>

        {/* ONLINE FILTER */}
        <div className="mt-3 hidden lg:flex items-center gap-2">

          <label className="cursor-pointer flex items-center gap-2">

            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) =>
                setShowOnlineOnly(
                  e.target.checked
                )
              }
              className="checkbox checkbox-sm"
            />

            <span className="text-sm">
              Show online only
            </span>

          </label>

          <span className="text-xs text-zinc-500">
            (
            {
              users.filter((user) =>
                onlineUsers.includes(user._id)
              ).length
            }{" "}
            online)
          </span>

        </div>

      </div>


      {/* USERS */}
      <div className="overflow-y-auto w-full py-3">

        {filteredUsers.map((user) => {

          const unreadCount =
            unreadMessages[user._id] || 0;

          const isOnline =
            onlineUsers.includes(user._id);

          return (
            <button
              key={user._id}
              onClick={() =>
                setSelectedUser(user)
              }
              className={`
                w-full p-3
                flex items-center gap-3
                hover:bg-base-300
                transition-colors
                ${
                  selectedUser?._id === user._id
                    ? "bg-base-300 ring-1 ring-base-300"
                    : ""
                }
              `}
            >

              {/* PROFILE IMAGE */}
              <div className="relative mx-auto lg:mx-0">

                <img
                  src={
                    user.profilePic ||
                    "/avatar.png"
                  }
                  alt={user.fullName}
                  className="
                    size-12
                    object-cover
                    rounded-full
                  "
                />

                {/* ONLINE DOT */}
                {isOnline &&
                  unreadCount === 0 && (
                    <span
                      className="
                        absolute
                        bottom-0
                        right-0
                        size-3
                        bg-green-500
                        rounded-full
                        ring-2
                        ring-zinc-900
                      "
                    />
                  )}

                {/* UNREAD COUNT */}
                {unreadCount > 0 && (
                  <span
                    className="
                      absolute
                      -top-1
                      -right-1
                      min-w-5
                      h-5
                      px-1
                      rounded-full
                      bg-primary
                      text-primary-content
                      text-xs
                      font-bold
                      flex
                      items-center
                      justify-center
                      ring-2
                      ring-base-100
                    "
                  >
                    {unreadCount > 99
                      ? "99+"
                      : unreadCount}
                  </span>
                )}

              </div>


              {/* USER INFORMATION */}
              <div
                className="
                  hidden
                  lg:block
                  text-left
                  min-w-0
                  flex-1
                "
              >

                <div className="font-medium truncate">
                  {user.fullName}
                </div>

                <div className="text-sm text-zinc-400">

                  {unreadCount > 0 ? (
                    <span className="text-primary font-medium">
                      {unreadCount} new{" "}
                      {unreadCount === 1
                        ? "message"
                        : "messages"}
                    </span>
                  ) : isOnline ? (
                    "Online"
                  ) : (
                    "Offline"
                  )}

                </div>

              </div>

            </button>
          );
        })}


        {/* NO USERS */}
        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">
            No online users
          </div>
        )}

      </div>

    </aside>
  );
};

export default Sidebar;