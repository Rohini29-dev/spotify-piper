import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import Home from "../pages/Home/Home";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import ArtistDashboard from "../pages/ArtistDashboard/ArtistDashboard";
import UploadMusic from "../pages/UploadMusic/UploadMusic";
import MusicPlayer from "../pages/MusicPlayer/MusicPlayer";
import Playlists from "../pages/Playlist/Playlists";

import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import RoleProtectedRoute from "../components/RoleProtectedRoute/RoleProtectedRoute";

const MainRoutes = () => {
  const [socket, setSocket] = useState(null);

  const navigate = useNavigate();

  // =========================================
  // SOCKET CONNECTION
  // =========================================

  useEffect(() => {
    const newSocket = io("http://localhost:3002", {
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log(
        "Socket connected:",
        newSocket.id
      );
    });

    newSocket.on("disconnect", () => {
      console.log(
        "Socket disconnected"
      );
    });

    // =========================================
    // PLAY MUSIC FROM ANOTHER BROWSER
    // =========================================

    const handleRemotePlayMusic = ({
      musicId,
      currentTime = 0,
    }) => {
      console.log(
        "Remote playlist music received:",
        {
          musicId,
          currentTime,
        }
      );

      if (!musicId) {
        console.log(
          "Music ID missing"
        );

        return;
      }

      // Remote browser ko MusicPlayer
      // route par le jao

      navigate(
        `/music/${musicId}?sync=true&time=${currentTime}`
      );
    };

    newSocket.on(
      "playMusic",
      handleRemotePlayMusic
    );

    setSocket(newSocket);

    // =========================================
    // CLEANUP
    // =========================================

    return () => {
      newSocket.off(
        "playMusic",
        handleRemotePlayMusic
      );

      newSocket.disconnect();
    };
  }, [navigate]);

  return (
    <Routes>

      {/* =====================================
          HOME
      ===================================== */}

      <Route
        path="/"
        element={
          <Home socket={socket} />
        }
      />

      {/* =====================================
          REGISTER
      ===================================== */}

      <Route
        path="/register"
        element={<Register />}
      />

      {/* =====================================
          LOGIN
      ===================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      {/* =====================================
          PLAYLISTS
      ===================================== */}

      <Route
        path="/playlists"
        element={
          <Playlists socket={socket} />
        }
      />

      {/* =====================================
          MUSIC PLAYER
      ===================================== */}

      <Route
        path="/music/:id"
        element={
          <MusicPlayer socket={socket} />
        }
      />

      {/* =====================================
          PROTECTED ROUTES
      ===================================== */}

      <Route element={<ProtectedRoute />}>

        {/* ===================================
            ARTIST ROUTES
        =================================== */}

        <Route
          element={
            <RoleProtectedRoute
              allowedRole="artist"
            />
          }
        >

          <Route
            path="/artist/dashboard"
            element={
              <ArtistDashboard />
            }
          />

          <Route
            path="/artist/dashboard/upload-music"
            element={
              <UploadMusic />
            }
          />

        </Route>

      </Route>

    </Routes>
  );
};

export default MainRoutes;