import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHMSData } from "../data/users";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {
    const data = getHMSData();

    const user = data.users.find(
      (u) =>
        u.username === username &&
        u.password === password &&
        u.role === role
    );

    if (!user) {
      alert("Invalid username, password or role");
      return;
    }

    localStorage.setItem("loggedInUser", JSON.stringify(user));

    // redirect based on role
    if (role === "admin") navigate("/admin");
    else if (role === "doctor") navigate("/doctor");
    else if (role === "staff") navigate("/staff");
    else if (role === "patient") navigate("/patient");
    else navigate("/");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Hospital Management System</h1>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="">Select Role</option>
        <option value="admin">Admin</option>
        <option value="doctor">Doctor</option>
        <option value="staff">Staff</option>
        <option value="patient">Patient</option>
      </select>

      <br /><br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;