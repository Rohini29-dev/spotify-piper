
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Home page
  musics: [],
  playlists: [],
  loading: false,
  error: "",

  // Music Player
  selectedMusic: null,
  detailsLoading: false,
  detailsError: "",

  // Artist Dashboard
  artistMusics: [],
  artistPlaylists: [],
  artistDashboardLoading: false,
  artistDashboardError: "",

  // Playlist Details
  selectedPlaylist: null,
  playlistDetailsLoading: false,
  playlistDetailsError: "",
};

const musicSlice = createSlice({
  name: "music",
  initialState,

  reducers: {
    // ================= HOME =================

    setMusics: (state, action) => {
      state.musics = action.payload;
    },

    setPlaylists: (state, action) => {
      state.playlists = action.payload;
    },

    setMusicLoading: (state, action) => {
      state.loading = action.payload;
    },

    setMusicError: (state, action) => {
      state.error = action.payload;
    },

    // ================= MUSIC PLAYER =================

    setSelectedMusic: (state, action) => {
      state.selectedMusic = action.payload;
    },

    setDetailsLoading: (state, action) => {
      state.detailsLoading = action.payload;
    },

    setDetailsError: (state, action) => {
      state.detailsError = action.payload;
    },

    // ================= ARTIST DASHBOARD =================

    setArtistMusics: (state, action) => {
      state.artistMusics = action.payload;
    },

    setArtistPlaylists: (state, action) => {
      state.artistPlaylists = action.payload;
    },

    setArtistDashboardLoading: (state, action) => {
      state.artistDashboardLoading = action.payload;
    },

    setArtistDashboardError: (state, action) => {
      state.artistDashboardError = action.payload;
    },

    // ================= PLAYLIST DETAILS =================

    setSelectedPlaylist: (state, action) => {
      state.selectedPlaylist = action.payload;
    },

    setPlaylistDetailsLoading: (state, action) => {
      state.playlistDetailsLoading = action.payload;
    },

    setPlaylistDetailsError: (state, action) => {
      state.playlistDetailsError = action.payload;
    },

    clearSelectedPlaylist: (state) => {
      state.selectedPlaylist = null;
      state.playlistDetailsLoading = false;
      state.playlistDetailsError = "";
    },

    // ================= DELETE PLAYLIST =================

    removePlaylist: (state, action) => {
      const playlistId = String(action.payload);

      state.playlists = state.playlists.filter(
        (playlist) => String(playlist._id) !== playlistId
      );

      state.artistPlaylists = state.artistPlaylists.filter(
        (playlist) => String(playlist._id) !== playlistId
      );

      if (
        state.selectedPlaylist &&
        String(state.selectedPlaylist._id) === playlistId
      ) {
        state.selectedPlaylist = null;
        state.playlistDetailsError = "";
      }
    },
  },
});

export const {
  setMusics,
  setPlaylists,
  setMusicLoading,
  setMusicError,

  setSelectedMusic,
  setDetailsLoading,
  setDetailsError,

  setArtistMusics,
  setArtistPlaylists,
  setArtistDashboardLoading,
  setArtistDashboardError,

  setSelectedPlaylist,
  setPlaylistDetailsLoading,
  setPlaylistDetailsError,
  clearSelectedPlaylist,

  removePlaylist,
} = musicSlice.actions;

export default musicSlice.reducer;
