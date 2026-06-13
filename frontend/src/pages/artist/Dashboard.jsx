import "./Dashboard.css";
import { useEffect, useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";



export default function Dashboard() {

  const navigate = useNavigate()

  const stats = [
  {
    title: "TOTAL PLAYS",
    value: "50,550",
  },
  {
    title: "MUSICS",
    value: "5",
  },
  {
    title: "PLAYLISTS",
    value: "3",
  },
  {
    title: "FOLLOWERS",
    value: "10,100",
  },
];

const [musics, setMusics] = useState([
   {
    _id: 1,
    title: "Midnight Echoes",
    artist: "You",
    coverImageUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
    plays: "12,450",
    duration: "3:42",
    released: "2024-11-10",
  },
  {
    _id: 2,
    title: "Golden Skies",
    artist: "You",
    coverImageUrl:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
    plays: "9,803",
    duration: "4:05",
    released: "2025-01-02",
  },
  {
    _id: 3,
    title: "Fading Lights",
    artist: "You",
    coverImageUrl:
      "https://images.unsplash.com/photo-1501612780327-45045538702b",
    plays: "15,221",
    duration: "2:58",
    released: "2024-09-28",
  },
])

const [playlists, setPlaylists] = useState([
   {
    _id: 1,
    title: "Chill Vibes",
    artist: "You",
    musics: [
      {
        title: "Midnight Echoes",
        coverImageUrl:
          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
      },
      {
        title: "Fading Lights",
        coverImageUrl:
          "https://images.unsplash.com/photo-1501612780327-45045538702b",
      },
      {
        title: "Ocean Drift",
        coverImageUrl:
          "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
      },
    ],
  },

  {
    _id: 2,
    title: "Focus Beats",
    artist: "You",
    musics: [
      {
        title: "Golden Skies",
        coverImageUrl:
          "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
      },
      {
        title: "Solstice",
        coverImageUrl:
          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
      },
      {
        title: "Fading Lights",
        coverImageUrl:
          "https://images.unsplash.com/photo-1501612780327-45045538702b",
      },
    ],
  },
])


useEffect(() => {
  axios.get('http://localhost:3002/api/music/artist-musics',{
    withCredentials:true
  })
    .then(res=>{
      setMusics(res.data.musics.map(m => ({
        id:m._id,
        title:m.title,
        artist:m.artist,
        coverImageUrl:m.coverImageUrl,
        musicUrl:m.musicUrl,
        plays:m.plays || 0,
        duration:m.duration || '3.00',
        released:m.released ? new Date(m.released).toISOString().split('T')[0]:'2024-01-01'
      })))
    })

    axios.get('http://localhost:3002/api/music/playlist/artist',{withCredentials:true})
    .then(res =>{
       setPlaylists(res.data.playlists.map(p => ({
                    id: p._id,
                    title: p.title,
                    artist: p.artist,
                    followers: p.followers || 0,
                    updated: p.updated ? `${Math.floor((Date.now() - new Date(p.updated).getTime()) / (1000 * 60 * 60 * 24))}d ago` : 'N/A',
                    musics: p.musics || []
                })));
    })
  
}, [])


  return (
    <div className="dashboard">
      {/* Header */}

      <div className="dashboard-header">
        <div>
          <h1>Artist Dashboard</h1>
          <p>Overview of your content performance</p>
        </div>

        <div className="dashboard-actions">
          <button className="primary-btn">
            + New Track
          </button>

          <button className="secondary-btn" onClick={() => navigate('/artist/dashboard/upload-music')}>
            + New Playlist
          </button>
        </div>
      </div>

      {/* Stats */}

      <div className="stats-grid">
        {stats.map((item) => (
          <div className="stat-card" key={item.title}>
            <span>{item.title}</span>
            <h2>{item.value}</h2>
          </div>
        ))}
      </div>

      {/* Main Content */}

      <div className="dashboard-content">

        {/* Music Table */}

        <div className="music-card">

          <div className="card-header">
            <h2>Musics</h2>

            <button>Manage</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Artist</th>
                <th>Plays</th>
                <th>Duration</th>
                <th>Released</th>
              </tr>
            </thead>

            <tbody>

              {musics.map((music) => (
                <tr key={music._id}>

                  <td>
                    <div className="music-info">
                      <img
                        src={music.coverImageUrl}
                        alt={music.title}
                      />

                      <div>
                        <p>{music.title}</p>
                        <small>{music.artist}</small>
                      </div>
                    </div>
                  </td>

                  <td>{music.artist}</td>

                  <td>{music.plays}</td>

                  <td>{music.duration}</td>

                  <td>{music.released}</td>

                </tr>
              ))}

            </tbody>
          </table>
        </div>

        {/* Playlists */}

        <div className="playlist-section">

          <div className="playlist-header">
            <h2>Playlists</h2>

            <button>View All</button>
          </div>

          {playlists.map((playlist) => (
            <div
              className="playlist-card"
              key={playlist._id}
            >
              <h3>{playlist.title}</h3>

              <p>{playlist.artist}</p>

              <small>
                {playlist.musics.length} Musics
              </small>

              <div className="playlist-covers">

                {playlist.musics
                  .slice(0, 3)
                  .map((music) => (
                    <img
                      key={music.title}
                      src={music.coverImageUrl}
                      alt={music.title}
                    />
                  ))}

              </div>

              <div className="playlist-song-list">

                {playlist.musics
                  .slice(0, 3)
                  .map((music) => (
                    <span key={music.title}>
                      {music.title}
                    </span>
                  ))}

              </div>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}