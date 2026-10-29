
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { asyncLoadHomeData } from "../../store/actions/musicAction";
import "./Home.css";

const Home = ({ socket }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    musics = [],
    playlists = [],
    loading,
    error,
  } = useSelector((state) => state.musicReducer);

  const [currentMusic, setCurrentMusic] = useState(null);

  useEffect(() => {
    dispatch(asyncLoadHomeData());
  }, [dispatch]);

  // Handle artist as either a string or an object.
  const getArtistName = (music) => {
    if (typeof music?.artist === "string") {
      return music.artist;
    }

    if (music?.artist?.fullName) {
      return music.artist.fullName;
    }

    if (music?.artist?.firstName) {
      return `${music.artist.firstName} ${
        music.artist.lastName || ""
      }`.trim();
    }

    return "Unknown Artist";
  };

  // Support common cover-image response formats.
  const getCoverImage = (music) => {
    if (typeof music?.coverImageUrl === "string") {
      return music.coverImageUrl;
    }

    if (typeof music?.coverImage === "string") {
      return music.coverImage;
    }

    if (typeof music?.coverImage?.url === "string") {
      return music.coverImage.url;
    }

    return "";
  };

  // ================= PLAY MUSIC =================
  const handlePlayMusic = (music) => {
    if (!music?._id) return;

    setCurrentMusic(music);

    socket?.emit("playMusic", {
      musicId: music._id,
      currentTime: 0,
    });

    navigate(`/music/${music._id}?sync=true&time=0`);
  };

  // ================= OPEN PLAYLIST =================
  const handleOpenPlaylist = (playlist) => {
    if (!playlist?._id) return;

    navigate("/playlists", {
      state: {
        selectedPlaylistId: playlist._id,
      },
    });
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="home-page home-loading">
        <div className="home-loader" />
        <p>Loading your music...</p>
      </div>
    );
  }

  // ================= ERROR =================
  if (error) {
    return (
      <div className="home-page">
        <div className="home-error">
          <div className="home-error-icon">⚠️</div>

          <h2>Something went wrong</h2>
          <p>{error}</p>

          <button
            type="button"
            className="home-view-all"
            onClick={() => dispatch(asyncLoadHomeData())}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="home-container">
        {/* ================= HERO ================= */}
        <section className="home-hero">
          <div>
            <p className="home-subtitle">DISCOVER MUSIC</p>

            <h1>
              Your Music.
              <br />
              Your Vibe. 🎧
            </h1>

            <p className="home-description">
              Discover new music, explore playlists and enjoy
              your favorite songs all in one place.
            </p>
          </div>

          <div className="hero-music-icon">♪</div>
        </section>

        {/* ================= PLAYLISTS ================= */}
        <section className="home-section">
          <div className="home-section-header">
            <div>
              <h2>Featured Playlists</h2>
              <p>Explore playlists created by artists</p>
            </div>

            <button
              type="button"
              className="home-view-all"
              onClick={() => navigate("/playlists")}
            >
              View All
            </button>
          </div>

          {playlists.length === 0 ? (
            <div className="home-empty">
              <div>📀</div>
              <h3>No playlists available</h3>
              <p>Check back later for new playlists.</p>
            </div>
          ) : (
            <div className="home-playlist-grid">
              {playlists.map((playlist, index) => {
                const firstMusic = playlist.musics?.[0];
                const playlistCover = getCoverImage(firstMusic);

                return (
                  <div
                    className="home-playlist-card"
                    key={playlist._id || index}
                    onClick={() => handleOpenPlaylist(playlist)}
                  >
                    <div className="home-playlist-image-wrapper">
                      {playlistCover ? (
                        <img
                          src={playlistCover}
                          alt={playlist.title || "Playlist cover"}
                          className="home-playlist-image"
                        />
                      ) : (
                        <div className="home-playlist-placeholder">
                          🎵
                        </div>
                      )}

                      {firstMusic?._id && (
                        <button
                          type="button"
                          className="home-playlist-play"
                          aria-label={`Play ${playlist.title || "playlist"}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            handlePlayMusic(firstMusic);
                          }}
                        >
                          ▶
                        </button>
                      )}
                    </div>

                    <div className="home-playlist-content">
                      <h3>{playlist.title || "Untitled Playlist"}</h3>
                      <p>{playlist.artist || "Unknown Artist"}</p>
                      <span>{playlist.musics?.length || 0} songs</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ================= POPULAR MUSIC ================= */}
        <section className="home-section">
          <div className="home-section-header">
            <div>
              <h2>Popular Music</h2>
              <p>Listen to music from our artists</p>
            </div>

            {/* Opens the separate All Music page */}
            <button
              type="button"
              className="home-view-all"
              onClick={() => navigate("/music")}
            >
              View All
            </button>
          </div>

          {musics.length === 0 ? (
            <div className="home-empty">
              <div>🎵</div>
              <h3>No music available</h3>
              <p>New music will appear here.</p>
            </div>
          ) : (
            <div className="home-music-list">
              {musics.map((music, index) => {
                const cover = getCoverImage(music);

                return (
                  <div
                    className="home-music-card"
                    key={music._id || index}
                  >
                    <span className="home-music-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {cover ? (
                      <img
                        src={cover}
                        alt={music.title || "Music cover"}
                        className="home-music-cover"
                      />
                    ) : (
                      <div className="home-music-cover home-music-cover-fallback">
                        ♪
                      </div>
                    )}

                    <div className="home-music-info">
                      <h3>{music.title || "Untitled"}</h3>
                      <p>{getArtistName(music)}</p>
                    </div>

                    <button
                      type="button"
                      className="home-music-play"
                      aria-label={`Play ${music.title || "song"}`}
                      onClick={() => handlePlayMusic(music)}
                    >
                      ▶
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* ================= MINI AUDIO PLAYER ================= */}
      {currentMusic && (
        <div className="home-player">
          <div className="home-player-info">
            {getCoverImage(currentMusic) ? (
              <img
                src={getCoverImage(currentMusic)}
                alt={currentMusic.title || "Music cover"}
                className="home-player-cover"
              />
            ) : (
              <div className="home-player-cover home-music-cover-fallback">
                ♪
              </div>
            )}

            <div>
              <h3>{currentMusic.title || "Untitled"}</h3>
              <p>{getArtistName(currentMusic)}</p>
            </div>
          </div>

          <audio
            className="home-audio"
            controls
            autoPlay
            src={currentMusic.musicUrl}
          >
            Your browser does not support the audio element.
          </audio>

          <button
            type="button"
            className="home-player-close"
            aria-label="Close music player"
            onClick={() => setCurrentMusic(null)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
