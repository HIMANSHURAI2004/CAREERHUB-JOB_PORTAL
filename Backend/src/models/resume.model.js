import mongoose, { Schema } from "mongoose";

const resumeSchema = new Schema({
    personalDetails: {
        fullName: {
            type: String,
            required: true
        },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        linkedin: String,
        github: String
    },
    skills: [String],
    workExperience: [
        {
            jobTitle: { type: String },
            company: { type: String },
            location: String,
            startDate: { type: Date },
            endDate: Date,
            responsibilities: String
        }
    ],
    education: [
        {
            degree: { type: String},
            institution: { type: String },
            location: String,
            start_date: Date,
            end_date: Date,
            gpa: Number
        }
    ],
    projects: [
        {
            type:String,
        }
    ],

}, { timestamps: true });

export const Resume = mongoose.model("Resume", resumeSchema);