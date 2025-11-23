import { seedJobsAndRecommendations } from "../../utils/seedData.js";
import User from "../../models/user.model.js";

export const seedDataForUser = async (req, res) => {
  try {
    const userId = req.id;
    
    const user = await User.findById(userId).populate('resume');
    
    if (!user.resume) {
      return res.status(400).json({
        message: "Please upload a resume first to generate recommendations",
        success: false,
        error: true
      });
    }

    const result = await seedJobsAndRecommendations(userId, user.resume._id);
    
    res.status(200).json({
      message: "Sample data created successfully!",
      data: result,
      success: true,
      error: false
    });

  } catch (error) {
    console.error("Error seeding data:", error);
    res.status(500).json({
      message: "Error creating sample data",
      error: true,
      success: false
    });
  }
};