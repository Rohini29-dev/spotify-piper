import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UploadMusic.css";

const UploadMusic = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      music: null,
      coverImage: null,
    },
  });

  const [imagePreview, setImagePreview] = useState("");
  const [musicPreview, setMusicPreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [serverError, setServerError] = useState("");

  // Watch form values
  const musicFile = watch("music")?.[0];
  const coverImageFile = watch("coverImage")?.[0];

  /* =========================
     Image Preview
  ========================= */

  useEffect(() => {
    if (!coverImageFile) {
      setImagePreview("");
      return;
    }

    const imageUrl = URL.createObjectURL(coverImageFile);

    setImagePreview(imageUrl);

    return () => {
      URL.revokeObjectURL(imageUrl);
    };
  }, [coverImageFile]);

  /* =========================
     Music Preview
  ========================= */

  useEffect(() => {
    if (!musicFile) {
      setMusicPreview("");
      return;
    }

    const musicUrl = URL.createObjectURL(musicFile);

    setMusicPreview(musicUrl);

    return () => {
      URL.revokeObjectURL(musicUrl);
    };
  }, [musicFile]);

  /* =========================
     Submit
  ========================= */

  const onSubmit = async (data) => {
    setMessage("");
    setServerError("");

    try {
      setLoading(true);

      const formData = new FormData();

      // Text field
      formData.append("title", data.title.trim());

      // Files
      formData.append("music", data.music[0]);
      formData.append("coverImage", data.coverImage[0]);

      const response = await axios.post(
        "http://localhost:3002/api/music/upload",
        formData,
        {
          withCredentials: true,
        }
      );

      console.log("Upload response:", response.data);

      setMessage(
        response.data?.message || "Music uploaded successfully!"
      );

      // Reset form
      reset();

      setImagePreview("");
      setMusicPreview("");

      // Redirect after success
      setTimeout(() => {
        navigate("/artist/dashboard");
      }, 1200);
    } catch (error) {
      console.error("Upload error:", error);

      setServerError(
        error.response?.data?.message ||
          "Failed to upload music. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     Reset
  ========================= */

  const handleReset = () => {
    reset();

    setImagePreview("");
    setMusicPreview("");

    setMessage("");
    setServerError("");
  };

  return (
    <div className="upload-page">
      <div className="upload-container">

        {/* =========================
            Header
        ========================= */}

        <div className="upload-header">
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/artist/dashboard")}
          >
            ← Back to Dashboard
          </button>

          <p className="upload-subtitle">
            ARTIST DASHBOARD
          </p>

          <h1>Upload Your Music 🎵</h1>

          <p className="upload-description">
            Share your music with your audience by uploading a
            song and its cover image.
          </p>
        </div>

        {/* =========================
            Form
        ========================= */}

        <form
          className="upload-form"
          onSubmit={handleSubmit(onSubmit)}
        >

          {/* =========================
              Music Title
          ========================= */}

          <div className="form-group">
            <label htmlFor="title">
              Music Title
            </label>

            <input
              id="title"
              type="text"
              placeholder="Enter music title"
              disabled={loading}
              {...register("title", {
                required: "Music title is required",

                minLength: {
                  value: 2,
                  message:
                    "Music title must contain at least 2 characters",
                },

                maxLength: {
                  value: 100,
                  message:
                    "Music title cannot exceed 100 characters",
                },
              })}
            />

            {errors.title && (
              <p className="field-error">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* =========================
              Music File
          ========================= */}

          <div className="form-group">
            <label htmlFor="music">
              Music File
            </label>

            <label
              htmlFor="music"
              className={`file-upload-box ${
                musicFile ? "file-selected" : ""
              }`}
            >
              <div className="file-icon">
                🎵
              </div>

              <div className="file-content">
                <h3>
                  {musicFile
                    ? musicFile.name
                    : "Choose your music file"}
                </h3>

                <p>
                  {musicFile
                    ? `${(
                        musicFile.size /
                        (1024 * 1024)
                      ).toFixed(2)} MB`
                    : "MP3, WAV or other audio files"}
                </p>
              </div>

              <span className="browse-btn">
                Browse
              </span>

              <input
                id="music"
                type="file"
                accept="audio/*"
                disabled={loading}
                {...register("music", {
                  required: "Music file is required",

                  validate: {
                    validFile: (files) => {
                      const file = files?.[0];

                      if (!file) {
                        return "Music file is required";
                      }

                      if (!file.type.startsWith("audio/")) {
                        return "Please select a valid audio file";
                      }

                      return true;
                    },
                  },
                })}
              />
            </label>

            {errors.music && (
              <p className="field-error">
                {errors.music.message}
              </p>
            )}

            {/* Music Preview */}

            {musicPreview && (
              <div className="music-preview">
                <div className="preview-heading">
                  <span>🎧 Music Preview</span>

                  <span className="preview-file-name">
                    {musicFile?.name}
                  </span>
                </div>

                <audio
                  className="audio-player"
                  controls
                  src={musicPreview}
                >
                  Your browser does not support the audio
                  element.
                </audio>
              </div>
            )}
          </div>

          {/* =========================
              Cover Image
          ========================= */}

          <div className="form-group">
            <label htmlFor="coverImage">
              Cover Image
            </label>

            <label
              htmlFor="coverImage"
              className={`file-upload-box ${
                coverImageFile ? "file-selected" : ""
              }`}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Cover preview"
                  className="cover-preview"
                />
              ) : (
                <div className="file-icon">
                  🖼️
                </div>
              )}

              <div className="file-content">
                <h3>
                  {coverImageFile
                    ? coverImageFile.name
                    : "Choose cover image"}
                </h3>

                <p>
                  {coverImageFile
                    ? `${(
                        coverImageFile.size /
                        (1024 * 1024)
                      ).toFixed(2)} MB`
                    : "PNG, JPG or JPEG"}
                </p>
              </div>

              <span className="browse-btn">
                Browse
              </span>

              <input
                id="coverImage"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                disabled={loading}
                {...register("coverImage", {
                  required: "Cover image is required",

                  validate: {
                    validImage: (files) => {
                      const file = files?.[0];

                      if (!file) {
                        return "Cover image is required";
                      }

                      if (!file.type.startsWith("image/")) {
                        return "Please select a valid image";
                      }

                      return true;
                    },
                  },
                })}
              />
            </label>

            {errors.coverImage && (
              <p className="field-error">
                {errors.coverImage.message}
              </p>
            )}

            {/* Image Preview */}

            {imagePreview && (
              <div className="image-preview-container">
                <div className="preview-heading">
                  <span>🖼️ Cover Preview</span>
                </div>

                <div className="image-preview-wrapper">
                  <img
                    src={imagePreview}
                    alt="Selected cover"
                    className="large-cover-preview"
                  />
                </div>
              </div>
            )}
          </div>

          {/* =========================
              Server Error
          ========================= */}

          {serverError && (
            <div className="form-message error-message">
              ❌ {serverError}
            </div>
          )}

          {/* =========================
              Success Message
          ========================= */}

          {message && (
            <div className="form-message success-message">
              ✅ {message}
            </div>
          )}

          {/* =========================
              Buttons
          ========================= */}

          <div className="upload-actions">
            <button
              type="button"
              className="reset-btn"
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </button>

            <button
              type="submit"
              className="submit-upload-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Uploading...
                </>
              ) : (
                <>
                  ⬆ Upload Music
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UploadMusic;