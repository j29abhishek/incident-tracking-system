import React, { useEffect, useRef, useState } from "react";
import "../css/auth.css";
import { Link } from "react-router-dom";
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

  const messageTimerRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for the field being edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

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

      if (res.data?.success) {
        setMessage("Your account has been created successfully.");

        setUserData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        // clear old timer if exists
        if (messageTimerRef.current) {
          clearTimeout(messageTimerRef.current);
        }

        messageTimerRef.current = setTimeout(() => {
          setMessage("");
        }, 3000);
      }
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (messageTimerRef.current) {
        clearTimeout(messageTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <img
          src="/itslogo.png"
          className="auth-logo"
          alt="Incident Tracking System"
        />

        <h2 className="auth-title">Create an Account</h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className="auth-input-group">
            <label className="auth-input-label">Full Name</label>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
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
            />
            {errors.confirmPassword && (
              <p className="auth-error">{errors.confirmPassword}</p>
            )}
          </div>

          {message && <p className="auth-message">{message}</p>}

          <button type="submit" className="auth-btn" disabled={loading}>
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
