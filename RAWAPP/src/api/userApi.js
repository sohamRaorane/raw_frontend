import axiosClient from "./axiosClient";

const userApi = {
  getAllUsers: () => axiosClient.get("/users"),
  searchUsers: (query) => axiosClient.get("/users", { params: { search: query } }),
  getUserById: (id) => axiosClient.get(`/users/${id}`),
  updateProfile: (data) => axiosClient.put("/users/profile", data),
};

export default userApi;
