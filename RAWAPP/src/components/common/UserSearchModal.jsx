import React, { useState, useEffect } from "react";
import userApi from "../../api/userApi";

/**
 * Reusable User Search Modal
 * @param {boolean} isOpen
 * @param {function} onClose
 * @param {string} title
 * @param {function} onUserSelect - (user) => void
 * @param {string[]} excludeUserIds - Array of firebaseUids to filter out
 */
export default function UserSearchModal({ isOpen, onClose, title, onUserSelect, excludeUserIds = [] }) {
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadUsers();
        } else {
            setQuery("");
            setUsers([]);
        }
    }, [isOpen]);

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

    const handleSearch = (e) => {
        setQuery(e.target.value);
        // Debounce could be added here
    };

    // Trigger search on query change or Enter? 
    // For simplicity, search on type or load all initially.
    // Effect for query?
    useEffect(() => {
        if (!isOpen) return;
        const timeout = setTimeout(() => {
            loadUsers();
        }, 500);
        return () => clearTimeout(timeout);
    }, [query]);

    if (!isOpen) return null;

    const filteredUsers = users.filter((u) => !excludeUserIds.includes(u.firebaseUid));

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-black border border-[#00FF41] p-6 rounded-lg w-96 shadow-[0_0_20px_rgba(0,255,65,0.2)] max-h-[80vh] flex flex-col">
                <h2 className="text-xl font-bold mb-4 text-white font-mono tracking-wider">{title || "SELECT_TARGET"}</h2>

                <input
                    className="w-full bg-black border border-[rgba(0,255,65,0.3)] rounded px-3 py-2 mb-4 text-[#00FF41] placeholder-[rgba(0,255,65,0.3)] focus:outline-none focus:border-[#00FF41] font-mono"
                    placeholder="SEARCH_FREQ..."
                    value={query}
                    onChange={handleSearch}
                />

                <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                    {loading && <p className="text-[#00FF41] text-center font-mono animate-pulse">SCANNING...</p>}

                    {!loading && filteredUsers.length === 0 && (
                        <p className="text-gray-500 text-center font-mono">NO_SIGNALS_FOUND</p>
                    )}

                    {filteredUsers.map((u) => (
                        <div
                            key={u.id}
                            onClick={() => onUserSelect(u)}
                            className="p-3 border border-[rgba(0,255,65,0.1)] rounded hover:bg-[rgba(0,255,65,0.1)] hover:border-[#00FF41] cursor-pointer flex items-center transition-all duration-200 group"
                        >
                            <div className="w-8 h-8 rounded bg-[rgba(0,255,65,0.1)] border border-[rgba(0,255,65,0.3)] flex items-center justify-center mr-3 font-semibold text-sm text-[#00FF41] group-hover:shadow-[0_0_10px_rgba(0,255,65,0.4)]">
                                {u.name?.[0] || u.email[0]}
                            </div>
                            <div>
                                <p className="font-semibold text-white font-mono text-sm">{u.name || "Unknown"}</p>
                                <p className="text-xs text-gray-500 font-mono">{u.email}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white font-mono text-sm hover:bg-white/5 rounded transition-colors">
                        ABORT
                    </button>
                </div>
            </div>
        </div>
    );
}
