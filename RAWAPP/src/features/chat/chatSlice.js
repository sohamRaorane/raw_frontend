import { createSlice } from "@reduxjs/toolkit";
import { fetchConversations, fetchMessages } from "./chatThunks";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    conversations: [],
    messages: [],
    activeConversation: null,
    loading: false,
  },

  reducers: {
    setActiveConversation(state, action) {
      state.activeConversation = action.payload;
      // Reset unread count for this conversation in the list
      if (action.payload) {
        const convo = state.conversations.find(c => c.id === action.payload.id);
        if (convo) {
          convo.unreadCount = 0;
        }
      }
    },

    addMessage(state, action) {
      const msg = action.payload;
      // Only append if the message belongs to the currently active conversation
      if (state.activeConversation && state.activeConversation.id === msg.conversationId) {
        const exists = state.messages.find(m => m.id === msg.id);
        if (!exists) {
          state.messages.push(msg);
        }
      }
    },

    // Added properly
    conversationsLoaded(state, action) {
      state.conversations = action.payload;
    },

    sidebarConversationUpdated(state, action) {
      const { conversationId, lastMessage, currentUserId } = action.payload;
      const convo = state.conversations.find((c) => c.id === conversationId);

      if (convo) {
        // Update last message
        convo.messages = [lastMessage];

        // Determine if we should increment unread count
        // 1. If we are currently viewing this conversation, do NOT increment.
        // 2. If WE sent the message, do NOT increment.
        const isActive = state.activeConversation?.id === conversationId;
        const isMyMessage = lastMessage.senderId === currentUserId;

        if (!isActive && !isMyMessage) {
          convo.unreadCount = (convo.unreadCount || 0) + 1;
        }

        // Move to top
        const index = state.conversations.findIndex(c => c.id === conversationId);
        if (index > 0) {
          state.conversations.splice(index, 1);
          state.conversations.unshift(convo);
        }
      }
    },

    updateUserPresence(state, action) {
      const { userId, online } = action.payload;
      // Update participants in all conversations
      state.conversations.forEach((convo) => {
        if (convo.participants) {
          convo.participants.forEach((p) => {
            if (p.user?.firebaseUid === userId || p.user?.id === userId) {
              if (p.user) p.user.isOnline = online;
            }
          });
        }
      });

      if (state.activeConversation) {
        state.activeConversation.participants?.forEach(p => {
          if (p.user?.firebaseUid === userId) {
            if (p.user) p.user.isOnline = online;
          }
        });
      }
    },

    messageSeen(state, action) {
      const { conversationId, userId } = action.payload;

      // If we are looking at this conversation, update the messages
      if (state.activeConversation && state.activeConversation.id === conversationId) {
        state.messages.forEach(msg => {
          if (msg.status) {
            // userId payload is typically Firebase UID from the socket
            const statusEntry = msg.status.find(s => s.user?.firebaseUid === userId);

            if (statusEntry) {
              statusEntry.seen = true;
            }
          }
        });
      }
    },

    clearUnread(state, action) {
      const conversationId = action.payload;
      const convo = state.conversations.find((c) => c.id === conversationId);
      if (convo) {
        convo.unreadCount = 0;
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
      });
  },
});

export const {
  setActiveConversation,
  addMessage,
  conversationsLoaded,
  sidebarConversationUpdated,
  updateUserPresence, messageSeen, clearUnread
} = chatSlice.actions;

export default chatSlice.reducer;
