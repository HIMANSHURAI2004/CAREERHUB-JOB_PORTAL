import {Router} from "express";
import {changeCurrentPassword, deleteUser, getCurrentUser, loginUser, logoutUser, registerUser, updateImage, updateUser} from "../controllers/auth.controller.js"
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

router.route("/getuser").get(verifyJWT,getCurrentUser);

router.route("/change-password").patch(verifyJWT,changeCurrentPassword);



router.route("/update-user").patch(verifyJWT,updateUser);
router.route("/update-image").patch(verifyJWT,upload.single("image"),updateImage);
router.route("/delete-account").delete(verifyJWT , deleteUser);




export default router