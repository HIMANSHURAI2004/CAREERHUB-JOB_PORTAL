import Job from "../models/job.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const createJob = asyncHandler(async (req, res) => {
  const { title, description, company, location, salary, postedBy } = req.body;

  // postedBy = req.user._id;
  // company = req.company;
  // ek company ka middleware banao jo company ko req me add karega

  if ([title, description, company, location, postedBy].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const job = await Job.create({
    title,
    description,
    company,
    location,
    salary: salary ? salary : "Depends on performance",
    postedBy,
  });

  const createdJob = await Job.findById(job._id).populate('company').populate('postedBy').select("-__v");

  if (!createdJob) {
    throw new ApiError(500, "Something went wrong while creating the job");
  }

  return res.status(201).json(new ApiResponse(201, createdJob, "Job created successfully"));
});

const getJobs = asyncHandler(async (req, res) => {
    const query = req.query;
    const jobs = await Job.find(query).populate('company').populate('postedBy').select("-__v");
    // const jobs = await Job.aggregate([
    //   { $match: query },
    //   { 
    //     $lookup: {
    //       from: 'companies', // collection name in MongoDB
    //       localField: 'company',
    //       foreignField: '_id',
    //       as: 'company'
    //     }
    //   },
    //   { 
    //     $lookup: {
    //       from: 'users', // collection name in MongoDB
    //       localField: 'postedBy',
    //       foreignField: '_id',
    //       as: 'postedBy'
    //     }
    //   },
    //   {
    //     $project: {
    //       __v: 0
    //     }
    //   }
    // ]);
    
    if (jobs.length === 0) {
      return res.status(200).json(new ApiResponse(200, jobs, "No jobs found based on this search"));
    }

    return res.status(200).json(new ApiResponse(200, jobs, "Jobs fetched successfully"));
  }
);

const updateJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const { title, description, company, location, salary } = req.body;

  if ([title, description, company, location].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  
  const job = await Job.findById(jobId);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }
  //findbyidandupdate
  job.title = title;
  job.description = description;
  job.company = company;
  job.location = location;
  job.salary = salary;

  await job.save();

  const updatedJob = await Job.findById(jobId).populate('company').populate('postedBy').select("-__v");

  return res.status(200).json(new ApiResponse(200, updatedJob, "Job updated successfully"));
});

const deleteJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const job = await Job.findByIdAndDelete(jobId);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  return res.status(200).json(new ApiResponse(200, null, "Job deleted successfully"));
});

const getCompanyDetails = asyncHandler(async (req,res) => {

})

export {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
  getCompanyDetails,
};

