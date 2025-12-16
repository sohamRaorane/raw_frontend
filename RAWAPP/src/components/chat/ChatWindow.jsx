import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMessage, messageSeen } from "../../features/chat/chatSlice";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import useChat from "../../hooks/useChat";
import { getSocket } from "../../socket/socketClient";

export default function ChatWindow() {
    const { messages, activeConversation } = useChat();
    const { connectionStatus } = useSelector((state) => state.socket);
    const dispatch = useDispatch();
    const bottomRef = useRef();
    const [typingUsers, setTypingUsers] = useState([]);

    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        const onTyping = ({ conversationId, senderUid }) => {
            if (activeConversation?.id === conversationId) {
                setTypingUsers((prev) => [...new Set([...prev, senderUid])]);
            }
        };

        const onStopTyping = ({ conversationId, senderUid }) => {
            if (activeConversation?.id === conversationId) {
                setTypingUsers((prev) => prev.filter(uid => uid !== senderUid));
            }
        };

        const onNewMessage = (message) => {
            if (activeConversation?.id === message.conversationId) {
                dispatch(addMessage(message));
                socket.emit("open-chat", message.conversationId);
            }
        };

        const onMessageSeen = ({ conversationId, userId }) => {
            if (activeConversation?.id === conversationId) {
                dispatch(messageSeen({ conversationId, userId }));
            }
        };

        socket.on("typing", onTyping);
        socket.on("stop_typing", onStopTyping);
        socket.on("new_message", onNewMessage);
        socket.on("message_seen", onMessageSeen);

        return () => {
            socket.off("typing", onTyping);
            socket.off("stop_typing", onStopTyping);
            socket.off("new_message", onNewMessage);
            socket.off("message_seen", onMessageSeen);
        };
    }, [activeConversation, connectionStatus, dispatch]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, typingUsers]);

    useEffect(() => {
        const socket = getSocket();
        if (socket && activeConversation?.id) {
            socket.emit("open-chat", activeConversation.id);
        }
    }, [activeConversation, connectionStatus]);

    return (
        <div className="flex flex-col h-full relative overflow-hidden bg-black">

            {/* Animated Grid Background */}
            <div className="absolute inset-0 chat-container opacity-20 pointer-events-none z-0"></div>

            {/* Doodles Background */}
            <div className="absolute inset-0 chat-doodles pointer-events-none z-0"></div>

            <ChatHeader />

            {connectionStatus === "reconnecting" && (
                <div className="bg-red-900/50 text-red-400 text-center py-1 text-xs font-mono border-b border-red-500/30">
                    ⚠ CONNECTION LOST. RETRYING...
                </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10 custom-scrollbar">
                {messages.map((msg) => (
                    <MessageBubble key={msg.id} msg={msg} />
                ))}

                {/* Typing Indicator */}
                {typingUsers.length > 0 && (
                    <div className="text-xs text-[#00FF41] ml-2 font-mono animate-pulse flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#00FF41] rounded-full"></span>
                        INCOMING TRANSMISSION...
                    </div>
                )}

                <div ref={bottomRef}></div>
            </div>

            <ChatInput />
        </div>
    );
}
