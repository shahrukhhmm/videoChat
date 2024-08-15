import React, { useEffect, useRef } from "react";
import { useMediaContext } from "../context/MediaContext";

type VideoCardProps = {
  stream?: MediaStream | null;
  autoPlay?: boolean;
  playsInline?: boolean;
  username?: string;
};

const VideoCard = React.forwardRef<HTMLVideoElement, VideoCardProps>(
  ({ stream, autoPlay = true, playsInline = true, username }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
      }
    }, [stream]);

    const { isAudioEnabled, isVideoEnabled } = useMediaContext();



    return (
      <>
        <div className={`relative w-[350px] lg:w-[600px]  h-[400px] lg:h-[500px]  rounded-xl ${!isVideoEnabled ? "hidden" : ""}`}>

          <video
            ref={videoRef}
            muted={!isAudioEnabled}
            autoPlay={autoPlay}
            playsInline={playsInline}
            className={`w-full h-full rounded-xl  border border-secondary-upperground`}
          />

        </div>
        {
          !isVideoEnabled &&
          <div className="flex items-center justify-center  bg-gray-800 rounded-xl w-[300px] lg:w-[600px] h-[500px]">
            <div className="relative inline-flex items-center justify-center w-32 h-32 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
              <span className="text-2xl text-gray-600 dark:text-gray-300 uppercase">{username && username[0]}</span>
            </div>
          </div>

        }
      </>
    );
  }
);

export default VideoCard;
