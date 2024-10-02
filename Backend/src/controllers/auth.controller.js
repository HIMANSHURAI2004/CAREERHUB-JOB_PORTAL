import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { options } from "../constants.js";
import Company from "../models/company.model.js";
import Job from "../models/job.model.js";
import { Resume } from "../models/resume.model.js";
import Application from "../models/application.model.js";
import { generateOTP,sendOTPEmail } from "../utils/otpForgotPassword.js";
import jwt from 'jsonwebtoken'
import { sendOTPEmail as sendSignUpOTPEmail } from "../utils/otpSignUp.js";

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


const preRegisterUserValidation = asyncHandler(async (req, res, next) => {
  const { email, password, userName, contactNo, role } = req.body;

  if ([email, password, userName, contactNo].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User with entered email already exists");
  }

  if (role === "recruiter") {
    const { companyName, address } = req.body;

    if (!companyName || !address) {
      throw new ApiError(400, "Company Name and Address are required");
    }

    const userExist = await Company.findOne({ recruiter: existingUser?._id });
    if (userExist) {
      throw new ApiError(409, "Recruiter already owns a company");
    }

    const companyExist = await Company.findOne({ companyName });
    if (companyExist) {
      throw new ApiError(409, "Company Already Exists");
    }
  }

  const createdUser = {
    email,
    password,
    userName,
    contactNo,
    role,
  }

  return res.status(201).json(new ApiResponse(201, createdUser, "User pre-validation successfull"));

});


const sendOTP = asyncHandler(async (req, res, next) => {

  const {email} = req.body

  const otp = generateOTP();
  const otpToken = jwt.sign({ email, otp }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
  try {
    await sendSignUpOTPEmail(email, otp);
  } catch (error) {
    throw new ApiError(500, error.message || "Error sending email");
  }
  return res.status(201).json(new ApiResponse(201, otpToken, "OTP sent to your email"));
});


const registerUser = asyncHandler(async (req, res) => {
  const { email, password, userName, contactNo, role, otp, otpToken } = req.body;
  let image; 
  try {
    const decoded = jwt.verify(otpToken, process.env.ACCESS_TOKEN_SECRET);
    
    if (decoded.email !== email || decoded.otp !== otp) {
      throw new ApiError(400, "Invalid OTP");
    }

    if (decoded.exp <= Date.now() / 1000) {
      throw new ApiError(400, "OTP Expired. Please try again");
    }
    
    // Handle image upload to Cloudinary if provided
    const imageLocalPath = req.files?.image?.[0]?.path;
    if (imageLocalPath) {
      image = await uploadOnCloudinary(imageLocalPath);
    }

    // Create user in the database
    const user = await User.create({
      email,
      userName,
      contactNo,
      role,
      image: image ? image.url : "", // Store image URL if uploaded
      password,
    });

    // Retrieve created user from database
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering the user");
    }

    // If role is recruiter, create associated company
    if (role === "recruiter") {
      const { companyName, address, website } = req.body;

      const company = await Company.create({
        companyName,
        address,
        website: website || "",
        recruiter: createdUser._id,
      });

      if (!company) {
        throw new ApiError(500, "Something went wrong while creating company");
      }

      // Return response for recruiter registration
      return res.status(201).json(new ApiResponse(201, company, "Recruiter registered successfully"));
    }

    // Return response for regular user registration
    return res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));

  } catch (error) {
    // Handle errors
    if (image && image.public_id) {
      try {
        await deleteFromCloudinary(image.public_id);
      } catch (deleteError) {
        console.error("Error deleting image from Cloudinary:", deleteError);
      }
    }

    // Return appropriate error response
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
    } else {
      console.error("Unhandled error during user registration:", error);
      return res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
    }
  }
});

