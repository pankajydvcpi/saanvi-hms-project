import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import Staff from "../models/Staff.js";
import Appointment from "../models/Appointment.js";

export const getDashboardStats = async (req, res) => {
  try {
    const patients = await Patient.countDocuments();
    const doctors = await Doctor.countDocuments();
    const staff = await Staff.countDocuments();
    const appointments = await Appointment.countDocuments();

    const admittedPatients = await Patient.countDocuments({
      status: "Admitted",
    });

    const pendingAppointments = await Appointment.countDocuments({
      status: "Pending",
    });

    res.json({
      patients,
      doctors,
      staff,
      appointments,
      admittedPatients,
      pendingAppointments,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load dashboard stats" });
  }
};