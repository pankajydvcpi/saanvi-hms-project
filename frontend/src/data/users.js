const getDoctorPassword = () => "1234";

const defaultData = {
  users: [
    {
      username: "admin",
      password: "admin123",
      role: "admin",
      name: "Admin"
    },
    {
      username: "Henry",
      password: "1234",
      role: "doctor",
      name: "Dr Henry",
      email: "henry@hms.com",
      access: "Full Access",
      specialization: "Cardiologist"
    },
    {
      username: "John",
      password: "1234",
      role: "doctor",
      name: "Dr John",
      email: "john@hms.com",
      access: "Limited Access",
      specialization: "Neurologist"
    },
    {
      username: "staff1",
      password: "1234",
      role: "staff",
      name: "Lisa Rao",
      email: "lisa@hms.com",
      department: "Reception",
      duty: "Patient check-in"
    },
    {
      username: "patient1",
      password: "1234",
      role: "patient",
      name: "Ram Sharma",
      patientId: "P001"
    }
  ],

  patients: [
    {
      id: "P001",
      name: "Ram Sharma",
      age: 45,
      disease: "Fever",
      doctorName: "Dr Henry",
      doctorUsername: "henry",
      status: "Active"
    }
  ],

  staff: [
    {
      id: "S001",
      name: "Lisa Rao",
      department: "Reception",
      duty: "Patient check-in",
      status: "Active"
    }
  ],

  appointments: [
    {
      id: "A001",
      patientName: "Ram Sharma",
      doctorName: "Dr Henry",
      date: "2026-06-24",
      status: "Pending"
    }
  ]
};

export const initHMSData = () => {
  const savedData = localStorage.getItem("hmsData");

  if (!savedData) {
    localStorage.setItem("hmsData", JSON.stringify(defaultData));
    return;
  }

  try {
    const parsedData = JSON.parse(savedData);
    const mergedUsers = [
      ...defaultData.users.map((defaultUser) => {
        const existingUser = (parsedData.users || []).find(
          (user) => user.username === defaultUser.username
        );
        return {
          ...defaultUser,
          ...(existingUser || {}),
        };
      }),
      ...((parsedData.users || []).filter(
        (user) => !defaultData.users.some((defaultUser) => defaultUser.username === user.username)
      )),
    ];

    const mergedData = {
      ...defaultData,
      ...parsedData,
      users: mergedUsers.map((user) =>
        user.role === "doctor"
          ? {
              ...user,
              username: (user.name || user.username)
                .split(" ")
                .filter(Boolean)
                .pop() || user.username,
              password: "1234",
            }
          : user
      ),
      patients: [
        ...defaultData.patients,
        ...((parsedData.patients || []).filter(
          (patient) => !defaultData.patients.some((defaultPatient) => defaultPatient.id === patient.id)
        )),
      ],
      staff: [
        ...defaultData.staff,
        ...((parsedData.staff || []).filter(
          (member) => !defaultData.staff.some((defaultStaff) => defaultStaff.id === member.id)
        )),
      ],
      appointments: [
        ...defaultData.appointments,
        ...((parsedData.appointments || []).filter(
          (appointment) => !defaultData.appointments.some((defaultAppointment) => defaultAppointment.id === appointment.id)
        )),
      ],
    };

    if (JSON.stringify(parsedData) !== JSON.stringify(mergedData)) {
      localStorage.setItem("hmsData", JSON.stringify(mergedData));
    }
  } catch {
    localStorage.setItem("hmsData", JSON.stringify(defaultData));
  }
};

export const getHMSData = () => {
  initHMSData();
  return JSON.parse(localStorage.getItem("hmsData"));
};

export const saveHMSData = (data) => {
  localStorage.setItem("hmsData", JSON.stringify(data));
  window.dispatchEvent(new Event("hms-data-updated"));
};

export const resetHMSData = () => {
  localStorage.setItem("hmsData", JSON.stringify(defaultData));
};