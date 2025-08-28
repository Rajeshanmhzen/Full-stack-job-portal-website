import  Job from "../../models/job.model.js"

export const getApplicants = async (req, res) => {
    try{
        const {id:jobId}  = req.params
       
        const job = await Job.findById(jobId).populate({
            path:"applications",
            options:{sort:{createdAt:-1}},
            populate:{
                path:"applicant"
            }
        });
        if(!job) {
            return res.status(404).json({
                message:"Job not Found!",
                success:false,
                error:true
            })
        }
        return res.status(200).json({
            job,
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