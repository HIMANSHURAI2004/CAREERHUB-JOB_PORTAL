import {Router} from "express";
import { verifyJWT } from "../middlewares/user.middleware.js";
<<<<<<< HEAD
import { createJob, deleteJob, getCompanyDetails, getCompanyDetailsById, getJob, getJobs, searchJobs, updateJob } from "../controllers/job.controller.js";
=======
import { createJob, deleteJob, getCompanyDetails, getCompanyDetailsById, getJob, getJobs, getRecruiterJobs, updateJob } from "../controllers/job.controller.js";
>>>>>>> 3081c6ab17522f1707f6b1a8111092ebd93fbda4

const router = Router();

router.route("/create-job").post(verifyJWT,createJob)


router.route("/get-job/:id").get(getJob)
router.route("/get-recruiter-jobs").get(verifyJWT,getRecruiterJobs)
router.route("/get-jobs").get(getJobs)
router.route("/search-jobs").post(searchJobs)
router.route("/update-job/:id").patch(verifyJWT,updateJob)
router.route("/delete-job/:id").delete(verifyJWT,deleteJob)

router.route("/get-company-details").get(verifyJWT,getCompanyDetails)
router.route("/get-company-details-by-id/:id").get(getCompanyDetailsById)

export default router