//Login User
const loginUser = asyncHandler(async (req, res) => {

  const { email, password } = req.body

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

  const options = {
    httpOnly: true,
    secure: true
  }

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

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request")
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )

    const user = await User.findById(decodedToken?._id)

    if (!user) {
      throw new ApiError(401, "Invalid refresh token")
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used")

    }

    const options = {
      httpOnly: true,
      secure: true
    }

    const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id)

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      )
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token")
  }

})


const getUser = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;

  const user = await User.findOne({ _id: userId });

  if (!user) {
    throw new ApiError(404, "user Not Found");
  }

  return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});

//Get Current User
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).populate("resume").select("-password");
  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "Current user fetched successfully")
    )
})

// Change Password
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid user Password")
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false })

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password change successfully"))

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
  const imageLocalPath = req.file?.path; // Since we're using upload.single(), req.file will contain the image.

  // Check if the image file was uploaded
  if (!imageLocalPath) {
    throw new ApiError(400, "Image file is missing");
  }

  // Upload the image to Cloudinary (or any cloud service)
  const image = await uploadOnCloudinary(imageLocalPath); // Assuming uploadOnCloudinary returns an object with a "url"

  if (!image.url) {
    throw new ApiError(400, "Error while uploading image");
  }

  // Update the user's image URL in the database
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { image: image.url } },
    { new: true }
  ).select("-password");

  return res.status(200).json(
    new ApiResponse(200, user, "Image updated successfully")
  );
});

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

const updateCompanyDetails = asyncHandler(async (req, res) => {
  const { companyName, address, website } = req.body;



  const company = await Company.findOne({ recruiter: req.user._id })

  if (!company) {
    throw new ApiError(404, "Company not found");
  }

  if (company.companyName !== companyName) {
    const companyExist = await Company.findOne({ companyName });
    if (companyExist) {
      throw new ApiError(409, "Company with this Name Already Exists");
    }
  }


  if (companyName) company.companyName = companyName;
  if (address) company.address = address;
  if (website) company.website = website;

  await company.save();

  return res.status(200).json(new ApiResponse(200, company, "Company details updated successfully"));
});

//Add Resume
const addResume = asyncHandler(async (req, res) => {
  const { fullName, email, phone, linkedin, github, skills, workExperience, education, projects } = req.body;

  if (!fullName && !email && !phone) {
    throw new ApiError(400, "All fields are required");
  }

  const resume = await Resume.create({
    personalDetails: {
      fullName,
      email,
      phone,
      linkedin: linkedin ? linkedin : "",
      github: github ? github : "",
    },
    skills: skills ? skills : [],
    workExperience: workExperience ? workExperience : [],
    education: education ? education : [],
    projects: projects ? projects : [],
  });

  if (!resume) {
    throw new ApiError(500, "Something went wrong while adding resume");
  }

  const user = await User.findById(req.user._id);
  user.resume = resume._id;
  await user.save({ validateBeforeSave: false });

  return res.status(201).json(new ApiResponse(201, resume, "Resume created successfully"));

});

const getResumeDetails = asyncHandler(async (req, res) => {
  const resume = await Resume.findById(req.user.resume).select("-__v  -_id -createdAt -updatedAt");

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  return res.status(200).json(new ApiResponse(200, resume, "Resume fetched successfully"));
})

const getResumeById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const resume = await Resume.findById(id).select("-__v  -_id -createdAt -updatedAt");
  if(!resume)
  {
    throw new ApiError(404, "Resume not found");
  }

  return res.status(200).json(new ApiResponse(200, resume, "Resume fetched successfully"));
})

