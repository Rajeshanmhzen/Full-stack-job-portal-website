import mongoose from "mongoose"
  
const resumeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    filename: String,
    content: String,
    name: String,
    email: String,
    phone: String,
    website: String,
    location: String,
    jobTitles: [String],
    skills: [String],
    experience: [String],
    projects: [String],
    uploadedAt: { type: Date, default: Date.now },
  });
  export const Resume = mongoose.model('Resume', resumeSchema);