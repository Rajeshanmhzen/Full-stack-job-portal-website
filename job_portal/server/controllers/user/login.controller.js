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

        const user = await User.findOne({email})

       if(!user){
            throw new Error("User not found")
       }
       if(role !== user.role) {
        throw new Error("Account doesn't exists with this current role")
       }

       const checkPassword = await bcrypt.compare(password,user.password)

       if(checkPassword){
        const tokenData = {
            _id : User._id,
            fullname: User.fullname,
            email : User.email,
            password: User.password,
            role: User.role,
            phoneNumber: User.phoneNumber,
            profile: User.profile,
        }
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: '1d'});

        const tokenOption = {
            httpOnly : true,
            secure : true,
        }

        res.cookie("token",token,tokenOption).status(200).json({
            message : `Welcome back ${user.fullname}`,
            data : token,
            success : true,
            error : false,
        })

       }else{
         throw new Error("Please check Password")
       }
   }catch(err){
        res.json({
            message : err.message || err  ,
            error : true,
            success : false,
        })
    }
}