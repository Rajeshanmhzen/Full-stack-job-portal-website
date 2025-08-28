import express from "express";
import { searchCandidates } from "../controllers/user/user.controller.js";
import Authtoken from "../middleware/authtoken.js";
import { searchJobs } from "../controllers/job/job.controller.js";

const router = express.Router();

router.get("/search", searchJobs); 
router.get("/candidates", Authtoken, searchCandidates); 

export default router;