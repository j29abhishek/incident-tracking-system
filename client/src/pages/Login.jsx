import React, { useState } from "react";
import "../css/auth.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { validateLogin } from "../utils/authValidations";

const Login = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  /* ----------------------------------
     Input change handler
  ---------------------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (message) {
      setMessage("");
    }
  };

  /* ----------------------------------
     Submit handler
  ---------------------------------- */
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
      const { success, token, user, message: apiMessage } = res.data;

      if (!success) {
        setMessage(apiMessage || "Invalid credentials");
        return;
      }

      // Persist auth data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Role-based redirect
      switch (user.role) {
        case "admin":
          navigate("/admin");
          break;
        case "engineer":
          navigate("/engineer");
          break;
        default:
          navigate("/user-dashboard");
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
              placeholder="Enter your password"
              disabled={loading}
            />
            {errors.password && <p className="auth-error">{errors.password}</p>}
          </div>

          {message && <p className="auth-message">{message}</p>}

          <button
            type="submit"
            className="auth-btn"
            disabled={loading || !!message}
          >
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
