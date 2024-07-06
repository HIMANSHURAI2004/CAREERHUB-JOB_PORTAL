import Job from "../models/job.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import Company from "../models/company.model.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";

const createJob = asyncHandler(async (req, res) => {
  const { title, description, location, salary , deadline} = req.body;
  const postedBy = req.user;
  const company = req.company._id;


  if ([title, description, location].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const jobExist = await Job.findOne({title,postedBy})

  if(jobExist)
  {
    throw new ApiError(400, "Job Already Exist");
  }

  const job = await Job.create({
    title,
    description,
    company,
    location,
    salary: salary ? salary : "Depends on performance",
    postedBy,
    deadline: deadline ? deadline : new Date('9999-12-31')
  });

  const createdJob = await Job.findById(job._id).populate('company').select("-__v");

  if (!createdJob) {
    throw new ApiError(500, "Something went wrong while creating the job");
  }

  return res.status(201).json(new ApiResponse(201, createdJob, "Job created successfully"));
});

const getJob = asyncHandler(async (req, res) => {
  const { id: jobId } = req.params;

  const job = await Job.findOne({_id:jobId});

  if(!job)
  {
    throw new ApiError(404,"Job Not Found");
  }

  return res.status(200).json(new ApiResponse(200, job, "Job fetched successfully"));
});

const getJobs = asyncHandler(async (req, res) => {
  const query = req.query;
 
  if (query.company) {
    const company = await Company.findOne({companyName:query.company})
    query.company = company._id;
  }
  if (query.postedBy) {
    const postedBy = await User.findOne({userName:query.postedBy})
    query.postedBy = postedBy._id;
  }
  
  const jobs = await Job.aggregate([
    { $match: query },
    {
      $lookup: {
        from: 'companies',
        localField: 'company',
        foreignField: '_id',
        as: 'company'
      },
      
    },
    {
      $lookup: {
        from: 'users', 
        localField: 'postedBy',
        foreignField: '_id',
        as: 'postedBy'
      }
    },
    {
      $project: {
        __v: 0,
        'company.__v': 0,
        'postedBy.__v': 0,
        'postedBy.password': 0,
        'postedBy.refreshToken': 0,
      }
    }
  ]);

  if (jobs.length === 0) {
    return res.status(200).json(new ApiResponse(200, jobs, "No jobs found based on this search"));
  }

  return res.status(200).json(new ApiResponse(200, jobs, "Jobs fetched successfully"));
});




const updateJob = asyncHandler(async (req, res) => {
  const postedBy = req.user;
  const { id: jobId } = req.params;
  // console.log(jobId);
  const { title, description, location, salary, company,deadline } = req.body;

  // Check if at least one field is provided
  if (!(title || description || location || salary || company || deadline)) {
    throw new ApiError(400, "At least one field is required");
  }

  // Find the job by id and postedBy user
  const job = await Job.findOne({ _id: jobId, postedBy});

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  // Update job fields if provided
  job.title = title !== undefined ? title : job.title;
  job.description = description !== undefined ? description : job.description;
  job.company = company !== undefined ? company : job.company;
  job.location = location !== undefined ? location : job.location;
  job.salary = salary !== undefined ? salary : job.salary;
  job.deadline = deadline !== undefined ? deadline : job.deadline;

  // Save the updated job
  await job.save();

  // Fetch the updated job details
  const updatedJob = await Job.findById(jobId).select("-__v");

  return res.status(200).json(new ApiResponse(200, updatedJob, "Job updated successfully"));
});


const deleteJob = asyncHandler(async (req, res) => {
  //isme yeh verify krna h ki current user h vo hi job delete kr rha h jo usne khud post kri thi

  const { id: jobId } = req.params;

  const job = await Job.findByIdAndDelete(jobId);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  return res.status(200).json(new ApiResponse(200, null, "Job deleted successfully"));
});

const getCompanyDetails = asyncHandler(async (req, res) => {
  const company = req.company;

  if (!company) {
    throw new ApiError(404, "Company not found");
  }

  const populatedCompany = await Company.findById(company._id).select("-__v");

  return res.status(200).json(new ApiResponse(200, populatedCompany, "Company details fetched successfully"));
});

export {
  createJob,
  getJob,
  getJobs,
  updateJob,
  deleteJob,
  getCompanyDetails,
};