//Update Resume
const updateResume = asyncHandler(async (req, res) => {
  const { personalDetails, skills, workExperience, education, projects } = req.body;
  const { fullName, email, phone, linkedin, github } = personalDetails;
  if (!(fullName && email && phone && linkedin && github && skills && workExperience && education && projects)) {
    throw new ApiError(400, "Atleast One field is required");
  }

  const resume = await Resume.findById(req.user.resume);

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  resume.personalDetails.fullName = fullName ? fullName : resume.personalDetails.fullName;
  resume.personalDetails.email = email ? email : resume.personalDetails.email;
  resume.personalDetails.phone = phone ? phone : resume.personalDetails.phone;
  resume.personalDetails.linkedin = linkedin ? linkedin : resume.personalDetails.linkedin;
  resume.personalDetails.github = github ? github : resume.personalDetails.github;
  resume.skills = skills ? skills : resume.skills;
  resume.workExperience = workExperience ? workExperience : resume.workExperience;
  resume.education = education ? education : resume.education;
  resume.projects = projects ? projects : resume.projects;

  await resume.save();

  return res.status(200).json(new ApiResponse(200, resume, "Resume updated successfully"));
})

//delete Resume
const deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findByIdAndDelete(req.user.resume);

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  return res.status(200).json(new ApiResponse(200, {}, "Resume deleted successfully"));
});


