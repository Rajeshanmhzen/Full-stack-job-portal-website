import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    desciption : {
        type: String,
        required: true,
    },
    requirement: [{
    type: String
    }],
    salary: {
        type: Number,
        required: true
    },
    location : {
        type:String,
        required: true
    },
    jobType: {
        type:String,
        required:true
    },
    position:{
        type:String,
        required:true
    }, 
    company: {
        type: mongoose.Schema.Types.objectId,
        ref:"Company",
        required:true
    },
    createdBy: {
        type: mongoose.Schema.Types.objectId,
        ref:"User",
        required:true,
    },
    appliacion: {
        type: mongoose.Schema.Types.objectId,
        ref:"Application",
    },
},{timestamps:true})
export const Job = mongoose.model("job", jobSchema)