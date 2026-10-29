
import {
  registerUser,
  loginUser,
} from "../../services/auth.service";

import { loadauth } from "../reducers/authSlice";

// ================= REGISTER =================
export const asyncauthRegister = (payload) => async (dispatch) => {
  try {
    const response = await registerUser(payload);

    if (response?.user) {
      dispatch(
        loadauth({
          user: response.user,
        })
      );
    }

    return response;
  } catch (error) {
    console.error(
      "REGISTER ERROR =>",
      error?.response?.data || error?.message || error
    );

    throw error;
  }
};

// ================= LOGIN =================
export const asyncauthLogin = (payload) => async (dispatch) => {
  try {
    const response = await loginUser(payload);

    if (response?.user) {
      dispatch(
        loadauth({
          user: response.user,
        })
      );
    }

    return response;
  } catch (error) {
    console.error(
      "LOGIN ERROR =>",
      error?.response?.data || error?.message || error
    );

    throw error;
  }
};
