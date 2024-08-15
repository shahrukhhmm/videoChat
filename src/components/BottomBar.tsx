import React from "react";
import { Files, Mic, MicOff, Phone, Video, VideoOff } from "lucide-react";
// import ChatMobile from "./ChatMobile";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { useMediaContext } from "../context/MediaContext";
import ChatMobile from "./ChatMobile";
import AskAi from "./AskAi";

const BottomBar: React.FC<{ roomId: string }> = ({ roomId }) => {
  const {
    isAudioEnabled,
    isVideoEnabled,
    toggleAudio,
    toggleVideo,
    cancelCall,
  } = useMediaContext();

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId);
    toast(`Room ID ${roomId} copied to clipboard!`);
  };

  return (
    <div className="flex items-center gap-x-3 relative">
      <div
        className="lg:absolute  lg:right-96 flex items-center text-white gap-4 bg-[#1A2131] p-4 rounded-xl cursor-pointer"
        onClick={handleCopy}
      >
        <span className="xl:block hidden">{roomId}</span>
        <div className="xl:block hidden">|</div> <Files />
      </div>
      <ChatMobile />
      <Button onClick={toggleAudio}>
        {isAudioEnabled ? <Mic /> : <MicOff />}
      </Button>
      <Button
        //@ts-ignore
        onClick={() => cancelCall(roomId)}
        className="bg-red-600 p-4 size-50 hover:bg-red-600/50 rounded-full"
      >
        <Phone />
      </Button>
      <Button onClick={toggleVideo}>
        {isVideoEnabled ? <Video /> : <VideoOff />}
      </Button>

      <AskAi roomId={roomId} />
    </div>
  );
};

export default BottomBar;
