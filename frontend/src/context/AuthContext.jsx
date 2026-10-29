
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";

const AuthContext = createContext(null);

const AUTH_ME_URL = "http://localhost:3000/api/auth/me";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(AUTH_ME_URL, {
        withCredentials: true,
      });

      setUser(response.data.user || response.data);

      return response.data;
    } catch (error) {
      setUser(null);

      if (error.response?.status === 401) {
        const currentPath =
          window.location.pathname.toLowerCase();

        if (
          currentPath !== "/login" &&
          currentPath !== "/register"
        ) {
          window.location.replace("/login");
        }
      }

      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      window.location.replace("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout,
        refreshUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
