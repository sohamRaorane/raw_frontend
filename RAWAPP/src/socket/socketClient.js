import { io } from "socket.io-client";

let socket = null;

export const connectSocket = () => {
    if (socket) return socket;

    const socketUrl = import.meta.env.VITE_SOCKET_URL || (typeof window !== "undefined" ? window.location.origin : undefined);

    socket = io(socketUrl, {
        withCredentials: true,
        transports: ["websocket"],
        auth: { token: localStorage.getItem("chatToken") },
    });

    return socket;
};

export const getSocket = () => socket;

export const disconnectSocketClient = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
