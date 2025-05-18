import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: String,
  email: { type: String, unique: true },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["worker", "recruiter"],
    required: true,
  },
  isVerified : {
    type:Boolean,
    default : false
},
  failedAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
  resume: { type: mongoose.Schema.Types.ObjectId, ref: "Resume" },
});

const User = mongoose.model("User", userSchema);
export default User
