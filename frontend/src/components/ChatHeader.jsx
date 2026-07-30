import { ArrowLeft } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {

  const { selectedUser, setSelectedUser } = useChatStore();


  if (!selectedUser) return null;


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
      "
    >


      {/* BACK BUTTON MOBILE */}

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

      <div
        className="
        avatar
        "
      >

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





      {/* USER NAME */}

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
          "
        >

          {selectedUser.fullName}

        </h3>


        <span
          className="
          text-xs
          text-green-500
          "
        >

          Online

        </span>


      </div>



    </div>

  );

};


export default ChatHeader;