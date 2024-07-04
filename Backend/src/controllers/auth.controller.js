import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { options } from "../constants.js";



const generateAccessAndRefreshToken=async(userId)=>{
  try {
      const user=await User.findById(userId)
      const accessToken=user.generateAccessToken()
      const refreshToken=user.generateRefreshToken()

      user.refreshToken=refreshToken;
      await user.save({validateBeforeSave:false})


      return {accessToken,refreshToken}

  } catch (error) {
      throw new ApiError(500,"Something went wrong while generating refresh and access token")
  }
}


//Register User
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, userName, contactNo,role } = req.body;

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
    role,
    image: image ? image.url : undefined,
    password,
  });

  const createdUser = await User.findById(user._id).select("-password -refreshTokens");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));
});



//Login User
const loginUser= asyncHandler(async (req,res) =>{

  const {email,password}=req.body

  if(!email)
  {
      throw new ApiError(400,"Email is required")
  }

  const user =await User.findOne({email})

  if(!user)
  {
      throw new ApiError(404,"User does not exist")
  }

  const isPasswordValid=await user.isPasswordCorrect(password)

  if(!isPasswordValid)
  {
      throw ApiError(401,"Invalid user credentials")
  }

  const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id)


  const loggedInUser=await User.findById(user._id).select(
      " -password -refreshToken"
  )

  return res
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
      new ApiResponse(200,
          {
              user:loggedInUser,accessToken,refreshToken
          },
          "User Logged in Successfully"
          )
  )

})

//Logout User
const logoutUser=asyncHandler(async(req,res) =>{
  await User.findByIdAndUpdate(
      req.user._id,
      {
          $unset:{
              refreshToken:1
          }
      },
      {
          new:true
      }
  )
  
  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(
      new ApiResponse(200,{},"User Logged Out")
  )

})

//Get Current User
const getCurrentUser = asyncHandler(async (req,res) =>{
  return res
  .status(200)
  .json(
      new ApiResponse(200,req.user,"Current user fetched successfully")
  )
})

//Delete User
const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
  
    const user = await User.findByIdAndDelete(userId);
  
    if (!user) {
      throw new ApiError(404, "User not found");
    }
  
    return res.status(200).json(new ApiResponse(200,"User deleted successfully"));
  });

//Update User  
  const updateUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { userName, contactNo } = req.body;
  
    if ([userName, contactNo].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "Username and contact number are required");
    }
  
    const user = await User.findById(userId);
    User.findByIdAndUpdate()
  
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
    loginUser,
    logoutUser,
    getCurrentUser,
    deleteUser,
    updateUser,
  };
  