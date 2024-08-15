/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useMemo, useContext } from "react";
import { io, Socket } from "socket.io-client";
import { API_URL } from "../lib/constant";

interface SocketContextValue {
    socket: Socket | null;
}

const SocketContext = createContext<SocketContextValue>({ socket: null });

export const useSocket = () => {
    const { socket } = useContext(SocketContext);
    return socket
}

export const SocketProvider: React.FC<React.PropsWithChildren<object>> = (props) => {
    const socket = useMemo(() => io(API_URL), []);

    return (
        <SocketContext.Provider value={{ socket }}>
            {props.children}
        </SocketContext.Provider>
    );
};