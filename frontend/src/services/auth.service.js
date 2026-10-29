
import axios from "axios";

const AUTH_API = "http://localhost:3000/api/auth";

const authAPI = axios.create({
  baseURL: AUTH_API,
  withCredentials: true,
});



authAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";

    // Invalid login/register credentials should not redirect
    const isLoginOrRegister =
      /\/(login|register)\/?$/i.test(requestUrl);

    if (status === 401 && !isLoginOrRegister) {
      const currentPath =
        window.location.pathname.toLowerCase();

      if (
        currentPath !== "/login" &&
        currentPath !== "/register"
      ) {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  }
);

// ================= REGISTER =================
export const registerUser = async (payload) => {
  const response = await authAPI.post("/register", payload);
  return response.data;
};

// ================= LOGIN =================
export const loginUser = async (payload) => {
  const response = await authAPI.post("/login", payload);
  return response.data;
};

// ================= CURRENT USER =================
export const getCurrentUser = async () => {
  const response = await authAPI.get("/me");
  return response.data;
};

// ================= LOGOUT =================
export const logoutUser = async () => {
  const response = await authAPI.post("/logout", {});
  return response.data;
};
