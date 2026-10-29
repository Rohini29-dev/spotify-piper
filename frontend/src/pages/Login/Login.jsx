
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { asyncauthLogin } from "../../store/actions/authActions";
import "./Login.css";

const Login = () => {
  const dispatch = useDispatch();
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
      const response = await dispatch(asyncauthLogin(data));

      console.log("LOGIN SUCCESS =>", response);

      navigate("/");
    } catch (error) {
      console.error(
        "LOGIN ERROR =>",
        error?.response?.data?.message ||
          error?.message ||
          "Login failed"
      );
    }
  };

  return (
    <main className="login-page">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <h1>Welcome back</h1>
          <p>Login to your account to continue.</p>
        </div>

        {/* Login Form */}
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
                  message:
                    "Password must be at least 6 characters",
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
