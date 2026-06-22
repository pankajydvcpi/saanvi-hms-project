const defaultData = {
  users: [
    {
      username: "admin",
      password: "admin123",
      role: "admin",
      name: "Hospital Admin",
      email: "admin@saanvi.com",
    },
    {
      username: "henry",
      password: "doctor123",
      role: "doctor",
      name: "Dr. Henry",
      email: "henry@gmail.com",
      specialization: "Blood Cancer Specialist",
      access: "View assigned patients and appointments",
    },
    {
      username: "sita",
      password: "staff123",
      role: "staff",
      name: "Sita Thapa",
      email: "sita@gmail.com",
      department: "Reception",
      duty: "Patient registration and appointment handling",
    },
    {
      username: "ram",
      password: "patient123",
      role: "patient",
      name: "Ram Sharma",
      email: "ram@gmail.com",
      patientId: "P001",
    },
  ],

  patients: [
    {
      id: "P001",
      name: "Ram Sharma",
      age: 45,
      disease: "Blood Cancer",
      doctorUsername: "henry",
      doctorName: "Dr. Henry",
      status: "Under Treatment",
    },
  ],

  appointments: [
    {
      id: "A001",
      patientId: "P001",
      patientName: "Ram Sharma",
      doctorUsername: "henry",
      doctorName: "Dr. Henry",
      time: "10:00 AM",
      date: "2026-06-22",
      reason: "Blood cancer follow-up",
      status: "Pending",
    },
  ],

  doctorDuties: {
    henry: [
      "Check assigned patients",
      "Review patient reports",
      "Update treatment status",
      "Manage today appointments",
    ],
  },

  staffDuties: {
    sita: [
      "Register new patients",
      "Handle reception desk",
      "Manage appointment queue",
      "Guide patients to doctor room",
    ],
  },
};

export const initHMSData = () => {
  const saved = localStorage.getItem("hmsData");

  if (!saved) {
    localStorage.setItem("hmsData", JSON.stringify(defaultData));
  }
};

export const getHMSData = () => {
  initHMSData();
  return JSON.parse(localStorage.getItem("hmsData"));
};

export const saveHMSData = (data) => {
  localStorage.setItem("hmsData", JSON.stringify(data));
};

export const resetHMSData = () => {
  localStorage.setItem("hmsData", JSON.stringify(defaultData));
};