import express from "express";
import {
  register,
  login,
  logout,
  forgetPassword,
  verifyResetOTP,
  resetPassword,
  resendVerification,
  verifyEmail,
  changePassword,
  getUserDetail,
  updateProfile,
} from "../controllers/user/user.controller.js";

import Authtoken from "../middleware/authtoken.js";
import { singleupload } from "../middleware/multer.js";

const router = express.Router();

// user routes
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/change-password", Authtoken, changePassword);
router.get("/user-detail", Authtoken, getUserDetail);
router.post("/update-profile", singleupload, Authtoken, updateProfile);
router.post("/forget-password", forgetPassword);
router.post("/verify-reset/:token", verifyResetOTP);
router.post("/resetpassword/:token", resetPassword);
router.post("/resendverification", resendVerification);
router.get("/verify", verifyEmail);

export default router;
