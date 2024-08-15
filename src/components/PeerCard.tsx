/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useRef } from "react";

type PeerCardProps = {
    stream?: MediaStream | null;
    muted?: boolean;
    autoPlay?: boolean;
    playsInline?: boolean;
    username?: string
};

const PeerCard = React.forwardRef<HTMLVideoElement, PeerCardProps>(
    ({ stream, muted = false, autoPlay = true, playsInline = true, username }) => {
        const videoRef = useRef<HTMLVideoElement>(null);


        useEffect(() => {
            if (videoRef.current && stream) {
                videoRef.current.srcObject = stream;
            }
        }, [stream]);

        return (
            <div className="w-full h-full relative  rounded-xl ">
                <video
                    ref={videoRef}
                    muted={muted}
                    autoPlay={autoPlay}
                    playsInline={playsInline}
                    className="w-full h-[94.67px] rounded-xl"
                />
                <h1 className="w-min px-2 left-1 absolute bottom-2 text-[12px] text-center text-black bg-[#686666] rounded-full">

                    {stream && username}
                </h1>
            </div>
        );
    }
);

export default PeerCard;
