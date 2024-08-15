/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react";
import { MediaProvider, } from "../context/MediaContext";
import BottomBar from "./BottomBar";
import VideoCard from "./VideoCard";
import peer from "../services/peer";
import { useSocket } from "../context/SocketProvider";
import { useParams } from "react-router-dom";
import PeerCard from "./PeerCard";
import JoinByLink from "./JoinByLink";
import Chat from "./Chat";

const Room = () => {
    const socket = useSocket();
    const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
    const [myStream, setMyStream] = useState<MediaStream | null>(null);
    const [remoteStreams, setRemoteStreams] = useState(new Map<string, MediaStream>());

    const userVideoRef = useRef<HTMLVideoElement>(null);
    const { roomId } = useParams<{ roomId: string }>();
    const [open, setOpen] = useState<boolean | false>(false);
    // Get the current user's name from storage
    const currentUser = localStorage.getItem("currentUser");
    const [remoteUsername, setRemoteUsername] = useState<string | null>(null);




    useEffect(() => {
        if (!socket?.id) {
            setOpen(true);
        }
    }, [socket?.id]);






    const handleUserJoined = useCallback(({ username, id }: any) => {

        console.log(`Email ${username} joined room`);
        setRemoteSocketId(id);
        setRemoteUsername(username); // Set the remote username

    }, []);

    const handleCallUser = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        const offer = await peer.getOffer();
        socket?.emit("user:call", { to: remoteSocketId, offer });
        setMyStream(stream);
    }, [remoteSocketId, socket]);


    useEffect(() => {
        handleCallUser()
    }, [handleCallUser])

    const handleIncommingCall = useCallback(
        async ({ from, offer }: any) => {
            setRemoteSocketId(from);
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true,
            });
            setMyStream(stream);
            // console.log(`Incoming Call`, from, offer);

            const ans = await peer.getAnswer(offer);
            socket?.emit("call:accepted", { to: from, ans });
        },
        [socket]
    );

    const sendStreams = useCallback(() => {
        if (!myStream) {
            // console.warn("myStream is null. Cannot send tracks.");
            return;
        }
        for (const track of myStream.getTracks()) {
            peer.peer.addTrack(track, myStream);
        }
    }, [myStream]);

    const startMyStream = useCallback(async () => {
        if (myStream) return; // If the stream is already started, do nothing.

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        setMyStream(stream);
    }, [myStream]);

    useEffect(() => {
        if (remoteSocketId) {
            startMyStream(); // Start my stream only if there is another user in the room.
        }
    }, [remoteSocketId, startMyStream]);

    const handleCallAccepted = useCallback(
        ({ ans }: any) => {
            peer.setLocalDescription(ans);
            // console.log("Call Accepted!");
            sendStreams();
        },
        [sendStreams]
    );

    const handleNegoNeeded = useCallback(async () => {
        const offer = await peer.getOffer();
        socket?.emit("peer:nego:needed", { offer, to: remoteSocketId });
    }, [remoteSocketId, socket]);

    useEffect(() => {
        peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
        return () => {
            peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
        };
    }, [handleNegoNeeded]);

    const handleNegoNeedIncomming = useCallback(
        async ({ from, offer }: any) => {
            const ans = await peer.getAnswer(offer);
            socket?.emit("peer:nego:done", { to: from, ans });
        },
        [socket]
    );

    const handleNegoNeedFinal = useCallback(async ({ ans }: any) => {
        await peer.setLocalDescription(ans);
    }, []);

    useEffect(() => {
        peer.peer.addEventListener("track", async (ev: { streams: any; }) => {
            const remoteStream = ev.streams;
            // console.log("GOT TRACKS!!");
            setRemoteStreams(remoteStream);
        });
    }, []);

    useEffect(() => {
        socket?.on("user:joined", handleUserJoined);
        socket?.on("incomming:call", handleIncommingCall);
        socket?.on("call:accepted", handleCallAccepted);
        socket?.on("peer:nego:needed", handleNegoNeedIncomming);
        socket?.on("peer:nego:final", handleNegoNeedFinal);

        return () => {
            socket?.off("user:joined", handleUserJoined);
            socket?.off("incomming:call", handleIncommingCall);
            socket?.off("call:accepted", handleCallAccepted);
            socket?.off("peer:nego:needed", handleNegoNeedIncomming);
            socket?.off("peer:nego:final", handleNegoNeedFinal);
        };
    }, [
        socket,
        handleUserJoined,
        handleIncommingCall,
        handleCallAccepted,
        handleNegoNeedIncomming,
        handleNegoNeedFinal,
    ]);


    return (
        <MediaProvider>
            <JoinByLink open={open} setOpen={setOpen} />
            <section className="w-screen h-screen overflow-y-hidden  lg:flex  bg-primary-upperground">
                <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>
                <div className="flex lg:flex-1 flex-col items-center  gap-10 lg:gap-2 py-2 justify-center ">
                    <div className="flex lg:self-start gap-4 lg:mx-6">
                        {Array.from(remoteStreams.values()).map((stream, index) => (
                            <PeerCard key={index} stream={stream} ref={userVideoRef} muted={true} autoPlay playsInline username={remoteUsername as string} />
                        ))}
                    </div>
                    <VideoCard ref={userVideoRef} stream={myStream} autoPlay playsInline username={currentUser as string} />
                    <BottomBar roomId={roomId as string} />
                </div>
                <div className="h-full hidden xl:flex lg:items-center">
                    <Chat roomId={roomId as string} />
                </div>
            </section>
        </MediaProvider>
    );
};

export default Room;
