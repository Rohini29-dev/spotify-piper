import { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = ({ socket }) => {
  const navigate = useNavigate();

  const [musics, setMusics] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentMusic, setCurrentMusic] = useState(null);

  // =========================
  // Fetch Home Data
  // =========================

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        setError("");

        const [musicRes, playlistRes] = await Promise.all([
          axios.get("http://localhost:3002/api/music", {
            withCredentials: true,
          }),

          axios.get("http://localhost:3002/api/music/playlist", {
            withCredentials: true,
          }),
        ]);

        console.log("Music response:", musicRes.data);
        console.log("Playlist response:", playlistRes.data);

        setMusics(musicRes.data.musics || []);
        setPlaylists(playlistRes.data.playlists || []);
      } catch (err) {
        console.error("Home data error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load music. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // =========================
  // Play Music
  // =========================

 const handlePlayMusic = (music) => {
  if (!music?._id) return;

  socket?.emit("playMusic", {
    musicId: music._id,
    currentTime: 0,
  });

  navigate(`/music/${music._id}?sync=true&time=0`);
};

  // =========================
  // Open Playlist
  // =========================

  const handleOpenPlaylist = (playlist) => {
    if (!playlist?._id) return;

    navigate(`/playlist/${playlist._id}`);
  };

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div className="home-page home-loading">
        <div className="home-loader"></div>

        <p>Loading your music...</p>
      </div>
    );
  }

  // =========================
  // Error
  // =========================

  if (error) {
    return (
      <div className="home-page">
        <div className="home-error">
          <div className="home-error-icon">⚠️</div>

          <h2>Something went wrong</h2>

          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="home-container">

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="home-hero">

          <div>
            <p className="home-subtitle">
              DISCOVER MUSIC
            </p>

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

          <div className="hero-music-icon">
            ♪
          </div>

        </section>


        {/* =====================================================
            PLAYLISTS
        ===================================================== */}

        <section className="home-section">

          <div className="home-section-header">

            <div>
              <h2>Featured Playlists</h2>

              <p>
                Explore playlists created by artists
              </p>
            </div>

            <button
              className="home-view-all"
              onClick={() => {
                // Future: navigate("/playlists")
              }}
            >
              View All
            </button>

          </div>


          {/* No Playlists */}

          {playlists.length === 0 ? (

            <div className="home-empty">

              <div>📀</div>

              <h3>
                No playlists available
              </h3>

              <p>
                Check back later for new playlists.
              </p>

            </div>

          ) : (

            <div className="home-playlist-grid">

              {playlists.map((playlist, index) => {

                const firstMusic =
                  playlist.musics?.[0];

                return (

                  <div
                    className="home-playlist-card"
                    key={playlist._id || index}
                    onClick={() =>
                      handleOpenPlaylist(playlist)
                    }
                  >

                    {/* =========================
                        Playlist Image
                    ========================= */}

                    <div className="home-playlist-image-wrapper">

                      {firstMusic?.coverImageUrl ? (

                        <img
                          src={firstMusic.coverImageUrl}
                          alt={playlist.title}
                          className="home-playlist-image"
                        />

                      ) : (

                        <div className="home-playlist-placeholder">
                          🎵
                        </div>

                      )}


                      {/* =========================
                          Play First Song
                      ========================= */}

                      {firstMusic?._id && (

                        <button
  className="home-playlist-play"
  onClick={(e) => {
    e.stopPropagation();

    const firstMusic = playlist.musics?.[0];

    if (!firstMusic?._id) return;

    socket?.emit("playMusic", {
      musicId: firstMusic._id,
      currentTime: 0,
    });

    navigate(
      `/music/${firstMusic._id}?sync=true&time=0`
    );
  }}
>
  ▶
</button>

                      )}

                    </div>


                    {/* =========================
                        Playlist Information
                    ========================= */}

                    <div className="home-playlist-content">

                      <h3>
                        {playlist.title}
                      </h3>

                      <p>
                        {playlist.artist}
                      </p>

                      <span>
                        {playlist.musics?.length || 0} songs
                      </span>

                    </div>

                  </div>

                );
              })}

            </div>

          )}

        </section>


        {/* =====================================================
            MUSIC SECTION
        ===================================================== */}

        <section className="home-section">

          <div className="home-section-header">

            <div>

              <h2>
                Popular Music
              </h2>

              <p>
                Listen to music from our artists
              </p>

            </div>

            <button
              className="home-view-all"
              onClick={() => {
                // Future: navigate("/music")
              }}
            >
              View All
            </button>

          </div>


          {/* No Music */}

          {musics.length === 0 ? (

            <div className="home-empty">

              <div>🎵</div>

              <h3>
                No music available
              </h3>

              <p>
                New music will appear here.
              </p>

            </div>

          ) : (

            <div className="home-music-list">

              {musics.map((music, index) => (

                <div
                  className="home-music-card"
                  key={music._id || index}
                >

                  {/* Number */}

                  <span className="home-music-number">

                    {String(index + 1).padStart(2, "0")}

                  </span>


                  {/* Cover */}

                  <img
                    src={music.coverImageUrl}
                    alt={music.title}
                    className="home-music-cover"
                  />


                  {/* Music Information */}

                  <div className="home-music-info">

                    <h3>
                      {music.title}
                    </h3>

                    <p>
                      {music.artist}
                    </p>

                  </div>


                  {/* Play Button */}

                 <button
  className="home-music-play"
  onClick={() => handlePlayMusic(music)}
>
  ▶
</button>

                </div>

              ))}

            </div>

          )}

        </section>

      </div>


      {/* =====================================================
          MINI AUDIO PLAYER
      ===================================================== */}

      {currentMusic && (

        <div className="home-player">

          {/* Music Info */}

          <div className="home-player-info">

            <img
              src={currentMusic.coverImageUrl}
              alt={currentMusic.title}
              className="home-player-cover"
            />

            <div>

              <h3>
                {currentMusic.title}
              </h3>

              <p>
                {currentMusic.artist}
              </p>

            </div>

          </div>


          {/* Audio */}

          <audio
            className="home-audio"
            controls
            autoPlay
            src={currentMusic.musicUrl}
          >
            Your browser does not support the audio element.
          </audio>


          {/* Close */}

          <button
            className="home-player-close"
            onClick={() =>
              setCurrentMusic(null)
            }
          >
            ✕
          </button>

        </div>

      )}

    </div>
  );
};

export default Home;