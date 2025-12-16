import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import axiosClient from "../../api/axiosClient";

export default function AdminDashboard() {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.role === "admin") {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const [usersRes, groupsRes] = await Promise.all([
                axiosClient.get("/admin/users"),
                axiosClient.get("/admin/groups")
            ]);
            setUsers(usersRes.data);
            setGroups(groupsRes.data);
        } catch (err) {
            console.error("Admin fetch error", err);
        } finally {
            setLoading(false);
        }
    };

    const handleBlock = async (userId) => {
        if (!confirm("Block this user?")) return;
        try {
            await axiosClient.post("/admin/users/block", { userId });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleMakeAdmin = async (userId) => {
        if (!confirm("Make this user admin?")) return;
        try {
            await axiosClient.post("/admin/users/make-admin", { userId });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteGroup = async (groupId) => {
        if (!confirm("Delete this group?")) return;
        try {
            await axiosClient.delete(`/admin/groups/${groupId}`);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    if (user?.role !== "admin") {
        return (
            <div className="p-6 text-center text-red-600 font-bold">
                Access Denied: You are not an admin.
            </div>
        );
    }

    if (loading) return <div className="p-6">Loading admin data...</div>;

    return (
        <div className="p-6 overflow-auto h-full bg-gray-50">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* USERS SECTION */}
                <section className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">All Users ({users.length})</h2>
                    <div className="space-y-2">
                        {users.map(u => (
                            <div className="p-3 border rounded flex justify-between items-center hover:bg-gray-50 bg-gray-50" key={u.id}>
                                <div>
                                    <p className="font-bold">{u.name}</p>
                                    <p className="text-sm text-gray-600">{u.email}</p>
                                    <p className="text-xs font-mono uppercase text-blue-600">{u.role}</p>
                                </div>
                                <div className="flex gap-2 text-sm">
                                    {u.role !== "admin" && (
                                        <button onClick={() => handleMakeAdmin(u.id)} className="text-blue-600 px-2 py-1 border rounded hover:bg-blue-50">
                                            Make Admin
                                        </button>
                                    )}
                                    {u.role !== "blocked" && u.role !== "admin" && (
                                        <button onClick={() => handleBlock(u.id)} className="text-red-600 px-2 py-1 border rounded hover:bg-red-50">
                                            Block
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* GROUPS SECTION */}
                <section className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">All Groups ({groups.length})</h2>
                    <div className="space-y-2">
                        {groups.map(g => (
                            <div className="p-3 border rounded flex justify-between items-center hover:bg-gray-50 bg-gray-50" key={g.id}>
                                <div>
                                    <p className="font-bold">{g.name || "Unnamed Group"}</p>
                                    <p className="text-sm text-gray-600">{g.participants?.length || 0} Members</p>
                                    <p className="text-xs text-gray-400">ID: {g.id}</p>
                                </div>
                                <button onClick={() => handleDeleteGroup(g.id)} className="text-red-600 px-2 py-1 border rounded hover:bg-red-50 text-sm">
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
