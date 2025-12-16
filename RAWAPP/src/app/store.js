import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import chatReducer from "../features/chat/chatSlice";
import socketReducer from "../features/socket/socketSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    socket: socketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["socket/setSocket"],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["payload.socket"],
        // Ignore these paths in the state
        ignoredPaths: ["socket.socket"],
      },
    }),
  devTools: true, // disable later for production
});
