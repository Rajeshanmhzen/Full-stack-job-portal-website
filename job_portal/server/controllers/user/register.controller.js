import {User} from "../../models/user.model.js"
import bcrypt from "bcryptjs"

export const register = async(req, res) => {
    try {
        const {fullname, email, phoneNumber, password, role} = req.body;

        const user = await User.findOne({email})

        if(user){
            throw new Error("Already user exits.")
        }

        if(!email){
           throw new Error("Please provide email")
        }
        if(!password){
            throw new Error("Please provide password")
       }
       if(password.length < 7) {
           throw new Error("password mus contain atleast 7 char")
       }
        if(!fullname){
            throw new Error("Please provide fullname")
        }
        if(!phoneNumber){
            throw new Error("Please provide phone number")
        }
        if(!role){
            throw new Error("Please provide role")
        }

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hashSync(password, salt);

        if(!hashPassword){    
            throw new Error("Something is wrong")
        }

        const payload = {
            ...req.body,
            password : hashPassword
        }

        const userData = new User(payload)
        const saveUser = await userData.save();
        saveUser.password = undefined

        res.status(201).json({
            data : saveUser,
            success : true,
            error : false,
            message : "User created Successfully!"
        })
    } catch(err){
        res.json({
            message : err.message || err  ,
            error : true,
            success : false,
        })
    }
}