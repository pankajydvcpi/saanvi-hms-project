import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHMSData } from "../data/users";
import "./Portal.css";

function PatientPortal() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  const [data] = useState(getHMSData());
  const [showDetails, setShowDetails] = useState(false);

  const myPatient = (data.patients || []).find((patient) => {
    const patientIdMatches = patient.id === user?.patientId;
    const patientNameMatches = patient.name === user?.name;
    const patientIdFieldMatches = patient.id === user?.id;
    return patientIdMatches || patientNameMatches || patientIdFieldMatches;
  });

  const myAppointments = (data.appointments || []).filter((app) => {
    const patientIdMatches = app.patientId === user?.patientId;
    const patientNameMatches = app.patientName === user?.name;
    const patientIdFieldMatches = app.patientId === user?.id;
    return patientIdMatches || patientNameMatches || patientIdFieldMatches;
  });

  const logout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  return (
    <div className="portal-page">
      <aside className="sidebar patient-side">
        <h2>Patient Portal</h2>
        <p>{user.name}</p>
        <button onClick={logout}>Logout</button>
      </aside>

      <main className="portal-main">
        <div className="topbar">
          <div>
            <h1>Welcome, {user.name}</h1>
            <p>Your personal hospital record and appointment details</p>
          </div>
        </div>

        <section className="profile-card">
          <h2>My Patient Details</h2>
          {myPatient ? (
            <>
              <div style={{ display: "grid", gap: "12px" }}>
                <div><strong>Patient ID:</strong> {myPatient.id}</div>
                <div><strong>Age/Gender:</strong> {myPatient.age} / {myPatient.gender || "Not Provided"}</div>
                <div><strong>Disease:</strong> {myPatient.disease}</div>
                <div><strong>Assigned Doctor:</strong> {myPatient.doctorName || "Not Assigned"}</div>
                <div><strong>Admission Date:</strong> {myPatient.admissionDate || myAppointments[0]?.date || "Not Available"}</div>
                <div><strong>Time:</strong> {myAppointments[0]?.time || "Not Available"}</div>
                <div><strong>Reason:</strong> {myAppointments[0]?.reason || "Consultation"}</div>
                <div><strong>Payment Status:</strong> {myPatient.paymentStatus || "Pending"}</div>
              </div>

              <div style={{ marginTop: "12px" }}>
                <button type="button" onClick={() => setShowDetails((prev) => !prev)}>
                  {showDetails ? "Hide Details" : "View Details"}
                </button>
              </div>

              {showDetails && (
                <div style={{ marginTop: "12px", padding: "12px", border: "1px solid #ddd", borderRadius: "8px" }}>
                  <p><strong>Status:</strong> {myPatient.status || "Active"}</p>
                  <p><strong>Room / Ward:</strong> {myPatient.room || "Not Assigned"}</p>
                  <p><strong>Contact:</strong> {myPatient.contact || "Not Provided"}</p>
                </div>
              )}
            </>
          ) : (
            <p>No patient details available.</p>
          )}
        </section>

        <section className="panel">
          <h2>My Appointments</h2>

          {myAppointments.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {myAppointments.map((app) => (
                  <tr key={app.id}>
                    <td>{app.doctorName}</td>
                    <td>{app.date}</td>
                    <td>{app.time}</td>
                    <td>{app.reason}</td>
                    <td>{app.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty-message">No appointment found.</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default PatientPortal;