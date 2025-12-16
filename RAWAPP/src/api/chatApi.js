import axiosClient from "./axiosClient";

const chatApi = {
  createConversation: (participants) =>
    axiosClient.post("/conversations", { participants }),

  getConversations: () => axiosClient.get("/conversations"),

  createGroup: (body) => axiosClient.post("/conversations/group", body),

  getConversationDetails: (id) =>
    axiosClient.get(`/conversations/${id}`),
};

export default chatApi;
