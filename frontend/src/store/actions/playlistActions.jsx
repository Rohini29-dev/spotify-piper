
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3002/api/music";

export const asyncLoadArtistMusics = createAsyncThunk(
  "playlist/loadArtistMusics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/artist-musics`,
        { withCredentials: true }
      );

      return response.data.musics || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to load your uploaded songs."
      );
    }
  }
);

export const asyncCreatePlaylist = createAsyncThunk(
  "playlist/createPlaylist",
  async (playlistData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/playlist`,
        {
          title: playlistData.title,
          musics: playlistData.musics,
        },
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to create playlist."
      );
    }
  }
);
