import axiosClient from "./axiosClient";

const authApi = {
  login: (token) =>
    axiosClient.post(
      "/auth/login",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),
  register: (token) =>
    axiosClient.post(
      "/auth/login", // Backend handles register/login in same route
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),
  me: () => axiosClient.get("/auth/me"),
};

export default authApi;
