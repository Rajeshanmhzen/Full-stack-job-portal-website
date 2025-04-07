import User from "../../models/user.model"
import bcrypt from "bcryptjs"


// export const register = async(req,res)=> {
//     try {
//         const {fullname, email, phoneNumber, password, role} = req.body;    } catch (error) {
//         const user = await User.findOne({email})
            
//                     if(user){
//                         throw new Error("Already user exits.")
//                     }
            
//                     if(!email){
//                        throw new Error("Please provide email")
//                     }
//                     if(!password){
//                         throw new Error("Please provide password")
//                    }
//                    if(password.length < 7) {
//                        throw new Error("password mus contain atleast 7 char")
//                    }
//                     if(!fullname){
//                         throw new Error("Please provide fullname")
//                     }
//                     if(!phoneNumber){
//                         throw new Error("Please provide phone number")
//                     }
//                     if(!role){
//                         throw new Error("Please provide role")
//                     }
//                     const salt = bcrypt.genSaltSync(10)
//                     const hashPassword = await bcrypt.hashSync(password, salt)

//         res.status(401).json({
//             message: error.message || error,
//             error:true,
//             success:false
//         })
//     }
// }

export const register = async (req, res) => {
    try {
      const { userName, email, password } = req.body;
  
      let user = await User.findOne({ userName });
  
      if (user) {
          return res.status(400).json({ error: 'username is not available.' })
      }
      user = await User.findOne({ email })
      if (user) {
          return res.status(400).json({ error: 'email is already registered' })
      }
     
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = await bcrypt.hashSync(password, salt);
  
      if (!hashPassword) {
        throw new Error("Something is wrong");
      }
      const payload = {
          ...req.body,
          password : hashPassword
      }
  
      const userData = new User(payload)
          const saveUser = await userData.save();
          saveUser.password = undefined
  
      let tokenData = await Token.create({
          token: crypto.randomBytes(24).toString('hex'),
          user: saveUser._id
      })
      if (!tokenData) {
          return res.status(400).json({ error: 'something went' })
      }
      const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {
        expiresIn: 60 * 60 * 8,
      });
  
      const tokenOption = {
        httpOnly: true,
        secure: true,
      };
      res.cookie("token", token, tokenOption);
  
      let URL = `http://localhost:8000/verify/${tokenData.token}`;
  
      await emailSender({
        from: "noreply@something.com", // there company email written
        to: email,
        subject: "Verfication E-mail",
        text: `Verify your account. ${URL}`,
        html: `<a href='${URL}'> <button> Verify Now</button></a>`,
      });
  
      res.status(201).json({
        data: {
          // Nest the user and token data for clarity
          user: saveUser,
          token,
        },
        success: true,
        error: false,
        message: "User Register Successfully!",
      });
    } catch (err) {
      res.json({
        message: err.message || err,
        error: true,
        success: false,
      });
    }
  };