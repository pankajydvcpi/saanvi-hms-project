import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, default: "Male" },
    disease: { type: String, required: true },
    phone: { type: String },
    bloodGroup: { type: String },
    doctorAssigned: { type: String },
    status: {
      type: String,
      enum: ["Admitted", "Under Treatment", "Discharged"],
      default: "Under Treatment",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Patient", patientSchema);