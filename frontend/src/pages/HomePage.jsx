import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-base-200 overflow-hidden">

      <div className="
        flex
        items-center
        justify-center
        h-full
        px-0
        sm:px-4
      ">

        <div
          className="
          bg-base-100
          w-full
          h-full
          sm:h-[calc(100vh-2rem)]
          sm:max-w-6xl
          sm:rounded-lg
          shadow-xl
          overflow-hidden
          "
        >

          <div className="flex h-full">

            <Sidebar />

            {!selectedUser ? (
              <NoChatSelected />
            ) : (
              <ChatContainer />
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default HomePage;