const getAllEntriesOfModel = asyncHandler(async (req, res) => {
  const { modelName, search, filters } = req.body;
  let Model;
  switch (modelName.toLowerCase()) {
    case 'users':
      Model = User;
      break;
    case 'companies':
      Model = Company;
      break;
    case 'jobs':
      Model = Job;
      break;
    case 'resumes':
      Model = Resume;
      break;
    case 'applications':
      Model = Application;
      break;
    default:
      throw new ApiError(400, 'Invalid model name');
  }
  let query = {};
  if (search || filters) {
    switch (modelName.toLowerCase()) {
      case 'users':
        query = {
          $or: [
            { userName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        };
        if (filters && filters.role) {
          query.role = filters.role;
        }
        break;
      case 'companies':
        query = {
          $or: [
            { companyName: { $regex: search, $options: 'i' } },
            { address: { $regex: search, $options: 'i' } },
          ],
        };
        break;
      case 'jobs':
        query = {
          $or: [
            { locations: { $elemMatch: { $regex: search, $options: 'i' } } },
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { skillsRequired: { $elemMatch: { $regex: search, $options: 'i' } } },
            { industry: { $regex: search, $options: 'i' } },
          ],
        };
  
        if (filters.workExperienceMinYears) {
            query.workExperienceMinYears = { $gte: parseInt(filters.workExperienceMinYears, 10) };
        }
        if (filters.isRemote) {
            query.isRemote = String(filters.isRemote) == 'true';
        }
        if (filters && filters.employmentType) {
          query.employmentType = filters.employmentType;
        }
        break;
      case 'resumes':
        query = {
          $or: [
            { 'personalDetails.fullName': { $regex: search, $options: 'i' } },
            { 'personalDetails.email': { $regex: search, $options: 'i' } },
            { 'personalDetails.phone': { $regex: search, $options: 'i' } },
            { 'personalDetails.linkedin': { $regex: search, $options: 'i' } },
            { 'personalDetails.github': { $regex: search, $options: 'i' } },
            { skills: { $elemMatch: { $regex: search, $options: 'i' } } },
          ],
        };
        break;
      case 'applications':
        query = {
          $or: [
            { status: { $regex: search, $options: 'i' } },
          ],
        };
        if (filters && filters.status) {
          query.status = filters.status;
        }
        break;
      default:
        throw new ApiError(400, 'Invalid model name');
    }
  }

  try {
    const entries = await Model.find(query).exec();
    let filteredEntries = entries;
    
    
    if (modelName.toLowerCase() === 'jobs' && (filters?.salaryMin|| filters?.salaryMax)) {
      filteredEntries = entries.filter(job => {
        const salary = parseInt(job.salary, 10);
        const salaryMin = filters.salaryMin ? parseInt(filters.salaryMin, 10) : 0;
        const salaryMax = filters.salaryMax ? parseInt(filters.salaryMax, 10) : Number.MAX_SAFE_INTEGER;
    
        if (salaryMin && !salaryMax) {
          return salary >= salaryMin;
        } else if (salaryMax && !salaryMin) {
          return salary <= salaryMax;
        } else if (salaryMin && salaryMax) {
          return salary >= salaryMin && salary <= salaryMax;
        } else {
          return true; 
        }
      });
    }

    res.status(200).json({ data: filteredEntries });
  } catch (error) {
    console.error(`Error getting entries of ${modelName.toLowerCase()} :`, error);
    res.status(500).json({ message: 'Server Error' });
  }
});

const getCountsOfAllOfModels = asyncHandler(async (req, res) => {
    const usersCount = await User.countDocuments();
    const companiesCount = await Company.countDocuments();
    const jobsCount = await Job.countDocuments();
    const resumesCount = await Resume.countDocuments();
    const applicationsCount = await Application.countDocuments();

    return res.status(200).json(
      new ApiResponse(200, {usersCount, companiesCount, jobsCount, resumesCount, applicationsCount}, "Counts fetched successfully") 
    );
  
})

const countEntriesOfModel = asyncHandler(async (req, res) => {
  const { modelName } = req.body;


  let Model;
  switch (modelName.toLowerCase().trim()) {
    case 'users':
      Model = User;
      break;
    case 'companies':
      Model = Company;
      break;
    case 'jobs':
      Model = Job;
      break;
    case 'resumes':
      Model = Resume;
      break;
    case 'applications':
      Model = Application;
      break;
    default:
      throw new ApiError(400, 'Invalid model name');
  }

  try {
    const count = await Model.countDocuments();
    res.status(200).json({ data : count });
  } catch (error) {
    console.error(`Error counting ${modelName.toLowerCase()} :`, error);
    res.status(500).json({ message: 'Server Error' });
  }

});

const deleteEntry = async (req, res) => {
  const { modelName, entryId } = req.body;

  let Model;
  switch (modelName.toLowerCase()) {
    case 'users':
      Model = User;
      break;
    case 'companies':
      Model = Company;
      break;
    case 'jobs':
      Model = Job;
      break;
    case 'resumes':
      Model = Resume;
      break;
    case 'applications':
      Model = Application;
      break;
    default:
      return res.status(400).json({ message: 'Invalid model name' });
  }

  try {
    const entry = await Model.findByIdAndDelete(entryId);

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.status(200).json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting entry:', error);
    res.status(500).json({ message: 'Failed to delete entry', error: error.message });
  }
};

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "Email does not exist");
  }
  const otp = generateOTP();
  const otpToken = jwt.sign({ email, otp }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
  try {
    await sendOTPEmail(email, otp);
    return res.status(200).json({ message: "OTP sent to your email", otpToken });
  } catch (error) {
    throw new ApiError(500, error.message || "Error sending email");
  }
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp, otpToken } = req.body;

  try {
    const decoded = jwt.verify(otpToken, process.env.ACCESS_TOKEN_SECRET);
    
    if (decoded.email !== email || decoded.otp !== otp) {
      throw new ApiError(400, "Invalid OTP");
    }

    if (decoded.exp <= Date.now() / 1000) {
      throw new ApiError(400, "OTP Expired. Please try again");
    }

    const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
    return res.status(200).json({ token });
  } catch (error) {
    throw new ApiError(500, error.message || "Invalid or expired OTP token");
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;
  const token = req.headers.authorization.split(" ")[1];
  if(!token){
    throw new ApiError(404, "jwt expired");
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false })

  return res
    .status(200)
    .json({message : "Password reset successfully"})

  } catch (error) {
    throw new ApiError(500, "Error resetting password");
  }
});


export {
  preRegisterUserValidation,
  sendOTP,
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getUser,
  getCurrentUser,
  deleteUser,
  updateUser,
  updateImage,
  changeCurrentPassword,
  updateCompanyDetails,
  addResume,
  getResumeDetails,
  getResumeById,
  updateResume,
  deleteResume,
  getAllEntriesOfModel,
  countEntriesOfModel,
  getCountsOfAllOfModels,
  deleteEntry,
  forgotPassword,
  verifyOTP,
  resetPassword,
};

