import mongoose, {Schema} from "mongoose";

const resumeSchema = new Schema({
    
    
}, {timestamps : true});

export const Resume = mongoose.model("Resume",resumeSchema);