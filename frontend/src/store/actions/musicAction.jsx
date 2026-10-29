
import {
  getAllMusics,
  getMusicById,
  getPlaylists,
  getArtistMusics,
  getArtistPlaylists,
  createPlaylist,
  getPlaylistById,
  deletePlaylist,
} from "../../services/music.service";

import {
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
  removePlaylist,
} from "../reducers/musicSlice";

// ================= HELPER =================

const extractArray = (response, key) => {
  if (Array.isArray(response?.[key])) {
    return response[key];
  }

  if (Array.isArray(response?.data?.[key])) {
    return response.data[key];
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  return [];
};

// ================= HOME: ALL MUSIC =================

export const asyncGetAllMusics = () => async (dispatch) => {
  dispatch(setMusicLoading(true));
  dispatch(setMusicError(""));

  try {
    const response = await getAllMusics();
    const musics = extractArray(response, "musics");

    dispatch(setMusics(musics));

    return musics;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      "Unable to load music. Please try again.";

    dispatch(setMusicError(message));
    console.error("GET ALL MUSICS ERROR:", message);

    return [];
  } finally {
    dispatch(setMusicLoading(false));
  }
};

// ================= HOME: PLAYLISTS =================

export const asyncGetPlaylists = () => async (dispatch) => {
  dispatch(setMusicLoading(true));
  dispatch(setMusicError(""));

  try {
    const response = await getPlaylists();
    const playlists = extractArray(response, "playlists");

    dispatch(setPlaylists(playlists));

    return playlists;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      "Unable to load playlists.";

    dispatch(setMusicError(message));
    console.error("GET PLAYLISTS ERROR:", message);

    return [];
  } finally {
    dispatch(setMusicLoading(false));
  }
};

// ================= HOME: MUSIC + PLAYLISTS =================

export const asyncLoadHomeData = () => async (dispatch) => {
  dispatch(setMusicLoading(true));
  dispatch(setMusicError(""));

  try {
    const [musicResponse, playlistResponse] = await Promise.all([
      getAllMusics(),
      getPlaylists(),
    ]);

    const musics = extractArray(musicResponse, "musics");
    const playlists = extractArray(playlistResponse, "playlists");

    dispatch(setMusics(musics));
    dispatch(setPlaylists(playlists));

    return { musics, playlists };
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      "Unable to load music. Please try again.";

    dispatch(setMusicError(message));
    console.error("HOME DATA ERROR:", error);

    return null;
  } finally {
    dispatch(setMusicLoading(false));
  }
};

// ================= MUSIC PLAYER: DETAILS =================

export const asyncGetMusicById = (id) => async (dispatch) => {
  dispatch(setSelectedMusic(null));
  dispatch(setDetailsLoading(true));
  dispatch(setDetailsError(""));

  try {
    const response = await getMusicById(id);

    const music =
      response?.music ||
      response?.data?.music ||
      response?.data ||
      null;

    if (!music || !music._id) {
      throw new Error("Music details not found.");
    }

    dispatch(setSelectedMusic(music));

    return music;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Unable to load music.";

    dispatch(setDetailsError(message));
    console.error("GET MUSIC DETAILS ERROR:", message);

    return null;
  } finally {
    dispatch(setDetailsLoading(false));
  }
};

// ================= ARTIST DASHBOARD =================

export const asyncGetArtistDashboard = () => async (dispatch) => {
  dispatch(setArtistDashboardLoading(true));
  dispatch(setArtistDashboardError(""));

  try {
    const [musicResponse, playlistResponse] = await Promise.all([
      getArtistMusics(),
      getArtistPlaylists(),
    ]);

    const musics = extractArray(musicResponse, "musics");
    const playlists = extractArray(playlistResponse, "playlists");

    dispatch(setArtistMusics(musics));
    dispatch(setArtistPlaylists(playlists));

    return { musics, playlists };
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      "Unable to load artist dashboard data.";

    dispatch(setArtistDashboardError(message));

    console.error(
      "ARTIST DASHBOARD ERROR:",
      error?.response?.data || error?.message
    );

    return null;
  } finally {
    dispatch(setArtistDashboardLoading(false));
  }
};

// ================= PLAYLIST DETAILS =================

export const asyncGetPlaylistById = (id) => async (dispatch) => {
  dispatch(setSelectedPlaylist(null));
  dispatch(setPlaylistDetailsLoading(true));
  dispatch(setPlaylistDetailsError(""));

  try {
    const response = await getPlaylistById(id);

    const playlist =
      response?.playlist ||
      response?.data?.playlist ||
      null;

    if (!playlist) {
      throw new Error("Playlist not found.");
    }

    dispatch(setSelectedPlaylist(playlist));

    return playlist;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Unable to load playlist songs.";

    dispatch(setPlaylistDetailsError(message));
    console.error("GET PLAYLIST DETAILS ERROR:", message);

    return null;
  } finally {
    dispatch(setPlaylistDetailsLoading(false));
  }
};

// ================= ARTIST MUSIC =================

export const asyncLoadArtistMusics = () => async (dispatch) => {
  dispatch(setArtistDashboardLoading(true));
  dispatch(setArtistDashboardError(""));

  try {
    const response = await getArtistMusics();
    const musics = extractArray(response, "musics");

    dispatch(setArtistMusics(musics));

    return musics;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      "Unable to load your songs.";

    dispatch(setArtistDashboardError(message));
    console.error("LOAD ARTIST MUSICS ERROR:", error);

    return [];
  } finally {
    dispatch(setArtistDashboardLoading(false));
  }
};

// ================= CREATE PLAYLIST =================

export const asyncCreatePlaylist = (data) => async (dispatch) => {
  dispatch(setArtistDashboardError(""));

  try {
    const response = await createPlaylist(data);

    // Refresh artist dashboard after successful creation.
    await dispatch(asyncGetArtistDashboard());

    return response;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      "Unable to create playlist.";

    dispatch(setArtistDashboardError(message));
    console.error("CREATE PLAYLIST ERROR:", error);

    throw error;
  }
};

// ================= DELETE PLAYLIST =================

export const asyncDeletePlaylist = (id) => async (dispatch) => {
  try {
    // First delete from backend.
    const response = await deletePlaylist(id);

    // Update Redux only after backend confirms success.
    dispatch(removePlaylist(id));

    console.log(
      "PLAYLIST DELETE SUCCESS:",
      response?.message || response
    );

    return response;
  } catch (error) {
    console.error(
      "DELETE PLAYLIST REDUX ERROR:",
      error?.response?.status,
      error?.response?.data || error?.message
    );

    throw error;
  }
};
