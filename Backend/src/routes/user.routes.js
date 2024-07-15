import {Router} from "express";
<<<<<<< HEAD
import {addResume, changeCurrentPassword, deleteResume, deleteUser,getUser, getCurrentUser, getResumeDetails, loginUser, logoutUser, registerUser, updateCompanyDetails, updateImage, updateResume, updateUser, getAllEntriesOfModel, refreshAccessToken, deleteEntry, countEntriesOfModel} from "../controllers/auth.controller.js"
=======
import {addResume, changeCurrentPassword, deleteResume, deleteUser,getUser, getCurrentUser, getResumeDetails, loginUser, logoutUser, registerUser, updateCompanyDetails, updateImage, updateResume, updateUser, getAllEntriesOfModel, refreshAccessToken, getResumeById} from "../controllers/auth.controller.js"
>>>>>>> 3081c6ab17522f1707f6b1a8111092ebd93fbda4
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/user.middleware.js";

const router = Router()

router.route("/register").post(upload.fields([
    {
        name : "image",//name should be same as frontend
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
router.route("/update-image").patch(verifyJWT,upload.fields([
    {
        name : "image",//name should be same as frontend
        maxCount : 1,
    }
]),updateImage);
router.route("/delete-user").delete(verifyJWT , deleteUser);



router.route("/add-resume").post(verifyJWT,addResume);
router.route("/get-resume").get(verifyJWT,getResumeDetails);
router.route("/get-applicant-resume/:id").get(verifyJWT,getResumeById);
router.route("/update-resume").patch(verifyJWT,updateResume);
router.route("/delete-resume").delete(verifyJWT,deleteResume);

router.route("/admin-dashboard").post(verifyJWT,getAllEntriesOfModel)
router.route("/count-entries").post(verifyJWT,countEntriesOfModel)
router.route("/admin-delete").delete(verifyJWT,deleteEntry)


export default router