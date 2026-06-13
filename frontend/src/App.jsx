import MusicPlayer from "./pages/music/MusicPlayer";
import UploadMusic from "./pages/artist/UploadMusic";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/artist/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home socket ={socket} />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* Artist Dashboard */}

      <Route
        path="/artist/dashboard"
        element={<Dashboard />}
      />


<Route
  path="/artist/upload-music"
  element={<UploadMusic />}
/>


<Route
  path="/music/:id"
  element={<MusicPlayer />}
/>
      
    </Routes>
  );
}

export default App;