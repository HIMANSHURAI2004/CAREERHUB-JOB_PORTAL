import {Router} from "express";
import { verifyJWT } from "../middlewares/user.middleware.js";
import { createApplication,getAllApplicationsForJob,getUserApplications,updateApplicationStatus,deleteApplication, } from "../controllers/application.controller.js";

const router = Router();

router.route("/create-application/:id").post(verifyJWT,createApplication)
router.route("/get-job-applications/:id").get(verifyJWT,getAllApplicationsForJob)
router.route("/get-user-applications").get(verifyJWT,getUserApplications)
router.route("/update-application-status/:id").patch(verifyJWT,updateApplicationStatus)
router.route("/delete-application/:id").delete(verifyJWT,deleteApplication)

export default router