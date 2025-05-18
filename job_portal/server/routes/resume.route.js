import express from "express"
import { upload } from "../middleware/fileUpload.js"
import { getAllResumes, keywordSearch, uploadResume } from "../controllers/resume/resume.controller.js"
import Authtoken from "../middleware/authtoken.js";

const router = express.Router()

router.post("/upload", upload.single("resume"),Authtoken, uploadResume);

router.get("/all", getAllResumes);

router.get("/search", keywordSearch);

export default router