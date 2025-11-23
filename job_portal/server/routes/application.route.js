import express from "express"
import Authtoken from "../middleware/authtoken.js"
import { applyJob } from "../controllers/application/applyJob.controller.js"
import { getAppliedJobs } from "../controllers/application/getAppliedJobs.js"
import { getApplicants } from "../controllers/application/getApplicants.js"
import { updateStatus } from "../controllers/application/updateStatus.js"
import { getApplicationsByStatus, getSavedJobs, removeSavedJob, saveJob } from "../controllers/application/application.controller.js"
import { 
    getRecruiterApplications, 
    getRecruiterJobs, 
    getApplicationDetails, 
    updateApplicationStatus, 
    getApplicationStats 
} from "../controllers/application/recruiterApplications.js"


const router = express.Router()

// User routes
router.get('/apply/:id',Authtoken,applyJob )
router.get('/get',Authtoken,getAppliedJobs )
router.get('/applicants/:id',Authtoken,getApplicants )
router.post('/status/:id/update',Authtoken, updateStatus )
router.get('/saved', Authtoken, getSavedJobs);
router.post('/save/:jobId', Authtoken, saveJob);
router.delete('/save/:jobId', Authtoken, removeSavedJob);
router.get('/status', Authtoken, getApplicationsByStatus);

// Recruiter routes
router.get('/recruiter/all', Authtoken, getRecruiterApplications);
router.get('/recruiter/jobs', Authtoken, getRecruiterJobs);
router.get('/recruiter/stats', Authtoken, getApplicationStats);
router.get('/recruiter/:applicationId', Authtoken, getApplicationDetails);
router.put('/status/:applicationId', Authtoken, updateApplicationStatus);


export default router;