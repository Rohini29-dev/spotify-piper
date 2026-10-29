
import { createSlice } from "@reduxjs/toolkit";
import { asyncUploadMusic } from "../actions/uploadMusicActions";

const initialState = {
  loading: false,
  data: null,
  error: null,
};

const uploadMusicSlice = createSlice({
  name: "uploadMusic",
  initialState,
  reducers: {
    clearUploadMusicState: (state) => {
      state.loading = false;
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncUploadMusic.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.data = null;
      })
      .addCase(asyncUploadMusic.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(asyncUploadMusic.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to upload music.";
      });
  },
});

export const { clearUploadMusicState } =
  uploadMusicSlice.actions;

export default uploadMusicSlice.reducer;
