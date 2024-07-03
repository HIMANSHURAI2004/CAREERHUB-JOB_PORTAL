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