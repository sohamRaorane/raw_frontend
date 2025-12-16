import { createAsyncThunk } from "@reduxjs/toolkit";
import chatApi from "../../api/chatApi";
import messageApi from "../../api/messageApi";

export const fetchConversations = createAsyncThunk(
  "chat/conversations",
  async () => {
    const res = await chatApi.getConversations();
    return res.data;
  }
);

export const fetchMessages = createAsyncThunk(
  "chat/messages",
  async (conversationId) => {
    const res = await messageApi.getMessages(conversationId);
    return res.data;
  }
);
