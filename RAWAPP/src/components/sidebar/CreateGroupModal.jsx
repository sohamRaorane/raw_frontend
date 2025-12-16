import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import userApi from "../../api/userApi";
import groupApi from "../../api/groupApi";
import useChat from "../../hooks/useChat";

export default function CreateGroupModal({ isOpen, onClose }) {
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { socket } = useSelector((state) => state.socket);
  const { loadConversations } = useChat();

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  const loadUsers = async () => {
    try {
      const res = await userApi.searchUsers(""); // Fetch all users or search
      setAvailableUsers(res.data);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  const handleUserToggle = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const createGroup = async () => {
    if (!groupName || selectedUsers.length === 0) return;

    try {
      setLoading(true);
      const res = await groupApi.createGroup({
        name: groupName,
        members: selectedUsers,
      });

      // Notify via socket
      socket.emit("group_updated", {
        conversationId: res.data.id,
        change: "created",
      });

      // Refresh list
      loadConversations();

      onClose();
      setGroupName("");
      setSelectedUsers([]);
    } catch (err) {
      console.error("Failed to create group", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-black border border-[#00FF41] p-6 rounded-lg w-96 shadow-[0_0_20px_rgba(0,255,65,0.2)]">
        <h2 className="text-xl font-bold mb-4 text-white font-mono tracking-wider">CREATE_GROUP_CHANNEL</h2>

        <div className="mb-4">
          <label className="block text-sm font-mono text-[#00FF41] mb-1">CHANNEL_ID (NAME)</label>
          <input
            className="w-full bg-black border border-[rgba(0,255,65,0.3)] rounded px-3 py-2 text-[#00FF41] placeholder-[rgba(0,255,65,0.3)] focus:outline-none focus:border-[#00FF41] font-mono"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="ENTER_NAME..."
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-mono text-[#00FF41] mb-1">ADD_OPERATIVES</label>
          <div className="max-h-40 overflow-y-auto border border-[rgba(0,255,65,0.2)] rounded custom-scrollbar">
            {availableUsers.map((user) => (
              <div
                key={user.id}
                className={`p-2 cursor-pointer flex justify-between items-center hover:bg-[rgba(0,255,65,0.1)] transition-colors border-b border-[rgba(0,255,65,0.1)] last:border-0 ${selectedUsers.includes(user.firebaseUid) ? "bg-[rgba(0,255,65,0.15)]" : ""
                  }`}
                onClick={() => handleUserToggle(user.firebaseUid)}
              >
                <span className="text-gray-300 font-mono text-sm">{user.name || user.email}</span>
                {selectedUsers.includes(user.firebaseUid) && (
                  <span className="text-[#00FF41] font-bold">✓</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 text-gray-400 hover:text-white font-mono text-sm hover:bg-white/5 rounded transition-colors"
            onClick={onClose}
          >
            ABORT
          </button>
          <button
            className="px-4 py-2 bg-[#00FF41]/10 border border-[#00FF41] text-[#00FF41] rounded hover:bg-[#00FF41]/20 disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm tracking-wider shadow-[0_0_10px_rgba(0,255,65,0.2)] transition-all"
            onClick={createGroup}
            disabled={loading || !groupName || selectedUsers.length === 0}
          >
            {loading ? "INITIALIZING..." : "ESTABLISH_LINK"}
          </button>
        </div>
      </div>
    </div>
  );
}
