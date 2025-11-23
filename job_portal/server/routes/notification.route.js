import express from "express"
import { getNotifications, markAsRead, markSingleAsRead } from "../controllers/notification/notification.controller.js";
import Authtoken from "../middleware/authtoken.js";

const router = express.Router();

router.get("/", Authtoken, getNotifications)
router.patch("/mark-read", Authtoken, markAsRead)
router.patch("/mark-single-read/:id", Authtoken, markSingleAsRead)

export default router;