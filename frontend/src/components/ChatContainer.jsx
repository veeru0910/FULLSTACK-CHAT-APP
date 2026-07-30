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

  const [selectedImage, setSelectedImage] = useState(null);



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
    unsubscribeFromMessages
  ]);





  useEffect(() => {

    messageEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });


  }, [messages]);






  if (isMessagesLoading) {

    return (

      <div
        className="
        flex-1
        flex
        flex-col
        h-full
        overflow-hidden
        "
      >

        <div className="shrink-0">
          <ChatHeader />
        </div>


        <div className="flex-1 overflow-hidden">

          <MessageSkeleton />

        </div>


        <div className="shrink-0">
          <MessageInput />
        </div>


      </div>

    );

  }







  return (

    <div
      className="
      flex-1
      flex
      flex-col
      h-full
      overflow-hidden
      relative
      "
    >



      {/* CHAT HEADER */}

      <div
        className="
        shrink-0
        z-20
        "
      >

        <ChatHeader />

      </div>






      {/* MESSAGES AREA */}

      <div
        className="
        flex-1
        overflow-y-auto
        p-3
        sm:p-4
        space-y-3
        pb-24
        "
      >



        {
          messages.map((message) => (


            <div

              key={message._id}

              className={`chat ${
                message.senderId === authUser._id
                ? "chat-end"
                : "chat-start"
              }`}

            >





              {/* PROFILE IMAGE */}

              <div className="chat-image avatar">

                <div
                  className="
                  size-8
                  sm:size-10
                  rounded-full
                  border
                  "
                >

                  <img

                    src={
                      message.senderId === authUser._id
                      ?
                      authUser.profilePic || "/avatar.png"
                      :
                      selectedUser.profilePic || "/avatar.png"
                    }

                    alt="profile"

                  />

                </div>

              </div>







              {/* TIME */}

              <div className="chat-header">

                <time className="text-xs opacity-50">

                  {formatMessageTime(message.createdAt)}

                </time>

              </div>








              {/* MESSAGE */}

              <div
                className="
                chat-bubble
                flex
                flex-col
                break-words
                max-w-[80vw]
                sm:max-w-[60%]
                "
              >



                {
                  message.image && (

                    <img

                      src={message.image}

                      onClick={() =>
                        setSelectedImage(message.image)
                      }

                      className="
                      rounded-md
                      mb-2
                      cursor-pointer
                      max-w-[220px]
                      "

                      alt="attachment"

                    />

                  )
                }







                {
                  message.text && (

                    <p>

                      {message.text}

                    </p>

                  )
                }




              </div>






            </div>


          ))
        }




        <div ref={messageEndRef} />

      </div>








      {/* MESSAGE INPUT */}

      <div

        className="
        shrink-0
        border-t
        bg-base-100
        z-40
        "

      >

        <MessageInput />

      </div>









      {/* FULL IMAGE VIEW */}

      {
        selectedImage && (


          <div

            className="
            fixed
            inset-0
            bg-black
            z-[9999]
            flex
            items-center
            justify-center
            "

            onClick={() => setSelectedImage(null)}

          >


            <img

              src={selectedImage}

              className="
              max-w-full
              max-h-full
              object-contain
              "

              alt="full"

            />


          </div>


        )
      }




    </div>

  );

};


export default ChatContainer;