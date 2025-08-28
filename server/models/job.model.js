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
    ],
    // Job images for better visual representation
    images: [{
        type: String, // URLs to job-related images
    }],
    // Track latest application submission for sorting/filtering
    lastApplicationDate: {
        type: Date,
        default: null
    },
    // Application count for quick access
    applicationCount: {
        type: Number,
        default: 0
    }
},{timestamps:true})

// Comprehensive indexing for optimal performance
jobSchema.index({
  title: "text",
  description: "text",
  location: "text",
  requirement: "text"
}, {
  weights: {
    title: 10,
    description: 5,
    location: 3,
    requirement: 1
  },
  name: "job_text_index"
});

// Individual field indexes for filtering
jobSchema.index({ location: 1 });
jobSchema.index({ type: 1 });
jobSchema.index({ salary: 1 });
jobSchema.index({ experienceLevel: 1 });
jobSchema.index({ createdAt: -1 });
jobSchema.index({ company: 1 });
jobSchema.index({ applicationCount: -1 });
jobSchema.index({ lastApplicationDate: -1 });

// Compound indexes for common query patterns
jobSchema.index({ location: 1, type: 1 });
jobSchema.index({ salary: 1, experienceLevel: 1 });
jobSchema.index({ company: 1, createdAt: -1 });
jobSchema.index({ type: 1, createdAt: -1 });
const Job = mongoose.model("Job", jobSchema);
export default Job;