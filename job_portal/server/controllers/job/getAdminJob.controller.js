import  Job  from "../../models/job.model.js"


export const getAdminJob = async(req,res)=> {
    try{
        const adminId = req.id;
        const jobs = await Job.find({created_by:adminId});
        if(!jobs){
            return res.status(404).json({
                message:"Job Not found!",
                success:false,
                error:true
            })
        }

        return res.status(200).json({
            jobs,
            success:true,
            error:false
        })
        
    }catch(err){
        res.status(400).json({
            message : err.message || err  ,
            error : true,
            success : false,
        })
    }
}