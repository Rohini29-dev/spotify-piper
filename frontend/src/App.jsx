import { Routes, Route, Link, NavLink } from 'react-router-dom'
import './App.css'
import { useState, useEffect } from 'react'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/artist/Dashboard'
import UploadMusic from './pages/artist/UploadMusic'
// import MusicPlayer from './pages/music/MusicPlayer'

function App() {



  return (
    <div>
      <main>
        <Routes>
          <Route path="/" element={<Home  />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/artist/dashboard" element={<Dashboard />} />
          <Route path="/artist/dashboard/upload-music" element={<UploadMusic />} />
          {/* <Route path="/music/:id" element={<MusicPlayer />} /> */}
        </Routes>
      </main>
    </div>

  )
}

export default App