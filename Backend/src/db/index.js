import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDB connected !! DB`)

    } catch (error) {
        
        console.log("MongoDB Connection Error");
        process.exit(1);
    }
}

export default connectDB
