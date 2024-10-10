import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    fullname : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    password: {
    type: String,
    required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    role : {
        type:String,
        enum : ["worker", "recruiter"],
        required: true
    },
    profile: {
        bio: {type:String},
        skills:[{type:String}],
        resume:{type:String},
        resumeOriginName:{type:String},
        company: {type:mongoose.Schema.Types.ObjectId, ref:'Company'},
        profilePhoto: {
            type:String,
            default: ""
        }
    },

});
export const User = mongoose.model("user", userSchema)