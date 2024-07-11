import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiError } from "./utils/ApiError.js";

const app = express();

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true,
    optionsSuccessStatus: 200,
}))

app.use(express.json({ limit:"16kb" }));
app.use(express.urlencoded({extended :true,limit : "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from './routes/user.routes.js';
import jobRouter from './routes/job.routes.js'
import applicationRouter from './routes/application.routes.js'


app.use("/api/v1/user",userRouter);
app.use("/api/v1/job",jobRouter);
app.use("/api/v1/application",applicationRouter)

app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
      return res.status(err.statusCode).json({ message: err.message, errors: err.errors });
    }
    res.status(500).json({ message: "Internal Server Error" });
  });
  


export {app}