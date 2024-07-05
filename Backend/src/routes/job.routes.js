import {Router} from "express";
import { verifyJWT } from "../middlewares/user.middleware.js";
import { createJob, updateJob } from "../controllers/job.controller.js";

const router = Router();

router.route("/create-job").post(verifyJWT,createJob)
router.route("/update-job/:id").post(verifyJWT,updateJob)

export default router
