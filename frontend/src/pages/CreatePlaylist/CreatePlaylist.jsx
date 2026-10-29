import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  asyncLoadArtistMusics,
  asyncCreatePlaylist,
} from "../../store/actions/musicAction";
import "./CreatePlaylist.css";

const getMusicId = (music) => music?._id || music?.id;

const getCoverImage = (music) =>
  music?.coverImageUrl ||
  music?.coverImageURL ||
  music?.coverImage ||
  music?.coverImageKey ||
  "";

const CreatePlaylist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const artistMusics = useSelector(
    (state) => state.musicReducer?.artistMusics || []
  );

  const [playlistTitle, setPlaylistTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMusics, setSelectedMusics] = useState([]);
  const [loadingSongs, setLoadingSongs] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pageError, setPageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let active = true;

    const loadSongs = async () => {
      setLoadingSongs(true);
      setPageError("");

      try {
        await dispatch(asyncLoadArtistMusics());
      } catch (error) {
        if (active) {
          setPageError(
            error?.response?.data?.message || "Songs load nahi ho paaye."
          );
        }
      } finally {
        if (active) setLoadingSongs(false);
      }
    };

    loadSongs();

    return () => {
      active = false;
    };
  }, [dispatch]);

  const filteredMusics = useMemo(() => {
    const songs = Array.isArray(artistMusics) ? artistMusics : [];
    const search = searchTerm.trim().toLowerCase();

    if (!search) return songs;

    return songs.filter((music) => {
      const title = music?.title || "";
      const artist = music?.artist || "";

      return (
        title.toLowerCase().includes(search) ||
        artist.toLowerCase().includes(search)
      );
    });
  }, [artistMusics, searchTerm]);

  const toggleMusic = (music) => {
    const musicId = getMusicId(music);

    if (!musicId) {
      setPageError("Is song ki ID nahi mili. Song data check karo.");
      return;
    }

    setPageError("");
    setSuccessMessage("");

    setSelectedMusics((previous) => {
      const alreadySelected = previous.some(
        (selected) => getMusicId(selected) === musicId
      );

      if (alreadySelected) {
        return previous.filter(
          (selected) => getMusicId(selected) !== musicId
        );
      }

      return [...previous, music];
    });
  };

  const removeSelectedMusic = (musicId) => {
    setSelectedMusics((previous) =>
      previous.filter((music) => getMusicId(music) !== musicId)
    );
  };

  const handleCreatePlaylist = async (event) => {
    event.preventDefault();

    const title = playlistTitle.trim();

    if (!title) {
      setPageError("Playlist title please enter.");
      return;
    }

    if (selectedMusics.length === 0) {
      setPageError("Select at least one song to create a playlist.");
      return;
    }

    setSubmitting(true);
    setPageError("");
    setSuccessMessage("");

    try {
      const payload = {
        title,
        musics: selectedMusics.map((music) => getMusicId(music)),
      };

      const response = await dispatch(asyncCreatePlaylist(payload));

      setSuccessMessage(
        response?.message || "Playlist successfully create ho gayi!"
      );
      setPlaylistTitle("");
      setSearchTerm("");
      setSelectedMusics([]);
      navigate('/playlists')
      
    } catch (error) {
      setPageError(
        error?.response?.data?.message ||
          error?.message ||
          "Playlist create nahi hui. Dobara try karo."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="create-playlist-page">
      <div className="create-playlist-container">
        <header className="create-playlist-header">
          <button
            type="button"
            className="playlist-back-button"
            onClick={() => navigate("/artist/dashboard")}
          >
            <span aria-hidden="true">←</span> Dashboard
          </button>

          <div className="playlist-heading">
            <span className="playlist-eyebrow">ARTIST STUDIO</span>
            <h1>Create Your Playlist</h1>
            <p>
              Apne favourite tracks select karo aur apni playlist banao.
            </p>
          </div>
        </header>

        {pageError && (
          <div className="playlist-alert playlist-alert-error" role="alert">
            <span>!</span>
            {pageError}
            <button
              type="button"
              aria-label="Dismiss error"
              onClick={() => setPageError("")}
            >
              ×
            </button>
          </div>
        )}

        {successMessage && (
          <div
            className="playlist-alert playlist-alert-success"
            role="status"
          >
            <span>✓</span>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleCreatePlaylist} className="playlist-form">
          <section className="playlist-title-card">
            <div className="playlist-section-heading">
              <div className="playlist-section-icon">♫</div>
              <div>
                <h2>Playlist details</h2>
                <p>Apni playlist ko ek naam do.</p>
              </div>
            </div>

            <label htmlFor="playlist-title">Playlist name</label>
            <input
              id="playlist-title"
              type="text"
              value={playlistTitle}
              onChange={(event) => setPlaylistTitle(event.target.value)}
              placeholder="e.g. My Favourite Songs"
              maxLength={100}
              required
            />

            <div className="playlist-title-footer">
              <span>Choose a name that describes your collection.</span>
              <span>{playlistTitle.length}/100</span>
            </div>
          </section>

          <div className="playlist-builder-grid">
            <section className="playlist-songs-card">
              <div className="playlist-section-heading songs-heading">
                <div>
                  <h2>Add songs</h2>
                  <p>Apne uploaded tracks mein se select karo.</p>
                </div>

                <span className="playlist-count-badge">
                  {selectedMusics.length} selected
                </span>
              </div>

              <div className="playlist-search-box">
                <span aria-hidden="true">⌕</span>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search your songs..."
                  aria-label="Search songs"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="playlist-song-list">
                {loadingSongs ? (
                  <div className="playlist-empty-state">
                    <span className="playlist-spinner" />
                    <p>Loading your songs...</p>
                  </div>
                ) : artistMusics.length === 0 ? (
                  <div className="playlist-empty-state">
                    <div className="playlist-empty-icon">♫</div>
                    <h3>No songs uploaded yet</h3>
                    <p>
                      Playlist create karne se pehle apne account mein songs
                      upload karo.
                    </p>
                    <button
                      type="button"
                      className="playlist-secondary-button"
                      onClick={() =>
                        navigate("/artist/dashboard/upload-music")
                      }
                    >
                      Upload Music
                    </button>
                  </div>
                ) : filteredMusics.length === 0 ? (
                  <div className="playlist-empty-state">
                    <h3>No matching songs</h3>
                    <p>Dusra song name search karke dekho.</p>
                  </div>
                ) : (
                  filteredMusics.map((music) => {
                    const musicId = getMusicId(music);
                    const isSelected = selectedMusics.some(
                      (selected) => getMusicId(selected) === musicId
                    );
                    const coverImage = getCoverImage(music);

                    return (
                      <div
                        className={`playlist-song-row ${
                          isSelected ? "song-is-selected" : ""
                        }`}
                        key={musicId}
                      >
                        {coverImage ? (
                          <img
                            className="playlist-song-cover"
                            src={coverImage}
                            alt=""
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="playlist-song-cover playlist-cover-placeholder">
                            ♫
                          </div>
                        )}

                        <div className="playlist-song-info">
                          <h3>{music.title || "Untitled song"}</h3>
                          <p>{music.artist || "Unknown artist"}</p>
                        </div>

                        <button
                          type="button"
                          className={`playlist-add-button ${
                            isSelected ? "is-added" : ""
                          }`}
                          onClick={() => toggleMusic(music)}
                          aria-label={
                            isSelected
                              ? `Remove ${music.title} from playlist`
                              : `Add ${music.title} to playlist`
                          }
                        >
                          {isSelected ? "✓ Added" : "+ Add"}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            <aside className="playlist-preview-card">
              <div className="playlist-preview-art">
                <div className="playlist-preview-note">♫</div>
                <span>YOUR COLLECTION</span>
              </div>

              <div className="playlist-preview-details">
                <span className="playlist-preview-label">PLAYLIST PREVIEW</span>
                <h2>{playlistTitle.trim() || "My Playlist"}</h2>
                <p>
                  {selectedMusics.length}{" "}
                  {selectedMusics.length === 1 ? "song" : "songs"} selected
                </p>
              </div>

              <div className="playlist-selected-heading">
                <h3>Selected songs</h3>
                <span>{selectedMusics.length}</span>
              </div>

              <div className="playlist-selected-list">
                {selectedMusics.length === 0 ? (
                  <div className="playlist-selection-hint">
                    <span>＋</span>
                    <p>Yahan tumhare selected songs dikhai denge.</p>
                  </div>
                ) : (
                  selectedMusics.map((music) => (
                    <div
                      className="playlist-selected-row"
                      key={getMusicId(music)}
                    >
                      <div className="playlist-selected-song-info">
                        <span className="playlist-selected-note">♫</span>
                        <div>
                          <h4>{music.title || "Untitled song"}</h4>
                          <p>{music.artist || "Unknown artist"}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeSelectedMusic(getMusicId(music))
                        }
                        aria-label={`Remove ${music.title} from selection`}
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>

              <button
                type="submit"
                className="playlist-create-button"
                disabled={submitting || loadingSongs}
              >
                {submitting ? (
                  <>
                    <span className="playlist-button-spinner" />
                    Creating playlist...
                  </>
                ) : (
                  <>
                    <span>＋</span> Create Playlist
                  </>
                )}
              </button>

              <p className="playlist-submit-note">
                Playlist mein kam se kam ek song hona chahiye.
              </p>
            </aside>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreatePlaylist;