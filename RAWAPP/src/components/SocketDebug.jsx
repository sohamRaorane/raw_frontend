import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getSocket } from '../socket/socketClient';

const SocketDebug = () => {
    const { connectionStatus } = useSelector((state) => state.socket);
    const { activeConversation } = useSelector((state) => state.chat);
    const [logs, setLogs] = useState([]);

    const addLog = (msg) => {
        setLogs((prev) => [`${new Date().toLocaleTimeString()} - ${msg}`, ...prev].slice(0, 20));
    };

    useEffect(() => {
        const socket = getSocket();
        if (!socket) {
            addLog("Socket is null");
            return;
        }

        addLog(`Socket Status: ${socket.connected ? 'Connected' : 'Disconnected'}`);
        addLog(`Socket ID: ${socket.id}`);

        const onConnect = () => addLog(`Connected: ${socket.id}`);
        const onDisconnect = () => addLog("Disconnected");

        // socket.io-client doesn't support onAny in browser usually without plugin, but let's try
        // socket.onAny && socket.onAny(onAny); 

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        // Manually listen to known events
        const onNewMessage = (data) => addLog(`Received new_message: ${JSON.stringify(data)}`);
        const onSidebarUpdate = (data) => addLog(`Received sidebar_update: ${JSON.stringify(data)}`);
        const onAuthSuccess = (data) => addLog(`Auth Success: ${JSON.stringify(data)}`);

        socket.on("new_message", onNewMessage);
        socket.on("sidebar_update", onSidebarUpdate);
        socket.on("auth_success", onAuthSuccess);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("new_message", onNewMessage);
            socket.off("sidebar_update", onSidebarUpdate);
            socket.off("auth_success", onAuthSuccess);
        };
    }, [connectionStatus]); // Re-run when status changes

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            right: 0,
            width: '300px',
            height: '200px',
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: '#0f0',
            fontSize: '12px',
            overflowY: 'auto',
            zIndex: 9999,
            padding: '10px',
            pointerEvents: 'none' // Let clicks pass through
        }}>
            <h3>Socket Debugger</h3>
            <div>Status: {connectionStatus}</div>
            <div>Active Room: {activeConversation?.id || 'None'}</div>
            <hr style={{ borderColor: '#333' }} />
            {logs.map((log, i) => (
                <div key={i}>{log}</div>
            ))}
        </div>
    );
};

export default SocketDebug;
