import { Application } from "../../models/application.model.js"
import  Job  from "../../models/job.model.js"


export const applyJob = async (req, res) => {
    try{
        console.log('Apply job request received:', req.params);
        console.log('User ID from token:', req.id);
        
        const userId = req.id
        const {id:jobId} = req.params
        
        if(!jobId) {
            console.log('JobId missing');
            return res.status(404).json({
                message:"JobId is required!",
                success:false,
                error:true,
            })
        };
        
        if(!userId) {
            console.log('UserId missing');
            return res.status(401).json({
                message:"User not authenticated!",
                success:false,
                error:true,
            })
        };

        // check if user has already applied for the job or not
        console.log('Checking existing application for job:', jobId, 'user:', userId);
        const existingApplication = await Application.findOne({job:jobId, applicant:userId})
        console.log('Existing application found:', existingApplication);

        if(existingApplication) {
            console.log('User already applied');
            return res.status(400).json({
                message:"You have already applied for this job",
                success:false,
                error:true
            })
        };

        // check the job exists or not
        console.log('Checking if job exists:', jobId);
        const job = await Job.findById(jobId)
        console.log('Job found:', job ? 'Yes' : 'No');
        
        if(!job) {
            console.log('Job not found');
            return res.status(404).json({
                message:"Job not Found!",
                error:true,
                success:false
            });
        };

        // create a new application
        const newJobApplication = await Application.create({
            job:jobId,
            applicant:userId,
        });
        job.applications.push(newJobApplication._id);
        await job.save();
        return res.status(200).json({
            message:"Job Applied Successfully!",
            error:false,
            success:true
        });

    } catch(err){
        console.error('Apply job error:', err);
        res.status(400).json({
            message : err.message || err  ,
            error : true,
            success : false,
        })
    }
}