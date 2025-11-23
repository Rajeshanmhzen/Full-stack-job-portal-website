import  Job  from "../../models/job.model.js"

// worker
export const getJobById = async(req,res)=> {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate('company');
        if(!job) {
            throw new Error ("Job not Found!")
        }
        return res.status(201).json({
            job, 
            error:false,
            success:true
        })


    } catch(err){
        res.status(404).json({
            message : err.message || err  ,
            error : true,
            success : false,
        })
    }
}


