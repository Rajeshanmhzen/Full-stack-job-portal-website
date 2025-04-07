export const logout = async (req, res) => {
    try {
        res.clearCookie("token",{httpOnly:true})

        res.json({
            message : "Logout successfully",
            error : false,
            success : true,
            data : []
        })
        
    } catch (err) {
        res.json({
            message:err.message || err,
            error: true,
            success: false,
        })
    }
}