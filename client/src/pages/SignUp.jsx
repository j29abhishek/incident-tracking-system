import React, { useState, useEffect } from "react";
import "../css/auth.css";
import { Link, useNavigate } from "react-router-dom";
import { validateSignup } from "../utils/authValidations";
import api from "../api/axiosInstance";

const SignUp = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* ----------------------------------
     Auto-clear API messages
  ---------------------------------- */
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  /* ----------------------------------
     Input change handler
  ---------------------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // clear field-specific validation error
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // clear API error while typing
    if (message) {
      setMessage("");
    }
  };

  /* ----------------------------------
     Submit handler
  ---------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateSignup(userData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/auth/signup", userData);
      const { success, message: apiMessage } = res.data;

      if (!success) {
        setMessage(apiMessage || "Signup failed");
        return;
      }

      // reset form after successful signup
      setUserData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      navigate("/login");
    } catch (error) {
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <img
          src="/itslogo.png"
          className="auth-logo"
          alt="Incident Tracking System"
        />

        <h1 className="auth-title">Create an Account</h1>

        <form onSubmit={handleSubmit} noValidate>
          <div className="auth-input-group">
            <label className="auth-input-label">Full Name</label>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              disabled={loading}
            />
            {errors.name && <p className="auth-error">{errors.name}</p>}
          </div>

          <div className="auth-input-group">
            <label className="auth-input-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              disabled={loading}
            />
            {errors.email && <p className="auth-error">{errors.email}</p>}
          </div>

          <div className="auth-input-group">
            <label className="auth-input-label">Password</label>
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              placeholder="Create a secure password"
              disabled={loading}
            />
            {errors.password && <p className="auth-error">{errors.password}</p>}
          </div>

          <div className="auth-input-group">
            <label className="auth-input-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={userData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              disabled={loading}
            />
            {errors.confirmPassword && (
              <p className="auth-error">{errors.confirmPassword}</p>
            )}
          </div>

          {message && <p className="auth-message">{message}</p>}

          <button
            type="submit"
            className="auth-btn"
            disabled={loading || !!message}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <span className="auth-login-account">
          Already have an account? <Link to="/login">Sign in</Link>
        </span>
      </div>
    </div>
  );
};

export default SignUp;
