import { Application } from "../../models/application.model.js"

export const getAppliedJobs = async (req, res) => {
    try{
        const userId = req.id
        const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'company',
                options:{sort:{createdAt:-1}},
            }
        });


        if(!application) {
            return res.status(404).json({
                message:"Application not Found!",
                error:true,
                succes:false
            });
        };
        return res.status(200).json({
            application,
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