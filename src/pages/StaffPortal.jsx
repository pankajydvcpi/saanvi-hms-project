import React from "react";
import { useNavigate } from "react-router-dom";
import { staffDuties } from "../data/users";
import "./Portal.css";

function StaffPortal() {
  const navigate = useNavigate();
  const staff = JSON.parse(localStorage.getItem("loggedInUser"));
  const myDuties = staffDuties[staff.username] || [];

  const logout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
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
          <h2>My Profile</h2>
          <p><b>Email:</b> {staff.email}</p>
          <p><b>Role:</b> Staff</p>
          <p><b>Department:</b> {staff.department}</p>
          <p><b>Main Duty:</b> {staff.duty}</p>
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
      </main>
    </div>
  );
}

export default StaffPortal;