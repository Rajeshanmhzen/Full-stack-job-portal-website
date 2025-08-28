import express from "express"
import Authtoken from "../middleware/authtoken.js"
import { getCompany, getCompanyById, registerCompany, searchCompaniesByname, updateCompany } from "../controllers/company/company.controller.js"
import { uploadCompanyLogo } from "../middleware/fileUpload.js"


const router = express.Router()

// user routes
router.post('/register',Authtoken,registerCompany )
router.get('/get',Authtoken,getCompany )
router.get('/get/:id',Authtoken,getCompanyById )
router.put('/update/:id',Authtoken,uploadCompanyLogo.single('logo'), updateCompany )
router.get('/search',Authtoken, searchCompaniesByname )


export default router;