# Spotify-Piper 🎵

A full-stack music streaming application built with React, Node.js, Express.js, MongoDB and Socket.IO.

The application allows users to discover music, explore playlists and listen to songs with real-time synchronized playback between multiple browsers.

---

## 🚀 Features

### 🎵 Music

- Browse available songs
- View music details
- Play and pause songs
- Seek through songs
- Skip forward and backward
- Control volume
- Mute and unmute
- Change playback speed
- Display song cover and artist information

### 📂 Playlists

- View all playlists
- Explore playlists created by artists
- Open a playlist to view its songs
- Play songs directly from a playlist
- Playlist song list with cover images and artist information

### 🔄 Real-Time Music Synchronization

Spotify-Piper uses Socket.IO to synchronize music playback between connected browsers.

When one user:

- Plays a song
- Pauses a song
- Seeks to another position
- Changes volume
- Changes playback speed
- Leaves the music

The action can be synchronized with other connected users.

### 👤 Authentication

- User registration
- User login
- Authentication using JWT
- Protected routes
- Role-based access control

### 🎤 Artist Features

Artists can:

- Access Artist Dashboard
- Upload music
- Create playlists
- Manage their music

---

## 🛠️ Technologies Used

### Frontend

- React.js
- React Router DOM
- Axios
- Socket.IO Client
- Vite
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Socket.IO
- Multer

### Other Technologies

- Git
- GitHub
- REST APIs

---

## 📁 Project Structure

```text
Spotify-Piper
│
├── auth
│   ├── controllers
│   ├── models
│   ├── routes
│   └── server.js
│
├── music
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── uploads
│   └── server.js
│
├── notification
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── context
│   │   ├── routes
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── README.md
│
└── README.md