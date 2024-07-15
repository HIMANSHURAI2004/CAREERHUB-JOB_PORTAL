import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import Company from "../models/company.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (!decodedToken?._id) {
            throw new ApiError(401, "Invalid access token");
        }

        const user = await User.findById(decodedToken._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid access token");
        }
        // if(user.role === "recruiter")
        // {
        //     const company = await Company.findOne({recruiter: user._id});
        //     if(!company)
        //     {
        //         throw new ApiError(401,"Company Does Not Exist !!")
        //     }
        //     req.company = company;
        // }
        
        req.user = user;
        next();
    } catch (error) {
        console.error("JWT verification error:", error);
        throw new ApiError(401, error.message || "Invalid access token");
    }
});

// import jwt from "jsonwebtoken";
// import { ApiError } from "../utils/ApiError.js";
// import { User } from "../models/user.model.js";

// export const verifyJWT = async (req, res, next) => {
//     try {
//         const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        
//         if (!token) {
//             throw new ApiError(401, "Unauthorized request");
//         }

//         let decodedToken;
//         try {
//             decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//         } catch (error) {
//             // Token verification failed, attempt to refresh tokens
//             if (error.name === 'TokenExpiredError') {
//                 const refreshToken = req.cookies?.refreshToken || req.header("Refresh-Token");
//                 const response = await fetch('http://localhost:3000/api/v1/user/refresh-token', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     credentials: 'include',
//                     body: JSON.stringify({ refreshToken }),
//                 });

//                 if (!response.ok) {
//                     throw new Error('Failed to refresh access token');
//                 }

//                 const responseData = await response.json();
//                 const { accessToken, refreshToken: newRefreshToken } = responseData.data;

//                 // Update tokens in cookies or local storage
//                 res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });
//                 res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true });

//                 // Update req object with new tokens
//                 req.accessToken = accessToken;
//                 req.refreshToken = newRefreshToken;

//                 // Continue with next middleware or route handler
//                 return next();
//             } else {
//                 throw new ApiError(401, "Invalid access token");
//             }
//         }

//         const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

//         if (!user) {
//             throw new ApiError(401, "Invalid access token");
//         }

//         req.user = user;
//         next();
//     } catch (error) {
//         console.error("JWT verification error:", error);
//         next(error);
//     }
// };
