
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import {
  asyncGetPlaylists,
  asyncGetPlaylistById,
  asyncDeletePlaylist,
} from "../../store/actions/musicAction";

import { clearSelectedPlaylist } from "../../store/reducers/musicSlice";
import "./Playlists.css";

const Playlists = ({ socket }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [openMenuId, setOpenMenuId] = useState(null);
  const [deletingPlaylistId, setDeletingPlaylistId] = useState(null);

  const {
    playlists = [],
    loading,
    error,
    selectedPlaylist,
    playlistDetailsLoading,
    playlistDetailsError,
  } = useSelector((state) => state.musicReducer);

  // Fetch all playlists
  useEffect(() => {
    dispatch(asyncGetPlaylists());
  }, [dispatch]);

  // Open playlist selected from another page
  useEffect(() => {
    const playlistId = location.state?.selectedPlaylistId;

    if (playlistId) {
      dispatch(asyncGetPlaylistById(playlistId));

      navigate(location.pathname, {
        replace: true,
        state: null,
      });
    }
  }, [dispatch, location.state, location.pathname, navigate]);

  // Close menu when clicking outside the menu
  useEffect(() => {
    const closeMenu = () => setOpenMenuId(null);

    document.addEventListener("click", closeMenu);

    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, []);

  const handleBack = () => {
    if (selectedPlaylist) {
      dispatch(clearSelectedPlaylist());
      return;
    }

    navigate("/");
  };

  const handlePlaylistClick = (playlist) => {
    if (!playlist?._id) return;

    setOpenMenuId(null);
    dispatch(asyncGetPlaylistById(playlist._id));
  };

  const handlePlayMusic = (music) => {
    if (!music?._id) {
      console.error("Music ID not found:", music);
      return;
    }

    socket?.emit("playMusic", {
      musicId: music._id,
      currentTime: 0,
    });

    navigate(`/music/${music._id}?sync=true&time=0`);
  };

  const handleDeletePlaylist = async (playlist) => {
    if (!playlist?._id || deletingPlaylistId) return;

    setOpenMenuId(null);

    const confirmed = window.confirm(
      `Are you sure you want to delete "${playlist.title}"?`
    );

    if (!confirmed) return;

    setDeletingPlaylistId(playlist._id);

    try {
      const result = await dispatch(
        asyncDeletePlaylist(playlist._id)
      );

      // Handles Redux Toolkit rejected actions if this is a createAsyncThunk.
      if (result?.meta?.requestStatus === "rejected") {
        throw new Error(
          result.payload?.message ||
            result.error?.message ||
            "Unable to delete playlist."
        );
      }

      if (result?.error) {
        throw new Error(
          result.error.message || "Unable to delete playlist."
        );
      }

      if (selectedPlaylist?._id === playlist._id) {
        dispatch(clearSelectedPlaylist());
      }

      window.alert("Playlist deleted successfully!");
    } catch (err) {
      window.alert(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to delete playlist."
      );
    } finally {
      setDeletingPlaylistId(null);
    }
  };

  const toggleMenu = (event, playlistId) => {
    event.stopPropagation();

    setOpenMenuId((currentId) =>
      currentId === playlistId ? null : playlistId
    );
  };

  // Loading
  if (loading && playlists.length === 0 && !selectedPlaylist) {
    return (
      <div className="playlist-page playlist-loading">
        <div className="playlist-loader" />
        <p>Loading playlists...</p>
      </div>
    );
  }

  // Error
  if (error && playlists.length === 0 && !selectedPlaylist) {
    return (
      <div className="playlist-page">
        <div className="playlist-error">
          <div className="playlist-error-icon">⚠️</div>
          <h2>Something went wrong</h2>
          <p>{error}</p>

          <button onClick={() => navigate("/")}>
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Selected playlist details
  if (
    selectedPlaylist ||
    playlistDetailsLoading ||
    playlistDetailsError
  ) {
    const songs = selectedPlaylist?.musics || [];
    const firstMusic = songs[0];

    return (
      <div className="playlist-page">
        <div className="playlist-container">
          <button className="playlist-back" onClick={handleBack}>
            ← Back to Playlists
          </button>

          {playlistDetailsLoading && !selectedPlaylist && (
            <div className="playlist-loading">
              <div className="playlist-loader" />
              <p>Loading playlist...</p>
            </div>
          )}

          {playlistDetailsError && !selectedPlaylist && (
            <div className="playlist-error">
              <p>{playlistDetailsError}</p>

              <button
                onClick={() => {
                  dispatch(clearSelectedPlaylist());
                  dispatch(asyncGetPlaylists());
                }}
              >
                Back to Playlists
              </button>
            </div>
          )}

          {selectedPlaylist && (
            <>
              <section className="playlist-header">
                <div className="playlist-cover">
                  {firstMusic?.coverImageUrl ? (
                    <img
                      src={firstMusic.coverImageUrl}
                      alt={selectedPlaylist.title}
                    />
                  ) : (
                    <div className="playlist-cover-placeholder">
                      🎵
                    </div>
                  )}
                </div>

                <div className="playlist-info">
                  <p className="playlist-label">PLAYLIST</p>
                  <h1>{selectedPlaylist.title}</h1>
                  <p className="playlist-artist">
                    {selectedPlaylist.artist}
                  </p>
                  <p className="playlist-count">
                    {songs.length} songs
                  </p>
                </div>
              </section>

              <section className="playlist-songs-section">
                <div className="playlist-songs-header">
                  <div>
                    <h2>Songs</h2>
                    <p>All songs in this playlist</p>
                  </div>

                  <span>{songs.length} tracks</span>
                </div>

                {songs.length === 0 ? (
                  <div className="playlist-empty">
                    <div>🎵</div>
                    <h3>No songs in this playlist</h3>
                    <p>
                      This playlist does not contain any songs yet.
                    </p>
                  </div>
                ) : (
                  <div className="playlist-songs">
                    {songs.map((music, index) => (
                      <div
                        className="playlist-track"
                        key={music._id || index}
                        onClick={() => handlePlayMusic(music)}
                      >
                        <span className="track-number">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        {music.coverImageUrl ? (
                          <img
                            src={music.coverImageUrl}
                            alt={music.title}
                            className="track-cover"
                          />
                        ) : (
                          <div className="track-cover track-cover-placeholder">
                            🎵
                          </div>
                        )}

                        <div className="track-info">
                          <h3>{music.title}</h3>
                          <p>{music.artist}</p>
                        </div>

                        <button
                          className="track-play"
                          onClick={(event) => {
                            event.stopPropagation();
                            handlePlayMusic(music);
                          }}
                          aria-label={`Play ${music.title}`}
                        >
                          ▶
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    );
  }

  // All playlists
  return (
    <div className="playlist-page">
      <div className="playlist-container">
        <section className="playlist-header">
          <div className="playlist-cover">
            <div className="playlist-cover-placeholder">🎵</div>
          </div>

          <div className="playlist-info">
            <p className="playlist-label">EXPLORE</p>
            <h1>Playlists</h1>
            <p className="playlist-artist">
              Discover playlists created by artists and find
              your next favorite songs.
            </p>
            <p className="playlist-count">
              {playlists.length} playlists available
            </p>
          </div>
        </section>

        <section className="playlist-songs-section">
          <div className="playlist-songs-header">
            <div>
              <h2>All Playlists</h2>
              <p>Choose a playlist to explore its songs.</p>
            </div>

            <span>{playlists.length} playlists</span>
          </div>

          {playlists.length === 0 ? (
            <div className="playlist-empty">
              <div>🎵</div>
              <h3>No playlists available</h3>
              <p>There are no playlists yet.</p>
            </div>
          ) : (
            <div className="playlists-grid">
              {playlists.map((playlist) => {
                const cover =
                  playlist.musics?.[0]?.coverImageUrl;

                const isMenuOpen = openMenuId === playlist._id;
                const isDeleting =
                  deletingPlaylistId === playlist._id;

                return (
                  <div
                    key={playlist._id}
                    className="playlist-card"
                    onClick={() => handlePlaylistClick(playlist)}
                  >
                    <div className="playlist-card-cover">
                      {cover ? (
                        <img
                          src={cover}
                          alt={playlist.title}
                        />
                      ) : (
                        <div className="playlist-card-placeholder">
                          🎵
                        </div>
                      )}

                      <button
                        className="playlist-card-play"
                        onClick={(event) => {
                          event.stopPropagation();
                          handlePlaylistClick(playlist);
                        }}
                        aria-label={`Open ${playlist.title}`}
                        title="Open playlist"
                      >
                        ▶
                      </button>
                    </div>

                    <div className="playlist-card-info">
                      <div className="playlist-card-title-row">
                        <div className="playlist-card-text">
                          <h3>{playlist.title}</h3>
                          <p>{playlist.artist}</p>
                          <span>
                            {playlist.musics?.length ||
                              playlist.songCount ||
                              0}{" "}
                            songs
                          </span>
                        </div>

                        {/* THREE-DOT MENU */}
                        <div
                          className="playlist-menu"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <button
                            type="button"
                            className={`playlist-menu-trigger ${
                              isMenuOpen ? "active" : ""
                            }`}
                            onClick={(event) =>
                              toggleMenu(event, playlist._id)
                            }
                            aria-label={`More options for ${playlist.title}`}
                            aria-haspopup="menu"
                            aria-expanded={isMenuOpen}
                            title="More options"
                          >
                            <span />
                            <span />
                            <span />
                          </button>

                          {isMenuOpen && (
                            <div
                              className="playlist-menu-dropdown"
                              role="menu"
                              onClick={(event) =>
                                event.stopPropagation()
                              }
                            >
                              <button
                                type="button"
                                role="menuitem"
                                onClick={() =>
                                  handlePlaylistClick(playlist)
                                }
                              >
                                <span className="menu-option-icon">
                                  ↗
                                </span>
                                Open Playlist
                              </button>

                              <button
                                type="button"
                                role="menuitem"
                                className="playlist-delete-option"
                                disabled={isDeleting}
                                onClick={() =>
                                  handleDeletePlaylist(playlist)
                                }
                              >
                                <span className="menu-option-icon">
                                  {isDeleting ? "…" : "⌫"}
                                </span>
                                {isDeleting
                                  ? "Deleting..."
                                  : "Delete Playlist"}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Playlists;
