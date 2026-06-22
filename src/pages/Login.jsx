import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHMSData } from "../data/users";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const data = getHMSData();

    const foundUser = data.users.find(
      (user) =>
        user.username.toLowerCase() === username.trim().toLowerCase() &&
        user.password === password.trim()
    );

    if (!foundUser) {
      setError("Invalid username or password");
      return;
    }

    localStorage.setItem("loggedInUser", JSON.stringify(foundUser));

    if (foundUser.role === "admin") navigate("/admin-dashboard");
    if (foundUser.role === "doctor") navigate("/doctor-dashboard");
    if (foundUser.role === "staff") navigate("/staff-dashboard");
    if (foundUser.role === "patient") navigate("/patient-dashboard");
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <h1>Saanvi HMS</h1>
        <p>Hospital Management System</p>
        <span>Real role-based access for Admin, Doctor, Staff and Patient</span>
      </div>

      <form className="login-card" onSubmit={handleLogin}>
        <h2>Welcome Back</h2>
        <p className="login-subtitle">Login to continue</p>

        {error && <div className="error-box">{error}</div>}

        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>

        <div className="demo-box">
          <p><b>Demo Login</b></p>
          <p>Admin: admin / admin123</p>
          <p>Doctor: henry / doctor123</p>
          <p>Staff: sita / staff123</p>
          <p>Patient: ram / patient123</p>
        </div>
      </form>
    </div>
  );
}

export default Login;