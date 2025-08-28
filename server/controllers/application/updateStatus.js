import { Application } from "../../models/application.model.js";

export const updateStatus = async (req, res) => {
    try{
    const {status} = req.body
    const applicationId = req.params.id;
    if(!status){
        return res.status(404).json({
            message:"Status required!",
            success:false,
            error:true
        });
    };

    // finding the application by using applicantion id
    const application = await Application.findOne({_id:applicationId})
    if(!application){
        return res.status(404).json({
            message:"Application not Found!",
            success:false,
            error:true
        });
    };


    // Update status 

    application.status = status.toLowerCase();
    await application.save();

    return res.status(200).json({
        message:"Status Update Successfully!",
        application,
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