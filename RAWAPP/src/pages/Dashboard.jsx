import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import useChat from "../hooks/useChat";
import useAuth from "../hooks/useAuth";
import UserSearchModal from "../components/common/UserSearchModal";
import axiosClient from "../api/axiosClient";

export default function Dashboard() {
    const navigate = useNavigate();
    const { conversations, loadConversations, selectConversation } = useChat();
    const { user } = useAuth();
    const [showHologram, setShowHologram] = useState(true);
    const [isDMModalOpen, setIsDMModalOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowHologram(false), 3500);
        return () => clearTimeout(timer);
    }, []);

    const handleStartDM = async (targetUser) => {
        if (!targetUser || !targetUser.firebaseUid) {
            console.error("Invalid target user for DM");
            return;
        }
        if (targetUser.firebaseUid === user?.firebaseUid) {
            console.warn("Cannot start DM with self");
            return;
        }

        try {
            const res = await axiosClient.post("/conversations/dm", {
                targetUserId: targetUser.firebaseUid
            });
            await loadConversations();
            setIsDMModalOpen(false);
            selectConversation(res.data);
            navigate(`/chat/${res.data.id}`);
        } catch (err) {
            console.error("Start DM failed", err);
        }
    };

    // Mock Stats
    const stats = {
        messagesSent: 1248,
        dataTransferred: "4.2 GB",
        uptime: "99.9%"
    };

    return (
        <DashboardLayout>
            <div className="p-6 h-full overflow-y-auto custom-scrollbar">

                {/* Header */}
                <div className="mb-8 border-b border-[rgba(0,255,65,0.2)] pb-4 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-white font-mono tracking-tight">
                            MISSION CONTROL <span className="text-[#00FF41] animate-pulse">_</span>
                        </h1>
                        <p className="text-gray-500 font-mono text-sm mt-1">
                            SYSTEM STATUS: <span className="text-[#00FF41]">OPTIMAL</span>
                        </p>
                    </div>
                    <button
                        onClick={() => setIsDMModalOpen(true)}
                        className="hidden md:flex items-center gap-2 bg-[#00FF41]/10 border border-[#00FF41] text-[#00FF41] px-4 py-2 rounded hover:bg-[#00FF41]/20 transition-all shadow-[0_0_10px_rgba(0,255,65,0.2)]"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <span className="font-mono font-bold tracking-wider">INITIATE_COMMS</span>
                    </button>
                </div>

                {/* Mobile New Chat Button (Visible only on small screens) */}
                <button
                    onClick={() => setIsDMModalOpen(true)}
                    className="md:hidden w-full mb-6 flex items-center justify-center gap-2 bg-[#00FF41]/10 border border-[#00FF41] text-[#00FF41] px-4 py-3 rounded hover:bg-[#00FF41]/20 transition-all shadow-[0_0_10px_rgba(0,255,65,0.2)]"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <span className="font-mono font-bold tracking-wider">INITIATE_COMMS</span>
                </button>

                {/* Grid Layout */}
                <div className="dashboard-grid">

                    {/* Widget 1: Recent Comms */}
                    <div className="widget-card">
                        <h3 className="text-[#00FF41] font-mono text-sm mb-4 border-b border-[rgba(0,255,65,0.2)] pb-2">
                            RECENT_COMMS
                        </h3>
                        <div className="space-y-3">
                            {conversations.slice(0, 5).map(conv => (
                                <div key={conv.id} onClick={() => navigate(`/chat/${conv.id}`)} className="flex justify-between items-center text-sm font-mono text-gray-400 hover:text-white transition-colors cursor-pointer">
                                    <span>{conv.name || "Unknown Channel"}</span>
                                    <span className="text-[10px] bg-[rgba(0,255,65,0.1)] text-[#00FF41] px-1 rounded">
                                        {conv.unreadCount > 0 ? `${conv.unreadCount} NEW` : (conv.isGroup ? 'GRP' : 'P2P')}
                                    </span>
                                </div>
                            ))}
                            {conversations.length === 0 && (
                                <div className="text-gray-600 text-xs font-mono italic">NO_SIGNALS_DETECTED</div>
                            )}
                        </div>
                    </div>

                    {/* Widget 2: Network Status (Radar) */}
                    <div className="widget-card flex flex-col items-center justify-center">
                        <h3 className="text-[#00FF41] font-mono text-sm mb-4 w-full border-b border-[rgba(0,255,65,0.2)] pb-2">
                            NETWORK_RADAR
                        </h3>
                        <div className="radar-circle">
                            <div className="radar-sweep"></div>
                            {/* Mock dots for friends */}
                            <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-[#00FF41] rounded-full shadow-[0_0_5px_#00FF41]"></div>
                            <div className="absolute bottom-1/3 right-1/3 w-1.5 h-1.5 bg-[#00FF41] rounded-full shadow-[0_0_5px_#00FF41]"></div>
                        </div>
                        <p className="mt-4 text-xs text-gray-500 font-mono">SCANNING FOR SIGNALS...</p>
                    </div>

                    {/* Widget 3: Stats */}
                    <div className="widget-card">
                        <h3 className="text-[#00FF41] font-mono text-sm mb-4 border-b border-[rgba(0,255,65,0.2)] pb-2">
                            OPERATIONAL_METRICS
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <span className="text-gray-500 text-xs font-mono">MSGS_SENT</span>
                                <span className="text-white font-mono text-xl">{stats.messagesSent}</span>
                            </div>
                            <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                                <div className="bg-[#00FF41] h-full w-[70%] shadow-[0_0_10px_#00FF41]"></div>
                            </div>

                            <div className="flex justify-between items-end">
                                <span className="text-gray-500 text-xs font-mono">DATA_TX</span>
                                <span className="text-white font-mono text-xl">{stats.dataTransferred}</span>
                            </div>
                            <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                                <div className="bg-[#00FF41] h-full w-[45%] shadow-[0_0_10px_#00FF41]"></div>
                            </div>

                            <div className="flex justify-between items-end">
                                <span className="text-gray-500 text-xs font-mono">UPTIME</span>
                                <span className="text-white font-mono text-xl">{stats.uptime}</span>
                            </div>
                            <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                                <div className="bg-[#00FF41] h-full w-[99%] shadow-[0_0_10px_#00FF41]"></div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Holographic Welcome */}
                {
                    showHologram && (
                        <div className="hologram-container">
                            <div className="hologram-avatar">
                                <span className="text-2xl font-bold text-[#00FF41]">{user?.name?.[0] || "A"}</span>
                            </div>
                            <div className="hologram-beam"></div>
                            <div className="bg-black/80 border border-[#00FF41] p-2 rounded text-[#00FF41] text-xs font-mono mt-2 shadow-[0_0_10px_rgba(0,255,65,0.3)]">
                                Welcome back, Agent {user?.name || "Unknown"}.
                            </div>
                        </div>
                    )
                }

            </div>

            {/* Modals */}
            {isDMModalOpen && (
                <UserSearchModal
                    isOpen={isDMModalOpen}
                    onClose={() => setIsDMModalOpen(false)}
                    onUserSelect={handleStartDM}
                    excludeUserIds={user ? [user.firebaseUid] : []}
                />
            )}
        </DashboardLayout>
    );
}
