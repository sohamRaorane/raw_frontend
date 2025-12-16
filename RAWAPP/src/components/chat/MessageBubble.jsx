import React from "react";
import useAuth from "../../hooks/useAuth";

export default function MessageBubble({ msg }) {
    const { user } = useAuth();
    const isMe = msg.senderId === user?.id;

    return (
        <div
            className={`flex w-full mb-4 ${isMe ? "justify-end" : "justify-start"}`}
        >
            <div
                className={`px-4 py-3 max-w-[75%] sm:max-w-[60%] relative group font-mono text-sm shadow-[0_0_10px_rgba(0,0,0,0.5)]
        ${isMe
                        ? "bg-[#00FF41] text-black rounded-sm border border-[#00FF41]" // High contrast for user
                        : "bg-[rgba(30,30,30,0.8)] text-white rounded-sm border border-gray-700 backdrop-blur-sm" // Dark glass for others
                    }`}
            >
                {/* Sender Name for Group Chats (if not me) */}
                {!isMe && msg.sender?.name && (
                    <div className="text-[10px] text-[#00FF41] mb-1 opacity-70 uppercase tracking-wider">
                        {msg.sender.name}
                    </div>
                )}

                {msg.text && (
                    <p className="leading-relaxed whitespace-pre-wrap">
                        {msg.text}
                    </p>
                )}

                {/* Attachments */}
                {msg.attachments?.map((file) => (
                    <div key={file.id || file.url} className="mt-2">
                        <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 p-2 border ${isMe ? 'border-black/20 hover:bg-black/10' : 'border-white/20 hover:bg-white/10'} transition rounded-sm`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                            </svg>
                            <span className="text-xs underline decoration-dotted">DATA_PACKET</span>
                        </a>
                    </div>
                ))}

                <div className={`text-[9px] flex gap-1 justify-end mt-1 select-none opacity-60 font-mono ${isMe ? 'text-black' : 'text-gray-400'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        </div>
    );
}
