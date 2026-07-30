import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Smile } from "lucide-react";
import toast from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";


const MessageInput = () => {

  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const fileInputRef = useRef(null);

  const { sendMessage } = useChatStore();



  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if(!file) return;


    if(!file.type.startsWith("image/")){

      toast.error("Please select an image file");
      return;

    }


    const reader = new FileReader();


    reader.onloadend = ()=>{

      setImagePreview(reader.result);

    };


    reader.readAsDataURL(file);

  };





  const removeImage = ()=>{

    setImagePreview(null);


    if(fileInputRef.current){

      fileInputRef.current.value="";

    }

  };





  const handleEmojiClick = (emojiData)=>{

    setText((prev)=>prev + emojiData.emoji);

  };





  const handleSendMessage = async(e)=>{

    e.preventDefault();


    if(!text.trim() && !imagePreview) return;


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
    p-3
    w-full
    relative
    ">



      {/* IMAGE PREVIEW */}

      {
        imagePreview &&

        <div className="
        mb-2
        flex
        items-center
        gap-2
        ">


          <div className="relative">


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
            w-5
            h-5
            flex
            items-center
            justify-center
            "

            >

            <X size={12}/>

            </button>



          </div>


        </div>

      }







      <form

      onSubmit={handleSendMessage}

      className="
      flex
      items-center
      gap-2
      "

      >




      <div className="
      flex-1
      flex
      items-center
      gap-2
      relative
      ">



      {/* TEXT BOX */}

      <input

      type="text"

      className="
      input
      input-bordered
      rounded-lg
      input-sm
      sm:input-md
      w-full
      "

      placeholder="Type a message..."

      value={text}

      onChange={(e)=>setText(e.target.value)}

      />






      {/* EMOJI BUTTON */}

      <button

      type="button"

      className="
      btn
      btn-circle
      btn-sm
      text-yellow-500
      "

      onClick={()=>setShowEmojiPicker(prev=>!prev)}

      >

      <Smile size={20}/>

      </button>







      {/* RESPONSIVE EMOJI PICKER */}

      {
        showEmojiPicker &&

        <div

        className="
        absolute
        bottom-14
        right-0
        z-[999]
        shadow-xl
        "

        >


        <EmojiPicker


        onEmojiClick={handleEmojiClick}


        theme="auto"


        width={
          window.innerWidth < 400
          ? 300
          : 350
        }


        height={
          window.innerWidth < 400
          ? 330
          : 400
        }


        previewConfig={{
          showPreview:false
        }}


        searchDisabled={false}


        />


        </div>

      }







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

      className={`
      btn
      btn-circle
      btn-sm
      ${
        imagePreview
        ?
        "text-emerald-500"
        :
        "text-zinc-400"
      }
      `}


      onClick={()=>fileInputRef.current?.click()}

      >

      <Image size={20}/>

      </button>





      </div>







      {/* SEND BUTTON */}

      <button

      type="submit"

      className="
      btn
      btn-sm
      btn-circle
      "

      disabled={!text.trim() && !imagePreview}

      >

      <Send size={20}/>

      </button>




      </form>



    </div>

  );

};


export default MessageInput;