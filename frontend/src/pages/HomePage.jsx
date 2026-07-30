import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {

  const { selectedUser } = useChatStore();


  return (

    <div className="h-screen bg-base-200">


      <div className="
        flex 
        items-center 
        justify-center
        px-0
        sm:px-4
      ">


        <div className="
          bg-base-100 
          w-full 
          h-screen
          sm:h-[calc(100vh-2rem)]
          sm:max-w-6xl
          sm:rounded-lg
          shadow-xl
        ">


          <div className="
            flex 
            h-full 
            overflow-hidden
            sm:rounded-lg
          ">



            {/* Hide sidebar on mobile when chatting */}

            <div
              className={`
                ${
                  selectedUser
                  ? "hidden sm:block"
                  : "block"
                }
              `}
            >

              <Sidebar />

            </div>





            {/* Chat Area */}

            <div
              className={`
                flex-1
                ${
                  selectedUser
                  ? "block"
                  : "hidden sm:block"
                }
              `}
            >

              {
                !selectedUser
                ?
                <NoChatSelected />
                :
                <ChatContainer />
              }

            </div>



          </div>


        </div>


      </div>


    </div>

  );

};


export default HomePage;