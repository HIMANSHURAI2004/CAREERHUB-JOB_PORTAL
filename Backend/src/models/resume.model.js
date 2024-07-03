import mongoose, {Schema} from "mongoose";

const notificationSchema = new Schema({
    title: { 
        type: String, 
        required: [true, "Title is required"] ,
        trim : true,
    },
    content: {
        type: String, 
        required: [true, "Content is required" ]
    },
    sender: {
        type: Schema.Types.ObjectId, 
        ref : "Company",
        required : [true, "Sender field is required"]
    },
    receiver: {
        type: Schema.Types.ObjectId, 
        ref : "Student",
        required : [true, "Receiver field is required"]
    },
}, {timestamps : true});

export const Notification = mongoose.model("Notification",notificationSchema);