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


  const { selectedUser } = useChatStore();



  useEffect(() => {

    checkAuth();

  }, [checkAuth]);



  console.log(onlineUsers);
  console.log(authUser);




  if (isCheckingAuth && !authUser) {

    return (

      <div
        className="
        flex
        items-center
        justify-center
        h-screen
        "
      >

        <Loader className="size-10 animate-spin" />

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
      pb-8
      "

    >



      {/* NAVBAR */}

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
                <HomePage />
                :
                <Navigate to="/login" />
            }
          />



          <Route
            path="/signup"
            element={
              !authUser
                ?
                <SignUpPage />
                :
                <Navigate to="/" />
            }
          />



          <Route
            path="/login"
            element={
              !authUser
                ?
                <LoginPage />
                :
                <Navigate to="/" />
            }
          />



          <Route
            path="/settings"
            element={<SettingsPage />}
          />



          <Route
            path="/profile"
            element={
              authUser
                ?
                <ProfilePage />
                :
                <Navigate to="/login" />
            }
          />



          <Route
            path="/admin"
            element={
              authUser
                ?
                <AdminPage />
                :
                <Navigate to="/login" />
            }
          />



        </Routes>


      </div>








      {/* DEVELOPER CREDIT */}

      <footer
        className="
        fixed
        bottom-0
        left-0
        w-full
        text-center
        py-2
        text-xs
        font-bold
        text-primary
        bg-base-100/90
        backdrop-blur
        border-t
        border-base-300
        z-50
        "
      >

        🚀 Developed by Veerendra

      </footer>






      <Toaster />


    </div>

  );

};


export default App;