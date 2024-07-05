import {Router} from "express";
import { verifyJWT } from "../middlewares/user.middleware.js";
import { createJob, deleteJob, getCompanyDetails, getJobs, updateJob } from "../controllers/job.controller.js";

const router = Router();

router.route("/create-job").post(verifyJWT,createJob)

router.route("/get-jobs").get(getJobs)
router.route("/update-job/:id").patch(verifyJWT,updateJob)
router.route("/delete-job/:id").delete(verifyJWT,deleteJob)

router.route("/get-company-details").get(verifyJWT,getCompanyDetails)

export default router
