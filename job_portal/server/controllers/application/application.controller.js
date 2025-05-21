import { Application } from "../../models/application.model.js";
import { SavedJob } from "../../models/savedJob.model.js";
import { Job } from "../../models/job.model.js";
// Get user's applied jobs
export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id; // From auth middleware
        
        const applications = await Application.find({ applicant: userId })
            .sort({ createdAt: -1 })
            .populate({
                path: 'job',
                populate: {
                    path: 'company',
                    select: 'name logo'
                }
            });

        return res.status(200).json({
            applications,
            success: true,
            error: false
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
};

// Get user's saved jobs
export const getSavedJobs = async (req, res) => {
    try {
        const userId = req.id;
        
        const savedJobs = await SavedJob.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate({
                path: 'job',
                populate: {
                    path: 'company',
                    select: 'name logo'
                }
            });

        return res.status(200).json({
            savedJobs,
            success: true,
            error: false
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
};

// Save a job
export const saveJob = async (req, res) => {
    try {
        const userId = req.id;
        const { jobId } = req.params;

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found!",
                error: true,
                success: false
            });
        }

        // Check if already saved
        const existingSavedJob = await SavedJob.findOne({
            user: userId,
            job: jobId
        });

        if (existingSavedJob) {
            return res.status(400).json({
                message: "Job already saved!",
                error: true,
                success: false
            });
        }

        // Save the job
        const savedJob = new SavedJob({
            user: userId,
            job: jobId
        });

        await savedJob.save();

        return res.status(201).json({
            message: "Job saved successfully!",
            savedJob,
            success: true,
            error: false
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
};

// Remove saved job
export const removeSavedJob = async (req, res) => {
    try {
        const userId = req.id;
        const { jobId } = req.params;

        const savedJob = await SavedJob.findOneAndDelete({
            user: userId,
            job: jobId
        });

        if (!savedJob) {
            return res.status(404).json({
                message: "Saved job not found!",
                error: true,
                success: false
            });
        }

        return res.status(200).json({
            message: "Saved job removed successfully!",
            success: true,
            error: false
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
};

// Apply for a job
export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const { jobId } = req.params;

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found!",
                error: true,
                success: false
            });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: userId
        });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job!",
                error: true,
                success: false
            });
        }

        // Create application
        const application = new Application({
            job: jobId,
            applicant: userId,
            status: 'applied'
        });

        await application.save();

        // Add to job's applications array
        job.applications.push(application._id);
        await job.save();

        return res.status(201).json({
            message: "Application submitted successfully!",
            application,
            success: true,
            error: false
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
};

// Get applications with different statuses
export const getApplicationsByStatus = async (req, res) => {
    try {
        const userId = req.id;
        const { status } = req.query; // ?status=applied,saved,offered,in-progress

        let result = {};

        if (!status || status === 'applied') {
            const applications = await Application.find({ applicant: userId })
                .sort({ createdAt: -1 })
                .populate({
                    path: 'job',
                    populate: {
                        path: 'company',
                        select: 'name logo'
                    }
                });
            result.applied = applications;
        }

        if (!status || status === 'saved') {
            const savedJobs = await SavedJob.find({ user: userId })
                .sort({ createdAt: -1 })
                .populate({
                    path: 'job',
                    populate: {
                        path: 'company',
                        select: 'name logo'
                    }
                });
            result.saved = savedJobs;
        }

        if (!status || status === 'offered') {
            const offeredJobs = await Application.find({ 
                applicant: userId, 
                status: 'offered' 
            })
                .sort({ createdAt: -1 })
                .populate({
                    path: 'job',
                    populate: {
                        path: 'company',
                        select: 'name logo'
                    }
                });
            result.offered = offeredJobs;
        }

        if (!status || status === 'inProgress') {
            const inProgressJobs = await Application.find({ 
                applicant: userId, 
                status: 'inProgress' 
            })
                .sort({ createdAt: -1 })
                .populate({
                    path: 'job',
                    populate: {
                        path: 'company',
                        select: 'name logo'
                    }
                });
            result.inProgress = inProgressJobs;
        }

        if (!status || status === 'rejected') {
            const rejectedJobs = await Application.find({ 
                applicant: userId, 
                status: 'rejected' 
            })
                .sort({ createdAt: -1 })
                .populate({
                    path: 'job',
                    populate: {
                        path: 'company',
                        select: 'name logo'
                    }
                });
            result.rejected = rejectedJobs;
        }
        return res.status(200).json({
            ...result,
            success: true,
            error: false
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
};