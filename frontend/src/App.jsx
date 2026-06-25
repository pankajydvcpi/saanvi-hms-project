import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorPortal from "./pages/DoctorPortal";
import StaffPortal from "./pages/StaffPortal";
import PatientPortal from "./pages/PatientPortal";
import UserDashboard from "./pages/UserDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/admin" element={<AdminDashboard />} />

      <Route path="/doctor" element={<DoctorPortal />} />

      <Route path="/staff" element={<StaffPortal />} />

      <Route path="/patient" element={<PatientPortal />} />

      <Route path="/user" element={<UserDashboard />} />
    </Routes>
  );
}

export default App;