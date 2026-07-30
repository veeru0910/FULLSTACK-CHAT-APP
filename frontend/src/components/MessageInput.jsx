import { useRef, useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Smile } from "lucide-react";
import toast from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";


const MessageInput = () => {

  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);


  const fileInputRef = useRef(null);

  // Emoji popup reference
  const emojiRef = useRef(null);


  const { sendMessage } = useChatStore();



  // CLOSE EMOJI WHEN CLICK OUTSIDE
  useEffect(() => {

    const handleOutsideClick = (event) => {

      if (
        emojiRef.current &&
        !emojiRef.current.contains(event.target)
      ) {

        setShowEmojiPicker(false);

      }

    };


    if (showEmojiPicker) {

      document.addEventListener(
        "mousedown",
        handleOutsideClick
      );

    }


    return () => {

      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

    };


  }, [showEmojiPicker]);






  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if(!file) return;


    if(!file.type.startsWith("image/")){

      toast.error("Please select an image file");
      return;

    }


    const reader = new FileReader();


    reader.onloadend = () => {

      setImagePreview(reader.result);

    };


    reader.readAsDataURL(file);

  };







  const removeImage = () => {

    setImagePreview(null);


    if(fileInputRef.current){

      fileInputRef.current.value="";

    }

  };







  const handleEmojiClick = (emojiData)=>{

    setText(prev => prev + emojiData.emoji);

  };







  const handleSendMessage = async(e)=>{

    e.preventDefault();


    if(!text.trim() && !imagePreview)
      return;



    try{

      await sendMessage({

        text:text.trim(),

        image:imagePreview,

      });



      setText("");

      setImagePreview(null);

      setShowEmojiPicker(false);



      if(fileInputRef.current){

        fileInputRef.current.value="";

      }



    }catch(error){

      console.log(error);

    }

  };







  return (

    <div className="
      w-full
      p-3
      bg-base-100
      relative
    ">



      {/* IMAGE PREVIEW */}

      {
        imagePreview && (

          <div className="mb-2">

            <div className="relative w-fit">


              <img

                src={imagePreview}

                className="
                  w-16
                  h-16
                  object-cover
                  rounded-lg
                "

              />



              <button

                type="button"

                onClick={removeImage}

                className="
                  absolute
                  -top-2
                  -right-2
                  bg-base-300
                  rounded-full
                  w-6
                  h-6
                  flex
                  items-center
                  justify-center
                "

              >

                <X size={14}/>

              </button>


            </div>

          </div>

        )
      }








      {/* EMOJI PICKER */}

      {
        showEmojiPicker && (

          <div

            ref={emojiRef}

            className="
              fixed
              bottom-[70px]
              left-1/2
              -translate-x-1/2
              z-[9999]
            "

          >


            <EmojiPicker

              onEmojiClick={handleEmojiClick}

              theme="auto"


              width={
                window.innerWidth < 420
                ? window.innerWidth - 20
                : 350
              }


              height={
                window.innerWidth < 420
                ? 320
                : 400
              }


              previewConfig={{
                showPreview:false
              }}


              searchDisabled={false}

            />


          </div>

        )
      }









      <form

        onSubmit={handleSendMessage}

        className="
          flex
          items-center
          gap-2
        "

      >



        <input

          type="text"

          placeholder="Type a message..."

          className="
            input
            input-bordered
            rounded-full
            w-full
            input-sm
            sm:input-md
          "

          value={text}

          onChange={(e)=>setText(e.target.value)}

        />








        {/* EMOJI BUTTON */}

        <button

          type="button"

          onClick={()=>setShowEmojiPicker(prev=>!prev)}

          className="
            btn
            btn-circle
            btn-sm
            text-yellow-500
          "

        >

          <Smile size={20}/>

        </button>









        {/* IMAGE INPUT */}

        <input

          type="file"

          accept="image/*"

          className="hidden"

          ref={fileInputRef}

          onChange={handleImageChange}

        />









        {/* IMAGE BUTTON */}

        <button

          type="button"

          onClick={()=>fileInputRef.current?.click()}

          className="
            btn
            btn-circle
            btn-sm
            text-zinc-400
          "

        >

          <Image size={20}/>

        </button>









        {/* SEND BUTTON */}

        <button

          type="submit"

          disabled={!text.trim() && !imagePreview}

          className="
            btn
            btn-circle
            btn-sm
          "

        >

          <Send size={20}/>

        </button>



      </form>



    </div>

  );

};


export default MessageInput;