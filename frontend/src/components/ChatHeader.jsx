import { ArrowLeft } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const ChatHeader = () => {

  const { selectedUser, setSelectedUser } = useChatStore();

  const { onlineUsers } = useAuthStore();


  if (!selectedUser) return null;


  const isOnline = onlineUsers.includes(selectedUser._id);



  return (

    <div
      className="
      h-16
      flex
      items-center
      gap-3
      px-3
      border-b
      bg-base-100
      sticky
      top-0
      z-30
      "
    >



      {/* MOBILE BACK */}

      <button

        onClick={() => setSelectedUser(null)}

        className="
        sm:hidden
        btn
        btn-ghost
        btn-circle
        "

      >

        <ArrowLeft size={22}/>

      </button>





      {/* PROFILE IMAGE */}

      <div className="avatar">

        <div
          className="
          w-10
          h-10
          rounded-full
          "
        >

          <img

            src={
              selectedUser.profilePic ||
              "/avatar.png"
            }

            alt="profile"

          />

        </div>

      </div>







      {/* NAME + STATUS */}

      <div
        className="
        flex
        flex-col
        overflow-hidden
        "
      >

        <h3
          className="
          font-semibold
          text-sm
          sm:text-base
          truncate
          max-w-[180px]
          "
        >

          {selectedUser.fullName}

        </h3>



        <span
          className={`
          text-xs
          ${
            isOnline
            ?
            "text-green-500"
            :
            "text-zinc-400"
          }
          `}
        >

          {
            isOnline
            ?
            "Online"
            :
            "Offline"
          }

        </span>


      </div>


    </div>

  );

};


export default ChatHeader;