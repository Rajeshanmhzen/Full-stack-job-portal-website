import User from "../../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Token from "../../models/token.model.js";
import crypto from "crypto";
import emailSender from "../../middleware/emailSender.js";
import { createNotification } from "../notification/notification.controller.js";

export const register = async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      throw new Error("Already user exits.");
    }

    if (!email) {
      throw new Error("Please provide email");
    }
    if (!password) {
      throw new Error("Please provide password");
    }
    if (password.length < 7) {
      throw new Error("password mus contain atleast 7 char");
    }
    if (!fullname) {
      throw new Error("Please provide fullname");
    }
    if (!role) {
      throw new Error("Please provide role");
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hashSync(password, salt);

    if (!hashPassword) {
      throw new Error("Something is wrong");
    }

    const payload = {
      ...req.body,
      password: hashPassword,
    };

    const userData = new User(payload);
    const saveUser = await userData.save();
    saveUser.password = undefined;

    res.status(201).json({
      data: saveUser,
      success: true,
      error: false,
      message: "User created Successfully!",
    });
  } catch (err) {
    res.json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email) {
      throw new Error("Please provide email");
    }
    if (!password) {
      throw new Error("Please provide password");
    }
    if (!role) {
      throw new Error("Please provide role");
    }
    if (password.length < 7) {
      throw new Error("password mus contain atleast 7 char");
    }

    let user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }
    if (role !== user.role) {
      throw new Error("Account doesn't exists with this current role");
    }

    if (user.lockUntil && user.lockUntil > Date.now()) {
      const remainingTime = (user.lockUntil - Date.now()) / 1000; // remaining lock time in seconds
      return res.status(400).json({
        message: `Account is locked. Please try again in ${Math.ceil(
          remainingTime
        )} seconds.`,
        success: false,
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (checkPassword) {
      // Reset failedAttempts and lockUntil after successful login
      user.failedAttempts = 0;
      user.lockUntil = null;

      // Save the updated user record
      await user.save();

      const tokenData = {
        userId: user._id,
        email: user.email,
        verifed: user.verified,
        role: user.role,
      };

      const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {
        expiresIn: "1d",
      });

      user = {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
      };

      res
        .cookie("token", token, {
          maxAge: 1 * 24 * 60 * 60 * 1000,
          httpsOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        })
        .status(200)
        .json({
          message: `Welcome back ${user.fullname}`,
          user,
          success: true,
          error: false,
        });

      return;
    } else {
      user.failedAttempts += 1;

      // const lockTimes = [30, 3 * 60, 5 * 60, 10 * 60];
      const lockTimes = [1, 5]; //this is for the testing to show the implement of locktime
      const maxAttempts = lockTimes.length;

      let lockTime = 0;

      for (let i = 0; i < maxAttempts; i++) {
        if (user.failedAttempts <= (i + 1) * 3) {
          lockTime = lockTimes[i];
          break;
        }
      }

      if (user.failedAttempts > maxAttempts * 3) {
        lockTime = lockTimes[maxAttempts - 1]; // After 12 attempts, use the max lock time
      }

      // Apply lock time based on failed attempts
      if (lockTime > 0) {
        user.lockUntil = Date.now() + lockTime * 1000; // Lock until updated
      }

      await user.save();

      return res.status(400).json({
        message: `Incorrect password. Attempt ${user.failedAttempts}/3. Please try again after the lock period ${lockTime}s.`,
        success: false,
      });
    }
  } catch (err) {
    res.json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};
export const verifyEmail = async (req, res) => {
  let tokenObj = await Token.findOne({ token: req.params.token });
  if (!tokenObj) {
    return res
      .status(400)
      .json({ error: "Invalid toke or token may be expired!" });
  }
  let user = await User.findById(tokenObj.user);
  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }
  if (user.isVerified) {
    return res
      .status(400)
      .json({ error: " user already verified.Login to continue " });
  }
  user.isVerified = true;
  user = await user.save();
  if (!user) {
    return res.status(400).json({ error: "something went wrong" });
  }
  res.send({ message: "user verified successfully" });
};
export const forgetPassword = async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ error: "Email not registered" });
  }
  const otpCode = Math.floor(100000 + Math.random() * 900000);
  let tokenObj = await Token.create({
    token: crypto.randomBytes(16).toString("hex"),
    otp: otpCode.toString(),
    user: user._id,
  });
  const URL = `${process.env.FRONTEND_URL}/resetpassword/${tokenObj.token}`;
  emailSender({
    from: "noreply@somthing.com",
    to: req.body.email,
    subject: "password reset email",
    text: "Click on the following link to reset the password",
    html: `
         <p>You can reset your password using either of the following methods:</p>
    <ul>
      <li><strong>Link:</strong> <a href="${URL}">verify</a></li>
      <li><strong>OTP Code:</strong> ${otpCode}</li>
    </ul>
    <p>This link/code will expire in 10 minutes.</p>
        `,
  });
  res.send({
    message: "password reset link has been sent to you your email.",
    token: tokenObj.token,
  });
};
export const verifyResetOTP = async (req, res) => {
  const { token } = req.params;
  const { otp } = req.body;

  const tokenDoc = await Token.findOne({ token, otp }).populate("user");

  if (!tokenDoc) {
    return res.status(400).json({ error: "Invalid token or OTP" });
  }

  // Optional: Mark token as verified (if you want to persist state)
  tokenDoc.verified = true;
  await tokenDoc.save();

  res.json({
    message: "OTP verified successfully. You may now reset your password.",
  });
};
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const tokenDoc = await Token.findOne({ token }).populate("user");

  if (!tokenDoc || !tokenDoc.verified) {
    return res
      .status(400)
      .json({ error: "Token not verified. OTP is required." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  tokenDoc.user.password = hashedPassword;
  await tokenDoc.user.save();

  await Token.deleteOne({ _id: tokenDoc._id });

  res.json({ message: "Password reset successfully." });
};
export const resendVerification = async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ error: "email is not registered" });
  }
  if (user.isVerified) {
    return res.status(400).json({ error: "user is already verified" });
  }
  await Token.deleteMany({ user: user._id });
  const otpCode = Math.floor(100000 + Math.random() * 900000);
  let tokenObj = await Token.create({
    token: crypto.randomBytes(16).toString("hex"),
    otp: otpCode.toString(),
    user: user._id,
  });
  const URL = `${process.env.FRONTEND_URL}/resetpassword/${tokenObj.token}`;

  emailSender({
    from: "noreply@somthing.com",
    to: req.body.email,
    subject: "password reset email",
    text: "Click on the following link to reset the password",
    html: `
         <p>You can reset your password using either of the following methods:</p>
    <ul>
      <li><strong>Link:</strong> <a href="${URL}">verify</a></li>
      <li><strong>OTP Code:</strong> ${otpCode}</li>
    </ul>
    <p>This link/code will expire in 10 minutes.</p>
        `,
  });
  res.send({
    message: "verification link has been send to your email",
    token: tokenObj.token,
  });
};
export const getUserDetail = async (req, res) => {
  try {
    const userId = req.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    res.status(200).json({
      message: "User retrieved successfully",
      user,
      error: false,
      success: true,
    });
  } catch (err) {
    res.status(400).json({
      message: "NO user Found with this Id" || err,
      error: true,
      success: false,
    });
  }
};
export const changePassword = async (req, res) => {
  try {
    const userId = req.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Both current and new passwords are required.",
        success: false,
        error: true,
      });
    }

    if (newPassword.length < 7) {
      return res.status(400).json({
        message: "New password must be at least 7 characters.",
        success: false,
        error: true,
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
        error: true,
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect.",
        success: false,
        error: true,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    await createNotification(userId, "Your password was changed successfully.");

    return res.status(200).json({
      message: "Password changed successfully.",
      success: true,
      error: false,
    });

  } catch (err) {
    console.error("Password change error:", err.message);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
      error: true,
    });
  }
};
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.send({ message: "Logout successfully", success: true, error: false });
};
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const userId = req.id;

    let user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found.", success: false });
    }

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skills.split(",");
    if (req.file) user.profilePic = req.file.filename; // ← update profilePic

    await user.save();
    await createNotification(userId, "Your profile was changed successfully")
    res.status(200).json({
      message: "Profile updated successfully.",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        profilePic: user.profilePic,
      },
      success: true,
    });
    
  } catch (err) {
    res.status(500).json({
      message: err.message || "Error updating user information",
      success: false,
    });
  }
};
export const searchCandidates = async (req, res) => {
  const {
    q = "",
    name = "",
    location = "",
    minExperience,
    maxExperience,
    page = 1,
    limit = 20,
    sort = "-createdAt",
  } = req.query;

  // Start filter with fixed role
  const filter = { role: "worker" };

  if (q) filter.$text = { $search: q };

  // 🔑 NAME SEARCH (partial, case‑insensitive)
  if (name) {
    const cleanName = name.trim();
    if (cleanName.length) filter.fullname = new RegExp(cleanName, "i");
  }

  if (location) filter.location = new RegExp(location.trim(), "i");
  if (minExperience) filter.experienceYears = {
    ...filter.experienceYears,
    $gte: +minExperience,
  };
  if (maxExperience) filter.experienceYears = {
    ...filter.experienceYears,
    $lte: +maxExperience,
  };

  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 20;

  try {
    const users = await User.find(filter)
      .sort(sort)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const total = await User.countDocuments(filter);

    res.json({
      candidates: users,
      total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
export const searchUsers = async(req,res)=> {
  try {
    const {q} = req.query
    if(!q || q.length < 2) {
      return res.json({
        success:true, users:[]
      })
    }
    // get alll user (exclude sensitive data)
    const allUsers = await User.find({}, 'fullname email role location profilepic');
    const resultResults = []
    const searchTerm = q.toLowerCase();

    // linear search implement
    for(let i =0; i<allUsers.length; i++) {
      const user = allUsers[i];
      const nameMatch = user.fullname.toLowerCase().includes(searchTerm)
      const roleMatch = user.role.toLowerCase().includes(searchTerm)
      const locationMatch = user.location.toLowerCase().includes(searchTerm)
      
      if (nameMatch || roleMatch || locationMatch) {
        searchResults.push(user);
      }
    }
     res.json({ success: true, users: searchResults });
  } catch (err) {
    res.json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
}
