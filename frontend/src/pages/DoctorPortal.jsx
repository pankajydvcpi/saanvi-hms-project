import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { getHMSData, saveHMSData } from "../data/users";
import "./Portal.css";

function DoctorPortal() {
  const navigate = useNavigate();
  const doctor = JSON.parse(localStorage.getItem("loggedInUser"));

  const [data, setData] = useState(() => getHMSData());
  const doctorName = doctor?.name || "";
  const doctorUsername = doctor?.username || "";

  const myPatients = (data.patients || []).filter((patient) => {
    const matchesUsername = patient.doctorUsername === doctorUsername;
    const matchesName = patient.doctorName === doctorName;
    return matchesUsername || matchesName;
  });

  const getAppointmentPatientName = (appointment) =>
    appointment.patientName ||
    appointment.patient?.name ||
    (data.patients || []).find((patient) => patient.id === appointment.patientId)?.name ||
    "Unknown Patient";

  const getAppointmentDoctorName = (appointment) =>
    appointment.doctorName ||
    appointment.doctor?.name ||
    (data.users || []).find((user) => user.username === appointment.doctorUsername)?.name ||
    "Not Assigned";

  const myAppointments = (data.appointments || []).filter((app) => {
    const matchesUsername = app.doctorUsername === doctorUsername;
    const matchesName = getAppointmentDoctorName(app) === doctorName;
    return matchesUsername || matchesName;
  });

  const today = new Date().toISOString().slice(0, 10);
  const todaySchedule = (myAppointments || []).filter((app) => app.date === today);
  const [prescriptionText, setPrescriptionText] = useState("");
  const [diagnosisText, setDiagnosisText] = useState("");
  const [labNote, setLabNote] = useState("");
  const [notifications, setNotifications] = useState([
    "2 new appointment requests",
    "Lab results uploaded for Ram Sharma",
  ]);

  useEffect(() => {
    const syncData = () => {
      setData(getHMSData());
    };

    window.addEventListener("hms-data-updated", syncData);
    window.addEventListener("storage", syncData);
    window.addEventListener("focus", syncData);

    return () => {
      window.removeEventListener("hms-data-updated", syncData);
      window.removeEventListener("storage", syncData);
      window.removeEventListener("focus", syncData);
    };
  }, []);

  const updateData = (newData) => {
    setData(newData);
    saveHMSData(newData);
  };

  const logout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  const handleDownloadPatientReport = (patient) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Patient Report", 14, 20);
    doc.setFontSize(12);
    doc.text(`Name: ${patient.name || "N/A"}`, 14, 35);
    doc.text(`Age: ${patient.age || "N/A"}`, 14, 45);
    doc.text(`Disease: ${patient.disease || "N/A"}`, 14, 55);
    doc.text(`Assigned Doctor: ${patient.doctorName || "N/A"}`, 14, 65);
    doc.text(`Status: ${patient.status || "Active"}`, 14, 75);
    doc.save(`${patient.name || "patient"}-report.pdf`);
  };

  const updateAppointment = (id, field, value) => {
    const newAppointments = (data.appointments || []).map((app) =>
      app.id === id ? { ...app, [field]: value } : app
    );

    updateData({
      ...data,
      appointments: newAppointments,
    });
  };

  const updatePatientStatus = (patientId, newStatus) => {
    const newPatients = (data.patients || []).map((patient) =>
      patient.id === patientId ? { ...patient, status: newStatus } : patient
    );

    updateData({
      ...data,
      patients: newPatients,
    });
  };

  const addPrescription = () => {
    if (!prescriptionText.trim()) return;
    setNotifications((prev) => [`Prescription added for ${myPatients[0]?.name || "patient"}`, ...prev]);
    setPrescriptionText("");
  };

  const addDiagnosisNote = () => {
    if (!diagnosisText.trim()) return;
    setNotifications((prev) => [`Diagnosis note added for ${myPatients[0]?.name || "patient"}`, ...prev]);
    setDiagnosisText("");
  };

  const availabilityByDay = {
    Monday: "9:00 AM - 5:00 PM",
    Tuesday: "9:00 AM - 5:00 PM",
    Wednesday: "9:00 AM - 5:00 PM",
    Thursday: "9:00 AM - 5:00 PM",
    Friday: "9:00 AM - 5:00 PM",
    Saturday: "10:00 AM - 2:00 PM",
    Sunday: "Closed",
  };

  const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todayAvailability = availabilityByDay[todayName] || "Closed";

  return (
    <div className="portal-page doctor-portal-page">
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
          <h2>Doctor Profile</h2>
          <p><b>Name:</b> {doctor.name}</p>
          <p><b>Email:</b> {doctor.email}</p>
          <p><b>Role:</b> Doctor</p>
          <p><b>Specialization:</b> {doctor.specialization}</p>
          <p><b>Access:</b> {doctor.access}</p>
        </section>

        <section className="panel">
          <h2>Today's Schedule</h2>
          <div className="duty-grid">
            {todaySchedule.length > 0 ? todaySchedule.map((app) => (
              <div className="duty-card" key={app.id}>
                <strong>{getAppointmentPatientName(app)}</strong>
                <div>{app.time || "Time TBD"}</div>
                <div>{app.reason || "Consultation"}</div>
                <small>{app.status}</small>
              </div>
            )) : <p>No appointments scheduled today for {doctor.name}.</p>}
          </div>
        </section>

        <section className="panel">
          <h2>Appointment Requests</h2>
          <div className="duty-grid">
            {myAppointments.filter((app) => app.status === "Pending").length > 0 ? myAppointments.filter((app) => app.status === "Pending").map((app) => (
              <div className="duty-card" key={app.id}>
                {getAppointmentPatientName(app)} - {app.date}
              </div>
            )) : <p>No pending appointment requests.</p>}
          </div>
        </section>

        <section className="panel">
          <h2>Patient List</h2>
          <table>
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Disease</th>
                <th>Status</th>
                <th>Report</th>
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
                    <div className="report-actions">
                      <button type="button" className="doctor-btn" onClick={() => handleDownloadPatientReport(patient)}>
                        Download PDF
                      </button>
                      <button type="button" className="doctor-btn secondary" onClick={() => window.print()}>
                        Print
                      </button>
                    </div>
                  </td>
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
          <h2>Patient Medical History</h2>
          <div className="duty-grid">
            {myPatients.length > 0 ? myPatients.map((patient) => (
              <div className="duty-card" key={patient.id}>
                <strong>{patient.name}</strong><br />{patient.disease} • {patient.status}
              </div>
            )) : <p>No patient medical history available.</p>}
          </div>
        </section>

        <section className="panel">
          <h2>Add Prescription</h2>
          <textarea
            className="doctor-textarea"
            value={prescriptionText}
            onChange={(e) => setPrescriptionText(e.target.value)}
            placeholder="Enter prescription details"
          />
          <button type="button" className="doctor-btn" onClick={addPrescription}>Save Prescription</button>
        </section>

        <section className="panel">
          <h2>Lab Report Access</h2>
          <textarea
            className="doctor-textarea"
            value={labNote}
            onChange={(e) => setLabNote(e.target.value)}
            placeholder="Add lab report notes"
          />
          <button type="button" className="doctor-btn secondary" onClick={() => setLabNote("")}>Clear</button>
        </section>

        <section className="panel">
          <h2>Diagnosis Notes</h2>
          <textarea
            className="doctor-textarea"
            value={diagnosisText}
            onChange={(e) => setDiagnosisText(e.target.value)}
            placeholder="Add diagnosis notes"
          />
          <button type="button" className="doctor-btn" onClick={addDiagnosisNote}>Save Diagnosis</button>
        </section>

        <section className="panel">
          <h2>Availability Schedule</h2>
          <p className="availability-summary">
            <strong>Today:</strong> {todayName} — {todayAvailability}
          </p>
          <div className="availability-grid">
            {Object.entries(availabilityByDay).map(([day, time]) => (
              <div key={day} className={`availability-card ${day === todayName ? "active" : ""}`}>
                <strong>{day}</strong>
                <span>{time}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2>Notifications</h2>
          <ul className="notification-list">
            {notifications.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
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
                  <td>{getAppointmentPatientName(app)}</td>

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