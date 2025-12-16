import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function ConversationItem({ conversation, onClick, isCollapsed }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const chatName = useMemo(() => {
    if (conversation.isGroup) {
      return conversation.name || "Unnamed Group";
    }
    const other = conversation.participants?.find((p) => p.user?.id !== user?.id);
    return {
      name: other?.user?.name || other?.user?.email || "Unknown User",
      isOnline: other?.user?.isOnline
    };
  }, [conversation, user]);

  const displayName = conversation.isGroup ? (conversation.name || "Unnamed Group") : chatName.name;

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const lastMsg = conversation.messages?.[0];
  const isActive = location.pathname === `/chat/${conversation.id}`;

  const handleClick = () => {
    if (onClick) onClick();
    navigate(`/chat/${conversation.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer transition-all duration-200 group border-b border-[rgba(0,255,65,0.05)] hover:bg-[rgba(0,255,65,0.05)]
        ${isActive ? 'bg-[rgba(0,255,65,0.1)] border-l-2 border-l-[#00FF41]' : 'border-l-2 border-l-transparent'}
        ${isCollapsed ? 'px-2 py-3 flex justify-center' : 'px-4 py-3 flex items-center justify-between'}
      `}
    >
      <div className={`flex items-center overflow-hidden ${isCollapsed ? 'justify-center w-full' : 'flex-1'}`}>
        {/* Avatar Circle */}
        <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full font-bold relative transition-all duration-300
          ${isActive ? 'shadow-[0_0_10px_rgba(0,255,65,0.4)] border border-[#00FF41] text-[#00FF41] bg-black' : 'bg-gray-900 text-gray-400 border border-gray-700 group-hover:border-[#00FF41] group-hover:text-[#00FF41]'}
        `}>
          {displayName?.[0]?.toUpperCase() || "C"}

          {/* Online Dot */}
          {!conversation.isGroup && chatName.isOnline && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00FF41] rounded-full shadow-[0_0_5px_#00FF41]"></span>
          )}
        </div>

        {/* Text Content - Hidden if collapsed */}
        {!isCollapsed && (
          <div className="ml-3 flex-1 min-w-0">
            <div className="flex justify-between items-baseline">
              <h3 className={`text-sm font-medium truncate font-mono ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                {displayName}
              </h3>
              {lastMsg && (
                <span className="text-[10px] text-gray-500 font-mono">
                  {formatTime(lastMsg.createdAt)}
                </span>
              )}
            </div>
            <div className="flex justify-between items-center mt-0.5">
              <p className={`text-xs truncate font-mono flex-1 ${isActive ? 'text-[#00FF41]' : 'text-gray-500 group-hover:text-gray-400'}`}>
                {lastMsg ? (
                  <>
                    {lastMsg.senderId === user?.id && <span className="mr-1">You:</span>}
                    {lastMsg.text}
                  </>
                ) : (
                  <span className="italic opacity-50">No signal...</span>
                )}
              </p>
              {conversation.unreadCount > 0 && (
                <span className="ml-2 bg-[#00FF41] text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-[0_0_5px_rgba(0,255,65,0.5)]">
                  {conversation.unreadCount}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
