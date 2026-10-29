
import { createSlice } from "@reduxjs/toolkit";
import {
  asyncLoadArtistMusics,
  asyncCreatePlaylist,
} from "../actions/playlistActions";

const initialState = {
  loading: false,
  musicsLoading: false,
  musics: [],
  playlist: null,
  error: null,
  success: false,
};

const playlistSlice = createSlice({
  name: "playlist",
  initialState,

  reducers: {
    clearPlaylistStatus: (state) => {
      state.error = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch uploaded songs
      .addCase(asyncLoadArtistMusics.pending, (state) => {
        state.musicsLoading = true;
        state.error = null;
      })
      .addCase(
        asyncLoadArtistMusics.fulfilled,
        (state, action) => {
          state.musicsLoading = false;
          state.musics = action.payload;
        }
      )
      .addCase(
        asyncLoadArtistMusics.rejected,
        (state, action) => {
          state.musicsLoading = false;
          state.error =
            action.payload || "Unable to load songs.";
        }
      )

      // Create playlist
      .addCase(asyncCreatePlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        asyncCreatePlaylist.fulfilled,
        (state, action) => {
          state.loading = false;
          state.playlist = action.payload.playlist;
          state.success = true;
        }
      )
      .addCase(
        asyncCreatePlaylist.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload || "Unable to create playlist.";
        }
      );
  },
});

export const { clearPlaylistStatus } = playlistSlice.actions;

export default playlistSlice.reducer;
