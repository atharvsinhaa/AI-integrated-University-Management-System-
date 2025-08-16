import { Project } from "../models/project.models.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { uploadOnCloudinary, deleteFileFromCloudinary  } from "../utils/cloudinary.js";
import mongoose from "mongoose";

/**
 * @desc Delete a project
 * @route DELETE /api/v1/projects/:id
 * @access Faculty / Project Owner
 */
export const deleteProject = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate the ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid project ID format.");
  }

  // Find the project
  const project = await Project.findById(id);
  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  // Check if the user is authorized to delete the project
  // You can either allow the creator of the project or faculty members to delete the project
  if (req.user.role !== "faculty" && !project.createdBy.equals(req.user._id)) {
    throw new ApiError(403, "You are not authorized to delete this project.");
  }

  // Delete project files from Cloudinary if necessary (optional)
  for (const file of project.projectFiles) {
    await deleteFileFromCloudinary(file.publicId); // This is assuming `uploadOnCloudinary.delete` exists to delete files
  }

  // Delete the project from the database
  await Project.deleteOne({ _id: id }); 

  res.status(200).json({ message: "Project deleted successfully." });
});


/**
 * @desc Create a new project
 * @route POST /api/projects
 * @access Student
 */
export const createProject = asyncHandler(async (req, res) => {
  const { title, description, teamMembers, facultyUsername, repositoryLink, type} = req.body;

  console.log(req.user.role);

//   Validate faculty existence
  const facultyUser = await User.findOne({ username: facultyUsername, role: "faculty" });
  if (!facultyUser) {
    throw new ApiError(404, "Assigned faculty not found.");
  }



   // Parse teamMembers if it's a string
  let teamMemberArray = teamMembers;
  if (typeof teamMembers === "string") {
    try {
      teamMemberArray = JSON.parse(teamMembers); // Parse the string into an array
    } catch (error) {
      throw new ApiError(400, "Invalid format for teamMembers. It must be a valid JSON array.");
    }
  }

  // Validate team members (must be students)
  const teamMemberIds = [];
  if (Array.isArray(teamMemberArray)) {
    for (const username of teamMemberArray) {
      const user = await User.findOne({ username });
      if (!user) {
        throw new ApiError(400, `Invalid team member: ${username}`);
      }
      teamMemberIds.push(user._id);
    }
  } else {
    throw new ApiError(400, "teamMembers must be an array of usernames.");
  }

// Handle file uploads
const projectFiles = [];
if (req.files && req.files.length > 0) {
  for (const file of req.files) {
    const uploadedFile = await uploadOnCloudinary(file.path); // Upload to Cloudinary
    if (uploadedFile) {
      projectFiles.push({
        url: uploadedFile.secure_url, // File URL from Cloudinary
        publicId: uploadedFile.public_id, // File public ID from Cloudinary
      });
    }
  }
}

  // Create project
  const project = await Project.create({
    createdBy: req.user._id,
    title,
    description,
    teamMembers: teamMemberIds,
    faculty: facultyUser._id,
    repositoryLink,
    projectFiles,
    type,
  });

  res.status(201).json(project);
});

/**
 * @desc Get all projects (For faculty)
 * @route GET /api/projects
 * @access Faculty
 */
export const getAllProjects = asyncHandler(async (req, res) => {

  const projects = await Project.find()
    .populate("createdBy", "username email fullName")
    .populate("teamMembers", "username email fullName")
    .populate("faculty", "username email fullName");

  res.status(200).json(projects);
});

/**
 * @desc Get a single project by ID
 * @route GET /api/projects/:id
 * @access Student / Faculty
 */
export const getProjectById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  console.log("Received project ID:", id); // Debugging log

  // Validate the ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error("Invalid project ID format:", id); // Debugging log
    throw new ApiError(400, "Invalid project ID format.");
  }

  const project = await Project.findById(id)
    .populate("createdBy", "username email")
    .populate("teamMembers", "username email")
    .populate("faculty", "username email");

  if (!project) {
    console.error("Project not found for ID:", id); // Debugging log
    throw new ApiError(404, "Project not found.");
  }

  console.log("Project fetched successfully:", project); // Debugging log

  res.status(200).json(project);
});

/**
 * @desc Update project status
 * @route PUT /api/projects/:id/status
 * @access Faculty
 */
export const updateProjectStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["pending", "ongoing", "completed"].includes(status)) {
    throw new ApiError(400, "Invalid status value.");
  }

//   // Ensure only faculty can update status
//   if (req.user.role !== "faculty") {
//     throw new ApiError(403, "Only faculty can update project status.");
//   }

  const project = await Project.findById(req.params.id);
  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  project.status = status;
  await project.save();

  res.status(200).json({ message: "Project status updated.", project });
});

/**
 * @desc Upload project files
 * @route POST /api/projects/:id/upload
 * @access Student
 */
/**
 * @desc Upload project files
 * @route POST /api/projects/:id/upload
 * @access Student
 */
export const uploadProjectFiles = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "No files uploaded.");
  }

  const project = await Project.findById(req.params.id);
  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  // Only the owner or team members can upload files
  // if (!project.createdBy.equals(req.user._id) && !project.teamMembers.includes(req.user._id)) {
  //   throw new ApiError(403, "You are not authorized to upload files.");
  // }

  const uploadedFiles = [];

  // Loop through files and upload each to Cloudinary
  for (const file of req.files) {
    const uploadedFile = await uploadOnCloudinary(file.path); // Upload to Cloudinary

    if (uploadedFile) {
      uploadedFiles.push({
        url: uploadedFile.secure_url, // File URL from Cloudinary
        publicId: uploadedFile.public_id, // File public ID from Cloudinary
      });
    }
  }

  // Push the uploaded file data into the project's projectFiles array
  project.projectFiles.push(...uploadedFiles);
  await project.save();

  res.status(200).json({ message: "Files uploaded successfully.", project });
});

