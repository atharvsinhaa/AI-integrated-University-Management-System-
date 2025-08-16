import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { Profile } from "../models/profile.model.js"; // Import the Profile model

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and fresh tokens"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password ,role} = req.body;

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required!");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    console.log("HEllo there");
    throw new ApiError(409, "Username or email already exists!");
  }

  console.log(req.files);

  const avatarLocalPath = req.files?.avatar?.length > 0 ? req.files.avatar[0].path : null;

  let avatar;
  if (avatarLocalPath) {
    avatar = await uploadOnCloudinary(avatarLocalPath);
  }

  // Create the user
  const user = await User.create({
    fullName,
    avatar: avatar?.url || "", // Default to an empty string if no avatar is provided
    email,
    password,
    username: username.toLowerCase(),
    role,
  });

  // Create the profile for the user
  await Profile.create({
    username: user._id, // Use the user's ObjectId
    email: user.email, // Use the user's email
    fullName: user.fullName, // Use the user's full name
    avatar: user.avatar, // Optional: Include avatar in the profile
    department: "Computer Science", // Provide a default value for department
    gender: "Prefer not to say",
     // Provide a default value for gender
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user!");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully!"));
});



const loginUser = asyncHandler(async (req, res) => {
  //req body -> data
  //username || email
  // find user
  //password check
  //accesstoken, refreshtoken
  //send cookie

  const { email, username, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "Username of email is required!");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User doesn't exist!");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid credentials!");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUSer = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUSer,
          accessToken,
          refreshToken,
        },
        "User Logged in Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        // updates the value
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User logged out successfullyyy!"));
});

const refreshAccessToken = asyncHandler(async (req, res) =>{
  const incomingRefreshToken = req.cookies.resfreshToken || req.body.refreshToken

  if(!incomingRefreshToken){
    throw new ApiError(401, "Unauthorised request!")
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
      )
  
      const user = await User.findById(decodedToken?._id)
  
      if(!user){
        throw new ApiError(401, "Invalid request Token!")
      }
  
      if(incomingRefreshToken !== user?.refreshToken){
        throw new ApiError(401, "Refresh token is expired or used!")
      }
  
      const options = {
        httpOnly: true,
        secure: true
      }
  
      const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id);
  
      return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {accessToken, newRefreshToken},
          "Access token refreshed!"
          )
      )
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token!")
  }

});

const getMe = asyncHandler(async (req, res) => {
  // The `req.user` is populated by the `verifyJWT` middleware
  const user = req.user;

  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  return res.status(200).json(
    new ApiResponse(200, user, "User details retrieved successfully!")
  );
});

export { registerUser, loginUser, logoutUser,refreshAccessToken, getMe };