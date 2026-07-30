import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";


const HomePage = () => {

  const { selectedUser } = useChatStore();


  return (

    <div
      className="
      h-screen
      w-screen
      bg-base-200
      overflow-hidden
      pt-16
      "
    >


      <div
        className="
        h-full
        w-full
        flex
        "
      >


        {/* SIDEBAR */}

        <div
          className={`
          h-full
          ${
            selectedUser
            ? "hidden sm:block"
            : "block"
          }
          `}
        >

          <Sidebar />

        </div>





        {/* CHAT SECTION */}

        <div
          className="
          flex-1
          h-full
          overflow-hidden
          "
        >

          {
            selectedUser
            ?
            <ChatContainer />
            :
            <NoChatSelected />
          }

        </div>



      </div>



    </div>

  );

};


export default HomePage;