import {User} from "../../models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const login  = async(req, res) => {
   try {
    const { email, password, role} = req.body

        if(!email){
            throw new Error("Please provide email")
        }
        if(!password){
             throw new Error("Please provide password")
        }
        if(!role){
            throw new Error("Please provide role")
       }
        if(password.length < 7) {
            throw new Error("password mus contain atleast 7 char")
        }

        let user = await User.findOne({email})

       if(!user){
            throw new Error("User not found")
       }
       if(role !== user.role) {
        throw new Error("Account doesn't exists with this current role")
       }

       const checkPassword = await bcrypt.compare(password,user.password)


        const tokenData = {
            userId : user._id,
        }


        const token =  jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: '1d'});

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        res.cookie("token",token,{ maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).status(200).json({
            message : `Welcome back ${user.fullname}`,
            user,
            success : true,
            error : false,
        })

       
   }catch(err){
        res.json({
            message : err.message || err  ,
            error : true,
            success : false,
        })
    }
}