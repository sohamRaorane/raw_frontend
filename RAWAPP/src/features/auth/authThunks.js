import { createAsyncThunk } from "@reduxjs/toolkit";
import authApi from "../../api/authApi";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (token, { rejectWithValue }) => {
    try {
      // We pass the token to the API, which sends it in the header
      const res = await authApi.login(token);
      // The backend returns the user object. We combine it with the token.
      return { user: res.data, token };
    } catch (err) {
      // Extract specific error message string to avoid storing objects in redux error state
      const errorMessage = err.response?.data?.error || err.message || "Login failed";
      return rejectWithValue(errorMessage);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (token, { rejectWithValue }) => {
    try {
      const res = await authApi.register(token);
      return { user: res.data, token };
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || "Register error";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await authApi.me();
      return { user: res.data };
    } catch (err) {
      // If fetch fails (invalid token), we should probably logout
      return rejectWithValue(err.message);
    }
  }
);
