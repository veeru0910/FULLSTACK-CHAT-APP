import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
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

  const isAdmin =
    authUser?.email?.toLowerCase() ===
    "veerendralolla5868@gmail.com";

  const handleNotificationClick = () => {
    navigate("/admin");
  };

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40
      backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">

        <div className="flex items-center justify-between h-full">

          {/* LOGO */}
          <div className="flex items-center gap-8">

            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>

              <h1 className="text-lg font-bold">
                Chatter
              </h1>
            </Link>

          </div>


          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2">

            {/* ADMIN NOTIFICATION */}
            {authUser && isAdmin && (
              <button
                onClick={handleNotificationClick}
                className="btn btn-sm btn-ghost relative"
                title="Account requests"
              >

                <Bell className="w-5 h-5" />

                {/* NOTIFICATION BADGE */}
                {adminNotificationCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1
                    badge badge-error badge-sm
                    text-white font-bold"
                  >
                    {adminNotificationCount > 99
                      ? "99+"
                      : adminNotificationCount}
                  </span>
                )}

                <span className="hidden sm:inline">
                  Requests
                </span>

              </button>
            )}


            {/* SETTINGS */}
            <Link
              to="/settings"
              className="btn btn-sm gap-2 transition-colors"
            >
              <Settings className="w-4 h-4" />

              <span className="hidden sm:inline">
                Settings
              </span>
            </Link>


            {/* PROFILE + LOGOUT */}
            {authUser && (
              <>

                <Link
                  to="/profile"
                  className="btn btn-sm gap-2"
                >
                  <User className="size-5" />

                  <span className="hidden sm:inline">
                    Profile
                  </span>
                </Link>


                <button
                  className="flex gap-2 items-center"
                  onClick={logout}
                >
                  <LogOut className="size-5" />

                  <span className="hidden sm:inline">
                    Logout
                  </span>
                </button>

              </>
            )}

          </div>

        </div>

      </div>
    </header>
  );
};

export default Navbar;