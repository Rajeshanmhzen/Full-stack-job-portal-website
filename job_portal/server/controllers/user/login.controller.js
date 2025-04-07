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

       if(user.lockUntil && user.lockUntil > Date.now()) {
        const remainingTime = (user.lockUntil - Date.now()) / 1000; // remaining lock time in seconds
        return res.status(400).json({ 
            message: `Account is locked. Please try again in ${Math.ceil(remainingTime)} seconds.`,
            success: false
        });
    }

       const checkPassword = await bcrypt.compare(password,user.password)

       if(checkPassword) {
         // Reset failedAttempts and lockUntil after successful login
         user.failedAttempts = 0;
         user.lockUntil = null;
 
         // Save the updated user record
         await user.save();

        const tokenData = {
            userId : user._id,
            email:user.email,
            verifed:user.verified
        }

        const token =  await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: '1d'});

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        res.cookie("token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpsOnly: process.env.NODE_ENV === "production",
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict'
        }).status(200).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true,
            error: false,
        });

       

        return; 
       
      

    }else {
        user.failedAttempts += 1;

        // const lockTimes = [30, 3 * 60, 5 * 60, 10 * 60]; 
         const lockTimes = [1,  5];  //this is for the testing to show the implement of locktime
        const maxAttempts = lockTimes.length; 

        let lockTime = 0;

        for (let i = 0; i < maxAttempts; i++) {
            if (user.failedAttempts <= (i + 1) * 3) {
                lockTime = lockTimes[i];
                break;
            }
        }

        if (user.failedAttempts > maxAttempts * 3) {
            lockTime = lockTimes[maxAttempts - 1]; // After 12 attempts, use the max lock time
        }

        // Apply lock time based on failed attempts
        if (lockTime > 0) {
            user.lockUntil = Date.now() + lockTime * 1000; // Lock until updated
        }

        await user.save();

        return res.status(400).json({ 
            message: `Incorrect password. Attempt ${user.failedAttempts}/3. Please try again after the lock period ${lockTime}s.`,
            success: false 
        });

    }
       
   }catch(err){
        res.json({
            message : err.message || err  ,
            error : true,
            success : false,
        })
    }
}