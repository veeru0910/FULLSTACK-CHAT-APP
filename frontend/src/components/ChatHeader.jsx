import { X, LogOut } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";


const ChatHeader = () => {

  const { selectedUser, setSelectedUser } = useChatStore();

  const { logout } = useAuthStore();


  if(!selectedUser) return null;


  return (

    <div
      className="
      h-16
      flex
      items-center
      justify-between
      px-4
      border-b
      bg-base-100
      shrink-0
      z-20
      "
    >


      {/* USER INFO */}

      <div className="flex items-center gap-3">


        <div className="avatar">

          <div className="
          size-10
          rounded-full
          border
          ">

            <img

            src={
              selectedUser.profilePic ||
              "/avatar.png"
            }

            />

          </div>

        </div>




        <div>

          <h3 className="
          font-semibold
          text-sm
          sm:text-base
          ">

            {selectedUser.fullName}

          </h3>


          <p className="
          text-xs
          text-green-500
          ">

            Online

          </p>


        </div>


      </div>





      {/* ACTIONS */}

      <div className="flex items-center gap-2">


        <button

        onClick={logout}

        className="
        btn
        btn-circle
        btn-sm
        "

        >

          <LogOut size={18}/>

        </button>




        <button

        onClick={()=>setSelectedUser(null)}

        className="
        btn
        btn-circle
        btn-sm
        "

        >

          <X size={18}/>

        </button>



      </div>



    </div>

  );

};


export default ChatHeader;