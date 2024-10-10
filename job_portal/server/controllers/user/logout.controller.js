export const logout = async (req, res) => {
    try {
        res.clearCookie("token")

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