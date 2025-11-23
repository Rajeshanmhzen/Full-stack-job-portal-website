import { Recommendation } from "../models/recommendation.model.js";
import Job from "../models/job.model.js";

export const cleanupOrphanedRecommendations = async () => {
  try {
    console.log("Starting cleanup of orphaned recommendations...");
    
    // Get all recommendations
    const recommendations = await Recommendation.find();
    
    // Check which jobs still exist
    const jobIds = recommendations.map(rec => rec.job);
    const existingJobs = await Job.find({ _id: { $in: jobIds } }).select('_id');
    const existingJobIds = existingJobs.map(job => job._id.toString());
    
    // Find orphaned recommendations
    const orphanedRecs = recommendations.filter(rec => 
      !existingJobIds.includes(rec.job.toString())
    );
    
    if (orphanedRecs.length > 0) {
      await Recommendation.deleteMany({ 
        _id: { $in: orphanedRecs.map(rec => rec._id) } 
      });
      console.log(`Cleaned up ${orphanedRecs.length} orphaned recommendations`);
    } else {
      console.log("No orphaned recommendations found");
    }
    
    return { cleaned: orphanedRecs.length };
  } catch (error) {
    console.error("Error cleaning up recommendations:", error);
    throw error;
  }
};