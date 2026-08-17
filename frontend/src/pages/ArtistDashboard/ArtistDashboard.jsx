import { useState } from "react";
import "./ArtistDashboard.css";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ArtistDashboard = () => {
  const navigate = useNavigate()

  const [musics, setmusics] = useState([]);
const [playlists, setplaylists] = useState([]);


 useEffect(() => {
  const fetchArtistData = async () => {
    try {
      const [musicRes, playlistRes] = await Promise.all([
        axios.get("http://localhost:3002/api/music/artist-musics", {
          withCredentials: true,
        }),

        axios.get("http://localhost:3002/api/music/playlist/artist", {
          withCredentials: true,
        }),
      ]);

      console.log("Music response:", musicRes.data);
      console.log("Playlist response:", playlistRes.data);

      setmusics(musicRes.data.musics);
      setplaylists(playlistRes.data.playlists);
    } catch (error) {
      console.log("Error fetching artist dashboard data:", error);
    }
  };

  fetchArtistData();
}, []);
  

  return (
    <div className="artist-dashboard">
      {/* Header */}
      <section className="dashboard-header">
        <div>
          <p className="dashboard-subtitle">ARTIST DASHBOARD</p>

          <h1>Welcome back, Artist 👋</h1>

          <p className="dashboard-description">
            Manage your music and playlists from one place.
          </p>
        </div>

        <button 
        onClick={()=>navigate('/artist/dashboard/upload-music')}
        className="upload-btn">
          + Upload Music
        </button>
      </section>

      {/* Stats */}
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

      {/* Musics */}
      <section className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>Your Musics</h2>
            <p>All songs uploaded by you</p>
          </div>

          <button className="view-all-btn">
            View All
          </button>
        </div>

        <div className="music-list">
          {musics.map((music, index) => (
            <div className="music-card" key={music.musicUrl || index}>
              <div className="music-number">
                {index + 1}
              </div>

              <img
                src={music.coverImageUrl}
                alt={music.title}
                className="music-cover"
              />

              <div className="music-info">
                <h3>{music.title}</h3>
                <p>{music.artist}</p>
              </div>

              <button
                className="play-btn"
                onClick={() => {
                  console.log("Play:", music.musicUrl);
                }}
              >
                ▶
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Playlists */}
      <section className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>Your Playlists</h2>
            <p>Your created playlists</p>
          </div>

          <button className="view-all-btn">
            View All
          </button>
        </div>

        <div className="playlist-grid">
          {playlists.map((playlist, index) => (
            <div
              className="playlist-card"
              key={playlist.title || index}
            >
              <div className="playlist-image-wrapper">
                {playlist.musics?.[0]?.coverImageUrl ? (
                  <img
                    src={playlist.musics[0].coverImageUrl}
                    alt={playlist.title}
                    className="playlist-image"
                  />
                ) : (
                  <div className="playlist-placeholder">
                    🎵
                  </div>
                )}

                <button className="playlist-play-btn">
                  ▶
                </button>
              </div>

              <div className="playlist-content">
                <h3>{playlist.title}</h3>

                <p>{playlist.artist}</p>

                <span>
                  {playlist.musics?.length || 0} songs
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ArtistDashboard;