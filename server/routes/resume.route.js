import express from "express"
import { downloadResume, getAllResumes, getResumesByUserID, getUserRecommendations, keywordSearch, uploadResume } from "../controllers/resume/resume.controller.js"
import { seedDataForUser } from "../controllers/data/seedController.js";
import Authtoken from "../middleware/authtoken.js";
import { uploadResumes } from "../middleware/fileUpload.js";

const router = express.Router()

router.get("/", Authtoken, getUserRecommendations); 
router.get("/recommendations", Authtoken, getUserRecommendations);
router.post("/seed-data", Authtoken, seedDataForUser);
router.post("/upload", uploadResumes.single("resume"),Authtoken, uploadResume);
router.get("/all", getAllResumes);
router.get("/search", keywordSearch);
router.get("/resume",Authtoken, getResumesByUserID);
router.get("/download",Authtoken, downloadResume);
export default router