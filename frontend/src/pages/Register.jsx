import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "patient",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const usernameExists = users.find((user) => user.username === form.username);

    if (usernameExists) {
      setError("Username already exists");
      return;
    }

    const newUser = {
      fullName: form.fullName,
      username: form.username,
      email: form.email,
      password: form.password,
      role: form.role,
    };

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));

    alert(`${form.role} registered successfully`);
    navigate("/login");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1>Saanvi HMS</h1>
        <h2>Register User</h2>

        <form onSubmit={handleRegister}>
          <input
            style={styles.input}
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <select
            style={styles.input}
            name="role"
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
            <option value="staff">Staff</option>
          </select>

          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button style={styles.button} type="submit">
            Register
          </button>
        </form>

        <p>
          Already registered? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #004d40, #009688)",
    fontFamily: "Arial",
  },
  card: {
    width: "430px",
    background: "white",
    padding: "35px",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
  },
  input: {
    width: "100%",
    padding: "13px",
    margin: "9px 0",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "15px",
  },
  button: {
    width: "100%",
    padding: "13px",
    marginTop: "12px",
    border: "none",
    borderRadius: "10px",
    background: "#00796b",
    color: "white",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default Register;