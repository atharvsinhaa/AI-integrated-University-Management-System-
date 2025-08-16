import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ProjectMarks } from "../models/projectMarks.models.js";
import { ApiError } from "../utils/apiError.js";
import mongoose from "mongoose";
import { Project } from "../models/project.models.js";
import { User } from "../models/user.model.js";

const defaultCriteria = [
  { criteria: "Background Study", score: 0 },
  { criteria: "Problem Statement", score: 0 },
  { criteria: "Implementation", score: 0 },
  { criteria: "Presentation", score: 0 },
];

// ✅ Fetch students & their marks for a given project
export const getProjectStudentsMarks = asyncHandler(async (req, res, next) => {
    const { projectId } = req.params;

    if (!mongoose.isValidObjectId(projectId)) {
        return next(new ApiError(400, "Invalid Project ID"));
    }

    // 🔹 Fetch project details including team members
    const project = await Project.findById(projectId).populate("teamMembers", "fullName username role");
    if (!project) {
        return next(new ApiError(404, "Project not found"));
    }

    // 🔹 Fetch marks (only for students in this project)
    const studentsMarks = await ProjectMarks.find({ projectId })
        .populate({
            path: "studentId",
            select: "fullName username role",
            match: { role: "student" },  // ✅ Ensure only students
        })
        .select("studentId marks");

    // 🔹 Convert `studentsMarks` into a Map for quick lookup
    const marksMap = new Map(studentsMarks.map(entry => [entry.studentId?._id.toString(), entry]));

    // 🔹 Ensure all team members are included (even if they have no marks)
    const allStudentsWithMarks = project.teamMembers
        .filter(member => member.role === "student") // ✅ Only students
        .map(student => ({
            studentId: student,
            marks: marksMap.get(student._id.toString())?.marks || []  // Use marks if found, else empty
        }));

    res.status(200).json(new ApiResponse(200, allStudentsWithMarks, "Marks retrieved successfully"));
});

  
//add Prjeect mArks 
  export const addProjectMarks = asyncHandler(async (req, res, next) => {
    const { projectId, studentId, marks } = req.body;
  
    if (!mongoose.isValidObjectId(studentId)) {
      return next(new ApiError(400, "Invalid Student ID"));
    }
  
    // 🔹 Fetch the project using `projectId` (UUID) and get its `_id`
    const project = await Project.findById( projectId ).select("_id teamMembers");

    console.log("Memberrsssss", project);
  
    if (!project) {
      return next(new ApiError(404, "Project not found"));
    }
  
    // 🔹 Ensure the student is part of the project
    if (!project.teamMembers.includes(studentId)) {
      return next(new ApiError(403, "Student is not part of this project"));
    }
  
    // 🔹 Check if marks already exist
    const existingMarks = await ProjectMarks.findOne({ projectId: project._id, studentId });
    if (existingMarks) {
      return next(new ApiError(409, "Marks already assigned to this student"));
    }
  
    // 🔹 Add marks
    const newMarks = await ProjectMarks.create({
      projectId: project._id, // Store ObjectId
      studentId,
      marks: marks || [
        { criteria: "Background Study", score: 0 },
        { criteria: "Problem Statement", score: 0 },
        { criteria: "Implementation", score: 0 },
        { criteria: "Presentation", score: 0 }
      ],
    });
    res.status(201).json(new ApiResponse(201, newMarks, "Marks assigned successfully"));
  });
  
  

//update marks
export const updateMarks = asyncHandler(async (req, res, next) => {
    const { projectId, studentId, marks } = req.body;

    if (!mongoose.isValidObjectId(projectId) || !mongoose.isValidObjectId(studentId)) {
        return next(new ApiError(400, "Invalid Project ID or Student ID"));
    }

    if (!marks || !Array.isArray(marks) || marks.length === 0) {
        return next(new ApiError(400, "Marks data is required"));
    }

    // Ensure score is within range [0,10]
    const validMarks = marks.every(m => m.score >= 0 && m.score <= 10);
    if (!validMarks) {
        return next(new ApiError(400, "Marks should be between 0 and 10"));
    }

    // Find or create the student's marks entry
    const existingMarks = await ProjectMarks.findOneAndUpdate(
        { projectId, studentId },
        { $setOnInsert: { marks: defaultCriteria } }, // Create default marks if not exists
        { new: true, upsert: true }
    );

    if (!existingMarks) {
        return next(new ApiError(404, "Marks update failed"));
    }

    // Update all marks at once
    marks.forEach(async ({ criteria, score }) => {
        await ProjectMarks.findOneAndUpdate(
            { projectId, studentId, "marks.criteria": criteria },
            { $set: { "marks.$.score": score } },
            { new: true }
        );
    });

    const updatedMarks = await ProjectMarks.findOne({ projectId, studentId });

    res.status(200).json(new ApiResponse(200, updatedMarks, "Marks updated successfully"));
});


export const getMarks = asyncHandler(async (req, res, next) => {
  console.log(req.params);
  const { studentId, projectId } = req.params;

  console.log("Received studentId:", studentId);
  console.log("Received projectId:", projectId);

  console.log("Received projectId:", projectId);
  console.log("Is Valid ObjectId?", mongoose.isValidObjectId(projectId));

  if (!mongoose.isValidObjectId(studentId)) {
    throw new Error("Invalid Student ID");
  }

  if (!studentId || !projectId) {
    return next(new ApiError(400, "Student ID and Project ID are required"));
  }

  // Ensure IDs are valid ObjectIds
  if (
    !mongoose.isValidObjectId(studentId) ||
    !mongoose.isValidObjectId(projectId)
  ) {
    return next(new ApiError(400, "Invalid Student ID or Project ID"));
  }

  const studentObjectId = new mongoose.Types.ObjectId(studentId);
  const projectObjectId = new mongoose.Types.ObjectId(projectId);

  const studentMarks = await ProjectMarks.findOne({
    studentId: studentObjectId,
    projectId: projectObjectId,
  });

  if (!studentMarks) {
    return next(new ApiError(404, "Marks not found"));
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, studentMarks.marks, "Marks retrieved successfully")
    );
});
