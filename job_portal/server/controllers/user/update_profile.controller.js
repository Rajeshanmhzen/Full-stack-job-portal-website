import User from "../../models/user.model.js";

export const updateProfile = async(req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        
        let skillsArray;
        if(skills){
            skillsArray = skills.split(",");
        }
        const userId = req.id; // middleware authentication
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            })
        }

         // updating data
         if(fullname) user.fullname = fullname
         if(email) user.email = email
         if(phoneNumber)  user.phoneNumber = phoneNumber
         if(bio) user.profile.bio = bio
         if(skills) user.profile.skills = skillsArray

         await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message:"Profile updated successfully.",
            user,
            success:true
        })

      } catch (err) {
        res.status(500).json({
          message: err.message || "Error updating user information",
          error: true,
          success: false,
        });
      }
}