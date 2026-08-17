import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import axios from "axios";

import "./MusicPlayer.css";

const MusicPlayer = ({ socket }) => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const audioRef = useRef(null);

  const [music, setMusic] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  const [volume, setVolume] =
    useState(1);

  const [isMuted, setIsMuted] =
    useState(false);

  const [playbackRate, setPlaybackRate] =
    useState(1);

  // =========================================
  // AUTOPLAY BLOCKED STATE
  // =========================================

  const [showJoinButton, setShowJoinButton] =
    useState(false);

  // =========================================
  // FETCH MUSIC
  // =========================================

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `http://localhost:3002/api/music/get-details/${id}`,
          {
            withCredentials: true,
          }
        );

        console.log(
          "Music details:",
          response.data
        );

        setMusic(response.data.music);
      } catch (err) {
        console.error(
          "Music details error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load music."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMusic();
  }, [id]);

  // =========================================
  // AUDIO EVENTS
  // =========================================

  useEffect(() => {
    const audio =
      audioRef.current;

    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(
        audio.currentTime
      );
    };

    const updateDuration = () => {
      setDuration(
        audio.duration || 0
      );
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener(
      "timeupdate",
      updateTime
    );

    audio.addEventListener(
      "loadedmetadata",
      updateDuration
    );

    audio.addEventListener(
      "ended",
      handleEnded
    );

    return () => {
      audio.removeEventListener(
        "timeupdate",
        updateTime
      );

      audio.removeEventListener(
        "loadedmetadata",
        updateDuration
      );

      audio.removeEventListener(
        "ended",
        handleEnded
      );
    };
  }, [music]);

  // =========================================
  // AUTO START FOR REMOTE USER
  // =========================================

  useEffect(() => {
    if (!music) return;

    const isSync =
      searchParams.get("sync") === "true";

    if (!isSync) return;

    const startTime = Number(
      searchParams.get("time") || 0
    );

    const audio =
      audioRef.current;

    if (!audio) return;

    const startMusic = async () => {
      try {
        audio.currentTime =
          startTime;

        await audio.play();

        setIsPlaying(true);

        setCurrentTime(
          audio.currentTime
        );

        setShowJoinButton(false);

        console.log(
          "Auto play started"
        );
      } catch (error) {
        console.log(
          "Autoplay blocked by browser"
        );

        setShowJoinButton(true);
      }
    };

    if (
      audio.readyState >= 1
    ) {
      startMusic();
    } else {
      audio.addEventListener(
        "loadedmetadata",
        startMusic,
        {
          once: true,
        }
      );
    }

    return () => {
      audio.removeEventListener(
        "loadedmetadata",
        startMusic
      );
    };
  }, [music, searchParams]);

  // =========================================
  // JOIN & PLAY
  // =========================================

  const handleJoinAndPlay =
    async () => {
      const audio =
        audioRef.current;

      if (!audio) return;

      try {
        const startTime = Number(
          searchParams.get(
            "time"
          ) || 0
        );

        audio.currentTime =
          startTime;

        await audio.play();

        setIsPlaying(true);

        setShowJoinButton(false);

        socket?.emit("play", {
          musicId: id,
          currentTime:
            audio.currentTime,
        });
      } catch (error) {
        console.error(
          "Join play error:",
          error
        );
      }
    };

  // =========================================
  // SOCKET LISTENERS
  // =========================================

  useEffect(() => {
    if (!socket) return;

    console.log(
      "Socket listeners registered"
    );

    // =======================================
    // PLAY
    // =======================================

    const handleRemotePlay = async ({
      musicId,
      currentTime,
    }) => {
      if (musicId !== id) return;

      const audio =
        audioRef.current;

      if (!audio) return;

      try {
        audio.currentTime =
          currentTime ??
          audio.currentTime;

        await audio.play();

        setIsPlaying(true);

        setCurrentTime(
          audio.currentTime
        );

        setShowJoinButton(false);

        console.log(
          "Remote play"
        );
      } catch (error) {
        console.log(
          "Remote autoplay blocked"
        );

        setShowJoinButton(true);
      }
    };

    // =======================================
    // PAUSE
    // =======================================

    const handleRemotePause = ({
      musicId,
      currentTime,
    }) => {
      if (musicId !== id) return;

      const audio =
        audioRef.current;

      if (!audio) return;

      if (
        currentTime !== undefined
      ) {
        audio.currentTime =
          currentTime;
      }

      audio.pause();

      setIsPlaying(false);

      setCurrentTime(
        audio.currentTime
      );
    };

    // =======================================
    // SEEK
    // =======================================

    const handleRemoteSeek = ({
      musicId,
      currentTime,
    }) => {
      if (musicId !== id) return;

      const audio =
        audioRef.current;

      if (!audio) return;

      audio.currentTime =
        currentTime;

      setCurrentTime(
        currentTime
      );
    };

    // =======================================
    // VOLUME
    // =======================================

    const handleRemoteVolume = ({
      musicId,
      volume,
    }) => {
      if (musicId !== id) return;

      const audio =
        audioRef.current;

      if (!audio) return;

      audio.muted = false;

      audio.volume =
        volume;

      setVolume(volume);

      setIsMuted(
        volume === 0
      );
    };

    // =======================================
    // SPEED
    // =======================================

    const handleRemoteSpeed = ({
      musicId,
      speed,
    }) => {
      if (musicId !== id) return;

      const audio =
        audioRef.current;

      if (!audio) return;

      audio.playbackRate =
        speed;

      setPlaybackRate(
        speed
      );
    };

    // =======================================
    // LEAVE
    // =======================================

    const handleRemoteLeave = ({ musicId }) => {
  if (musicId !== id) return;

  console.log("Remote user left:", musicId);

  const audio = audioRef.current;

  if (audio) {
    audio.pause();
  }

  navigate(-1);
};
    socket.on(
      "play",
      handleRemotePlay
    );

    socket.on(
      "pause",
      handleRemotePause
    );

    socket.on(
      "seek",
      handleRemoteSeek
    );

    socket.on(
      "volume",
      handleRemoteVolume
    );

    socket.on(
      "speed",
      handleRemoteSpeed
    );

    socket.on(
      "leaveMusic",
      handleRemoteLeave
    );

    return () => {
      socket.off(
        "play",
        handleRemotePlay
      );

      socket.off(
        "pause",
        handleRemotePause
      );

      socket.off(
        "seek",
        handleRemoteSeek
      );

      socket.off(
        "volume",
        handleRemoteVolume
      );

      socket.off(
        "speed",
        handleRemoteSpeed
      );

      socket.off(
        "leaveMusic",
        handleRemoteLeave
      );
    };
  }, [socket, id]);

  // =========================================
  // PLAY / PAUSE
  // =========================================

  const togglePlay =
    async () => {
      const audio =
        audioRef.current;

      if (!audio) return;

      try {
        if (audio.paused) {
          await audio.play();

          setIsPlaying(true);

          setShowJoinButton(false);

          socket?.emit(
            "play",
            {
              musicId: id,
              currentTime:
                audio.currentTime,
            }
          );
        } else {
          audio.pause();

          setIsPlaying(false);

          socket?.emit(
            "pause",
            {
              musicId: id,
              currentTime:
                audio.currentTime,
            }
          );
        }
      } catch (error) {
        console.error(
          "Play error:",
          error
        );
      }
    };

  // =========================================
  // SEEK
  // =========================================

  const handleSeek = (e) => {
    const value =
      Number(e.target.value);

    const audio =
      audioRef.current;

    if (!audio) return;

    audio.currentTime =
      value;

    setCurrentTime(value);

    socket?.emit(
      "seek",
      {
        musicId: id,
        currentTime: value,
      }
    );
  };

  // =========================================
  // VOLUME
  // =========================================

  const handleVolume = (e) => {
    const value =
      Number(e.target.value);

    const audio =
      audioRef.current;

    if (!audio) return;

    audio.muted = false;

    audio.volume =
      value;

    setVolume(value);

    setIsMuted(
      value === 0
    );

    socket?.emit(
      "volume",
      {
        musicId: id,
        volume: value,
      }
    );
  };

  // =========================================
  // MUTE
  // =========================================

  const toggleMute =
    () => {
      const audio =
        audioRef.current;

      if (!audio) return;

      if (audio.muted) {
        const newVolume =
          volume || 1;

        audio.muted =
          false;

        audio.volume =
          newVolume;

        setVolume(
          newVolume
        );

        setIsMuted(false);

        socket?.emit(
          "volume",
          {
            musicId: id,
            volume:
              newVolume,
          }
        );
      } else {
        audio.muted =
          true;

        setIsMuted(true);

        socket?.emit(
          "volume",
          {
            musicId: id,
            volume: 0,
          }
        );
      }
    };

  // =========================================
  // SPEED
  // =========================================

  const handlePlaybackRate =
    (e) => {
      const speed =
        Number(e.target.value);

      const audio =
        audioRef.current;

      if (!audio) return;

      audio.playbackRate =
        speed;

      setPlaybackRate(
        speed
      );

      socket?.emit(
        "speed",
        {
          musicId: id,
          speed,
        }
      );
    };

  // =========================================
  // SKIP
  // =========================================

  const skipTime =
    (seconds) => {
      const audio =
        audioRef.current;

      if (!audio) return;

      const newTime =
        Math.min(
          Math.max(
            audio.currentTime +
              seconds,
            0
          ),
          duration
        );

      audio.currentTime =
        newTime;

      setCurrentTime(
        newTime
      );

      socket?.emit(
        "seek",
        {
          musicId: id,
          currentTime:
            newTime,
        }
      );
    };

  // =========================================
  // LEAVE
  // =========================================

  const leaveMusic = () => {
  const audio = audioRef.current;

  if (audio) {
    audio.pause();
  }

  socket?.emit("leaveMusic", {
    musicId: id,
  });

  navigate(-1);
};

  // =========================================
  // FORMAT TIME
  // =========================================

  const formatTime =
    (time) => {
      if (
        !time ||
        Number.isNaN(time)
      ) {
        return "0:00";
      }

      const minutes =
        Math.floor(
          time / 60
        );

      const seconds =
        Math.floor(
          time % 60
        );

      return `${minutes}:${seconds
        .toString()
        .padStart(2, "0")}`;
    };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="music-player-page player-loading">
        <div className="player-loader"></div>

        <p>
          Loading music...
        </p>
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (
    error ||
    !music
  ) {
    return (
      <div className="music-player-page">
        <div className="player-error">

          <div className="player-error-icon">
            🎵
          </div>

          <h2>
            Music not found
          </h2>

          <p>
            {error ||
              "Unable to find this music."}
          </p>

          <button
            className="back-dashboard-btn"
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
  // UI
  // =========================================

  return (
    <div className="music-player-page">

      <div className="music-player-container">

        <button
          className="player-back-btn"
          onClick={
            leaveMusic
          }
        >
          ← Back
        </button>

        <div className="music-player-card">

          {/* COVER */}

          <div className="player-cover-section">

            <div
              className={`player-cover-wrapper ${
                isPlaying
                  ? "is-playing"
                  : ""
              }`}
            >
              <img
                src={
                  music.coverImageUrl
                }
                alt={
                  music.title
                }
                className="player-cover"
              />
            </div>

          </div>

          {/* INFO */}

          <div className="player-info">

            <p className="player-label">
              NOW PLAYING
            </p>

            <h1>
              {music.title}
            </h1>

            <p className="player-artist">
              {music.artist}
            </p>

            <audio
              ref={audioRef}
              src={music.musicUrl}
              preload="metadata"
            />

            {/* AUTOPLAY / JOIN */}

            {showJoinButton && (
              <button
                className="join-play-btn"
                onClick={
                  handleJoinAndPlay
                }
              >
                ▶ Join & Play
              </button>
            )}

            {/* PROGRESS */}

            <div className="progress-section">

              <input
                type="range"
                min="0"
                max={
                  duration || 0
                }
                value={Math.min(
                  currentTime,
                  duration || 0
                )}
                onChange={
                  handleSeek
                }
                className="progress-bar"
                style={{
                  "--progress":
                    duration
                      ? `${
                          (currentTime /
                            duration) *
                          100
                        }%`
                      : "0%",
                }}
              />

              <div className="time-row">

                <span>
                  {formatTime(
                    currentTime
                  )}
                </span>

                <span>
                  {formatTime(
                    duration
                  )}
                </span>

              </div>

            </div>

            {/* MAIN CONTROLS */}

            <div className="main-controls">

              <button
                className="skip-btn"
                onClick={() =>
                  skipTime(-10)
                }
              >
                ↶
                <span>
                  10
                </span>
              </button>

              <button
                className="play-pause-btn"
                onClick={
                  togglePlay
                }
              >
                {isPlaying
                  ? "❚❚"
                  : "▶"}
              </button>

              <button
                className="skip-btn"
                onClick={() =>
                  skipTime(10)
                }
              >
                <span>
                  10
                </span>
                ↷
              </button>

            </div>

            {/* BOTTOM CONTROLS */}

            <div className="player-bottom-controls">

              {/* VOLUME */}

              <div className="volume-control">

                <button
                  className="control-icon-btn"
                  onClick={
                    toggleMute
                  }
                >
                  {isMuted
                    ? "🔇"
                    : volume < 0.5
                    ? "🔉"
                    : "🔊"}
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={
                    isMuted
                      ? 0
                      : volume
                  }
                  onChange={
                    handleVolume
                  }
                  className="volume-bar"
                />

                <span className="volume-value">
                  {Math.round(
                    (isMuted
                      ? 0
                      : volume) *
                      100
                  )}
                  %
                </span>

              </div>

              {/* SPEED */}

              <div className="speed-control">

                <span className="speed-label">
                  Speed
                </span>

                <select
                  value={
                    playbackRate
                  }
                  onChange={
                    handlePlaybackRate
                  }
                  className="speed-select"
                >
                  <option value="0.5">
                    0.5x
                  </option>

                  <option value="0.75">
                    0.75x
                  </option>

                  <option value="1">
                    1x
                  </option>

                  <option value="1.25">
                    1.25x
                  </option>

                  <option value="1.5">
                    1.5x
                  </option>

                  <option value="1.75">
                    1.75x
                  </option>

                  <option value="2">
                    2x
                  </option>
                </select>

              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;