import React, { useState, useMemo } from "react";
import useChat from "../../hooks/useChat";
import useAuth from "../../hooks/useAuth";
import groupApi from "../../api/groupApi";
import UserSearchModal from "../common/UserSearchModal";

export default function ChatHeader() {
    const { activeConversation, loadConversations } = useChat();
    const { user } = useAuth();
    const [showMenu, setShowMenu] = useState(false);
    const [showAddMember, setShowAddMember] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState("");

    const chatName = useMemo(() => {
        if (!activeConversation) return "";
        if (activeConversation.isGroup) return activeConversation.name;
        const other = activeConversation.participants?.find((p) => p.user?.id !== user?.id);
        return other?.user?.name || other?.user?.email || "Unknown";
    }, [activeConversation, user]);

    const handleRename = async () => {
        if (!newName.trim()) return;
        try {
            await groupApi.renameGroup(activeConversation.id, newName);
            loadConversations();
            setIsRenaming(false);
        } catch (err) {
            console.error("Rename failed", err);
        }
    };

    const handleAddMember = async (selectedUser) => {
        try {
            await groupApi.addMember(activeConversation.id, selectedUser.firebaseUid);
            alert(`${selectedUser.name || "User"} added to group!`);
            setShowAddMember(false);
        } catch (err) {
            console.error("Add member failed", err);
            alert("Failed to add member");
        }
    };

    if (!activeConversation) return null;

    return (
        <div className="px-6 py-3 bg-[rgba(5,5,5,0.95)] border-b border-[rgba(0,255,65,0.2)] flex items-center justify-between shadow-[0_0_15px_rgba(0,255,65,0.1)] z-10 backdrop-blur-sm">
            <div className="flex items-center flex-1">
                <div className="w-10 h-10 rounded-full bg-black border border-[#00FF41] flex items-center justify-center text-[#00FF41] font-bold shadow-[0_0_10px_rgba(0,255,65,0.2)] mr-4">
                    {chatName?.[0]?.toUpperCase() || "?"}
                </div>

                <div>
                    {isRenaming ? (
                        <div className="flex items-center gap-2">
                            <input
                                autoFocus
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="bg-black border border-[#00FF41] text-[#00FF41] px-2 py-1 text-sm font-mono focus:outline-none shadow-[0_0_5px_rgba(0,255,65,0.3)]"
                                placeholder="NEW_DESIGNATION..."
                            />
                            <button onClick={handleRename} className="text-[#00FF41] hover:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            </button>
                            <button onClick={() => setIsRenaming(false)} className="text-red-500 hover:text-red-400">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <h2 className="text-lg font-bold text-white font-mono tracking-wide flex items-center gap-2">
                            {chatName}
                            {activeConversation.isGroup && (
                                <span className="text-[10px] bg-[rgba(0,255,65,0.1)] text-[#00FF41] px-1.5 py-0.5 rounded border border-[rgba(0,255,65,0.2)]">
                                    SECURE_CHANNEL
                                </span>
                            )}
                        </h2>
                    )}
                    <p className="text-xs text-gray-500 font-mono flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-[#00FF41] rounded-full animate-pulse"></span>
                        ENCRYPTED CONNECTION ESTABLISHED
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 relative">
                {activeConversation.isGroup && (
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 text-[#00FF41] hover:bg-[rgba(0,255,65,0.1)] rounded transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                        </svg>
                    </button>
                )}

                {/* Dropdown Menu */}
                {showMenu && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-black border border-[#00FF41] shadow-[0_0_20px_rgba(0,255,65,0.2)] rounded-sm z-50 py-1">
                        <button
                            onClick={() => {
                                setIsRenaming(true);
                                setNewName(activeConversation.name);
                                setShowMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[rgba(0,255,65,0.1)] hover:text-[#00FF41] font-mono"
                        >
                            RENAME_CHANNEL
                        </button>
                        <button
                            onClick={() => {
                                setShowAddMember(true);
                                setShowMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[rgba(0,255,65,0.1)] hover:text-[#00FF41] font-mono"
                        >
                            ADD_OPERATIVE
                        </button>
                    </div>
                )}
            </div>

            {showAddMember && (
                <UserSearchModal
                    isOpen={showAddMember}
                    onClose={() => setShowAddMember(false)}
                    onSelectUser={handleAddMember}
                />
            )}
        </div>
    );
}
