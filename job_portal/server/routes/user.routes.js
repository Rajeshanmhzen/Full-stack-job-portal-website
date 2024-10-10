import express from "express"
import {register} from "../controllers/user/register.controller.js"
import {login} from "../controllers/user/login.controller.js"
import {logout} from "../controllers/user/logout.controller.js"
import {updateProfile} from "../controllers/user/update_profile.controller.js"
import { authtoken } from "../middleware/authtoken.js"


const router = express.Router()

// user routes
router.post('/register',register )
router.post('/login',login )
router.get('/logout',logout )
router.post('/update-profile',authtoken, updateProfile )


export default router;