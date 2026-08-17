import { useState } from "react";
import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();

    closeMenu();

    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}

        <NavLink
          to="/"
          className="navbar-logo"
          onClick={closeMenu}
        >
          <span className="navbar-logo-icon">
            ♪
          </span>

          <span>
            Spotify-Piper
          </span>
        </NavLink>


        {/* Desktop Links */}

        <div className="navbar-links">

          <NavLink
            to="/"
            className={({ isActive }) =>
              `navbar-link ${
                isActive ? "active" : ""
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/playlists"
            className={({ isActive }) =>
              `navbar-link ${
                isActive ? "active" : ""
              }`
            }
          >
            Playlists
          </NavLink>

          {/* Artist-only links */}

          {user?.role === "artist" && (
            <>
              <NavLink
                to="/artist/dashboard"
                className={({ isActive }) =>
                  `navbar-link ${
                    isActive ? "active" : ""
                  }`
                }
              >
                Artist Dashboard
              </NavLink>

              <NavLink
                to="/artist/dashboard/upload-music"
                className={({ isActive }) =>
                  `navbar-link ${
                    isActive ? "active" : ""
                  }`
                }
              >
                Upload Music
              </NavLink>
            </>
          )}

        </div>


        {/* Right Actions */}

        <div className="navbar-actions">

          {!loading && !user && (
            <>
              <button
                className="navbar-login-btn"
                onClick={() =>
                  navigate("/login")
                }
              >
                Login
              </button>

              <button
                className="navbar-register-btn"
                onClick={() =>
                  navigate("/register")
                }
              >
                Register
              </button>
            </>
          )}

          {!loading && user && (
            <>
              <div className="navbar-user">
                <span className="navbar-user-icon">
                  {user.role === "artist"
                    ? "🎤"
                    : "👤"}
                </span>

                <span>
                  {user.fullName?.firstName ||
                    user.username ||
                    "User"}
                </span>
              </div>

              <button
                className="navbar-logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}

        </div>


        {/* Mobile Menu */}

        <button
          className={`navbar-menu-btn ${
            menuOpen ? "open" : ""
          }`}
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

      </div>


      {/* Mobile Navigation */}

      <div
        className={`navbar-mobile-menu ${
          menuOpen ? "show" : ""
        }`}
      >

        <NavLink
          to="/"
          className={({ isActive }) =>
            `mobile-nav-link ${
              isActive ? "active" : ""
            }`
          }
          onClick={closeMenu}
        >
          🏠 Home
        </NavLink>

        <NavLink
          to="/playlists"
          className={({ isActive }) =>
            `mobile-nav-link ${
              isActive ? "active" : ""
            }`
          }
          onClick={closeMenu}
        >
          📀 Playlists
        </NavLink>


        {/* Artist mobile links */}

        {user?.role === "artist" && (
          <>
            <NavLink
              to="/artist/dashboard"
              className={({ isActive }) =>
                `mobile-nav-link ${
                  isActive ? "active" : ""
                }`
              }
              onClick={closeMenu}
            >
              🎤 Artist Dashboard
            </NavLink>

            <NavLink
              to="/artist/dashboard/upload-music"
              className={({ isActive }) =>
                `mobile-nav-link ${
                  isActive ? "active" : ""
                }`
              }
              onClick={closeMenu}
            >
              ⬆ Upload Music
            </NavLink>
          </>
        )}


        {/* Auth actions */}

        {!loading && !user && (
          <div className="mobile-auth-actions">

            <button
              className="mobile-login-btn"
              onClick={() => {
                navigate("/login");
                closeMenu();
              }}
            >
              Login
            </button>

            <button
              className="mobile-register-btn"
              onClick={() => {
                navigate("/register");
                closeMenu();
              }}
            >
              Register
            </button>

          </div>
        )}


        {user && (
          <div className="mobile-user-section">

            <div className="mobile-user-info">
              <span>
                {user.role === "artist"
                  ? "🎤"
                  : "👤"}
              </span>

              <span>
                {user.fullName?.firstName ||
                  user.username ||
                  "User"}
              </span>
            </div>

            <button
              className="mobile-logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;