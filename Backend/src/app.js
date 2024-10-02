import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiError } from "./utils/ApiError.js";
import dotenv from "dotenv";
const app = express();

dotenv.config()

app.use(cors({
    origin: process.env.FRONTEND_URL, // Frontend URL
    credentials: true,
    optionsSuccessStatus: 200,
}))

app.use(express.json({ limit:"5mb" }));
app.use(express.urlencoded({extended :true,limit : "5mb"}));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from './routes/user.routes.js';
import jobRouter from './routes/job.routes.js'
import applicationRouter from './routes/application.routes.js'


app.use("/user",userRouter);
app.use("/job",jobRouter);
app.use("/application",applicationRouter)

app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
      return res.status(err.statusCode).json({  
        success: false, 
        message: err.message, 
        errors: err.errors,
        stack: err.stack });
    }
     res.status(500).json({ message: "Internal Server Error" });
  });
  

export {app}