import express from "express"
import Authtoken from "../middleware/authtoken.js"
import { applyJob } from "../controllers/application/applyJob.controller.js"
import { getAppliedJobs } from "../controllers/application/getAppliedJobs.js"
import { getApplicants } from "../controllers/application/getApplicants.js"
import { updateStatus } from "../controllers/application/updateStatus.js"


const router = express.Router()

router.get('/apply/:id',Authtoken,applyJob )
router.get('/get',Authtoken,getAppliedJobs )
router.get('/applicants/:id',Authtoken,getApplicants )
router.post('/status/:id/update',Authtoken, updateStatus )


export default router;