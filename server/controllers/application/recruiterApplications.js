import { Application } from "../../models/application.model.js";
import Job from "../../models/job.model.js";

// Get all applications for recruiter's jobs
export const getRecruiterApplications = async (req, res) => {
    try {
        const recruiterId = req.id;
        console.log('Fetching applications for recruiter:', recruiterId);
        
        if (!recruiterId) {
            return res.status(401).json({
                message: 'User not authenticated',
                error: true,
                success: false
            });
        }
        
        // First get all jobs posted by this recruiter
        const recruiterJobs = await Job.find({ created_by: recruiterId }).select('_id');
        console.log('Found recruiter jobs:', recruiterJobs.length);
        const jobIds = recruiterJobs.map(job => job._id);
        
        if (jobIds.length === 0) {
            return res.status(200).json({
                applications: [],
                count: 0,
                success: true,
                error: false,
                message: 'No jobs found for this recruiter'
            });
        }
        
        // Get all applications for these jobs
        const applications = await Application.find({ job: { $in: jobIds } })
            .populate({
                path: 'applicant',
                select: 'fullname email'
            })
            .populate({
                path: 'job',
                select: 'title location salary type',
                populate: {
                    path: 'company',
                    select: 'name logo'
                }
            })
            .sort({ createdAt: -1 });

        console.log('Found applications:', applications.length);
        res.status(200).json({
            applications,
            count: applications.length,
            success: true,
            error: false
        });
    } catch (error) {
        console.error('Error fetching recruiter applications:', error);
        res.status(500).json({
            message: 'Error fetching applications: ' + error.message,
            error: true,
            success: false
        });
    }
};

// Get recruiter's jobs for filter dropdown
export const getRecruiterJobs = async (req, res) => {
    try {
        const recruiterId = req.id;
        
        const jobs = await Job.find({ created_by: recruiterId })
            .select('title _id')
            .sort({ createdAt: -1 });

        res.status(200).json({
            jobs,
            success: true,
            error: false
        });
    } catch (error) {
        console.error('Error fetching recruiter jobs:', error);
        res.status(500).json({
            message: 'Error fetching jobs',
            error: true,
            success: false
        });
    }
};

// Get single application details
export const getApplicationDetails = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const recruiterId = req.id;
        
        const application = await Application.findById(applicationId)
            .populate({
                path: 'applicant',
                populate: {
                    path: 'resume',
                    select: 'skills experience education filename'
                }
            })
            .populate({
                path: 'job',
                populate: {
                    path: 'company',
                    select: 'name logo'
                }
            });

        if (!application) {
            return res.status(404).json({
                message: 'Application not found',
                error: true,
                success: false
            });
        }

        // Verify that this application belongs to recruiter's job
        const job = await Job.findById(application.job._id);
        if (job.created_by.toString() !== recruiterId) {
            return res.status(403).json({
                message: 'Unauthorized access',
                error: true,
                success: false
            });
        }

        res.status(200).json({
            application,
            success: true,
            error: false
        });
    } catch (error) {
        console.error('Error fetching application details:', error);
        res.status(500).json({
            message: 'Error fetching application details',
            error: true,
            success: false
        });
    }
};

// Update application status
export const updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;
        const recruiterId = req.id;

        // Validate status
        const validStatuses = ['applied', 'inProgress', 'offered', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: 'Invalid status',
                error: true,
                success: false
            });
        }

        const application = await Application.findById(applicationId).populate('job');
        
        if (!application) {
            return res.status(404).json({
                message: 'Application not found',
                error: true,
                success: false
            });
        }

        // Verify that this application belongs to recruiter's job
        if (application.job.created_by.toString() !== recruiterId) {
            return res.status(403).json({
                message: 'Unauthorized access',
                error: true,
                success: false
            });
        }

        application.status = status;
        application.updatedAt = new Date();
        await application.save();

        res.status(200).json({
            message: 'Application status updated successfully',
            application,
            success: true,
            error: false
        });
    } catch (error) {
        console.error('Error updating application status:', error);
        res.status(500).json({
            message: 'Error updating application status',
            error: true,
            success: false
        });
    }
};

// Get application statistics
export const getApplicationStats = async (req, res) => {
    try {
        const recruiterId = req.id;
        
        // Get all jobs posted by this recruiter
        const recruiterJobs = await Job.find({ created_by: recruiterId }).select('_id');
        const jobIds = recruiterJobs.map(job => job._id);
        
        // Get application counts by status
        const stats = await Application.aggregate([
            { $match: { job: { $in: jobIds } } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const formattedStats = {
            total: 0,
            applied: 0,
            inProgress: 0,
            offered: 0,
            rejected: 0
        };

        stats.forEach(stat => {
            formattedStats[stat._id] = stat.count;
            formattedStats.total += stat.count;
        });

        res.status(200).json({
            stats: formattedStats,
            success: true,
            error: false
        });
    } catch (error) {
        console.error('Error fetching application stats:', error);
        res.status(500).json({
            message: 'Error fetching statistics',
            error: true,
            success: false
        });
    }
};