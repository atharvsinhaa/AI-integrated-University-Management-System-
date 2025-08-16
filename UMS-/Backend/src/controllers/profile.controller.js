import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Profile } from "../models/profile.model.js";
import { ApiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"; // Cloudinary upload function

// Controller 1: Get the profile of the user
export const getProfileDetails = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ username: req.user._id }).populate("username", "_id username role"); // Use req.user.id instead of req.user.username
  
  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  res.status(200).json(new ApiResponse(200, profile, "Profile fetched successfully"));
});

// Controller 2: Update the profile of the user
export const updateProfileDetails = asyncHandler(async (req, res) => {
  const { fullName, phoneNumber, gender, dateOfBirth, department, year } = req.body;

  // Find profile by username
  const profile = await Profile.findOne({ username: req.user._id }).populate("username", "_id username role"); // Use req.user.id instead of req.user.username

  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  // Handle Avatar Upload
  let avatarUrl = profile.avatar; // Preserve old avatar if not updating
  if (req.file) {
    const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
    if (!cloudinaryResponse) {
      throw new ApiError(500, "Error uploading avatar to Cloudinary");
    }
    avatarUrl = cloudinaryResponse.secure_url; // Get uploaded image URL
  }

  // Update profile fields
  if (fullName) profile.fullName = fullName;
  if (phoneNumber) profile.phoneNumber = phoneNumber;
  if (gender) profile.gender = gender;
  if (dateOfBirth) profile.dateOfBirth = dateOfBirth;
  if (department) profile.department = department;
  if (year) profile.year = year;
  if (avatarUrl) profile.avatar = avatarUrl; // Update avatar in DB

  const updatedProfile = await profile.save();
  res.status(200).json(new ApiResponse(200, updatedProfile, "Profile updated successfully"));
});

