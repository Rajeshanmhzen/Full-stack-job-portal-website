import { Application } from "../../models/application.model.js"
import { Job } from "../../models/job.model.js"


export const applyJob = async (req, res) => {
    try{
        const userId = req.id
        const {id:jobId} = req.params
        if(!jobId) {
            return res.status(404).json({
                message:"JobId is required!",
                success:false,
                error:true,
            })
        };

        // check if user has laready appy for hte job or not
        const existingApplication = await Application.findOne({id:jobId, applicant:userId})

        if(existingApplication) {
            return res.status(400).json({
                message:"You have already apply",
                success:false,
                error:true
            })
        };

        // check the job exists for not
        const job = await Job.findById(jobId)
        if(!job) {
            return res.send(404).json({
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
        res.status(400).json({
            message : err.message || err  ,
            error : true,
            success : false,
        })
    }
}