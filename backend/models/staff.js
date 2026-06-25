import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    department: { type: String },
    phone: { type: String },
    shift: { type: String },
    salary: { type: Number },
    status: {
      type: String,
      enum: ["Active", "Inactive", "On Leave"],
      default: "Active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Staff", staffSchema);