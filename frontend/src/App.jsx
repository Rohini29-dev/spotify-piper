import React from "react";
import MainRoutes from "./routes/MainRoutes";
import Navbar from "./components/Navbar/Navbar";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <Navbar />
      <MainRoutes />
    </AuthProvider>
  );
};

export default App;