/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from "react";
import { useSocket } from "./SocketProvider";

interface MediaContextProps {
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  toggleAudio: () => void;
  toggleVideo: () => void;
  cancelCall: () => void;
}

const MediaContext = createContext<MediaContextProps | undefined>(undefined);

export const useMediaContext = () => {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error("useMediaContext must be used within a MediaProvider");
  }
  return context;
};

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAudioEnabled, setAudioEnabled] = useState(true);
  const [isVideoEnabled, setVideoEnabled] = useState(true);
  const socket: any = useSocket();

  const toggleAudio = useCallback(() => {
    setAudioEnabled((prev) => !prev);
  }, []);

  const toggleVideo = useCallback(() => {
    setVideoEnabled((prev) => !prev);
  }, []);

  const cancelCall = useCallback((to: string) => {
    socket.emit("call:cancel", { to });
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentUserLanguage");
    setAudioEnabled(false);
    setVideoEnabled(false);
    window.location.replace("/");
  }, []);

  return (
    <MediaContext.Provider
      value={{
        isAudioEnabled,
        isVideoEnabled,
        toggleAudio,
        toggleVideo,
        //@ts-ignore
        cancelCall,
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};
