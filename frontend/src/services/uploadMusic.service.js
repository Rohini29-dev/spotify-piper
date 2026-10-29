
import axios from "axios";

const MUSIC_API = "http://localhost:3002/api/music";

export const uploadMusicService = async (formData) => {
  const response = await axios.post(
    `${MUSIC_API}/upload`,
    formData,
    {
      withCredentials: true,
    }
  );

  return response.data;
};
