import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  requestLeave,
  approveLeave,
  rejectLeave,
  getPendingLeaves,
  getMyLeaves,
  deleteLeaveRequest
} from "../controllers/leave.controller.js";

const router = Router();

// 📌 Student requests leave
router.post("/request", verifyJWT, requestLeave);

// 📌 Faculty views pending leave requests
router.get("/pending", verifyJWT, getPendingLeaves);

// 📌 Faculty approves or rejects leave (✅ Fixed URL paths)
router.put("/:id/approve", verifyJWT, approveLeave);
router.put("/:id/reject", verifyJWT, rejectLeave);

// 📌 Student views their leave requests
router.get("/my-leaves", verifyJWT, getMyLeaves);

router.delete("/:id/delete", verifyJWT, deleteLeaveRequest);

export default router;
