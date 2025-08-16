import mongoose, { Schema } from "mongoose";

const leaveSchema = new Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  // Assuming students are in the "User" model
    required: true,
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  // Faculty approving/rejecting leave
  },
  type: {
    type: String,
    enum: ["sick", "casual", "emergency", "academic"], // Extendable
    required: true,
  },
  fromDate: {
    type: Date,
    required: true,
  },
  toDate: {
    type: Date,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending", // Starts as pending
  },
  requestDate: {
    type: Date,
    default: Date.now,
  },
  updatedDate: {
    type: Date,
  },
});

export const Leave = mongoose.model("Leave", leaveSchema);
