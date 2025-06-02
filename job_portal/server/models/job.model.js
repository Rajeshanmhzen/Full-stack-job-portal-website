import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    description : {
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
    experienceLevel: {
      type: String,
        enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'],
        required:true,
    },
    location : {
        type:String,
        required: true
    },
    type: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
        default: 'Full-time'
      },
    position:{
        type:String,
        required:true
    }, 
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application',
        }
    ]
},{timestamps:true})
export const Job = mongoose.model("Job", jobSchema)