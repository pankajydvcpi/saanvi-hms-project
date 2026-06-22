import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHMSData, saveHMSData } from "../data/users";
import "./Portal.css";

function DoctorPortal() {
  const navigate = useNavigate();
  const doctor = JSON.parse(localStorage.getItem("loggedInUser"));

  const [data, setData] = useState(getHMSData());

  const myPatients = data.patients.filter(
    (patient) => patient.doctorUsername === doctor.username
  );

  const myAppointments = data.appointments.filter(
    (app) => app.doctorUsername === doctor.username
  );

  const myDuties = data.doctorDuties[doctor.username] || [];

  const updateData = (newData) => {
    setData(newData);
    saveHMSData(newData);
  };

  const logout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  const updateAppointment = (id, field, value) => {
    const newAppointments = data.appointments.map((app) =>
      app.id === id ? { ...app, [field]: value } : app
    );

    updateData({
      ...data,
      appointments: newAppointments,
    });
  };

  const updatePatientStatus = (patientId, newStatus) => {
    const newPatients = data.patients.map((patient) =>
      patient.id === patientId ? { ...patient, status: newStatus } : patient
    );

    updateData({
      ...data,
      patients: newPatients,
    });
  };

  return (
    <div className="portal-page">
      <aside className="sidebar doctor-side">
        <h2>Doctor Portal</h2>
        <p>{doctor.name}</p>
        <button onClick={logout}>Logout</button>
      </aside>

      <main className="portal-main">
        <div className="topbar">
          <div>
            <h1>Welcome, {doctor.name}</h1>
            <p>{doctor.specialization}</p>
          </div>
        </div>

        <section className="profile-card">
          <h2>My Access</h2>
          <p><b>Email:</b> {doctor.email}</p>
          <p><b>Role:</b> Doctor</p>
          <p><b>Access:</b> {doctor.access}</p>
        </section>

        <section className="panel">
          <h2>Today's Duties</h2>
          <div className="duty-grid">
            {myDuties.map((duty, index) => (
              <div className="duty-card" key={index}>
                {duty}
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2>My Patients</h2>
          <table>
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Disease</th>
                <th>Status</th>
                <th>Change Status</th>
              </tr>
            </thead>

            <tbody>
              {myPatients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.id}</td>
                  <td>{patient.name}</td>
                  <td>{patient.disease}</td>
                  <td>{patient.status}</td>
                  <td>
                    <select
                      value={patient.status}
                      onChange={(e) =>
                        updatePatientStatus(patient.id, e.target.value)
                      }
                    >
                      <option>New Patient</option>
                      <option>Under Treatment</option>
                      <option>Admitted</option>
                      <option>Recovered</option>
                      <option>Discharged</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="panel">
          <h2>My Appointments</h2>
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Time</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {myAppointments.map((app) => (
                <tr key={app.id}>
                  <td>{app.patientName}</td>

                  <td>
                    <input
                      type="date"
                      value={app.date}
                      onChange={(e) =>
                        updateAppointment(app.id, "date", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      value={app.time}
                      onChange={(e) =>
                        updateAppointment(app.id, "time", e.target.value)
                      }
                    />
                  </td>

                  <td>{app.reason}</td>

                  <td>
                    <select
                      value={app.status}
                      onChange={(e) =>
                        updateAppointment(app.id, "status", e.target.value)
                      }
                    >
                      <option>Pending</option>
                      <option>Checked</option>
                      <option>Rescheduled</option>
                      <option>Completed</option>
                      <option>Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default DoctorPortal;