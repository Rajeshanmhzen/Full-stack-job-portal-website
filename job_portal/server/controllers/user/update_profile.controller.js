import { User } from "../../models/user.model.js"

export const updateProfile = async(req, res) => {
    try {
        const {_id,skills, ...restBody } = req.body
        const file = req.file;

        if(!email){
           throw new Error("Please provide email")
        }
       
        if(!fullname){
            throw new Error("Please provide fullname")
        }
        if(!phoneNumber){
            throw new Error("Please provide phone number")
        }
        if(!bio){
            throw new Error("Please provide bio")
        }
        if(!skills){
            throw new Error("Please provide skills")
        }

        // cloudinary come here 

        const skillArray = skills.split(",");
        const userId = req.id
        let updateuser = await User.findByIdAndUpdate(userId, skillArray, restBody);

        res.json({
            message : "User update successfully",
            data : updateuser,
            success : true,
            error : false
        })

    } catch (err) {
        res.json({
            message:err.message || err,
            error: true,
            success: false,
        })
    }
}