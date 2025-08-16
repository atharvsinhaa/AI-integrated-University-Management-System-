import mongoose, { Schema } from "mongoose";

const defaultCriteria = [
  { criteria: "Background Study", score: 0 },
  { criteria: "Problem Statement", score: 0 },
  { criteria: "Implementation", score: 0 },
  { criteria: "Presentation", score: 0 }
];

const projectMarksSchema = new Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    marks: { 
      type: [{ criteria: String, score: Number }], 
      default: defaultCriteria  // 🔥 Auto-adds default criteria when creating a new entry
  }
  },
  { timestamps: true }
);

export const ProjectMarks = mongoose.model("ProjectMarks", projectMarksSchema);
