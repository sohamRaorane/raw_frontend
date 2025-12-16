import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import {
  fetchConversations,
  fetchMessages,
} from "../features/chat/chatThunks";

import {
  setActiveConversation,
  addMessage,
  conversationsLoaded
} from "../features/chat/chatSlice";

export default function useChat() {
  const dispatch = useDispatch();

  const {
    conversations,
    messages,
    activeConversation,
    loading,
  } = useSelector((state) => state.chat);

  // Modified to support mock data
  const loadConversations = useCallback((mockData = null) => {
    if (mockData) {
      dispatch(conversationsLoaded(mockData));
      return;
    }
    dispatch(fetchConversations());
  }, [dispatch]);

  const loadMessages = (conversationId) =>
    dispatch(fetchMessages(conversationId));

  const selectConversation = (c) => {
    console.log("Selected:", c);
    dispatch(setActiveConversation(c));
    dispatch(fetchMessages(c.id)); // Safe even if backend missing
  };

  const pushMessage = (msg) => {
    dispatch(addMessage(msg));
  };

  return {
    conversations,
    messages,
    activeConversation,
    loading,
    loadConversations,
    loadMessages,
    selectConversation,
    pushMessage,
  };
}
