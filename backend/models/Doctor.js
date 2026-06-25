import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    department: { type: String },
    availability: { type: String },
    status: {
      type: String,
      enum: ["Available", "Busy", "On Leave"],
      default: "Available",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", doctorSchema);