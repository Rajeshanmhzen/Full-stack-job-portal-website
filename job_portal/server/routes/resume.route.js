import express from "express"
import { downloadResume, getAllResumes, getResumesByUserID, keywordSearch, uploadResume } from "../controllers/resume/resume.controller.js"
import Authtoken from "../middleware/authtoken.js";
import { uploadResumes } from "../middleware/fileUpload.js";

const router = express.Router()

router.post("/upload", uploadResumes.single("resume"),Authtoken, uploadResume);

router.get("/all", getAllResumes);

router.get("/search", keywordSearch);
router.get("/resume",Authtoken, getResumesByUserID);
router.get("/download",Authtoken, downloadResume);

export default router