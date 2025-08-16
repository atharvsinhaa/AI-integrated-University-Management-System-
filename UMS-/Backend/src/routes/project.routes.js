import { Router } from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProjectStatus,
  uploadProjectFiles,
  deleteProject,
} from "../controllers/project.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { restrictTo } from "../middlewares/restrict.middleware.js"; // Do this afterwards when things become stable
import { upload } from "../middlewares/multer.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const router = Router();
import { Project } from "../models/project.models.js";

// Route 1: Create a project (Only "students" can create projects)
router.post(
  "/",
  verifyJWT,
  upload.array("projectFiles", 15), // Allow up to 15 files
  createProject
);

router.delete("/:id", verifyJWT, deleteProject);

// Route 2: Get all projects (Only "faculty" and "admin" can view all projects)
router.get("/", verifyJWT, getAllProjects);

// Route 3: Get a single project by ID (Accessible to all roles)
router.get("/:id", verifyJWT, getProjectById);

// Route 4: Update project status (Only "faculty" can update project status)
router.put("/:id/status", verifyJWT, updateProjectStatus);

// Route 5: Upload project files (Only "students" can upload files)
router.post(
  "/:id/upload",
  verifyJWT,
  upload.array("projectFiles", 15), // Allow up to 15 files with the field name "projectFiles"
  uploadProjectFiles
);

// Route 6: Update repository link
router.put(
  "/:id/repository",
  verifyJWT, // Ensure the user is authenticated
  asyncHandler(async (req, res) => {
    const { id } = req.params; // Project ID
    const { repositoryLink } = req.body; // New repository link from the request body

    if (!repositoryLink) {
      return res.status(400).json({ message: "Repository link is required" });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.repositoryLink = repositoryLink;
    await project.save();

    res.status(200).json({
      message: "Repository link updated successfully.",
      project,
    });
  })
);

// Route 7: Download project files (Accessible to all roles)
router.get("/:id/download", verifyJWT, getProjectById, (req, res) => {
  const project = req.project;
  if (!project || !project.files) {
    return res.status(404).json({ message: "No files found for this project." });
  }
  // Logic to download files goes here
  res.status(200).json({ message: "Files downloaded successfully." });
});

/*  
  🔥 NEW ROUTES: Faculty can add/update recommendations, and students can view them.  
*/

// Route 8: Faculty Adds/Updates Recommendation
router.put(
  "/:id/recommendation",
  verifyJWT,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { recommendation } = req.body;
    const facultyId = req.user._id; // Ensure faculty is logged in

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Ensure only assigned faculty can give recommendations
    if (project.faculty.toString() !== facultyId.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    project.recommendation = recommendation;
    await project.save();

    res.status(200).json({ message: "Recommendation updated successfully!", project });
  })
);

// Route 9: Get Recommendation (Students View)
router.get(
  "/:id/recommendation",
  verifyJWT,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const project = await Project.findById(id).select("recommendation");

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json({ recommendation: project.recommendation });
  })
);

export default router;
