import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
job: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"Job",
    required:true
},
applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
},
status: {
    type:String,
    enum: ['applied', 'pending', 'reviewing', 'interviewed', 'rejected', 'offered', 'hired', "inProgress"],
    default:'applied'
}
}, {timestamps:true})

export const Application = mongoose.model("Application", applicationSchema)