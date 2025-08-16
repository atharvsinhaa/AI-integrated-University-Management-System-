import { Router } from "express";
import { updateMarks, getMarks, getProjectStudentsMarks, addProjectMarks } from "../controllers/projectMarks.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();


// Route 1: Create a project (Only "students" can create projects)
// router.post("/", verifyJWT, restrictTo("student"), createProject);
router.post(
  "/update",
  verifyJWT,
  updateMarks
);

router.get("/:projectId/students-marks", verifyJWT, getProjectStudentsMarks);

router.get('/:studentId/:projectId', verifyJWT, getMarks);

router.post('/add', verifyJWT, addProjectMarks);




export default router;
