import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      fullName: {
        firstName: "",
        lastName: "",
      },
      password: "",
      role: "user",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        data,
        {
          withCredentials: true,
        }
      );

      console.log("Register success =>", response.data);

      navigate("/login");
    } catch (error) {
      console.error(
        "Register error =>",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <main className="register-page">
      <div className="register-card">

        {/* Header */}
        <div className="register-header">
          <h1>Create your account</h1>
          <p>Join Spotify-Piper and start listening.</p>
        </div>

        {/* Form */}
        <form
          className="register-form"
          onSubmit={handleSubmit(onSubmit)}
        >

          {/* First Name */}
          <div className="form-group">
            <label htmlFor="firstName">First name</label>

            <input
              id="firstName"
              type="text"
              placeholder="Enter your first name"
              {...register("fullName.firstName", {
                required: "First name is required",
                minLength: {
                  value: 2,
                  message: "First name must be at least 2 characters",
                },
              })}
            />

            {errors.fullName?.firstName && (
              <span className="form-error">
                {errors.fullName.firstName.message}
              </span>
            )}
          </div>

          {/* Last Name */}
          <div className="form-group">
            <label htmlFor="lastName">Last name</label>

            <input
              id="lastName"
              type="text"
              placeholder="Enter your last name"
              {...register("fullName.lastName", {
                required: "Last name is required",
                minLength: {
                  value: 2,
                  message: "Last name must be at least 2 characters",
                },
              })}
            />

            {errors.fullName?.lastName && (
              <span className="form-error">
                {errors.fullName.lastName.message}
              </span>
            )}
          </div>

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
              placeholder="Create a password"
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

          {/* Account Type */}
          <div className="form-group">
            <label className="role-label">Account type</label>

            <div className="role-options">

              <label className="role-option">
                <input
                  type="radio"
                  value="user"
                  {...register("role", {
                    required: "Please select an account type",
                  })}
                />
                <span>User</span>
              </label>

              <label className="role-option">
                <input
                  type="radio"
                  value="artist"
                  {...register("role", {
                    required: "Please select an account type",
                  })}
                />
                <span>Artist</span>
              </label>

            </div>

            {errors.role && (
              <span className="form-error">
                {errors.role.message}
              </span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="register-button"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Creating account..."
              : "Create account"}
          </button>

        </form>

        {/* Divider */}
        <div className="register-divider">
          <span>OR</span>
        </div>

        {/* Google */}
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

        {/* Login Link */}
        <p className="login-link">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>

      </div>
    </main>
  );
};

export default Register;