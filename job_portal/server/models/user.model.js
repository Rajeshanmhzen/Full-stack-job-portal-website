import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: String,
  email: { type: String, unique: true },
  password: {
    type: String,
    required: true,
  },
  location:String,
  experienceYears:Number,
  banner:String,
  skills:[String],

  role: {
    type: String,
    enum: ["worker", "recruiter"],
    required: true,
  },
  profilePic:String,
  isVerified : {
    type:Boolean,
    default : false
},
experience: [
    {
      role: String,
      company: String,
      location: String,
      description: String,
      startDate: String,
      endDate: String,
      logo: String
    }
  ],
  certifications: [
    {
      title: String,
      organization: String,
      issueDate: String,
      certificateId: String,
      logo: String
    }
  ],
  failedAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
  resume: { type: mongoose.Schema.Types.ObjectId, ref: "Resume" },
});

// Comprehensive user indexing
userSchema.index({
  fullname: "text",
  skills: "text",
  location: "text"
}, {
  weights: {
    fullname: 10,
    skills: 5,
    location: 3
  }
});

// Individual field indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ location: 1 });
userSchema.index({ experienceYears: 1 });
userSchema.index({ skills: 1 });
userSchema.index({ isVerified: 1 });

// Compound indexes
userSchema.index({ role: 1, location: 1 });
userSchema.index({ role: 1, experienceYears: 1 });

const User = mongoose.model("User", userSchema);
export default User;
