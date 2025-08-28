import jwt from "jsonwebtoken"

 const Authtoken = async (req, res, next) => {
    try {
        const token = req.cookies.token

        // console.log("token", token)

        if(!token) {
            return res.status(401).json({

                message: "Please Login ....!",
                error: true,
                success: false
            })
        } else {
           jwt.verify(token, process.env.TOKEN_SECRET_KEY, function(err, decoded) {
                // console.log(err)
                // console.log("decoded", decoded)
                
                if(err){
                    console.log("error auth", err)
                }
    
                req.id = decoded.userId
    
                next()
            })
        }
        
    } catch (err) {
        res.status(400).json({
            message:err.message ||err,
            data: [],
            error: true,
            success: false,
        })
    }
}

export default Authtoken