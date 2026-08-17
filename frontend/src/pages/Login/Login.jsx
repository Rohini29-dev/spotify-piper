import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        data,
        {
          withCredentials: true,
        }
      );

      console.log("Login success =>", response.data);

      await refreshUser();

      navigate("/");
    } catch (error) {
      console.error(
        "Login error =>",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <main className="login-page">
      <div className="login-card">

        <div className="login-header">
          <h1>Welcome back</h1>
          <p>Login to your account to continue.</p>
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit(onSubmit)}
        >

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              })}
            />

            {errors.email && (
              <span className="form-error">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />

            {errors.password && (
              <span className="form-error">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="login-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Divider */}
        <div className="login-divider">
          <span>OR</span>
        </div>

        {/* Google Login */}
        <button
          type="button"
          className="google-button"
          onClick={() => {
            window.location.href =
              "http://localhost:3000/api/auth/google";
          }}
        >
          <span className="google-icon">G</span>
          Continue with Google
        </button>

        {/* Register Link */}
        <p className="register-link">
          Don't have an account?{" "}
          <Link to="/register">Create an account</Link>
        </p>

      </div>
    </main>
  );
};

export default Login;