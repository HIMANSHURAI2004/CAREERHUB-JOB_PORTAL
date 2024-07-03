import 'dotenv/config';
import express from 'express';
import connectDB from './db/index.js';
const  app = express();

const port = process.env.PORT || 3000

connectDB()
.then(()=>{
    app.on("error",(error) =>{
        console.log(" Server connection failed error :",error);
        throw error
    })
    
    app.listen(process.env.PORT,() =>{
        console.log(`Server connected at PORT :${process.env.PORT}`);
    })
}
)
.catch((err) =>{
    console.log("MONGODB CONNECTION FAILED !!",err)
})
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import {app} from "./app.js";


dotenv.config({
    path : './.env'
})

connectDB()
.then(() => {
    try {
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server is running at port : ${process.env.PORT}`);
        });
    } catch (error) {
        console.log(`Server connection failed : `,error);
    }
})
.catch((err) => {
    console.log("MongoDB connection failed : ",err);
})