import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";

import { useAuthStore } from "./store/useAuthStore";
import { useChatStore } from "./store/useChatStore";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";


const App = () => {


  const {
    authUser,
    checkAuth,
    isCheckingAuth,
    onlineUsers,
  } = useAuthStore();



  const { theme } = useThemeStore();



  // selected chat user
  const { selectedUser } = useChatStore();




  useEffect(() => {

    checkAuth();

  }, [checkAuth]);





  console.log(onlineUsers);

  console.log(authUser);





  if (isCheckingAuth && !authUser) {

    return (

      <div className="
      flex
      items-center
      justify-center
      h-screen
      ">

        <Loader className="size-10 animate-spin"/>

      </div>

    );

  }





  return (


    <div

    data-theme={theme}

    className="
    min-h-screen
    flex
    flex-col
    "

    >



      {/* 
          Hide navbar while chatting
          like WhatsApp mobile
      */}

      {
        !selectedUser && <Navbar />
      }





      {/* PAGE CONTENT */}

      <div className="flex-1">


        <Routes>



          <Route

          path="/"

          element={

            authUser

            ?

            <HomePage/>

            :

            <Navigate to="/login"/>

          }

          />





          <Route

          path="/signup"

          element={

            !authUser

            ?

            <SignUpPage/>

            :

            <Navigate to="/"/>

          }

          />






          <Route

          path="/login"

          element={

            !authUser

            ?

            <LoginPage/>

            :

            <Navigate to="/"/>

          }

          />






          <Route

          path="/settings"

          element={<SettingsPage/>}

          />







          <Route

          path="/profile"

          element={

            authUser

            ?

            <ProfilePage/>

            :

            <Navigate to="/login"/>

          }

          />







          <Route

          path="/admin"

          element={

            authUser

            ?

            <AdminPage/>

            :

            <Navigate to="/login"/>

          }

          />




        </Routes>


      </div>







      {/* Hide footer while chatting */}

      {
        !selectedUser && (

          <footer className="
          text-center
          py-2
          text-xs
          text-base-content/50
          ">

            Developed by Veerendra

          </footer>

        )
      }






      <Toaster />


    </div>


  );

};


export default App;