import {Router} from "express";
import {deleteUser, getCurrentUser, loginUser, logoutUser, registerUser, updateUser} from "../controllers/auth.controller.js"
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
// router.route("/delete-account").delete(verifyJWT , deleteUser);




export default router