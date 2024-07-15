import Job from "../models/job.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import Company from "../models/company.model.js";

const createJob = asyncHandler(async (req, res) => {
  const { title, description, locations, salary, deadline, workExperienceMinYears, isRemote, skillsRequired, employmentType, industry } = req.body;
  const postedBy = req.user;
  const company = req.company._id;

  if ([title, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  let parsedLocations = locations ? locations.split(",").map(loc => loc.trim()) : [];
  if (parsedLocations.length === 0) {
    parsedLocations.push("Remote");
  }

  const jobExist = await Job.findOne({ title, postedBy });

  if (jobExist) {
    throw new ApiError(400, "Job Already Exist");
  }

  const job = await Job.create({
    title,
    description,
    company,
    locations: parsedLocations,
    salary: salary ? salary : "Depends on performance",
    postedBy,
    deadline: deadline ? deadline : new Date('9999-12-31'),
    workExperienceMinYears: workExperienceMinYears ? workExperienceMinYears : 0,
    isRemote: isRemote ? isRemote : false,
    skillsRequired: skillsRequired ? skillsRequired.split(",").map(skill => skill.trim()) : [],
    employmentType: employmentType ? employmentType : 'Full-time',
    industry: industry ? industry : ''
  });

  const createdJob = await Job.findById(job._id).populate('company').select("-__v");

  if (!createdJob) {
    throw new ApiError(500, "Something went wrong while creating the job");
  }

  return res.status(201).json(new ApiResponse(201, createdJob, "Job created successfully"));
});


const getJob = asyncHandler(async (req, res) => {
  const { id: jobId } = req.params;

  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new ApiError(404, "Job Not Found");
  }

  return res.status(200).json(new ApiResponse(200, job, "Job fetched successfully"));
});

// const getJobs = asyncHandler(async (req, res) => {
//   const query = req.query;

//   if (query.company) {
//     const company = await Company.findOne({ companyName: query.company });
//     query.company = company._id;
//   }
//   if (query.postedBy) {
//     const postedBy = await User.findOne({ userName: query.postedBy });
//     query.postedBy = postedBy._id;
//   }

//   const jobs = await Job.aggregate([
//     { $match: query },
//     {
//       $lookup: {
//         from: 'companies',
//         localField: 'company',
//         foreignField: '_id',
//         as: 'company'
//       }
//     },
//     {
//       $lookup: {
//         from: 'users',
//         localField: 'postedBy',
//         foreignField: '_id',
//         as: 'postedBy'
//       }
//     },
//     {
//       $project: {
//         __v: 0,
//         'company.__v': 0,
//         'postedBy.__v': 0,
//         'postedBy.password': 0,
//         'postedBy.refreshToken': 0,
//       }
//     }
//   ]);

//   if (jobs.length === 0) {
//     return res.status(200).json(new ApiResponse(200, jobs, "No jobs found based on this search"));
//   }

//   return res.status(200).json(new ApiResponse(200, jobs, "Jobs fetched successfully"));
// });

const getJobs = asyncHandler(async (req, res) => {
  const query = req.query;

  const jobs = await Job.find(query);

  if (jobs.length === 0) {
    return res.status(200).json(new ApiResponse(200, jobs, "No jobs found based on this search"));
  }

  return res.status(200).json(new ApiResponse(200, jobs, "Jobs fetched successfully"));
});

const searchJobs = async (req, res) => {
  const { search, filters } = req.body;

  let query = {};
  if (search || filters) {
    
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
     
  }


  try {
    const jobs = await Job.find(query).exec();
    let filteredJobs = jobs;

    if (filters.salaryMin) {
      filteredJobs = jobs.filter(job => parseInt(job.salary) >= parseInt(filters.salaryMin));
    }

    res.status(200).json({ data: filteredJobs });
  } catch (error) {
    console.error('Error searching jobs:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};



const updateJob = asyncHandler(async (req, res) => {
  const postedBy = req.user;
  const { id: jobId } = req.params;
  const { title, description, locations, salary, company, deadline, workExperienceMinYears, isRemote, skillsRequired, employmentType, industry } = req.body;

  if (!(title || description || locations || salary || company || deadline )) {
    throw new ApiError(400, "At least one field is required");
  }

  const job = await Job.findOne({ _id: jobId, postedBy });

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  job.title = title !== undefined ? title : job.title;
  job.description = description !== undefined ? description : job.description;
  job.company = company !== undefined ? company : job.company;
  
  job.locations = locations !== undefined ? locations.split(",").map(loc => loc.trim()) : job.locations;

  job.salary = salary !== undefined ? salary : job.salary;
  job.deadline = deadline !== undefined ? deadline : job.deadline;
  job.workExperienceMinYears = workExperienceMinYears !== undefined ? workExperienceMinYears : job.workExperienceMinYears;
  job.isRemote = isRemote !== undefined ? isRemote : job.isRemote;

  job.skillsRequired = skillsRequired !== undefined ? skillsRequired.split(",").map(skill => skill.trim()) : job.skillsRequired;

  job.employmentType = employmentType !== undefined ? employmentType : job.employmentType;
  job.industry = industry !== undefined ? industry : job.industry;

  await job.save();

  const updatedJob = await Job.findById(jobId).select("-__v");

  return res.status(200).json(new ApiResponse(200, updatedJob, "Job updated successfully"));
});


const deleteJob = asyncHandler(async (req, res) => {
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

const getCompanyDetailsById = asyncHandler(async (req, res) => {
  const { id: companyId } = req.params;

  const company = await Company.findOne({ _id: companyId });

  if (!company) {
    throw new ApiError(404, "Company Not Found");
  }

  return res.status(200).json(new ApiResponse(200, company, "Company fetched successfully"));
});

export {
  createJob,
  getJob,
  getJobs,
  searchJobs,
  updateJob,
  deleteJob,
  getCompanyDetails,
  getCompanyDetailsById,
};


