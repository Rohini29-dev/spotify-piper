import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./Playlists.css";

const Playlists = ({ socket }) => {
  const navigate = useNavigate();

  const [playlists, setPlaylists] =
    useState([]);

  const [selectedPlaylist, setSelectedPlaylist] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [loadingSongs, setLoadingSongs] =
    useState(false);

  const [error, setError] =
    useState("");

  // =========================================
  // FETCH ALL PLAYLISTS
  // =========================================

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await axios.get(
            "http://localhost:3002/api/music/playlist",
            {
              withCredentials: true,
            }
          );

        console.log(
          "Playlists response:",
          response.data
        );

        setPlaylists(
          response.data.playlists || []
        );
      } catch (err) {
        console.error(
          "Playlists error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load playlists."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  // =========================================
  // OPEN PLAYLIST
  // =========================================

  const handlePlaylistClick = async (
    playlist
  ) => {
    try {
      setLoadingSongs(true);
      setError("");

      console.log(
        "Selected playlist:",
        playlist
      );

      const response =
        await axios.get(
          `http://localhost:3002/api/music/playlist/${playlist._id}`,
          {
            withCredentials: true,
          }
        );

      console.log(
        "Selected playlist details:",
        response.data
      );

      setSelectedPlaylist(
        response.data.playlist
      );
    } catch (err) {
      console.error(
        "Playlist details error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load playlist songs."
      );
    } finally {
      setLoadingSongs(false);
    }
  };

  // =========================================
  // PLAY MUSIC FROM PLAYLIST
  // =========================================

  const handlePlayMusic = (music) => {
    if (!music?._id) {
      console.log(
        "Music ID not found:",
        music
      );

      return;
    }

    console.log(
      "Playlist song clicked:",
      music
    );

    const musicId = music._id;

    const currentTime = 0;

    // =======================================
    // SEND EVENT TO OTHER BROWSER
    // =======================================

    if (socket) {
      socket.emit("playMusic", {
        musicId,
        currentTime,
      });

      console.log(
        "playMusic event emitted:",
        {
          musicId,
          currentTime,
        }
      );
    } else {
      console.log(
        "Socket not available"
      );
    }

    // =======================================
    // OPEN MUSIC PLAYER IN CURRENT BROWSER
    // =======================================

    navigate(
      `/music/${musicId}?sync=true&time=0`
    );
  };

  // =========================================
  // BACK
  // =========================================

  const handleBack = () => {
    if (selectedPlaylist) {
      setSelectedPlaylist(null);
      setError("");

      return;
    }

    navigate("/");
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="playlist-page playlist-loading">

        <div className="playlist-loader"></div>

        <p>
          Loading playlists...
        </p>

      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (
    error &&
    !selectedPlaylist
  ) {
    return (
      <div className="playlist-page">

        <div className="playlist-error">

          <div className="playlist-error-icon">
            ⚠️
          </div>

          <h2>
            Something went wrong
          </h2>

          <p>
            {error}
          </p>

          <button
            onClick={() =>
              navigate("/")
            }
          >
            ← Back to Home
          </button>

        </div>

      </div>
    );
  }

  // =========================================
  // SELECTED PLAYLIST
  // =========================================

  if (selectedPlaylist) {

    const songs =
      selectedPlaylist.musics || [];

    const firstMusic =
      songs[0];

    return (
      <div className="playlist-page">

        <div className="playlist-container">

          {/* BACK */}

          <button
            className="playlist-back"
            onClick={handleBack}
          >
            ← Back to Playlists
          </button>

          {/* =================================
              PLAYLIST HEADER
          ================================= */}

          <section className="playlist-header">

            <div className="playlist-cover">

              {firstMusic?.coverImageUrl ? (
                <img
                  src={
                    firstMusic.coverImageUrl
                  }
                  alt={
                    selectedPlaylist.title
                  }
                />
              ) : (
                <div className="playlist-cover-placeholder">
                  🎵
                </div>
              )}

            </div>

            <div className="playlist-info">

              <p className="playlist-label">
                PLAYLIST
              </p>

              <h1>
                {selectedPlaylist.title}
              </h1>

              <p className="playlist-artist">
                {selectedPlaylist.artist}
              </p>

              <p className="playlist-count">
                {songs.length} songs
              </p>

            </div>

          </section>

          {/* =================================
              SONG SECTION
          ================================= */}

          <section className="playlist-songs-section">

            <div className="playlist-songs-header">

              <div>

                <h2>
                  Songs
                </h2>

                <p>
                  All songs in this playlist
                </p>

              </div>

              <span>
                {songs.length} tracks
              </span>

            </div>

            {/* LOADING */}

            {loadingSongs ? (

              <div className="playlist-loading">

                <div className="playlist-loader"></div>

                <p>
                  Loading songs...
                </p>

              </div>

            ) : error ? (

              <div className="playlist-error">

                <p>
                  {error}
                </p>

              </div>

            ) : songs.length === 0 ? (

              <div className="playlist-empty">

                <div>
                  🎵
                </div>

                <h3>
                  No songs in this playlist
                </h3>

                <p>
                  This playlist does not
                  contain any songs yet.
                </p>

              </div>

            ) : (

              <div className="playlist-songs">

                {songs.map(
                  (music, index) => (

                    <div
                      className="playlist-track"
                      key={
                        music._id ||
                        index
                      }
                      onClick={() =>
                        handlePlayMusic(
                          music
                        )
                      }
                    >

                      {/* NUMBER */}

                      <span className="track-number">
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      {/* COVER */}

                      <img
                        src={
                          music.coverImageUrl
                        }
                        alt={
                          music.title
                        }
                        className="track-cover"
                      />

                      {/* INFO */}

                      <div className="track-info">

                        <h3>
                          {music.title}
                        </h3>

                        <p>
                          {music.artist}
                        </p>

                      </div>

                      {/* PLAY BUTTON */}

                      <button
                        className="track-play"
                        onClick={(e) => {

                          e.stopPropagation();

                          handlePlayMusic(
                            music
                          );

                        }}
                      >
                        ▶
                      </button>

                    </div>

                  )
                )}

              </div>

            )}

          </section>

        </div>

      </div>
    );
  }

  // =========================================
  // ALL PLAYLISTS
  // =========================================

  return (
    <div className="playlist-page">

      <div className="playlist-container">

        {/* =================================
            HEADER
        ================================= */}

        <section className="playlist-header">

          <div className="playlist-cover">

            <div className="playlist-cover-placeholder">
              🎵
            </div>

          </div>

          <div className="playlist-info">

            <p className="playlist-label">
              EXPLORE
            </p>

            <h1>
              Playlists
            </h1>

            <p className="playlist-artist">
              Discover playlists created by
              artists and find your next
              favorite songs.
            </p>

            <p className="playlist-count">
              {playlists.length} playlists
              available
            </p>

          </div>

        </section>

        {/* =================================
            ALL PLAYLISTS
        ================================= */}

        <section className="playlist-songs-section">

          <div className="playlist-songs-header">

            <div>

              <h2>
                All Playlists
              </h2>

              <p>
                Choose a playlist to explore
                its songs.
              </p>

            </div>

            <span>
              {playlists.length} playlists
            </span>

          </div>

          {playlists.length === 0 ? (

            <div className="playlist-empty">

              <div>
                🎵
              </div>

              <h3>
                No playlists available
              </h3>

              <p>
                There are no playlists yet.
              </p>

            </div>

          ) : (

            <div className="playlists-grid">

              {playlists.map(
                (playlist) => {

                  const cover =
                    playlist.musics?.[0]
                      ?.coverImageUrl;

                  return (

                    <div
                      key={
                        playlist._id
                      }
                      className="playlist-card"
                      onClick={() =>
                        handlePlaylistClick(
                          playlist
                        )
                      }
                    >

                      {/* COVER */}

                      <div className="playlist-card-cover">

                        {cover ? (

                          <img
                            src={cover}
                            alt={
                              playlist.title
                            }
                          />

                        ) : (

                          <div className="playlist-card-placeholder">
                            🎵
                          </div>

                        )}

                        <button
                          className="playlist-card-play"
                          onClick={(e) => {

                            e.stopPropagation();

                            handlePlaylistClick(
                              playlist
                            );

                          }}
                        >
                          ▶
                        </button>

                      </div>

                      {/* INFO */}

                      <div className="playlist-card-info">

                        <h3>
                          {playlist.title}
                        </h3>

                        <p>
                          {playlist.artist}
                        </p>

                        <span>
                          {
                            playlist.musics
                              ?.length ||
                            playlist.songCount ||
                            0
                          }{" "}
                          songs
                        </span>

                      </div>

                    </div>

                  );
                }
              )}

            </div>

          )}

        </section>

      </div>

    </div>
  );
};

export default Playlists;