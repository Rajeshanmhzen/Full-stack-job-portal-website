import express from "express"
import {register} from "../controllers/user/register.controller.js"
import {login} from "../controllers/user/login.controller.js"
import {logout} from "../controllers/user/logout.controller.js"
import {updateProfile} from "../controllers/user/update_profile.controller.js"
import Authtoken from "../middleware/authtoken.js"
import { singleupload } from "../middleware/multer.js"
import { requestPasswordReset, resetPassword, verifyResetToken } from "../controllers/user/forgetPassword.controller.js"



const router = express.Router()

// user routes
router.post('/register',register )
router.post('/login',login )
router.get('/logout',logout )
router.post('/update-profile',singleupload ,Authtoken, updateProfile )
router.post('/request-password-reset',requestPasswordReset)
router.get('/verify-reset-token',verifyResetToken )
router.post('/reset-password',resetPassword )


export default router;