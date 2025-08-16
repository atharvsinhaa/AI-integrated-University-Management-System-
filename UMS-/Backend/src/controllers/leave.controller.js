import {Leave} from "../models/leave.models.js";
import {User} from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/apiError.js";

// 📌 Request Leave (Student)
export const requestLeave = asyncHandler(async (req, res) => {
  const { type, fromDate, toDate, reason } = req.body;
  const studentId = req.user._id;

  if (!type || !fromDate || !toDate || !reason) {
    throw new ApiError(400, "All fields are required.");
  }

  const leaveRequest = new Leave({
    student: studentId,
    type,
    fromDate,
    toDate,
    reason,
    status: "pending",
  });

  await leaveRequest.save();
  res.status(201).json(new ApiResponse(201, leaveRequest, "Leave request submitted."));
});

// 📌 Approve Leave (Faculty)
export const approveLeave = asyncHandler(async (req, res) => {
  const leaveId = req.params.id;
  const facultyId = req.user._id;

  const leave = await Leave.findById(leaveId);
  if (!leave) throw new ApiError(404, "Leave request not found.");

  if (leave.status !== "pending") {
    throw new ApiError(400, "Leave request is already processed.");
  }

  leave.status = "approved";
  leave.faculty = facultyId;
  leave.updatedDate = Date.now();

  await leave.save();
  res.json(new ApiResponse(200, leave, "Leave approved."));
});

// 📌 Reject Leave (Faculty)
export const rejectLeave = asyncHandler(async (req, res) => {
  const leaveId = req.params.id;
  const facultyId = req.user._id;

  const leave = await Leave.findById(leaveId);
  if (!leave) throw new ApiError(404, "Leave request not found.");

  if (leave.status !== "pending") {
    throw new ApiError(400, "Leave request is already processed.");
  }

  leave.status = "rejected";
  leave.faculty = facultyId;
  leave.updatedDate = Date.now();

  await leave.save();
  res.json(new ApiResponse(200, leave, "Leave rejected."));
});

// 📌 Get Pending Leaves (For Faculty)
export const getPendingLeaves = asyncHandler(async (req, res) => {
  const leaves = await Leave.find({ status: "pending" }).populate("student", "fullName username");
  res.json(new ApiResponse(200, leaves, "Pending leave requests fetched successfully."));
});

// 📌 Get My Leaves (For Students)
export const getMyLeaves = asyncHandler(async (req, res) => {
  const studentId = req.user._id;
  console.log(req.user.id, req.user._id);
  const leaves = await Leave.find({ student: studentId }).sort({ requestDate: -1 }).populate("student", "fullName username");
  res.json(new ApiResponse(200, leaves, "Your leave requests fetched successfully."));
});

// 📌 Delete Leave Request (Student)
export const deleteLeaveRequest = asyncHandler(async (req, res) => {
  const leaveId = req.params.id;
  const studentId = req.user._id; // Logged-in student

  // Find leave request
  const leave = await Leave.findById(leaveId);
  if (!leave) throw new ApiError(404, "Leave request not found.");

  // Ensure only the owner can delete
  if (leave.student.toString() !== studentId.toString()) {
    throw new ApiError(403, "You can only delete your own leave requests.");
  }

  // Delete the request
  await Leave.findByIdAndDelete(leaveId);
  res.json(new ApiResponse(200, null, "Leave request deleted successfully."));
});
