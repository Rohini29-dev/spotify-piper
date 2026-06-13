import { useNavigate } from "react-router-dom";
import "./Home.css";
import { useEffect, useState } from "react";



export default function Home({socket}) {

const navigate = useNavigate()

const [playlists, setplaylists] = useState([
   {
    _id: 1,
    title: "Chill Vibes",
    totalSongs: 12,
    coverImage:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
  },
  {
    _id: 2,
    title: "Focus Beats",
    totalSongs: 8,
    coverImage:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
  },
  {
    _id: 3,
    title: "Party Mix",
    totalSongs: 15,
    coverImage:
      "https://images.unsplash.com/photo-1501612780327-45045538702b",
  },
])

const [musics, setMusics] = useState([
   {
    _id: 1,
    title: "Midnight Echoes",
    artist: "Rohini",
    coverImageUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
  },
  {
    _id: 2,
    title: "Golden Skies",
    artist: "Rohini",
    coverImageUrl:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
  },
  {
    _id: 3,
    title: "Fading Lights",
    artist: "Rohini",
    coverImageUrl:
      "https://images.unsplash.com/photo-1501612780327-45045538702b",
  },
])

useEffect(() => {
    axios.get("http://localhost:3002/api/music", { withCredentials: true })
      .then(res => {
        setMusics(res.data.musics.map(m => ({
          id: m._id,
          title: m.title,
          artist: m.artist,
          coverImageUrl: m.coverImageUrl,
          musicUrl: m.musicUrl,
        })))
      })

    axios.get("http://localhost:3002/api/music/playlist", { withCredentials: true })
      .then(res => {
        setPlaylists(res.data.playlists.map(p => ({
          id: p._id,
          title: p.title,
          count: p.musics.length
        })))
      })
}, [])



  return (
    <div className="home">

      {/* Header */}

      <header className="home-header">
        <h1>Spotify Piper</h1>
        <p>Discover amazing music and playlists</p>
      </header>

      {/* Playlists */}

      <section className="section">
        <div className="section-header">
          <h2>Featured Playlists</h2>
        </div>

        <div className="playlist-grid">

          {playlists.map((playlist) => (
            <div
              className="playlist-card"
              key={playlist._id}
            >
              <img
                src={playlist.coverImage}
                alt={playlist.title}
              />

              <h3>{playlist.title}</h3>

              <p>
                {playlist.totalSongs} Songs
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* Musics */}

      <section className="section">
        <div className="section-header">
          <h2>Trending Musics</h2>
        </div>

        <div 
        onClick={() =>{
          socket?.emit('play',{musicId:m.id}) 
          navigate('/music/${m.id')}}
        className="music-grid">

          {musics.map((music) => (
            <div
              className="music-card"
              key={music._id}
            >
              <img
                src={music.coverImageUrl}
                alt={music.title}
              />

              <h3>{music.title}</h3>

              <p>{music.artist}</p>

              <button>
                ▶ Play
              </button>
            </div>
          ))}

        </div>
      </section>

    </div>
  );
}