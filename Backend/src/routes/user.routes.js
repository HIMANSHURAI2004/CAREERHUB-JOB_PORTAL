import {Router} from "express";
import {addResume, changeCurrentPassword, deleteResume, deleteUser,getUser, getCurrentUser, getResumeDetails, loginUser, logoutUser, registerUser, updateCompanyDetails, updateImage, updateResume, updateUser, getAllEntriesOfModel, refreshAccessToken, deleteEntry, countEntriesOfModel, getResumeById, forgotPassword, verifyOTP, resetPassword, preRegisterUserValidation, sendOTP ,getCountsOfAllOfModels} from "../controllers/auth.controller.js"
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/user.middleware.js";

const router = Router()

router.route("/preRegisterValidation").post(preRegisterUserValidation)
router.route("/sendRegisterOTP").post(sendOTP)
router.route("/register").post(upload.fields([
    {
        name : "image",
        maxCount : 1,
    }
]),registerUser);

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/refresh-token").post(refreshAccessToken)

router.route("/get-user-from-id/:id").get(getUser);

router.route("/get-user").get(verifyJWT,getCurrentUser);


router.route("/change-password").patch(verifyJWT,changeCurrentPassword);



router.route("/update-user").patch(verifyJWT,updateUser);
router.route("/update-company-details").patch(verifyJWT,updateCompanyDetails);
router.route("/update-image").patch(verifyJWT, upload.single('image'), updateImage);

router.route("/delete-user").delete(verifyJWT , deleteUser);



router.route("/add-resume").post(verifyJWT,addResume);
router.route("/get-resume").get(verifyJWT,getResumeDetails);
router.route("/get-applicant-resume/:id").get(verifyJWT,getResumeById);
router.route("/update-resume").patch(verifyJWT,updateResume);
router.route("/delete-resume").delete(verifyJWT,deleteResume);

router.route("/admin-dashboard").post(verifyJWT,getAllEntriesOfModel)
router.route("/count-entries").post(verifyJWT,countEntriesOfModel)
router.route("/get-all-counts").post(verifyJWT,getCountsOfAllOfModels)
router.route("/admin-delete").delete(verifyJWT,deleteEntry)

router.route("/forgot-password").post(forgotPassword);
router.route("/verify-otp").post(verifyOTP)
router.route("/reset-password").post(resetPassword)


export default router