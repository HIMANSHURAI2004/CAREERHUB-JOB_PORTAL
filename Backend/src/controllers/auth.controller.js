import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { options } from "../constants.js";
import Company from "../models/company.model.js";
import Job from "../models/job.model.js";
import mongoose from "mongoose";


const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false })


    return { accessToken, refreshToken }

  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating refresh and access token")
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
  console.log(imageLocalPath);
  let image;
  if (imageLocalPath) {
    image = await uploadOnCloudinary(imageLocalPath);
  }

  const user = await User.create({
    email,
    userName,
    contactNo,
    role,
    image: image ? image.url : "",
    password,
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  if(role === "recruiter")
  {
    const {companyName , address , website} = req.body;

    if(!companyName && !address)
    {
      throw new ApiError(401,"Company Name and Address are required");
    }

    
    const userExist = await Company.findOne({recruiter: createdUser._id});
    if(userExist)
      {
        throw new ApiError(401,"Recruiter already owns a company");
      }
      
    const companyExist = await Company.findOne({companyName});
    if(companyExist)
    {
      throw new ApiError(401,"Company Already Exists");
    }

    const company = await Company.create({
      companyName,
      address,
      website: website ? website : "",
      recruiter:createdUser._id
    
    })

    if(!company)
    {
      throw new ApiError(500,"Something went wrong while creating company")
    }

    return res.status(201).json(new ApiResponse(201,company, "Recruiter registered successfully"));
  }

  
  return res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));
});



//Login User
const loginUser = asyncHandler(async (req, res) => {

  const { email, password} = req.body

  if (!email) {
    throw new ApiError(400, "Email is required")
  }

  const user = await User.findOne({ email })

  if (!user) {
    throw new ApiError(404, "User does not exist")
  }

  const isPasswordValid = await user.isPasswordCorrect(password)

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)


  const loggedInUser = await User.findById(user._id).select(
    " -password -refreshToken"
  )

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200,
        {
          user: loggedInUser, accessToken, refreshToken
        },
        "User Logged in Successfully"
      )
    )

})

//Logout User
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1
      }
    },
    {
      new: true
    }
  )

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
      new ApiResponse(200, {}, "User Logged Out")
    )

})

//Get Current User
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(200, req.user, "Current user fetched successfully")
    )
})

// Change Password
const changeCurrentPassword = asyncHandler(async (req,res) =>{
  const {oldPassword,newPassword}= req.body;

  const user=await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

  if(!isPasswordCorrect)
  {
      throw new ApiError(400,"Invalid user Password")
  }

  user.password=newPassword;
  await user.save({validateBeforeSave:false})

  return res
  .status(200)
  .json(new ApiResponse(200,{},"Password change successfully"))

})

//Update User  
const updateUser = asyncHandler(async (req, res) => {
  const { userName, contactNo } = req.body

  if (!userName || !contactNo) {
    throw new ApiError(400, "User name and contact number are required")
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        userName,
        contactNo
      }
    },
    {
      new: true
    }
    
  ).select(
    "-password"
  )
  
  return res
  .status(200)
  .json(
    new ApiResponse(200, user, "User details updated successfully")
  )
})

//Update image
const updateImage = asyncHandler(async (req, res) => {
  const imageLocalPath = req.file?.path;
  console.log(imageLocalPath)

  if (!imageLocalPath) {
    throw new ApiError(400, "image file is missing")
  }

  const image = await uploadOnCloudinary(imageLocalPath)
  
  if (!image.url) {
    throw new ApiError(400, "Error while uploading image")
  }
  
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        image: image.url
      }
    },
    {
      new: true
    }
  ).select(
    "-password"
  )
  
  return res
  .status(200)
  .json(
    new ApiResponse(200, user, "Image updated successfully")
  )
  
})

//Delete User
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.role === "recruiter") {

    const company = await Company.findOneAndDelete({ recruiter: user._id });
    if (!company) {
      throw new ApiError(500, "Something went wrong while deleting the company associated to this user");
    }
    const jobs = await Job.deleteMany({ postedBy: user._id });
    if (!jobs) {
      throw new ApiError(500, "Something went wrong while deleting the jobs associated to this user");
    }
  }

  return res.status(200).json(new ApiResponse(200, {}, "User deleted successfully"));
});




export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  deleteUser,
  updateUser,
  updateImage,
  changeCurrentPassword
};
