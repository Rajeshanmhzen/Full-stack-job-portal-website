import express from "express"
import {registerCompany} from "../controllers/company/register.controller.js"
import { getCompany, getCompanyById } from "../controllers/company/getCompany.controller.js"

import Authtoken from "../middleware/authtoken.js"
import { updateCompany } from "../controllers/company/updateCompanyInfo.controller.js"


const router = express.Router()

// user routes
router.post('/register',Authtoken,registerCompany )
router.get('/get',Authtoken,getCompany )
router.get('/get/:id',Authtoken,getCompanyById )
router.put('/update/:id',Authtoken, updateCompany )


export default router;