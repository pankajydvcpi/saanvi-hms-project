import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Portal.css";

function StaffPortal() {
  const navigate = useNavigate();
  const staff = JSON.parse(localStorage.getItem("loggedInUser"));
  const myDuties = staff?.duty ? [staff.duty] : [];

  const [assignedTasks, setAssignedTasks] = useState([
    { label: "Check-in patients", done: false },
    { label: "Prepare discharge summary", done: false },
    { label: "Update ward records", done: false },
  ]);

  const attendanceStatus = "Present";
  const departmentDuty = {
    Reception: "Patient check-in and front desk support",
    ICU: "Critical patient monitoring and ward coordination",
    Laboratory: "Sample processing and lab support",
    Pharmacy: "Medication handling and stock support",
    Nursing: "Patient care and ward assistance",
  };
  const mainDuty = departmentDuty[staff?.department] || staff?.duty || "Hospital support operations";
  const shiftSchedule = ["Morning Shift: 8:00 AM - 4:00 PM", "Evening Shift: 4:00 PM - 12:00 AM"];
  const patientSupport = ["Assist walk-in patients", "Coordinate doctor requests"];
  const [roomAllocation, setRoomAllocation] = useState([
    { room: "Room 101", status: "Available" },
    { room: "Room 102", status: "Occupied" },
    { room: "Room 103", status: "Available" },
    { room: "Room 201", status: "Occupied" },
    { room: "Room 202", status: "Available" },
    { room: "Room 305", status: "Occupied" },
  ]);
  const inventoryItems = ["Bandages", "Gloves", "IV Fluids"];
  const notifications = ["New patient admitted", "Inventory restock pending"];
  const functions = [
    { title: "Patient Check-in", description: "Register and guide patients on arrival." },
    { title: "Appointment Handling", description: "Support scheduling and follow-up coordination." },
    { title: "Record Updates", description: "Maintain ward and patient service records." },
  ];

  const logout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  const toggleTask = (index) => {
    setAssignedTasks((prev) =>
      prev.map((task, taskIndex) =>
        taskIndex === index ? { ...task, done: !task.done } : task
      )
    );
  };

  const toggleRoomStatus = (index) => {
    setRoomAllocation((prev) =>
      prev.map((room, roomIndex) =>
        roomIndex === index
          ? {
              ...room,
              status: room.status === "Available" ? "Occupied" : "Available",
            }
          : room
      )
    );
  };

  return (
    <div className="portal-page">
      <aside className="sidebar staff-side">
        <h2>Staff Portal</h2>
        <p>{staff.name}</p>
        <button onClick={logout}>Logout</button>
      </aside>

      <main className="portal-main">
        <div className="topbar">
          <div>
            <h1>Welcome, {staff.name}</h1>
            <p>{staff.department} Department</p>
          </div>
        </div>

        <section className="profile-card">
          <h2>Staff Profile</h2>
          <p><b>Name:</b> {staff.name}</p>
          <p><b>Email:</b> {staff.email}</p>
          <p><b>Role:</b> Staff</p>
          <p><b>Department:</b> {staff.department}</p>
          <p><b>Main Duty:</b> {mainDuty}</p>
        </section>

        <section className="panel">
          <h2>Attendance</h2>
          <p><b>Status:</b> {attendanceStatus}</p>
          <p><b>Today's Check-in:</b> 08:00 AM</p>
        </section>

        <section className="panel">
          <h2>My Duties & Functions</h2>
          <div className="duty-grid">
            {functions.map((item, index) => (
              <div className="duty-card" key={index}>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2>Assigned Tasks</h2>
          <div className="duty-grid">
            {assignedTasks.map((task, index) => (
              <label className={`duty-card task-card ${task.done ? "completed" : ""}`} key={index}>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(index)}
                />
                <span>{task.label}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2>Shift Management</h2>
          <div className="duty-grid">
            {shiftSchedule.map((shift, index) => (
              <div className="duty-card" key={index}>{shift}</div>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2>Patient Support</h2>
          <div className="duty-grid">
            {patientSupport.map((item, index) => (
              <div className="duty-card" key={index}>{item}</div>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2>Room Allocation</h2>
          <div className="duty-grid">
            {roomAllocation.map((room, index) => (
              <button
                type="button"
                className={`duty-card room-card ${room.status === "Occupied" ? "occupied" : "available"}`}
                key={index}
                onClick={() => toggleRoomStatus(index)}
              >
                <strong>{room.room}</strong>
                <span>{room.status}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2>Manage Inventory</h2>
          <div className="duty-grid">
            {inventoryItems.map((item, index) => (
              <div className="duty-card" key={index}>{item}</div>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2>Internal Notifications</h2>
          <ul className="notification-list">
            {notifications.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <h2>Today's Duties</h2>
          <div className="duty-grid">
            {myDuties.map((duty, index) => (
              <div className="duty-card" key={index}>{duty}</div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default StaffPortal;