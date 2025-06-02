import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  resume: { type: mongoose.Schema.Types.ObjectId, ref: "Resume" },
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  score: Number,
  matchingReason: String,
  notified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const Recommendation = mongoose.model("Recommendation", recommendationSchema);