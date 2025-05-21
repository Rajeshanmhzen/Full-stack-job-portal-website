import express from "express"
import Authtoken from "../middleware/authtoken.js"
import { applyJob } from "../controllers/application/applyJob.controller.js"
import { getAppliedJobs } from "../controllers/application/getAppliedJobs.js"
import { getApplicants } from "../controllers/application/getApplicants.js"
import { updateStatus } from "../controllers/application/updateStatus.js"
import { getApplicationsByStatus, getSavedJobs, removeSavedJob, saveJob } from "../controllers/application/application.controller.js"


const router = express.Router()

router.get('/apply/:id',Authtoken,applyJob )
router.get('/get',Authtoken,getAppliedJobs )
router.get('/applicants/:id',Authtoken,getApplicants )
router.post('/status/:id/update',Authtoken, updateStatus )
router.get('/saved', Authtoken, getSavedJobs);
router.post('/save/:jobId', Authtoken, saveJob);
router.delete('/save/:jobId', Authtoken, removeSavedJob);
router.get('/status', Authtoken, getApplicationsByStatus);


export default router;