import mongoose from "mongoose";
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        enum: ["worker", "recruiter"],
        required: true
    },
    resetPasswordToken: { 
        type: String, 
        select: false },
    resetPasswordExpires: { 
        type: Date, 
        select: false 
    },
    failedAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
    profile: {
        bio: { type: String },
        skills: [{ type: String }],
        resume: { type: String },
        resumeOriginName: { type: String },
        company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
        profilePhoto: {
            type: String,
            default: ""
        }
    },

}, { timestamps: true });

userSchema.methods.generatePasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 10 min expiry
    return resetToken;
};
export const User = mongoose.model("User", userSchema);
