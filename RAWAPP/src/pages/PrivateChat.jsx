import React from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import ChatWindow from "../components/chat/ChatWindow";
import useChat from "../hooks/useChat";

export default function PrivateChat() {
    const { activeConversation } = useChat();

    return (
        <DashboardLayout>
            {activeConversation ? (
                <ChatWindow />
            ) : (
                <div className="h-full flex items-center justify-center flex-col">
                    <div className="text-[#00FF41] font-mono text-xl animate-pulse">
                        WAITING FOR SIGNAL...
                    </div>
                    <p className="text-gray-500 font-mono text-sm mt-2">
                        SELECT A FREQUENCY TO BEGIN TRANSMISSION
                    </p>
                </div>
            )}
        </DashboardLayout>
    );
}
