import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHMSData, saveHMSData, resetHMSData } from "../data/users";
import "./Portal.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));

  const [data, setData] = useState(getHMSData());

  const [doctorForm, setDoctorForm] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    specialization: "",
  });

  const [staffForm, setStaffForm] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    department: "",
    duty: "",
  });

  const [patientForm, setPatientForm] = useState({
    name: "",
    age: "",
    disease: "",
    doctorUsername: "",
    status: "New Patient",
  });

  const [appointmentForm, setAppointmentForm] = useState({
    patientId: "",
    doctorUsername: "",
    date: "",
    time: "",
    reason: "",
  });

  const doctors = data.users.filter((user) => user.role === "doctor");
  const staff = data.users.filter((user) => user.role === "staff");

  const updateData = (newData) => {
    setData(newData);
    saveHMSData(newData);
  };

  const logout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  const addDoctor = (e) => {
    e.preventDefault();

    const newDoctor = {
      ...doctorForm,
      role: "doctor",
      access: "View and manage own patients and appointments",
    };

    const newData = {
      ...data,
      users: [...data.users, newDoctor],
      doctorDuties: {
        ...data.doctorDuties,
        [doctorForm.username]: [
          "Check assigned patients",
          "Review appointments",
          "Update patient status",
        ],
      },
    };

    updateData(newData);

    setDoctorForm({
      username: "",
      password: "",
      name: "",
      email: "",
      specialization: "",
    });
  };

  const addStaff = (e) => {
    e.preventDefault();

    const newStaff = {
      ...staffForm,
      role: "staff",
    };

    const newData = {
      ...data,
      users: [...data.users, newStaff],
      staffDuties: {
        ...data.staffDuties,
        [staffForm.username]: [
          staffForm.duty,
          "Manage daily hospital operations",
          "Support patient services",
        ],
      },
    };

    updateData(newData);

    setStaffForm({
      username: "",
      password: "",
      name: "",
      email: "",
      department: "",
      duty: "",
    });
  };

  const addPatient = (e) => {
    e.preventDefault();

    const selectedDoctor = doctors.find(
      (doctor) => doctor.username === patientForm.doctorUsername
    );

    const newPatientId = "P" + String(data.patients.length + 1).padStart(3, "0");

    const newPatient = {
      id: newPatientId,
      name: patientForm.name,
      age: patientForm.age,
      disease: patientForm.disease,
      doctorUsername: patientForm.doctorUsername,
      doctorName: selectedDoctor.name,
      status: patientForm.status,
    };

    const patientUsername = patientForm.name.toLowerCase().split(" ")[0];

    const patientUser = {
      username: patientUsername,
      password: "patient123",
      role: "patient",
      name: patientForm.name,
      email: `${patientUsername}@gmail.com`,
      patientId: newPatientId,
    };

    const newData = {
      ...data,
      patients: [...data.patients, newPatient],
      users: [...data.users, patientUser],
    };

    updateData(newData);

    setPatientForm({
      name: "",
      age: "",
      disease: "",
      doctorUsername: "",
      status: "New Patient",
    });

    alert(`Patient added. Login: ${patientUsername} / patient123`);
  };

  const addAppointment = (e) => {
    e.preventDefault();

    const selectedPatient = data.patients.find(
      (patient) => patient.id === appointmentForm.patientId
    );

    const selectedDoctor = doctors.find(
      (doctor) => doctor.username === appointmentForm.doctorUsername
    );

    const newAppointment = {
      id: "A" + String(data.appointments.length + 1).padStart(3, "0"),
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      doctorUsername: selectedDoctor.username,
      doctorName: selectedDoctor.name,
      date: appointmentForm.date,
      time: appointmentForm.time,
      reason: appointmentForm.reason,
      status: "Pending",
    };

    const newData = {
      ...data,
      appointments: [...data.appointments, newAppointment],
    };

    updateData(newData);

    setAppointmentForm({
      patientId: "",
      doctorUsername: "",
      date: "",
      time: "",
      reason: "",
    });
  };

  const deletePatient = (id) => {
    const newData = {
      ...data,
      patients: data.patients.filter((patient) => patient.id !== id),
      appointments: data.appointments.filter((app) => app.patientId !== id),
      users: data.users.filter((user) => user.patientId !== id),
    };

    updateData(newData);
  };

  const handleReset = () => {
    resetHMSData();
    setData(getHMSData());
  };

  return (
    <div className="portal-page">
      <aside className="sidebar">
        <h2>Saanvi HMS</h2>
        <p>Admin Panel</p>
        <button onClick={logout}>Logout</button>
        <button className="secondary-btn" onClick={handleReset}>
          Reset Demo Data
        </button>
      </aside>

      <main className="portal-main">
        <div className="topbar">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome, {loggedUser.name}. You can regulate the whole hospital system.</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>{doctors.length}</h3>
            <p>Doctors</p>
          </div>
          <div className="stat-card">
            <h3>{staff.length}</h3>
            <p>Staff</p>
          </div>
          <div className="stat-card">
            <h3>{data.patients.length}</h3>
            <p>Patients</p>
          </div>
          <div className="stat-card">
            <h3>{data.appointments.length}</h3>
            <p>Appointments</p>
          </div>
        </div>

        <section className="panel">
          <h2>Add Doctor</h2>
          <form className="form-grid" onSubmit={addDoctor}>
            <input placeholder="Username" value={doctorForm.username} onChange={(e) => setDoctorForm({ ...doctorForm, username: e.target.value })} required />
            <input placeholder="Password" value={doctorForm.password} onChange={(e) => setDoctorForm({ ...doctorForm, password: e.target.value })} required />
            <input placeholder="Full Name" value={doctorForm.name} onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })} required />
            <input placeholder="Email" value={doctorForm.email} onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })} required />
            <input placeholder="Specialization" value={doctorForm.specialization} onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })} required />
            <button>Add Doctor</button>
          </form>
        </section>

        <section className="panel">
          <h2>Add Staff</h2>
          <form className="form-grid" onSubmit={addStaff}>
            <input placeholder="Username" value={staffForm.username} onChange={(e) => setStaffForm({ ...staffForm, username: e.target.value })} required />
            <input placeholder="Password" value={staffForm.password} onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })} required />
            <input placeholder="Full Name" value={staffForm.name} onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })} required />
            <input placeholder="Email" value={staffForm.email} onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })} required />
            <input placeholder="Department" value={staffForm.department} onChange={(e) => setStaffForm({ ...staffForm, department: e.target.value })} required />
            <input placeholder="Duty" value={staffForm.duty} onChange={(e) => setStaffForm({ ...staffForm, duty: e.target.value })} required />
            <button>Add Staff</button>
          </form>
        </section>

        <section className="panel">
          <h2>Add Patient</h2>
          <form className="form-grid" onSubmit={addPatient}>
            <input placeholder="Patient Name" value={patientForm.name} onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })} required />
            <input type="number" placeholder="Age" value={patientForm.age} onChange={(e) => setPatientForm({ ...patientForm, age: e.target.value })} required />
            <input placeholder="Disease / Problem" value={patientForm.disease} onChange={(e) => setPatientForm({ ...patientForm, disease: e.target.value })} required />

            <select value={patientForm.doctorUsername} onChange={(e) => setPatientForm({ ...patientForm, doctorUsername: e.target.value })} required>
              <option value="">Assign Doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.username} value={doctor.username}>
                  {doctor.name} - {doctor.specialization}
                </option>
              ))}
            </select>

            <select value={patientForm.status} onChange={(e) => setPatientForm({ ...patientForm, status: e.target.value })}>
              <option>New Patient</option>
              <option>Under Treatment</option>
              <option>Admitted</option>
              <option>Recovered</option>
            </select>

            <button>Add Patient</button>
          </form>
        </section>

        <section className="panel">
          <h2>Add Appointment</h2>
          <form className="form-grid" onSubmit={addAppointment}>
            <select value={appointmentForm.patientId} onChange={(e) => setAppointmentForm({ ...appointmentForm, patientId: e.target.value })} required>
              <option value="">Select Patient</option>
              {data.patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>

            <select value={appointmentForm.doctorUsername} onChange={(e) => setAppointmentForm({ ...appointmentForm, doctorUsername: e.target.value })} required>
              <option value="">Select Doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.username} value={doctor.username}>
                  {doctor.name}
                </option>
              ))}
            </select>

            <input type="date" value={appointmentForm.date} onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })} required />
            <input placeholder="Time e.g. 10:30 AM" value={appointmentForm.time} onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })} required />
            <input placeholder="Reason" value={appointmentForm.reason} onChange={(e) => setAppointmentForm({ ...appointmentForm, reason: e.target.value })} required />

            <button>Add Appointment</button>
          </form>
        </section>

        <section className="panel">
          <h2>Patients</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Disease</th>
                <th>Doctor</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {data.patients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.id}</td>
                  <td>{patient.name}</td>
                  <td>{patient.disease}</td>
                  <td>{patient.doctorName}</td>
                  <td>{patient.status}</td>
                  <td>
                    <button className="danger-small" onClick={() => deletePatient(patient.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="panel">
          <h2>All Appointments</h2>
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {data.appointments.map((app) => (
                <tr key={app.id}>
                  <td>{app.patientName}</td>
                  <td>{app.doctorName}</td>
                  <td>{app.date}</td>
                  <td>{app.time}</td>
                  <td>{app.reason}</td>
                  <td>{app.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;