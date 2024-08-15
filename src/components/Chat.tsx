/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { Mic, SendHorizontal } from "lucide-react";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Recorder from "recorder-js";
import { useSocket } from "../context/SocketProvider";
import { API_URL } from "../lib/constant";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import FileUpload from "./FileUpload";

interface Props {
  roomId: string;
  fileURL?: string; // Add this property

}
interface Message {
  msg: string;
  sender: string;
  fileURL?: string; // Add this property
}
const Chat = ({ roomId }: Props) => {
  // Use socket context
  const socket: any = useSocket();

  // Get the current user's name from session
  const currentUser = localStorage.getItem("currentUser");

  const [msg, setMsg] = useState<Message[]>([]);
  const [audioMsgs, setAudioMsgs] = useState<AudioMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [translatedMessages, setTranslatedMessages] = useState<Record<number, string>>({});
  const [translatedAudioMessages, setTranslatedAudioMessages] = useState<Record<number, string>>({});

  // Refs for various elements and audio context
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recorder = useRef<any>(null);
  const audioContext = useRef<AudioContext | null>(null);

  // Effect to handle receiving text and audio messages via socket
  useEffect(() => {
    socket?.on("FE-receive-message", ({ msg, sender, fileURL }: Message) => {

      setMsg((msgs) => [...msgs, { sender, msg, fileURL }]);
    });

    socket?.on("FE-receive-audio", ({ audioUrl, sender }: AudioMessage) => {
      setAudioMsgs((audioMsgs) => [...audioMsgs, { sender, audioUrl }]);
    });

    // Cleanup listeners on unmount
    return () => {
      socket?.off("FE-receive-message");
      socket?.off("FE-receive-audio");
    };
  }, [socket, roomId]);

  // Effect to fetch messages and audio messages when roomId or msg changes
  // useEffect(() => {
  //   const fetchMessages = async () => {
  //     try {
  //       const response = await axios.get(`${API_URL}/api/messages/${roomId}`);
  //       const data = response.data;
  //       console.log(data)
  //       setMsg(data.messages);
  //       setAudioMsgs(data.audioMessages);
  //     } catch (error) {
  //       console.error("Error fetching messages:", error);
  //     }
  //   };

  //   fetchMessages();
  // }, [roomId, msg]);

  // Effect to scroll to the bottom of the chat when new messages or audio messages are added
  useEffect(() => {
    scrollToBottom();
  }, [msg, audioMsgs]);

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Function to send a message via socket
  const sendMessage = (
    e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    let msg = "";

    if ("key" in e && e.key === "Enter") {
      // Handling keyboard event
      msg = (e.currentTarget as HTMLInputElement).value;
    } else if ("type" in e && e.type === "click") {
      // Handling mouse event
      msg = inputRef.current?.value || "";
    }

    if (msg) {
      socket.emit("BE-send-message", { roomId, msg, sender: currentUser });
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  // Function to toggle recording state
  const toggleRecording = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Function to start audio recording
  const startRecording = async () => {
    audioContext.current = new ((window.AudioContext ||
      (window as any).webkitAudioContext) as typeof AudioContext)();
    recorder.current = new Recorder(audioContext.current);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recorder.current.init(stream);
    recorder.current.start();
    setIsRecording(true);
  };

  // Function to stop audio recording and send the audio file via socket
  const stopRecording = async () => {
    try {
      // eslint-disable-next-line no-unsafe-optional-chaining
      const { blob } = await recorder?.current?.stop();
      const audioFile = new File([blob], "recording.wav", {
        type: "audio/wav",
      });

      const arrayBuffer = await audioFile.arrayBuffer();

      socket.emit("BE-send-audio", {
        roomId,
        audioBlob: arrayBuffer,
        sender: currentUser,
      });

      setIsRecording(false);
    } catch (error) {
      console.error("An error occurred during stop recording:", error);
      setIsRecording(false);
    }
  };

  // Function to translate a text message
  const handleTranslate = async (msg: string, index: number) => {
    const language = localStorage.getItem("currentUserLanguage")?.split('-')[0] || "Mongolian"; // Default to Mongolian if not set

    try {
      const response = await axios.post(`${API_URL}/api/translate`, {
        language: language,
        content: msg,
      });

      if (response.status === 200) {
        setTranslatedMessages((prev) => ({
          ...prev,
          [index]: response.data.translatedText,
        }));
      } else {
        console.error("Translation error:", response.data.error);
        toast("Failed to translate the message.");
      }
    } catch (error) {
      console.error("Error during translation:", error);
      toast("An error occurred during translation.");
    }
  };

  // Function to translate an audio message
  const handleTranslateAudio = async (audioUrl: string, index: number) => {
    const language = localStorage.getItem("currentUserLanguage")?.split('-')[0] || "Mongolian"; // Default to Mongolian if not set

    try {
      const response = await axios.post(`${API_URL}/api/translate-audio`, {
        language: language,
        audioUrl: audioUrl,
      });

      if (response.status === 200) {
        setTranslatedAudioMessages((prev) => ({
          ...prev,
          [index]: response.data.translatedText,
        }));
      } else {
        console.error("Translation error:", response.data.error);
        toast("Failed to translate the message.");
      }
    } catch (error) {
      console.error("Error during translation:", error);
      toast("An error occurred during translation.");
    }
  };



  return (
    <div className="text-white p-3 lg:p-5  bg-[#1A2131] lg:w-[354px] rounded-xl h-auto md:h-[600px] relative    m-5 xl:m-10 overflow-hidden">
      <img src="/assets/monaai.png" alt="logo" className="w-[112px] h-[20px] " />
      {/* <h1 className="text-2xl lg:text-3xl">MONA AI</h1> */}
      <div className=" h-[30rem] overflow-y-scroll w-full  scrollbar-hide">
        <div>
          <>
            {msg &&
              msg.map(({ sender, msg, fileURL, timestamp }: any, index: number) => {
                if (sender !== currentUser) {
                  return (
                    <div className="flex items-start gap-2.5 my-7 " key={index}>
                      <div className="flex flex-col w-[250px] lg:w-[300px] text-white  leading-1.5 p-[2px]">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <span className="text-sm font-bold ">
                            {sender}
                          </span>
                          <span className="text-sm font-light text-[10px]">
                            {moment(timestamp).format("h:mm A")}
                          </span>
                        </div>
                        <p className="text-sm font-light py-[6px] text-[16px] ">
                          {msg}
                          {fileURL && (
                            <a href={fileURL} download target="_blank">
                              <button className="text-white">
                                Download
                              </button>
                            </a>
                          )}
                        </p>
                        <button className="flex text-white text-[10px] items-center gap-2" onClick={() => handleTranslate(msg, index)}>
                          <img src="/assets/translate.png" alt="logo" className="size-3 cursor-pointer" />
                          {translatedMessages[index] || ""}
                        </button>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div className="flex items-start gap-2.5 my-5 " key={index}>
                      <div className="flex flex-col w-[250px] lg:w-[300px] text-white  leading-1.5 p-[2px]">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <span className="text-sm font-semibold ">
                            {sender}
                          </span>
                          <span className="text-sm font-light text-[10px]">
                            {moment(timestamp).format("h:mm A")}
                          </span>
                        </div>
                        <p className="text-sm font-light py-[6px] text-[16px] ">
                          {msg}
                          {fileURL && (
                            <a href={fileURL} download target="_blank">
                              <button className="download-button">
                                Download
                              </button>
                            </a>
                          )}
                        </p>
                        <button className="flex text-white text-[10px] items-center gap-2" onClick={() => handleTranslate(msg, index)}>
                          <img src="/assets/translate.png" alt="logo" className="size-3 cursor-pointer" />
                          {translatedMessages[index] || ""}
                        </button>
                      </div>
                    </div>
                  );
                }
              })}
            {audioMsgs.map(
              ({ sender, audioUrl, timestamp }: any, index: number) => {
                if (sender !== currentUser) {
                  return (
                    <div className="flex items-start gap-2.5 my-5 " key={index}>
                      <div className="flex flex-col w-[250px] lg:w-[300px] text-white  leading-1.5 p-[2px]">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <span className="text-sm font-semibold ">
                            {sender}
                          </span>
                          <span className="text-sm font-light text-[10px]">
                            {moment(timestamp).format("h:mm A")}
                          </span>
                        </div>
                        <p className="text-sm font-light py-[6px] text-[16px] ">
                          <audio
                            controls
                            src={audioUrl}
                            className=""
                            id="audio"
                          ></audio>
                        </p>
                        <button className="flex text-white text-[10px] items-center gap-2" onClick={() => handleTranslateAudio(audioUrl, index)}>
                          <img src="/assets/translate.png" alt="logo" className="size-3 cursor-pointer" />
                          {translatedAudioMessages[index] || ""}
                        </button>
                      </div>
                    </div>

                  );
                } else {
                  return (
                    <div className="flex items-start gap-2.5 my-5 " key={index}>
                      <div className="flex flex-col w-[250px] lg:w-[300px] text-white  leading-1.5 p-[2px]">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <span className="text-sm font-semibold ">
                            {sender}
                          </span>
                          <span className="text-sm font-light text-[10px]">
                            {moment(timestamp).format("h:mm A")}
                          </span>
                        </div>
                        <p className="text-sm font-light py-[6px] text-[16px] ">
                          <audio
                            controls
                            src={audioUrl}
                            className=""
                            id="audio"
                          ></audio>
                        </p>
                        <button className="flex text-white text-[10px] items-center gap-2" onClick={() => handleTranslateAudio(audioUrl, index)}>
                          <img src="/assets/translate.png" alt="logo" className="size-3 cursor-pointer" />
                          {translatedAudioMessages[index] || ""}
                        </button>
                      </div>
                    </div>
                  );
                }
              }
            )}
          </>
        </div>
      </div>
      <div className="flex gap-2 absolute bottom-4 items-center">
        <div className="flex border-2 border-secondary-upperground bg-transparent rounded-xl w-44 lg:w-64">
          <Input
            type="text"
            name="text"
            className="text-[#9D9FA5] bg-transparent border-none outline-none"
            ref={inputRef}
            onKeyDown={sendMessage}
            placeholder="Enter your message"
          />
          <Button
            onMouseDown={toggleRecording}
            className="bg-transparent hover:bg-green-400"
          >
            <Mic width={15} color="#9D9FA5" />
          </Button>
          <FileUpload />
        </div>
        <button
          onClick={sendMessage}
          className="bg-secondary-upperground hover:bg-secondary-upperground/50 w-[46px] flex items-center justify-center h-[40px] rounded-xl"

        >
          <SendHorizontal />
        </button>
      </div>

    </div>
  );
};

export default Chat;
