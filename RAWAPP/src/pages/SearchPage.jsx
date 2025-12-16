import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import userApi from "../api/userApi";
import useAuth from "../hooks/useAuth";
import useChat from "../hooks/useChat";
import axiosClient from "../api/axiosClient";

export default function SearchPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { loadConversations, selectConversation } = useChat();
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            loadUsers();
        }, 500);
        return () => clearTimeout(timeout);
    }, [query]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const res = await userApi.searchUsers(query);
            setUsers(res.data);
        } catch (err) {
            console.error("Search failed", err);
        } finally {
            setLoading(false);
        }
    };

    const handleStartDM = async (targetUser) => {
        if (!targetUser || !targetUser.firebaseUid) return;
        if (targetUser.firebaseUid === user?.firebaseUid) return;

        try {
            const res = await axiosClient.post("/conversations/dm", {
                targetUserId: targetUser.firebaseUid
            });
            await loadConversations();
            selectConversation(res.data);
            navigate(`/chat/${res.data.id}`);
        } catch (err) {
            console.error("Start DM failed", err);
        }
    };

    const filteredUsers = users.filter((u) => u.firebaseUid !== user?.firebaseUid);

    return (
        <DashboardLayout>
            <div className="p-6 h-full flex flex-col">
                <div className="mb-8 border-b border-[rgba(0,255,65,0.2)] pb-4">
                    <h1 className="text-3xl font-bold text-white font-mono tracking-tight">
                        GLOBAL_SEARCH <span className="text-[#00FF41] animate-pulse">_</span>
                    </h1>
                    <p className="text-gray-500 font-mono text-sm mt-1">
                        LOCATE_TARGETS // INITIATE_UPLINK
                    </p>
                </div>

                <div className="mb-6">
                    <input
                        autoFocus
                        className="w-full bg-black border border-[rgba(0,255,65,0.3)] rounded px-4 py-3 text-[#00FF41] placeholder-[rgba(0,255,65,0.3)] focus:outline-none focus:border-[#00FF41] font-mono text-lg shadow-[0_0_15px_rgba(0,255,65,0.1)]"
                        placeholder="ENTER_IDENTIFIER..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {loading && <p className="text-[#00FF41] text-center font-mono animate-pulse text-xl mt-10">SCANNING_NETWORK...</p>}

                    {!loading && filteredUsers.length === 0 && (
                        <div className="text-center mt-10">
                            <p className="text-gray-500 font-mono text-xl">NO_SIGNALS_FOUND</p>
                            <p className="text-gray-700 font-mono text-sm mt-2">TRY_DIFFERENT_FREQUENCY</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredUsers.map((u) => (
                            <div
                                key={u.id}
                                onClick={() => handleStartDM(u)}
                                className="p-4 border border-[rgba(0,255,65,0.1)] rounded bg-[rgba(0,255,65,0.02)] hover:bg-[rgba(0,255,65,0.1)] hover:border-[#00FF41] cursor-pointer flex items-center transition-all duration-200 group hover:shadow-[0_0_15px_rgba(0,255,65,0.2)]"
                            >
                                <div className="w-12 h-12 rounded bg-[rgba(0,255,65,0.1)] border border-[rgba(0,255,65,0.3)] flex items-center justify-center mr-4 font-semibold text-lg text-[#00FF41] group-hover:shadow-[0_0_10px_rgba(0,255,65,0.4)]">
                                    {u.name?.[0] || u.email[0]}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-semibold text-white font-mono text-lg truncate">{u.name || "Unknown"}</p>
                                    <p className="text-sm text-gray-500 font-mono truncate">{u.email}</p>
                                </div>
                                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-[#00FF41]">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
