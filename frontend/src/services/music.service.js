
import axios from "axios";

const MUSIC_API = "http://localhost:3002/api/music";

const musicAPI = axios.create({
  baseURL: MUSIC_API,
  withCredentials: true,
});

// Automatically redirect when the session is unauthorized
musicAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname.toLowerCase();

      if (
        currentPath !== "/login" &&
        currentPath !== "/register"
      ) {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  }
);

// ================= MUSIC =================

export const uploadMusic = async (formData) => {
  const response = await musicAPI.post("/upload", formData);
  return response.data;
};

export const getAllMusics = async () => {
  const response = await musicAPI.get("/");
  return response.data;
};

export const getMusicById = async (id) => {
  const response = await musicAPI.get(`/get-details/${id}`);
  return response.data;
};

export const getArtistMusics = async () => {
  const response = await musicAPI.get("/artist-musics");
  return response.data;
};

// ================= PLAYLIST =================

export const createPlaylist = async (payload) => {
  const response = await musicAPI.post("/playlist", payload);
  return response.data;
};

export const getPlaylists = async () => {
  const response = await musicAPI.get("/playlist");
  return response.data;
};

export const getArtistPlaylists = async () => {
  const response = await musicAPI.get("/playlist/artist");
  return response.data;
};

export const getPlaylistById = async (id) => {
  const response = await musicAPI.get(`/playlist/${id}`);
  return response.data;
};

export const deletePlaylist = async (id) => {
  const response = await musicAPI.delete(`/playlist/${id}`);
  return response.data;
};
