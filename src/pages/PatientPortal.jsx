import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHMSData } from "../data/users";
import "./Portal.css";

function PatientPortal() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  const [data] = useState(getHMSData());

  const myRecord = data.patients.find(
    (patient) => patient.id === user.patientId
  );

  const myAppointments = data.appointments.filter(
    (app) => app.patientId === user.patientId
  );

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

        {myRecord ? (
          <section className="profile-card">
            <h2>My Medical Information</h2>
            <p>
              <b>Patient ID:</b> {myRecord.id}
            </p>
            <p>
              <b>Name:</b> {myRecord.name}
            </p>
            <p>
              <b>Age:</b> {myRecord.age}
            </p>
            <p>
              <b>Disease / Problem:</b> {myRecord.disease}
            </p>
            <p>
              <b>Assigned Doctor:</b> {myRecord.doctorName}
            </p>
            <p>
              <b>Treatment Status:</b> {myRecord.status}
            </p>
          </section>
        ) : (
          <section className="profile-card">
            <h2>No Patient Record Found</h2>
            <p>Your patient record is not available.</p>
          </section>
        )}

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