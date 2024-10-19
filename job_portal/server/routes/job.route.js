import express from "express"
import Authtoken from "../middleware/authtoken.js";
import { postJob } from "../controllers/job/postJob.controller.js";
import { getAllJob } from "../controllers/job/getAllJob.controller.js";
import { getAdminJob } from "../controllers/job/getAdminJob.controller.js";
import { getJobById } from "../controllers/job/getJobById.controller.js";

const router = express.Router()

// user routes
router.post("/post",Authtoken, postJob)
router.get("/get-job",Authtoken, getAllJob)
router.get("/getAdminJob",Authtoken, getAdminJob)
router.get("/get/:id",Authtoken, getJobById)


export default router;