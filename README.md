# Spotify-Piper 🎵

A full-stack music streaming application built with React.js, Node.js, Express.js, MongoDB, Redux Toolkit, and Socket.IO.

Spotify-Piper allows users to discover music, explore playlists, and listen to songs with synchronized playback across connected browsers. Artists can upload music, create playlists, and manage their music through a dedicated dashboard.

## 🚀 Features

### 🎵 Music Discovery & Playback
- Browse all available music.
- Explore songs with cover images and artist information.
- View individual music details.
- Play and pause songs.
- Seek through tracks.
- Control volume and mute or unmute playback.
- Adjust playback speed.
- Navigate to music from the dashboard and playlists.

### 📂 Playlist Management
- Browse available playlists.
- Create playlists as an artist.
- View playlist details and associated songs.
- Open playlists from the Artist Dashboard.
- Display song covers and artist information.
- Delete created playlists.

### 🔄 Real-Time Music Synchronization
Socket.IO enables synchronized playback between connected browsers.

Supported playback events include:
- Play and pause.
- Seek to a specific playback position.
- Volume changes.
- Playback speed changes.
- Leaving a synchronized listening session.

### 🔐 Authentication & Authorization
- User registration and login.
- JWT-based authentication.
- Protected routes.
- Role-based access control.
- Separate artist and regular-user experiences.

### 🎤 Artist Dashboard
- View uploaded music.
- View created playlists.
- Upload new music.
- Create and manage playlists.
- Open songs and playlists directly from the dashboard.
- View music and playlist statistics.

### ⚙️ State Management
- Redux Toolkit for centralized application state.
- Redux actions and reducers for music-related operations.
- Authentication context for user authentication state.

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router DOM
- Redux Toolkit
- React Redux
- Axios
- Socket.IO Client
- Vite
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- Socket.IO
- Multer

### Tools & Development
- Git
- GitHub
- REST APIs
- Postman

## 📁 Project Structure

```text
Spotify-Piper/
│
├── auth/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── music/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── store/
│   │   └── main.jsx
│   ├── package.json
│   └── README.md
│
├── notification/
│
└── README.md
```

## ⚙️ Getting Started

### Prerequisites
- Node.js and npm
- MongoDB
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Rohini29-dev/spotify-piper.git
cd spotify-piper
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Configure Environment Variables

Configure the environment variables required by each backend service and the frontend.

Use local environment files for credentials, database connection strings, JWT secrets, and other sensitive configuration. Do not commit `.env` files or private credentials to GitHub.

### 4. Start the Application

Start each backend service using its configured start command, then start the frontend:

```bash
cd frontend
npm run dev
```

The frontend development server will display its local URL in the terminal.

**Note:** Configure the service ports, MongoDB connection, and frontend API URLs according to your local environment.

## 🔮 Future Improvements
- Cloud-based music and image storage.
- Enhanced playlist artwork and customization.
- Improved listening experience and responsive UI.
- Additional music discovery features.

## 👩‍💻 Author

**Rohini Bharsakle**

- GitHub: [Rohini29-dev](https://github.com/Rohini29-dev)
- LinkedIn: [Rohini Bharsakle](https://linkedin.com/in/rohini-bharsakle-a46220417)

---

⭐ If you find this project interesting, consider starring the repository.