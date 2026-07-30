
import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();

  const messageEndRef = useRef(null);

  // Image opened in full screen
  const [selectedImage, setSelectedImage] = useState(null);

  // =========================
  // GET MESSAGES
  // =========================
  useEffect(() => {
    if (!selectedUser?._id) return;

    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => {
      unsubscribeFromMessages();
    };
  }, [
    selectedUser?._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  // =========================
  // AUTO SCROLL
  // =========================
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // =========================
  // ESCAPE TO CLOSE IMAGE
  // =========================
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedImage(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  // =========================
  // LOADING
  // =========================
  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">

      <ChatHeader />

      {/* =========================
          MESSAGES
      ========================= */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {messages.map((message) => (

          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id
                ? "chat-end"
                : "chat-start"
            }`}
          >

            {/* PROFILE PICTURE */}
            <div className="chat-image avatar">

              <div className="size-10 rounded-full border">

                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic ||
                        "/avatar.png"
                      : selectedUser.profilePic ||
                        "/avatar.png"
                  }
                  alt="profile pic"
                />

              </div>

            </div>


            {/* TIME */}
            <div className="chat-header mb-1">

              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(
                  message.createdAt
                )}
              </time>

            </div>


            {/* MESSAGE BUBBLE */}
            <div className="chat-bubble flex flex-col">

              {/* IMAGE MESSAGE */}
              {message.image && (

                <img
                  src={message.image}
                  alt="Attachment"
                  onClick={() =>
                    setSelectedImage(
                      message.image
                    )
                  }
                  className="
                    max-w-[200px]
                    sm:max-w-[250px]
                    rounded-md
                    mb-2
                    cursor-pointer
                    hover:opacity-90
                    transition
                  "
                />

              )}


              {/* TEXT MESSAGE */}
              {message.text && (
                <p>{message.text}</p>
              )}

            </div>

          </div>

        ))}


        {/* SCROLL TARGET */}
        <div ref={messageEndRef} />

      </div>


      {/* MESSAGE INPUT */}
      <MessageInput />


      {/* =========================
          FULL SCREEN IMAGE VIEWER
      ========================= */}
      {selectedImage && (

        <div
          className="
            fixed
            inset-0
            z-[9999]
            bg-black
            flex
            items-center
            justify-center
            w-screen
            h-screen
          "
          onClick={() =>
            setSelectedImage(null)
          }
        >

          {/* CLOSE BUTTON */}
          <button
            onClick={() =>
              setSelectedImage(null)
            }
            className="
              absolute
              top-4
              right-4
              z-10
              text-white
              text-3xl
              w-12
              h-12
              flex
              items-center
              justify-center
              rounded-full
              bg-black/50
              hover:bg-white/20
            "
          >
            ✕
          </button>


          {/* FULL SCREEN IMAGE */}
          <img
            src={selectedImage}
            alt="Full size attachment"
            className="
              max-w-full
              max-h-full
              w-auto
              h-auto
              object-contain
              select-none
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          />

        </div>

      )}

    </div>
  );
};

export default ChatContainer;
