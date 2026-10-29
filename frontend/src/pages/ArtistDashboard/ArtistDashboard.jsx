import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { asyncDeletePlaylist, asyncGetArtistDashboard } from "../../store/actions/musicAction";

import "./ArtistDashboard.css";

const ArtistDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    artistMusics: musics,
    artistPlaylists: playlists,
    artistDashboardLoading: loading,
    artistDashboardError: error,
  } = useSelector((state) => state.musicReducer);

  useEffect(() => {
    dispatch(asyncGetArtistDashboard());
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(asyncGetArtistDashboard());
  };

  const handlePlayMusic = (music) => {
    if (!music?._id) return;

    navigate(`/music/${music._id}`);
  };

 const handleOpenPlaylist = (playlist) => {
  if (!playlist?._id) return;

  navigate("/playlists", {
    state: {
      selectedPlaylistId: playlist._id,
    },
  });
};

  const handleDeletePlaylist = async (playlist) => {
  if (!playlist?._id) return;

  const confirmed = window.confirm(
    `Are you sure you want to delete "${playlist.title}"?`
  );

  if (!confirmed) return;

  try {
    await dispatch(asyncDeletePlaylist(playlist._id));
    alert("Playlist deleted successfully!");
  } catch (error) {
    alert(
      error.response?.data?.message ||
        "Unable to delete playlist."
    );
  }
};

  return (
    <div className="artist-dashboard">
      {/* HEADER */}
      
{/* HEADER */}
<section className="dashboard-header">
  <div>
    <p className="dashboard-subtitle">ARTIST DASHBOARD</p>

    <h1>Welcome back, Artist 👋</h1>

    <p className="dashboard-description">
      Manage your music and playlists from one place.
    </p>
  </div>

  <div className="dashboard-header-actions">
    <button
      onClick={() => navigate("/artist/dashboard/upload-music")}
      className="upload-btn"
    >
      + Upload Music
    </button>

   <button
  className="create-playlist-btn"
  onClick={() => navigate("/artist/dashboard/create-playlist")}
>
  + Create Playlist
</button>
  </div>
</section>


      {/* ERROR */}
      {error && (
        <div className="dashboard-error" role="alert">
          <p>{error}</p>

          <button onClick={handleRetry}>
            Try Again
          </button>
        </div>
      )}

      {/* STATS */}
      <section className="dashboard-stats">
        <div className="stat-card">
          <span className="stat-icon">🎵</span>

          <div>
            <h3>{musics.length}</h3>
            <p>Total Musics</p>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">📀</span>

          <div>
            <h3>{playlists.length}</h3>
            <p>Playlists</p>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">▶</span>

          <div>
            <h3>1.2K</h3>
            <p>Total Plays</p>
          </div>
        </div>
      </section>

      {/* MUSIC */}
      <section className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>Your Musics</h2>
            <p>All songs uploaded by you</p>
          </div>

          <button
            className="view-all-btn"
            onClick={() => navigate("/artist/dashboard/upload-music")}
          >
            + Upload Music
          </button>
        </div>

        {loading ? (
          <p>Loading your music...</p>
        ) : musics.length === 0 ? (
          <div className="dashboard-empty">
            <span>🎵</span>

            <h3>No music uploaded yet</h3>

            <p>
              Upload your first song to get started.
            </p>

            <button
              className="upload-btn"
              onClick={() => navigate("/artist/dashboard/upload-music")}
            >
              Upload Your First Song
            </button>
          </div>
        ) : (
          <div className="music-list">
            {musics.map((music, index) => (
              <div
                className="music-card"
                key={music._id || index}
              >
                <div className="music-number">
                  {index + 1}
                </div>

                <img
                  src={
                    music.coverImageUrl ||
                    music.coverImageURL ||
                    ""
                  }
                  alt={music.title || "Music cover"}
                  className="music-cover"
                />

                <div className="music-info">
                  <h3>{music.title || "Untitled Music"}</h3>

                  <p>{music.artist || "Unknown Artist"}</p>
                </div>

                <button
                  className="play-btn"
                  onClick={() => handlePlayMusic(music)}
                  aria-label={`Play ${music.title || "music"}`}
                >
                  ▶
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* PLAYLISTS */}
      <section className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>Your Playlists</h2>
            <p>Your created playlists</p>
          </div>
        </div>

        {loading ? (
          <p>Loading your playlists...</p>
        ) : playlists.length === 0 ? (
          <div className="dashboard-empty">
            <span>📀</span>

            <h3>No playlists yet</h3>

            <p>Your created playlists will appear here.</p>
          </div>
        ) : (
          <div className="playlist-grid">
            {playlists.map((playlist, index) => (
              <div
                className="playlist-card"
                key={playlist._id || index}
              >
                <div className="playlist-image-wrapper">
                  {playlist.musics?.[0]?.coverImageUrl ? (
                    <img
                      src={playlist.musics[0].coverImageUrl}
                      alt={playlist.title || "Playlist cover"}
                      className="playlist-image"
                    />
                  ) : (
                    <div className="playlist-placeholder">
                      🎵
                    </div>
                  )}

                  <button
                    className="playlist-play-btn"
                    onClick={() => handleOpenPlaylist(playlist)}
                    aria-label={`Open ${playlist.title || "playlist"}`}
                  >
                    ▶
                  </button>
                </div>

                <div className="playlist-content">
                  <h3>{playlist.title || "Untitled Playlist"}</h3>

                  <p>{playlist.artist || "Your playlist"}</p>

                  <span>
                    {playlist.musics?.length || 0} songs
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ArtistDashboard;