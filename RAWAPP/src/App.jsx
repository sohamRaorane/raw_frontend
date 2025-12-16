import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppRouter from "./router/AppRouter";
import SocketManager from "./components/SocketManager";
import { fetchUser } from "./features/auth/authThunks";
import { setUser } from "./features/auth/authSlice";

export default function App() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  // Add local state to block rendering until we've checked for a token
  const [isAuthChecking, setIsAuthChecking] = React.useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("chatToken");
      if (token && !user) {
        // We have a token but no user in state yet.
        // Set token in state so useAuth() might return isLoggedIn=true (if it checks token)
        // But mainly we want to fetch the user.
        dispatch(setUser({ user: null, token }));

        // Wait for fetchUser to complete (success or fail)
        try {
          await dispatch(fetchUser()).unwrap();
        } catch (error) {
          console.error("Failed to restore session:", error);
        }
      }
      // Once done (or if no token), we are ready to render
      setIsAuthChecking(false);
    };

    initAuth();
  }, [dispatch]); // Run once on mount

  if (isAuthChecking) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <SocketManager />
      <AppRouter />
    </div>
  );
}
