import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/authSlice";
import musicSlice from "./reducers/musicSlice";
import uploadMusicSlice from "./reducers/uploadMusicSlice";
import playlistSlice from "./reducers/playlistSlice";

export const store = configureStore({
  reducer: {
    authReducer: authSlice,
    musicReducer: musicSlice,
    uploadMusicReducer: uploadMusicSlice,
    playlistReducer: playlistSlice
  },
});