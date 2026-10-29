
import { createAsyncThunk } from "@reduxjs/toolkit";
import { uploadMusicService } from "../../services/uploadMusic.service";

export const asyncUploadMusic = createAsyncThunk(
  "uploadMusic/upload",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await uploadMusicService(formData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to upload music. Please try again."
      );
    }
  }
);
