import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    // socket: null, // Removed non-serializable socket object
    connectionStatus: "disconnected", // connected, reconnecting, disconnected
  },
  reducers: {
    // setSocket(state, action) {
    //   state.socket = action.payload;
    // },
    disconnectSocket(state) {
      // Handled by socketClient
    },
    setConnectionStatus(state, action) {
      state.connectionStatus = action.payload;
    }
  },
});

export const { disconnectSocket, setConnectionStatus } = socketSlice.actions;
export default socketSlice.reducer;
