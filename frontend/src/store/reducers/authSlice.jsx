import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  auth: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    loadauth: (state, action) => {
      state.auth = action.payload;
    },

    removeuser: (state) => {
      state.auth = null;
    },
  },
});

export const {
  loadauth,
  removeuser,
} = authSlice.actions;

export default authSlice.reducer;