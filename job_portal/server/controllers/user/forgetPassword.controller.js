import { User } from '../../models/user.model.js';

import transporter from '../../middleware/emailSender.js';
import bcrypt from 'bcryptjs';
import crypto from "crypto"


export const requestPasswordReset = async (req, res) => {
  try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ message: "Email is required" });

      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "No account found with this email" });

      const token = user.generatePasswordResetToken();
      await user.save();

      const resetURL = `${process.env.FRONTEND_URL}/verify-reset-password?token=${token}`;

      // Send email with the reset link
      await transporter.sendMail({
          from: "noreply@yourdomain.com",
          to: email,
          subject: "Password Reset Request",
          html: `
              <h2>Password Reset Request</h2>
              <p>Click the link below to reset your password:</p>
              <a href="${resetURL}" style="background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
              <p>This link will expire in 10 minutes.</p>
              <p>If you didn't request this, please ignore this email.</p>
          `,
      });

      res.status(200).json({ message: "Password reset link sent to email" });
  } catch (error) {
      console.error("Password reset request error:", error);
      res.status(500).json({ message: "Server error" });
  }
};

export const verifyResetToken = async (req, res) => {
  try {
     const {token} = req.query

     if (!token) {
      return res.status(400).json({ message: "Reset token is required" });
    }
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(404).json({ message: "Invalid or expired reset token" });
    }


    // If token is valid, send response to allow the user to reset their password
    res.status(200).json({
      message: "Reset token is valid. You can now reset your password.",
      redirectUrl: `${process.env.FRONTEND_URL}/verify-reset-password?token=${token}`
    });


  } catch (error) {
      console.error("Token verification error:", error);
      res.status(500).json({ message: "Server error" });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { token } = req.query;
      
    if (!token) return res.status(400).json({ message: "Reset token is required" });
    if (!newPassword) return res.status(400).json({ message: "New password is required" });
    
    // Find the user with this token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() } // Must not be expired
    });
    
    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'Invalid or expired reset token' });
    }
    
    
    // Hash the new password before saving it
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update the user's password
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;  // Clear the reset token
    user.resetPasswordExpires = undefined;  // Clear the reset token expiry
    
    // Save the updated user object to the database
    await user.save();
    
    // Send success response
    return res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

