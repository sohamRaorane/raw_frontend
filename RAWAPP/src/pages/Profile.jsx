
import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice.js";
import useAuth from "../hooks/useAuth.js";

export default function Profile() {
    const dispatch = useDispatch();
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [glitch, setGlitch] = useState(false);

    // Trigger random glitch effect
    useEffect(() => {
        const interval = setInterval(() => {
            setGlitch(true);
            setTimeout(() => setGlitch(false), 200);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setIsEditing(false);
        }, 2000);
    };

    if (!user) {
        return (
            <DashboardLayout>
                <div className="h-full flex flex-col items-center justify-center gap-6 bg-black">
                    <div className="text-[#00FF41] font-mono animate-pulse tracking-widest text-xl">
                        INITIALIZING_PERSONNEL_DATA...
                    </div>
                    <button
                        onClick={() => dispatch(logout())}
                        className="px-6 py-3 border border-red-500 text-red-500 hover:bg-red-900/20 font-mono rounded transition-all"
                    >
                        FORCE_TERMINATE_SESSION
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    const displayName = user.name || "Unknown Operative";
    const displayEmail = user.email || "No Frequency";
    const displayId = user.firebaseUid || user.id || "UNKNOWN_ID";
    const displayRole = user.role || "OPERATIVE";
    const displayInitial = displayName[0]?.toUpperCase() || "U";

    return (
        <DashboardLayout>
            <div className="profile-container">
                {/* Background Grid & Overlay */}
                <div className="grid-bg"></div>
                <div className="scanline-overlay"></div>

                {/* Main ID Card */}
                <div className={`id-card ${glitch ? 'glitch-active' : ''}`}>

                    {/* Card Header */}
                    <div className="id-header">
                        <div className="agency-logo">
                            <span className="logo-icon">RAW</span>
                            <span className="logo-text">INTELLIGENCE BUREAU</span>
                        </div>
                        <div className="security-level">
                            <span>CLEARANCE:</span>
                            <span className="level-indicator">TOP SECRET</span>
                        </div>
                    </div>

                    {/* Card Body */}
                    <div className="id-body">

                        {/* Left Column: Photo & Status */}
                        <div className="id-left-col">
                            <div className="photo-frame">
                                <div className="photo-placeholder">
                                    {displayInitial}
                                </div>
                                <div className="corner-bracket top-left"></div>
                                <div className="corner-bracket top-right"></div>
                                <div className="corner-bracket bottom-left"></div>
                                <div className="corner-bracket bottom-right"></div>
                            </div>
                            <div className="status-indicator">
                                <div className="status-dot"></div>
                                <span>ACTIVE DUTY</span>
                            </div>
                        </div>

                        {/* Right Column: Details */}
                        <div className="id-right-col">
                            <div className="detail-group">
                                <label>CODENAME</label>
                                {isEditing ? (
                                    <input
                                        defaultValue={displayName}
                                        className="cyber-input"
                                    />
                                ) : (
                                    <div className="detail-value highlight">{displayName}</div>
                                )}
                            </div>

                            <div className="detail-group">
                                <label>OPERATIVE ID</label>
                                <div className="detail-value font-mono text-xs">{displayId}</div>
                            </div>

                            <div className="detail-group">
                                <label>COMMUNICATION FREQ</label>
                                <div className="detail-value">{displayEmail}</div>
                            </div>

                            <div className="detail-group">
                                <label>ASSIGNMENT</label>
                                <div className="detail-value">{displayRole}</div>
                            </div>

                            <div className="detail-group">
                                <label>ENCRYPTION KEY</label>
                                <div className="detail-value encrypted">
                                    {Array(20).fill(0).map(() => Math.random().toString(36)[2]).join('').toUpperCase()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card Footer */}
                    <div className="id-footer">
                        <div className="barcode-strip">
                            {/* Visual barcode representation */}
                            {Array(40).fill(0).map((_, i) => (
                                <div key={i} className="bar" style={{ height: Math.random() * 20 + 10 + 'px', width: Math.random() * 3 + 1 + 'px' }}></div>
                            ))}
                        </div>

                        <div className="action-buttons">
                            {isEditing ? (
                                <>
                                    <button onClick={() => setIsEditing(false)} className="cyber-btn secondary">CANCEL</button>
                                    <button onClick={handleSave} className="cyber-btn primary">{isSaving ? 'UPLOADING...' : 'SAVE'}</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => dispatch(logout())} className="cyber-btn danger">LOGOUT</button>
                                    <button onClick={() => setIsEditing(true)} className="cyber-btn primary">EDIT</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}