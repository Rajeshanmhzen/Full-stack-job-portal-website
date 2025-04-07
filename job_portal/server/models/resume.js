import mongoose from "mongoose"

const resumeSchema = new mongoose.Schema({
    filename: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    name: {
      type: String,
      default: "Unknown"
    },
    email: {
      type: String,
      default: "Not Found"
    },
    phone: {
      type: String,
      default: "Not Found"
    },
    location: {
      type: String,
      default: "Not Found"
    },
    jobTitles: [{
      type: String
    }],
    skills: [{
      type: String
    }],
    experience: [{
      type: String
    }],
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  });
  
  export const Resume = mongoose.model('Resume', resumeSchema);