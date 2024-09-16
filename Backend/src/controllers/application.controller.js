import Application from "../models/application.model.js";
import Job from "../models/job.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
const createApplication = asyncHandler(async (req, res) => {
  const { id: jobId } = req.params; 
  const applicant = req.user._id;

  //TODO uncomment this
  // if(!req.user?.resume){
  //   throw new ApiError(400, "Please upload your resume before applying for a job");
  // }

  // console.log(jobId,applicant)
  const user =await User.findById(applicant)
  // console.log(user)
  if (user.role !== "student") {
    throw new ApiError(404, "You Can Not Apply For this Job");
  }

  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  const existingApplication = await Application.findOne({ job: jobId, applicant });
  if (existingApplication) {
    throw new ApiError(409, "You have already applied for this job");
  }

  const application = await Application.create({ job: jobId, applicant });
  if(!application){
    throw new ApiError(400,'Application failed')
  }

  return res.status(201).json(new ApiResponse(201, application, "Application created successfully"));
});

const getAllApplicationsForJob = asyncHandler(async (req, res) => {
    const { id: jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      throw new ApiError(404, "Job not found");
    }
    const applications = await mongoose.model('Application').aggregate([
      {
        $match: { job: new mongoose.Types.ObjectId(jobId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "applicant",
          foreignField: "_id",
          as: "applicant",
        },
      },
      {
        $unwind: "$applicant",
      },
      {
        $project: {
          applicant: {
            password: 0,
            __v: 0,
            image: 0,
            role: 0,
            createdAt: 0,
            updatedAt: 0,
            refreshToken: 0,
            },
          },
        },
    ]);

    
    if (applications.length === 0) {
      return res.status(200).json(new ApiResponse(200, [], "No applications found for this job"));
    }

    return res.status(200).json(new ApiResponse(200, applications, "Applications for job fetched successfully"));
});


const getUserApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ applicant: req.user._id }).populate("job").select("-__v");
  // console.log(applications.job);
  if (applications.length === 0) {
    return res.status(200).json(new ApiResponse(200, [], "No applications found for this user"));
  }

  return res.status(200).json(new ApiResponse(200, applications, "User applications fetched successfully"));
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
    const { id : applicationId } = req.params;
    const { status } = req.body;
    if (!["Applied", "Interviewing", "Offered", "Rejected"].includes(status)) {
      throw new ApiError(400, "Invalid status value");
    }
  
    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );
  
    if (!application) {
      throw new ApiError(404, "Application not found");
    }
  
    return res.status(200).json(new ApiResponse(200, application, "Application status updated successfully"));
  });
  

const deleteApplication = asyncHandler(async (req, res) => {
  const { id : applicationId } = req.params;

  const application = await Application.findByIdAndDelete(applicationId);
  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  return res.status(200).json(new ApiResponse(200, null, "Application deleted successfully"));
});

export {
  createApplication,
  getAllApplicationsForJob,
  getUserApplications,
  updateApplicationStatus,
  deleteApplication,
};
