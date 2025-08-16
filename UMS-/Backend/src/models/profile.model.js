import mongoose, { Schema } from "mongoose";

const profileSchema = new Schema(
  {
    username: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    email: {
      type: String, // Changed from ObjectId to String
      required: true,
      trim: true,
    },
    fullName: {
      type: String, // Changed from ObjectId to String
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      required: false,
    },
    dateOfBirth: {
      type: Date,
      required: false,
    },
    year: {
      type: Number, // Academic year (e.g., 1, 2, 3, 4)
      required: false,
    },
    department: {
      type: String,
      required: true,
      default: "Computer Science",
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other","Prefer not to say"],
      default: "Prefer not to say",
      required: true,
    },
  },
  { timestamps: true }
);

export const Profile = mongoose.model("Profile", profileSchema);

