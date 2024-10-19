import { Job } from "../../models/job.model.js";

export const getAllJob = async(req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or:[
                {title:{$regex:keyword, $options:"i"}},
                {descripton:{$regex:keyword, $options:"i"}}
            ]
        };

        const jobs = await Job.find(query).populate(
            {
                path:"company"
            }
        ).sort({createdAt:-1});
        if(!jobs) {
            return res.status(404).json({
                message:"Job not Found!",
                success:false,
                error:true
            })
        }
        return res.status(201).json({
            message:"Get All Jobs",
            jobs,
            success:true,
            error:false
        })

    } catch(err){
        res.status(400).json({
            message : err.message || err  ,
            error : true,
            success : false,
        })
    }
}