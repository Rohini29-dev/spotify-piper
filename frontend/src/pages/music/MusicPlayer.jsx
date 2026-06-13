import { useEffect, useRef, useState } from "react";
import "./MusicPlayer.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function MusicPlayer() {
  
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const newSocket = io.('http://localhost:3002',{
      withCredentials:true 
    })

    setSocket(newSocket)

    newSocket.on('play',(data) => {
      const musicId = data.musicId
      // console.log("Received play event for music Id:",musicId);
      window.location.href = `/music/${musicId}`
      
    })
  }, [])
  

    const navigate =useNavigate()
    const {id} = userParam()
  const audioRef = useRef(null);
   const [track, setTrack] = useState(null)


  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(1);
  const [speed, setSpeed] = useState(1);
 const [track, setTrack] = useState(null)


  const music = {
    title: "Midnight Echoes",
    artist: "Rohini",
    coverImageUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
    musicUrl:
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  };

  function togglePlay() {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setPlaying(!playing);
  }

  function handleVolume(e) {
    const value = Number(e.target.value);

    setVolume(value);

    if (audioRef.current) {
      audioRef.current.volume = value;
    }
  }

  function handleSpeed(e) {
    const value = Number(e.target.value);

    setSpeed(value);

    if (audioRef.current) {
      audioRef.current.playbackRate = value;
    }
  }

  useEffect(() => {
    axios.get(`http://localhost:3002/api/music/get-details/${id}`,{
        withCredentials:true
    }).then(res => {
        setTrack(res.data.music)
    })
    .catch(err=>{
        console.log(err);
        
    })
  }, [])
  

  if(!track){
    return <div>Loading...</div>
  }
  

  return (
    <div className="player-page">

      <div className="player-card">

        <img
          src={music.coverImageUrl}
          alt={music.title}
          className="cover-image"
        />

        <h1>{music.title}</h1>

        <p>{music.artist}</p>

        <audio
          ref={audioRef}
          src={music.musicUrl}
          autoPlay = {true}
        />

        <button
          className="play-btn"
          onClick={togglePlay}
        >
          {playing ? "⏸ Pause" : "▶ Play"}
        </button>

        {/* Volume */}

        <div className="control-group">
          <label>
            Volume: {Math.round(volume * 100)}%
          </label>

          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolume}
          />
        </div>

        {/* Speed */}

        <div className="control-group">
          <label>
            Speed: {speed}x
          </label>

          <input
            type="range"
            min="0.5"
            max="2"
            step="0.25"
            value={speed}
            onChange={handleSpeed}
          />
        </div>

      </div>

    </div>
  );
}