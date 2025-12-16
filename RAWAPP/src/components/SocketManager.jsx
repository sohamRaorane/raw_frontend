import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setConnectionStatus } from "../features/socket/socketSlice";
import { addMessage, updateUserPresence, sidebarConversationUpdated, clearUnread } from "../features/chat/chatSlice";
import useAuth from "../hooks/useAuth";
import { connectSocket, disconnectSocketClient, getSocket } from "../socket/socketClient";

export default function SocketManager() {
    const dispatch = useDispatch();
    const { user, isLoggedIn } = useAuth();
    const { activeConversation } = useSelector((state) => state.chat);
    // const { socket } = useSelector((state) => state.socket); // Removed

    // 1. Connect/Disconnect Socket
    useEffect(() => {
        if (isLoggedIn) {
            const newSocket = connectSocket();

            const onConnect = () => {
                console.log("Socket connected:", newSocket.id);
                dispatch(setConnectionStatus("connected"));
                if (user?.firebaseUid) {
                    console.log("Emitting socket auth for user (onConnect):", user.firebaseUid);
                    newSocket.emit("auth", { firebaseUid: user.firebaseUid });
                }
            };

            const onNewMessage = (msg) => {
                console.log("Received new message:", msg);
                dispatch(addMessage(msg));
            };

            const onSidebarUpdate = (data) => {
                console.log("Sidebar update:", data);
                dispatch(sidebarConversationUpdated(data));
            };

            const onMessageDelivered = ({ messageId, userId }) => {
                console.log("Delivered ✔", messageId, userId);
            };

            const onMessageSeen = ({ conversationId, userId }) => {
                console.log("Seen ✔✔ in conversation", conversationId, userId);
            };

            const onNotificationsCleared = ({ conversationId }) => {
                dispatch(clearUnread(conversationId));
            };

            const onUserOnline = ({ userId }) => {
                dispatch(updateUserPresence({ userId, online: true }));
            };

            const onUserOffline = ({ userId }) => {
                dispatch(updateUserPresence({ userId, online: false }));
            };

            const onConnectError = (err) => {
                console.error("Socket connection error:", err);
                dispatch(setConnectionStatus("reconnecting"));
            };

            const onReconnect = () => {
                dispatch(setConnectionStatus("connected"));
            };

            newSocket.on("connect", onConnect);
            newSocket.on("new_message", onNewMessage);
            newSocket.on("sidebar_update", onSidebarUpdate);
            newSocket.on("message_delivered", onMessageDelivered);
            newSocket.on("message_seen", onMessageSeen);
            newSocket.on("notifications_cleared", onNotificationsCleared);
            newSocket.on("user_online", onUserOnline);
            newSocket.on("user_offline", onUserOffline);
            newSocket.on("connect_error", onConnectError);
            newSocket.on("reconnect", onReconnect);

            // Initial auth if already connected
            if (newSocket.connected && user?.firebaseUid) {
                newSocket.emit("auth", { firebaseUid: user.firebaseUid });
            }

            return () => {
                newSocket.off("connect", onConnect);
                newSocket.off("new_message", onNewMessage);
                newSocket.off("sidebar_update", onSidebarUpdate);
                newSocket.off("message_delivered", onMessageDelivered);
                newSocket.off("message_seen", onMessageSeen);
                newSocket.off("notifications_cleared", onNotificationsCleared);
                newSocket.off("user_online", onUserOnline);
                newSocket.off("user_offline", onUserOffline);
                newSocket.off("connect_error", onConnectError);
                newSocket.off("reconnect", onReconnect);

                disconnectSocketClient();
                dispatch(setConnectionStatus("disconnected"));
            };
        }
    }, [isLoggedIn, dispatch, user?.firebaseUid]);

    // 2. Handle Active Conversation Room
    useEffect(() => {
        const socket = getSocket();
        if (socket && activeConversation) {
            console.log("Joining conversation room:", activeConversation.id);
            socket.emit("join_conversation", activeConversation.id);

            return () => {
                console.log("Leaving conversation room:", activeConversation.id);
                socket.emit("leave_conversation", activeConversation.id);
            };
        }
    }, [activeConversation]); // socket is stable

    return null;
}
