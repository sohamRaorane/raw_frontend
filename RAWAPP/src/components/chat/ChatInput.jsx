import React, { useState, useRef } from "react";
import useChat from "../../hooks/useChat";
import { getSocket } from "../../socket/socketClient";

export default function ChatInput() {
    const [text, setText] = useState("");
    const { activeConversation } = useChat();
    const typingTimeoutRef = useRef(null);

    const handleTyping = () => {
        const socket = getSocket();
        if (!socket || !activeConversation) return;

        socket.emit("typing", { conversationId: activeConversation.id });

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("stop_typing", { conversationId: activeConversation.id });
        }, 1500);
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim() || !activeConversation) return;

        try {
            const socket = getSocket();
            if (socket) {
                socket.emit("send_message", {
                    conversationId: activeConversation.id,
                    text: text.trim()
                });
            }
            setText("");
        } catch (err) {
            console.error("Message send error:", err);
        }
    };

    return (
        <div className="p-4 bg-black border-t border-[rgba(0,255,65,0.2)]">
            <form onSubmit={sendMessage} className="relative flex items-center">
                <span className="text-[#00FF41] font-mono mr-2 select-none">{'>'}</span>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value);
                        handleTyping();
                    }}
                    placeholder="Type command..."
                    className="flex-1 bg-transparent text-[#00FF41] font-mono focus:outline-none placeholder-[rgba(0,255,65,0.3)] caret-[#00FF41]"
                    autoFocus
                />
                <button
                    type="submit"
                    disabled={!text.trim()}
                    className="ml-2 text-[#00FF41] hover:text-white disabled:opacity-30 transition-colors font-mono text-sm uppercase"
                >
                    [SEND]
                </button>
            </form>
        </div>
    );
}
