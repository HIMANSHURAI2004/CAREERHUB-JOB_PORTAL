import { User } from "../models/user.model";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { uploadOnCloudinary } from "../utils/cloudinary";

const registerUser = asyncHandler(async (req, res) => {
  const { email, password, userName, contactNo } = req.body;

  if ([email, password, userName, contactNo].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User with entered email already exists");
  }

  const imageLocalPath = req.files?.image?.[0]?.path;

  let image;
  if (imageLocalPath) {
    image = await uploadOnCloudinary(imageLocalPath);
  }

  const user = await User.create({
    email,
    userName,
    contactNo,
    image: image ? image.url : undefined,
    password,
  });

  const createdUser = await User.findById(user._id).select("-password -refreshTokens");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
  
    const user = await User.findByIdAndDelete(userId);
  
    if (!user) {
      throw new ApiError(404, "User not found");
    }
  
    return res.status(200).json(new ApiResponse(200,"User deleted successfully"));
  });

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    if ([email, password].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "Email and password are required");
    }
  
    const user = await User.findOne({ email });
  
    if (!user || !(await user.isPasswordCorrect(password))) {
      throw new ApiError(401, "Invalid email or password");
    }
  
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
  
    user.refreshTokens = refreshToken;
    await user.save();
  
    return res.status(200).json(new ApiResponse(200, { accessToken, refreshToken }, "Login successful"));
  });
  
  const updateUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { userName, contactNo } = req.body;
  
    if ([userName, contactNo].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "User name and contact number are required");
    }
  
    const user = await User.findById(userId);
  
    if (!user) {
      throw new ApiError(404, "User not found");
    }
  
    user.userName = userName;
    user.contactNo = contactNo;
  
    if (req.files?.image?.[0]?.path) {
      const image = await uploadOnCloudinary(req.files.image[0].path);
      user.image = image.url;
    }
  
    await user.save();
  
    const updatedUser = await User.findById(userId).select("-password -refreshTokens");
  
    return res.status(200).json(new ApiResponse(200, updatedUser, "User updated successfully"));
  });

  export {
    registerUser,
    deleteUser,
    loginUser,
    updateUser
  };
  