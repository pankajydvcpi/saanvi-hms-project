import { Link } from "react-router-dom";
import "./Portal.css";

function Portal() {
  return (
    <div className="portal-page">
      <h1>Saanvi HMS Portal</h1>
      <p>Select your dashboard access</p>

      <div className="portal-cards">
        <Link to="/admin-dashboard" className="portal-card">
          <h2>Admin Dashboard</h2>
          <p>Manage doctors, patients, staff and appointments.</p>
        </Link>

        <Link to="/doctor-dashboard" className="portal-card">
          <h2>Doctor Portal</h2>
          <p>View assigned patients and appointments.</p>
        </Link>

        <Link to="/patient-dashboard" className="portal-card">
          <h2>Patient Portal</h2>
          <p>View patient details and appointment status.</p>
        </Link>

        <Link to="/staff-dashboard" className="portal-card">
          <h2>Staff Portal</h2>
          <p>View staff duties and hospital tasks.</p>
        </Link>
      </div>
    </div>
  );
}

export default Portal;