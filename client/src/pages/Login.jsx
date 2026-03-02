import React, { useState, useEffect, useRef } from "react";
import "../css/auth.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { validateLogin } from "../utils/authValidations";

const Login = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const messageTimerRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserData((prev) => ({ ...prev, [name]: value }));

    // Clear field error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateLogin(userData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", userData);
      let role;
      if (res.data?.success) {
        setMessage("Login successful! Redirecting...");

        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          role = res.data?.user?.role;
          console.log("User role:", role);
          // localStorage.setItem("user", JSON.stringify(res.data.user));
        }

        if (role === "admin") navigate("/admin");
        else if (role === "user") navigate("/user-dashboard");
        else if (role === "engineer") navigate("/engineer");
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

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
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

        <h2 className="auth-title">Sign In</h2>

        <form onSubmit={handleSubmit} noValidate>
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
              placeholder="Enter your password"
            />
            {errors.password && <p className="auth-error">{errors.password}</p>}
          </div>

          {message && <p className="auth-message">{message}</p>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <span className="auth-login-account">
          Don’t have an account? <Link to="/signup">Create one</Link>
        </span>
      </div>
    </div>
  );
};

export default Login;
