import express from "express"
import { upload } from "../middleware/fileUpload.js"
import { getAllResumes, keywordSearch, uploadResume } from "../controllers/resume/resume.controller.js"

const router = express.Router()

router.post("/upload", upload.single("resume"), uploadResume);

router.get("/", getAllResumes);

router.get("/search", keywordSearch);

export default router