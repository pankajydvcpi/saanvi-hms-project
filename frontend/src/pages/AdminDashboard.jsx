import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHMSData, saveHMSData } from "../data/users";

const getDoctorPassword = () => "1234";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const specializationOptions = [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Gynecology",
    "Dermatology",
    "Psychiatry",
    "General Medicine",
  ];
  const diseaseOptions = [
    "Fever",
    "Flu",
    "Diabetes",
    "Hypertension",
    "Asthma",
    "Arthritis",
    "Migraine",
    "Allergy",
    "Injury",
    "COVID-19",
  ];
  const doctorStatusOptions = ["Available", "Busy", "On Leave", "Off Duty"];
  const patientStatusOptions = ["Active", "Critical", "Recovered", "Discharged"];
  const departmentOptions = ["Reception", "ICU", "Laboratory", "Pharmacy", "Nursing"];
  const dutyOptions = ["Patient check-in", "Appointment scheduling", "Lab support", "Pharmacy support", "Nursing support"];

  const [data, setData] = useState(() => {
    const saved = getHMSData();
    return {
      ...saved,
      staff: saved.staff || [],
      appointments: saved.appointments || [],
    };
  });
  const [section, setSection] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleAppointmentId, setRescheduleAppointmentId] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [addType, setAddType] = useState("doctor");
  const [addForm, setAddForm] = useState({
    name: "",
    specialization: specializationOptions[0],
    age: "",
    disease: diseaseOptions[0],
    department: departmentOptions[0],
    duty: dutyOptions[0],
    doctorName: "",
    status: "Available",
    username: "",
    password: "1234",
    email: "",
  });

  const update = (newData) => {
    setData(newData);
    saveHMSData(newData);
  };

  const logout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  const openAddModal = (type) => {
    setAddType(type);
    setAddForm({
      name: "",
      specialization: specializationOptions[0],
      age: "",
      disease: diseaseOptions[0],
      department: departmentOptions[0],
      duty: dutyOptions[0],
      doctorName: data.users.find((user) => user.role === "doctor")?.name || "",
      status: "Available",
      username: "",
      password: "1234",
      email: "",
    });
    setShowAddModal(true);
  };

  const handleAddInputChange = (e) => {
    setAddForm({
      ...addForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();

    if (addType === "doctor") {
      const name = addForm.name.trim();
      const specialization = addForm.specialization.trim();

      if (!name || !specialization) return;

      const newDoctor = {
        username: name.trim().split(" ").filter(Boolean).pop() || name.trim(),
        password: "1234",
        role: "doctor",
        name,
        specialization,
        status: addForm.status || "Available",
      };

      update({
        ...data,
        users: [...data.users, newDoctor],
      });
    } else if (addType === "patient") {
      const name = addForm.name.trim();
      const age = addForm.age.trim();
      const disease = addForm.disease.trim();

      if (!name || !age || !disease) return;

      const selectedDoctor = data.users.find(
        (user) => user.role === "doctor" && user.name === addForm.doctorName
      );
      const patientId = "P" + Date.now();
      const newPatient = {
        id: patientId,
        name,
        age,
        disease,
        doctorName: addForm.doctorName || "Not Assigned",
        doctorUsername: selectedDoctor?.username || "",
        status: "Active",
      };

      const newAppointment = selectedDoctor
        ? {
            id: "A" + Date.now(),
            patientId,
            patientName: name,
            doctorName: addForm.doctorName || "Not Assigned",
            doctorUsername: selectedDoctor.username,
            date: new Date().toISOString().slice(0, 10),
            status: "Pending",
          }
        : null;

      update({
        ...data,
        patients: [...data.patients, newPatient],
        appointments: newAppointment
          ? [...data.appointments, newAppointment]
          : data.appointments,
      });
    } else {
      const name = addForm.name.trim();
      const department = addForm.department.trim();

      if (!name || !department) return;

      const loginUsername = addForm.username.trim() || `staff${Date.now()}`;
      const loginPassword = addForm.password.trim() || "1234";
      const email = addForm.email.trim() || `${loginUsername}@hms.com`;
      const newStaff = {
        id: "S" + Date.now(),
        name,
        department,
        duty: addForm.duty || "Patient check-in",
        status: "Active",
        username: loginUsername,
        password: loginPassword,
        email,
      };

      update({
        ...data,
        staff: [...data.staff, newStaff],
        users: [
          ...data.users,
          {
            username: loginUsername,
            password: loginPassword,
            role: "staff",
            name,
            email,
            department,
          },
        ],
      });
    }

    setShowAddModal(false);
  };

  const deleteDoctor = (username) => {
    update({
      ...data,
      users: data.users.filter((u) => u.username !== username),
    });
  };

  const deletePatient = (id) => {
    update({
      ...data,
      patients: data.patients.filter((p) => p.id !== id),
    });
  };

  const handleDoctorStatusChange = (username, status) => {
    update({
      ...data,
      users: data.users.map((user) =>
        user.username === username ? { ...user, status } : user
      ),
    });
  };

  const handlePatientStatusChange = (id, status) => {
    update({
      ...data,
      patients: data.patients.map((patient) =>
        patient.id === id ? { ...patient, status } : patient
      ),
    });
  };

  const deleteStaff = (id, username) => {
    update({
      ...data,
      staff: data.staff.filter((s) => s.id !== id),
      users: data.users.filter((u) => !(u.role === "staff" && u.username === username)),
    });
  };

  const updateAppointmentStatus = (id, status) => {
    update({
      ...data,
      appointments: data.appointments.map((appointment) =>
        appointment.id === id ? { ...appointment, status } : appointment
      ),
    });
  };

  const openRescheduleModal = (appointment) => {
    setRescheduleAppointmentId(appointment.id);
    setRescheduleDate(appointment.date || "");
    setShowRescheduleModal(true);
  };

  const closeRescheduleModal = () => {
    setShowRescheduleModal(false);
    setRescheduleAppointmentId(null);
    setRescheduleDate("");
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();

    if (!rescheduleAppointmentId || !rescheduleDate.trim()) return;

    update({
      ...data,
      appointments: data.appointments.map((item) =>
        item.id === rescheduleAppointmentId ? { ...item, date: rescheduleDate.trim(), status: "Rescheduled" } : item
      ),
    });

    closeRescheduleModal();
  };

  const doctors = data.users.filter((u) => u.role === "doctor");
  const patients = data.patients || [];
  const staff = data.staff || [];
  const appointments = data.appointments || [];
  const pendingAppointments = appointments.filter((item) => item.status === "Pending").length;
  const today = new Date().toISOString().slice(0, 10);
  const todaysAppointments = appointments.filter((item) => item.date === today).length;

  const filteredDoctors = doctors.filter((doctor) =>
    `${doctor.name} ${doctor.specialization}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredPatients = patients.filter((patient) =>
    `${patient.name} ${patient.disease}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredStaff = staff.filter((member) =>
    `${member.name} ${member.department}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredAppointments = appointments.filter((appointment) => {
    const patientName = appointment.patientName || appointment.patient?.name || "";
    const doctorName = appointment.doctorName || appointment.doctor?.name || "";
    return `${patientName} ${doctorName} ${appointment.date}`.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getAppointmentPatientName = (appointment) =>
    appointment.patientName ||
    appointment.patient?.name ||
    (patients.find((patient) => patient.id === appointment.patientId)?.name) ||
    "Unknown Patient";

  const getAppointmentDoctorName = (appointment) =>
    appointment.doctorName ||
    appointment.doctor?.name ||
    (doctors.find((doctor) => doctor.username === appointment.doctorUsername || doctor.name === appointment.doctorId)?.name) ||
    "Not Assigned";

  const searchPlaceholder =
    section === "doctors"
      ? "Search doctors by name or specialization"
      : section === "patients"
        ? "Search patients by name or disease"
        : section === "staff"
          ? "Search staff by name or department"
          : section === "appointments"
            ? "Search appointments by patient, doctor, or date"
            : "Search records";

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>🏥 HMS</h2>
        <button onClick={() => setSection("dashboard")}>Dashboard</button>
        <button onClick={() => setSection("doctors")}>Doctors</button>
        <button onClick={() => setSection("patients")}>Patients</button>
        <button onClick={() => setSection("appointments")}>Appointments</button>
        <button onClick={() => setSection("staff")}>Staff</button>
        <button onClick={() => setSection("reports")}>Reports</button>
        <button className="logout" onClick={logout}>Logout</button>
      </aside>

      <main className="main">
        <div className="topbar">
          <div>
            <p className="eyebrow">Hospital Management System</p>
            <h1>Admin Dashboard</h1>
          </div>
          <div className="search-bar">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {section === "dashboard" && (
          <div className="content-stack">
            <div className="stats-grid">
              <div className="stat-card">
                <p>Total Patients</p>
                <h2>{patients.length}</h2>
              </div>
              <div className="stat-card">
                <p>Total Doctors</p>
                <h2>{doctors.length}</h2>
              </div>
              <div className="stat-card">
                <p>Total Staff</p>
                <h2>{staff.length}</h2>
              </div>
              <div className="stat-card">
                <p>Today&apos;s Appointments</p>
                <h2>{todaysAppointments}</h2>
              </div>
              <div className="stat-card">
                <p>Pending Appointments</p>
                <h2>{pendingAppointments}</h2>
              </div>
            </div>

            <div className="panel-grid">
              <div className="panel-card">
                <div className="panel-header">
                  <h3>Quick Actions</h3>
                </div>
                <div className="quick-actions">
                  <button onClick={() => openAddModal("doctor")}>+ Add Doctor</button>
                  <button onClick={() => openAddModal("patient")}>+ Add Patient</button>
                  <button onClick={() => openAddModal("staff")}>+ Add Staff</button>
                </div>
              </div>

              <div className="panel-card">
                <div className="panel-header">
                  <h3>Upcoming Appointments</h3>
                </div>
                <ul className="list-stack">
                  {appointments.slice(0, 4).map((appointment) => (
                    <li key={appointment.id}>
                      <strong>{getAppointmentPatientName(appointment)}</strong> with {getAppointmentDoctorName(appointment)} on {appointment.date}
                      <span className={`badge ${appointment.status.toLowerCase()}`}>{appointment.status}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {section === "doctors" && (
          <div className="content-stack">
            <div className="section-header">
              <h2>Doctor Management</h2>
              <button onClick={() => openAddModal("doctor")}>+ Add Doctor</button>
            </div>

            <div className="table-card">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Specialization</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDoctors.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="empty-state">No doctors found</td>
                    </tr>
                  ) : (
                    filteredDoctors.map((doctor) => (
                      <tr key={doctor.username}>
                        <td>{doctor.name}</td>
                        <td>{doctor.specialization}</td>
                        <td>
                          <select
                            className="inline-select"
                            value={doctor.status || "Available"}
                            onChange={(e) => handleDoctorStatusChange(doctor.username, e.target.value)}
                          >
                            {doctorStatusOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <button className="danger-btn" onClick={() => deleteDoctor(doctor.username)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {section === "patients" && (
          <div className="content-stack">
            <div className="section-header">
              <h2>Patient Management</h2>
              <button onClick={() => openAddModal("patient")}>+ Add Patient</button>
            </div>

            <div className="table-card">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Disease</th>
                    <th>Doctor</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty-state">No patients found</td>
                    </tr>
                  ) : (
                    filteredPatients.map((patient) => (
                      <tr key={patient.id}>
                        <td>{patient.name}</td>
                        <td>{patient.age}</td>
                        <td>{patient.disease}</td>
                        <td>{patient.doctorName}</td>
                        <td>
                          <select
                            className="inline-select"
                            value={patient.status || "Active"}
                            onChange={(e) => handlePatientStatusChange(patient.id, e.target.value)}
                          >
                            {patientStatusOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <button className="danger-btn" onClick={() => deletePatient(patient.id)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {section === "appointments" && (
          <div className="content-stack">
            <div className="section-header">
              <h2>Appointment Management</h2>
            </div>

            <div className="table-card">
              <table>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty-state">No appointments found</td>
                    </tr>
                  ) : (
                    filteredAppointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>{getAppointmentPatientName(appointment)}</td>
                        <td>{getAppointmentDoctorName(appointment)}</td>
                        <td>{appointment.date}</td>
                        <td><span className={`badge ${appointment.status.toLowerCase()}`}>{appointment.status}</span></td>
                        <td>
                          <div className="action-row">
                            <button onClick={() => updateAppointmentStatus(appointment.id, "Approved")}>Approve</button>
                            <button className="secondary-btn" onClick={() => updateAppointmentStatus(appointment.id, "Rejected")}>Reject</button>
                            <button className="secondary-btn" onClick={() => openRescheduleModal(appointment)}>Reschedule</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {section === "staff" && (
          <div className="content-stack">
            <div className="section-header">
              <h2>Staff Management</h2>
              <button onClick={() => openAddModal("staff")}>+ Add Staff</button>
            </div>

            <div className="table-card">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Duty</th>
                    <th>Username</th>
                    <th>Password</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="empty-state">No staff found</td>
                    </tr>
                  ) : (
                    filteredStaff.map((member) => (
                      <tr key={member.id}>
                        <td>{member.name}</td>
                        <td>{member.department}</td>
                        <td>{member.duty}</td>
                        <td>{member.username || "-"}</td>
                        <td>{member.password || "-"}</td>
                        <td>{member.email || "-"}</td>
                        <td>
                          <button className="danger-btn" onClick={() => deleteStaff(member.id, member.username)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {section === "reports" && (
          <div className="content-stack">
            <div className="section-header">
              <h2>Reports & Analytics</h2>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <p>Patient Reports</p>
                <h2>{patients.length}</h2>
              </div>
              <div className="stat-card">
                <p>Doctor Reports</p>
                <h2>{doctors.length}</h2>
              </div>
              <div className="stat-card">
                <p>Appointment Reports</p>
                <h2>{appointments.length}</h2>
              </div>
              <div className="stat-card">
                <p>Hospital Statistics</p>
                <h2>{patients.length + doctors.length + staff.length}</h2>
              </div>
            </div>
          </div>
        )}

        {showRescheduleModal && (
          <div className="modal-overlay">
            <div className="modal-card">
              <div className="modal-header">
                <h3>Reschedule Appointment</h3>
                <button className="close-btn" onClick={closeRescheduleModal}>
                  ×
                </button>
              </div>

              <form onSubmit={handleRescheduleSubmit} className="add-form">
                <label>New Date</label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  required
                />

                <div className="modal-actions">
                  <button type="button" className="secondary-btn" onClick={closeRescheduleModal}>
                    Cancel
                  </button>
                  <button type="submit">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal-card">
              <div className="modal-header">
                <h3>
                  {addType === "doctor"
                    ? "Add Doctor"
                    : addType === "patient"
                      ? "Add Patient"
                      : "Add Staff"}
                </h3>
                <button className="close-btn" onClick={() => setShowAddModal(false)}>
                  ×
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="add-form">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={addForm.name}
                  onChange={handleAddInputChange}
                  placeholder={
                    addType === "doctor"
                      ? "Enter doctor name"
                      : addType === "patient"
                        ? "Enter patient name"
                        : "Enter staff name"
                  }
                  required
                />

                {addType === "doctor" ? (
                  <>
                    <label>Specialization</label>
                    <select name="specialization" value={addForm.specialization} onChange={handleAddInputChange} required>
                      {specializationOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>

                    <label>Status</label>
                    <select name="status" value={addForm.status} onChange={handleAddInputChange} required>
                      {doctorStatusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </>
                ) : addType === "patient" ? (
                  <>
                    <label>Age</label>
                    <input type="number" name="age" value={addForm.age} onChange={handleAddInputChange} placeholder="Enter age" required />

                    <label>Disease</label>
                    <select name="disease" value={addForm.disease} onChange={handleAddInputChange} required>
                      {diseaseOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>

                    <label>Assign Doctor</label>
                    <select name="doctorName" value={addForm.doctorName} onChange={handleAddInputChange}>
                      <option value="">Not Assigned</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.username} value={doctor.name}>
                          {doctor.name}
                        </option>
                      ))}
                    </select>
                  </>
                ) : (
                  <>
                    <label>Department</label>
                    <select name="department" value={addForm.department} onChange={handleAddInputChange} required>
                      {departmentOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>

                    <label>Duty</label>
                    <select name="duty" value={addForm.duty} onChange={handleAddInputChange} required>
                      {dutyOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>

                    <label>Username</label>
                    <input
                      type="text"
                      name="username"
                      value={addForm.username}
                      onChange={handleAddInputChange}
                      placeholder="Enter staff username"
                    />

                    <label>Password</label>
                    <input
                      type="password"
                      name="password"
                      value={addForm.password}
                      onChange={handleAddInputChange}
                      placeholder="Enter staff password"
                    />

                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={addForm.email}
                      onChange={handleAddInputChange}
                      placeholder="Enter staff email"
                    />
                  </>
                )}

                <div className="modal-actions">
                  <button type="button" className="secondary-btn" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;