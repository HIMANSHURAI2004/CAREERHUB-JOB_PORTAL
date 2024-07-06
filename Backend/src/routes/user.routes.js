import {Router} from "express";
import {addResume, changeCurrentPassword, deleteResume, deleteUser, getCurrentUser, getResumeDetails, loginUser, logoutUser, registerUser, updateCompanyDetails, updateImage, updateResume, updateUser} from "../controllers/auth.controller.js"
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

router.route("/get-user").get(verifyJWT,getCurrentUser);


router.route("/change-password").patch(verifyJWT,changeCurrentPassword);



router.route("/update-user").patch(verifyJWT,updateUser);
router.route("/update-company-details").patch(verifyJWT,updateCompanyDetails);
router.route("/update-image").patch(verifyJWT,upload.single("image"),updateImage);
router.route("/delete-user").delete(verifyJWT , deleteUser);



router.route("/add-Resume").post(verifyJWT,addResume);
router.route("/get-Resume").get(verifyJWT,getResumeDetails);
router.route("/update-Resume").patch(verifyJWT,updateResume);
router.route("/delete-Resume").delete(verifyJWT,deleteResume);


export default router