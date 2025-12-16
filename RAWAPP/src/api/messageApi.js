import axiosClient from "./axiosClient";

const messageApi = {
  sendMessage: (data) => axiosClient.post("/messages", data),

  getMessages: (conversationId) =>
    axiosClient.get(`/messages/${conversationId}`),
};

export default messageApi;
