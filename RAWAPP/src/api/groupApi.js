import axiosClient from "./axiosClient";

const groupApi = {
    createGroup: (data) => axiosClient.post("/groups/create", data),
    addMember: (conversationId, userId) => axiosClient.post("/groups/add-member", { conversationId, userId }),
    removeMember: (conversationId, userId) => axiosClient.post("/groups/remove-member", { conversationId, userId }),
    renameGroup: (conversationId, newName) => axiosClient.post("/groups/rename", { conversationId, newName }),
};

export default groupApi;
