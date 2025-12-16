import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useChat from "../../hooks/useChat";
import useAuth from "../../hooks/useAuth";
import { sidebarConversationUpdated } from "../../features/chat/chatSlice";
import { logout } from "../../features/auth/authSlice";
import ConversationItem from "./ConversationItem";
import CreateGroupModal from "./CreateGroupModal";
import UserSearchModal from "../common/UserSearchModal";
import userApi from "../../api/userApi";

export default function Sidebar({ onCloseMobile }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { conversations, loadConversations, selectConversation } = useChat();
  const { user } = useAuth();
  const { socket } = useSelector((state) => state.socket);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isDMModalOpen, setIsDMModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [globalSearchResults, setGlobalSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Debounced search effect
  useEffect(() => {
    if (!searchTerm.trim()) {
      setGlobalSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await userApi.searchUsers(searchTerm);
        // Filter out current user
        const results = res.data.filter(u => u.firebaseUid !== user?.firebaseUid);
        setGlobalSearchResults(results);
      } catch (err) {
        console.error("Global search failed", err);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, user]);

  useEffect(() => {
    if (!socket) return;

    const handleSidebarUpdate = (payload) => {
      const exists = conversations.find(c => c.id === payload.conversationId);
      if (!exists) {
        loadConversations();
      } else {
        dispatch(sidebarConversationUpdated({ ...payload, currentUserId: user?.id }));
      }
    };

    socket.on("sidebar_update", handleSidebarUpdate);

    return () => {
      socket.off("sidebar_update", handleSidebarUpdate);
    };
  }, [socket, dispatch, user, conversations, loadConversations]);

  const handleStartDM = async (targetUser) => {
    if (!targetUser || !targetUser.firebaseUid) return;
    if (targetUser.firebaseUid === user?.firebaseUid) return;

    try {
      const res = await axiosClient.post("/conversations/dm", {
        targetUserId: targetUser.firebaseUid
      });
      await loadConversations();
      setIsDMModalOpen(false);
      if (onCloseMobile) onCloseMobile(); // Close sidebar on mobile
      selectConversation(res.data);
      navigate(`/chat/${res.data.id}`);
    } catch (err) {
      console.error("Start DM failed", err);
    }
  };

  const handleConversationClick = (conv) => {
    if (onCloseMobile) onCloseMobile();
    selectConversation(conv);
    navigate(`/chat/${conv.id}`);
  };

  const filteredConversations = conversations.filter(c => {
    let displayName = c.name;
    if (!c.isGroup) {
      const other = c.participants?.find((p) => p.user?.id !== user?.id);
      displayName = other?.user?.name || other?.user?.email || "Unknown User";
    }
    return displayName?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className={`flex flex-col h-full transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-96'} bg-black/80 backdrop-blur-md border-r border-[rgba(0,255,65,0.2)]`}>

      {/* Header */}
      <div className="p-4 border-b border-[rgba(0,255,65,0.2)] flex justify-between items-center">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[rgba(0,255,65,0.1)] border border-[#00FF41] rounded flex items-center justify-center text-[#00FF41] font-bold text-sm shadow-[0_0_10px_rgba(0,255,65,0.3)]">
              RC
            </div>
            <h2 className="text-lg font-bold text-white tracking-wider font-mono">COMMS</h2>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-[#00FF41] hover:text-white transition-colors p-1"
        >
          {isCollapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Actions */}
      <div className={`p-4 flex ${isCollapsed ? 'flex-col gap-4 items-center' : 'gap-2'}`}>
        <button
          onClick={() => setIsDMModalOpen(true)}
          title="New Chat"
          className={`flex items-center justify-center rounded border border-[#00FF41] bg-[rgba(0,255,65,0.05)] hover:bg-[rgba(0,255,65,0.15)] text-[#00FF41] transition-all duration-300 shadow-[0_0_5px_rgba(0,255,65,0.2)] hover:shadow-[0_0_15px_rgba(0,255,65,0.4)] ${isCollapsed ? 'w-10 h-10' : 'flex-1 py-2'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          {!isCollapsed && <span className="ml-2 text-xs font-mono font-bold tracking-wider uppercase">New Chat</span>}
        </button>

        <button
          onClick={() => setIsGroupModalOpen(true)}
          title="Create Group"
          className={`flex items-center justify-center rounded border border-[#00FF41] bg-[rgba(0,255,65,0.05)] hover:bg-[rgba(0,255,65,0.15)] text-[#00FF41] transition-all duration-300 shadow-[0_0_5px_rgba(0,255,65,0.2)] hover:shadow-[0_0_15px_rgba(0,255,65,0.4)] ${isCollapsed ? 'w-10 h-10' : 'w-10 py-2'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 5.472m0 0a9.09 9.09 0 00-3.246 1.598 3 3 0 004.664 2.648 14.053 14.053 0 005.64 1.125c1.42 0 2.806-.13 4.125-.38m-9.873-3.328a5.972 5.972 0 01-.94-3.197m0 0A5.995 5.995 0 0112 12.75a5.995 5.995 0 015.058 5.472M12 12.75a5.995 5.995 0 00-5.058-5.472m0 0A9.094 9.094 0 003.246 8.78 3 3 0 007.91 11.428M12 12.75a5.995 5.995 0 015.058-5.472m0 0a9.094 9.094 0 013.741 1.598 3 3 0 01-4.664 2.648" />
          </svg>
        </button>

        <button
          onClick={() => navigate("/profile")}
          className={`flex items-center justify-center rounded border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white transition-all duration-300 ${isCollapsed ? 'w-10 h-10' : 'w-10 py-2'}`}
          title="Profile"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </button>
      </div>

      {/* Search Bar */}
      {!isCollapsed && (
        <div className="px-4 pb-4">
          <input
            type="text"
            placeholder="SEARCH_FREQ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 bg-black border border-[rgba(0,255,65,0.2)] rounded text-sm text-[#00FF41] placeholder-[rgba(0,255,65,0.3)] focus:outline-none focus:border-[#00FF41] font-mono transition-colors"
          />
        </div>
      )}

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Existing Conversations */}
        {filteredConversations.length > 0 && (
          <>
            {searchTerm && <div className="px-4 py-2 text-xs text-gray-500 font-mono">ACTIVE_CHANNELS</div>}
            {filteredConversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isCollapsed={isCollapsed}
                onClick={() => handleConversationClick(conv)}
              />
            ))}
          </>
        )}

        {/* Global Search Results */}
        {searchTerm && (
          <>
            <div className="px-4 py-2 text-xs text-gray-500 font-mono mt-2">GLOBAL_NETWORK</div>
            {isSearching ? (
              <div className="px-4 py-2 text-xs text-[#00FF41] animate-pulse font-mono">SCANNING...</div>
            ) : (
              globalSearchResults.length === 0 && filteredConversations.length === 0 ? (
                <div className="px-4 py-2 text-xs text-gray-600 font-mono">NO_SIGNALS_FOUND</div>
              ) : (
                globalSearchResults.map(u => {
                  // Check if we already have a conversation with this user to avoid duplicates in UI if logic fails
                  // But typically we want to show them here so clicking opens that chat
                  return (
                    <div
                      key={u.id}
                      onClick={() => handleStartDM(u)}
                      className="px-4 py-3 flex items-center cursor-pointer hover:bg-[rgba(0,255,65,0.05)] border-l-2 border-l-transparent hover:border-l-[#00FF41] transition-all"
                    >
                      <div className="w-10 h-10 rounded-full bg-[rgba(0,255,65,0.1)] border border-gray-700 flex items-center justify-center text-[#00FF41] font-bold text-sm">
                        {u.name?.[0] || u.email[0]}
                      </div>
                      <div className="ml-3 overflow-hidden">
                        <p className="text-sm font-medium text-gray-300 truncate font-mono">{u.name || "Unknown"}</p>
                        <p className="text-xs text-gray-600 truncate font-mono">{u.email}</p>
                      </div>
                    </div>
                  );
                })
              )
            )}
          </>
        )}
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => dispatch(logout())}
          className={`flex items-center justify-center w-full rounded border border-red-900/50 text-red-500 hover:bg-red-900/20 hover:text-red-400 transition-all duration-300 ${isCollapsed ? 'h-10' : 'py-2'}`}
          title="Logout"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          {!isCollapsed && <span className="ml-2 text-xs font-mono font-bold tracking-wider uppercase">LOGOUT</span>}
        </button>
      </div>

      {/* Modals */}
      {isGroupModalOpen && (
        <CreateGroupModal onClose={() => setIsGroupModalOpen(false)} />
      )}
      {isDMModalOpen && (
        <UserSearchModal
          isOpen={isDMModalOpen}
          onClose={() => setIsDMModalOpen(false)}
          onUserSelect={handleStartDM}
          excludeUserIds={user ? [user.firebaseUid] : []}
        />
      )}
    </div>
  );
}
