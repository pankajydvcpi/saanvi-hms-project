import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div>
      <h1>Main Dashboard</h1>

      <h2>Welcome, {user?.name}</h2>
      <p>Your role is: {user?.role}</p>

      {user?.role === "admin" && (
        <>
          <Link to="/admin">Go to Admin Dashboard</Link>
          <br />
          <Link to="/patients">Manage Patients CRUD</Link>
        </>
      )}

      {user?.role === "staff" && (
        <>
          <Link to="/staff">Go to Staff Dashboard</Link>
          <br />
          <Link to="/patients">Manage Patients</Link>
        </>
      )}

      {user?.role === "user" && (
        <Link to="/user">Go to User Dashboard</Link>
      )}

      <br />
      <br />
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Dashboard;