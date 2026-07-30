import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

import {
  LogOut,
  MessageSquare,
  Settings,
  User,
  Bell,
} from "lucide-react";


const Navbar = () => {

  const navigate = useNavigate();

  const {
    logout,
    authUser,
    adminNotificationCount,
  } = useAuthStore();


  const { selectedUser } = useChatStore();



  const isAdmin =
    authUser?.email?.toLowerCase() ===
    "veerendralolla5868@gmail.com";



  return (

    <header

    className={`
    bg-base-100
    border-b
    border-base-300
    fixed
    top-0
    w-full
    z-40
    backdrop-blur-lg
    bg-base-100/80

    ${selectedUser ? "hidden sm:block" : "block"}

    `}

    >


      <div
      className="
      container
      mx-auto
      px-3
      sm:px-4
      h-16
      ">


        <div
        className="
        flex
        items-center
        justify-between
        h-full
        ">



          {/* LOGO */}

          <Link

          to="/"

          className="
          flex
          items-center
          gap-2
          "

          >

            <div
            className="
            size-9
            rounded-lg
            bg-primary/10
            flex
            items-center
            justify-center
            ">

              <MessageSquare
              className="
              text-primary
              "
              />

            </div>


            <h1
            className="
            font-bold
            text-lg
            "
            >
              Chatter
            </h1>


          </Link>






          {/* RIGHT SIDE */}

          <div
          className="
          flex
          items-center
          gap-2
          "
          >




          {/* ADMIN */}

          {
          authUser && isAdmin &&

          <button

          onClick={()=>navigate("/admin")}

          className="
          btn
          btn-sm
          btn-ghost
          "

          >

            <div className="relative">

              <Bell size={20}/>


              {
              adminNotificationCount > 0 &&

              <span
              className="
              absolute
              -top-2
              -right-2
              badge
              badge-error
              badge-xs
              text-white
              "
              >

              {
              adminNotificationCount > 99
              ?
              "99+"
              :
              adminNotificationCount
              }

              </span>

              }


            </div>


          </button>

          }







          {/* SETTINGS */}

          <Link

          to="/settings"

          className="
          btn
          btn-sm
          gap-2
          "

          >

            <Settings size={18}/>

            <span className="hidden sm:block">
            Settings
            </span>


          </Link>







          {/* PROFILE */}

          {
          authUser &&

          <Link

          to="/profile"

          className="
          btn
          btn-sm
          gap-2
          "

          >

            <User size={18}/>

            <span className="hidden sm:block">
            Profile
            </span>


          </Link>

          }








          {/* LOGOUT */}

          {
          authUser &&

          <button

          onClick={logout}

          className="
          btn
          btn-sm
          gap-2
          "

          >

            <LogOut size={18}/>

            <span className="hidden sm:block">
            Logout
            </span>


          </button>

          }



          </div>



        </div>


      </div>


    </header>


  );

};


export default Navbar;