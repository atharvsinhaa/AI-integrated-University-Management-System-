import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid"; // To generate unique project IDs

const projectSchema = new Schema(
  {
    projectId: {
      type: String,
      unique: true,
      default: uuidv4, // Auto-generate unique ID
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    teamMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Faculty must be assigned
    },
    status: {
      type: String,
      enum: ["pending", "ongoing", "completed"],
      default: "pending",
    },
    repositoryLink: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["capstone", "epic", "research", "internship", "mini", "hackathon"],
      default: "capstone",
    },
    projectFiles: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
      },
    ],
    // 🔥 Adding faculty recommendation field
    recommendation: {
      type: String,
      default: "", // Empty by default
      trim: true,
    },
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);
