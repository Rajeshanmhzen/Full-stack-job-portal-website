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
  searchUsers,
} from "../controllers/user/user.controller.js";

import Authtoken from "../middleware/authtoken.js";
import { uploadUserProfile } from "../middleware/fileUpload.js";


const router = express.Router();

// user routes
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/change-password", Authtoken, changePassword);
router.get("/profile", Authtoken, getUserDetail);
router.post("/update-profile", uploadUserProfile.single("profilePic"), Authtoken, updateProfile);
router.post("/forget-password", forgetPassword);
router.post("/verify-reset/:token", verifyResetOTP);
router.post("/resetpassword/:token", resetPassword);
router.post("/resendverification", resendVerification);
router.get("/verify", verifyEmail);
router.get("/search", searchUsers);

export default router;
