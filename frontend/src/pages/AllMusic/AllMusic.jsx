
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { asyncGetAllMusics } from "../../store/actions/musicAction";
import "./AllMusic.css";

const AllMusic = ({ socket }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { musics, loading, error } = useSelector(
    (state) => state.musicReducer
  );

  useEffect(() => {
    dispatch(asyncGetAllMusics());
  }, [dispatch]);

  const getArtistName = (music) => {
    if (typeof music?.artist === "string") {
      return music.artist;
    }

    if (music?.artist?.fullName) {
      return music.artist.fullName;
    }

    if (music?.artist?.firstName) {
      return `${music.artist.firstName} ${music.artist.lastName || ""}`.trim();
    }

    return "Unknown Artist";
  };

  const getCoverImage = (music) => {
    return (
      music?.coverImageUrl ||
      music?.coverImage ||
      music?.coverImage?.url ||
      music?.cover ||
      music?.imageUrl ||
      ""
    );
  };

  const handlePlayMusic = (music) => {
    if (!music?._id) return;

    if (socket) {
      socket.emit("playMusic", {
        musicId: music._id,
        music,
        currentTime: 0,
      });
    }

    navigate(`/music/${music._id}?sync=true&time=0`);
  };

  return (
    <main className="all-music-page">
      <header className="all-music-header">
        <button
          className="all-music-back"
          onClick={() => navigate("/")}
          type="button"
        >
          <span aria-hidden="true">←</span> Home
        </button>

        <div className="all-music-heading">
          <span className="all-music-eyebrow">YOUR MUSIC SPACE</span>
          <h1>All Music</h1>
          <p>Discover your next favourite song.</p>
        </div>

        <div className="all-music-count">
          <span>{musics?.length || 0}</span>
          <small>Songs</small>
        </div>
      </header>

      <section className="all-music-content">
        <div className="all-music-section-heading">
          <div>
            <h2>Popular Music</h2>
            <p>All available tracks in one place</p>
          </div>
        </div>

        {loading && (!musics || musics.length === 0) && (
          <div className="all-music-message">
            <div className="all-music-loader" />
            <p>Loading your music...</p>
          </div>
        )}

        {!loading && error && (!musics || musics.length === 0) && (
          <div className="all-music-message all-music-error">
            <span className="all-music-message-icon">!</span>
            <h3>Music couldn't be loaded</h3>
            <p>{error}</p>
            <button
              type="button"
              onClick={() => dispatch(asyncGetAllMusics())}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (!musics || musics.length === 0) && (
          <div className="all-music-message">
            <div className="all-music-empty-icon">♫</div>
            <h3>No songs available yet</h3>
            <p>Music uploaded by artists will appear here.</p>
          </div>
        )}

        {musics && musics.length > 0 && (
          <div className="all-music-grid">
            {musics.map((music, index) => {
              const cover = getCoverImage(music);

              return (
                <article className="all-music-card" key={music._id || index}>
                  <div className="all-music-cover-wrap">
                    {cover ? (
                      <img
                        className="all-music-cover"
                        src={cover}
                        alt={`${music.title || "Song"} cover`}
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                          event.currentTarget.nextElementSibling.style.display =
                            "flex";
                        }}
                      />
                    ) : null}

                    <div
                      className="all-music-cover-fallback"
                      style={{ display: cover ? "none" : "flex" }}
                    >
                      <span>♫</span>
                    </div>

                    <button
                      className="all-music-play-button"
                      type="button"
                      aria-label={`Play ${music.title || "song"}`}
                      onClick={() => handlePlayMusic(music)}
                    >
                      <span>▶</span>
                    </button>

                    <span className="all-music-track-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="all-music-card-info">
                    <h3 title={music.title || "Untitled"}>
                      {music.title || "Untitled"}
                    </h3>
                    <p title={getArtistName(music)}>
                      {getArtistName(music)}
                    </p>
                  </div>

                  <button
                    className="all-music-open-button"
                    type="button"
                    onClick={() => handlePlayMusic(music)}
                  >
                    Play song <span>↗</span>
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};

export default AllMusic;
