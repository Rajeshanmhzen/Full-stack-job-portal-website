import { Resume } from "../../models/resume.js";
import { Job } from "../../models/job.model.js";
import { 
  extractDetail, 
  extractTextFromDocx, 
  extractTextFromPdf, 
  calculateSimilarity 
} from "../../utils/resumeParser.js";
import  User  from "../../models/user.model.js";
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { Recommendation } from "../../models/recommendation.model.js";


export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No new file uploaded",
        success: false,
        error: true
      });
    }

    const userId = req.id;
    const newFilePath = req.file.path;
    const newFilename = req.file.filename;
    const mimeType = req.file.mimetype;

    let extractedText = "";

    if (mimeType === "application/pdf") {
      extractedText = await extractTextFromPdf(newFilePath);
    } else if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      extractedText = await extractTextFromDocx(newFilePath);
    } else {
      return res.status(400).json({
        message: "Unsupported file format",
        success: false,
        error: true
      });
    }

    if (!extractedText) {
      return res.status(400).json({
        message: "Failed to extract text from file",
        success: false,
        error: true
      });
    }

    // Get previous resume
    const user = await User.findById(userId).populate('resume');
    const oldResume = user.resume;

    // Delete old file from disk if it exists
    if (oldResume?.filename) {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const oldFilePath = path.join(__dirname, '../../uploads/resumes', oldResume.filename);

      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath); // delete old resume file
      }
    }

    const newDetails = extractDetail(extractedText, newFilename);

    let updatedResume;

    if (oldResume) {
      updatedResume = await Resume.findByIdAndUpdate(
        oldResume._id,
        { ...newDetails, filename: newFilename },
        { new: true }
      );
    } else {
      updatedResume = new Resume({ ...newDetails, user: userId, filename: newFilename });
      await updatedResume.save();
      await User.findByIdAndUpdate(userId, { resume: updatedResume._id });
    }

    // Get fresh job recommendations
    const recommendations = await getJobRecommendations(updatedResume);

    for(const r of recommendations) {
      await Recommendation.create({
        user:userId,
        resume:updatedResume._id,
        job:r.job._id,
        score:r.score,
        matchingReason:r.matchingReason
      })
    }
    
    res.status(200).json({
      message: "Resume updated successfully!",
      resume: updatedResume,
      recommendations,
      success: true,
      error: false
    });

  } catch (error) {
    console.error("Error updating resume:", error);
    res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false
    });
  }
};

// Get job recommendations based on a resume
export const getJobRecommendations = async (resumeData) => {
  try {
    // Find all available jobs
    const jobs = await Job.find();
    const scoredJobs = [];
    
    // Get job titles from resume for quick matching
    const resumeJobTitles = resumeData.jobTitles.map(title => title.toLowerCase());
    const resumeSkills = resumeData.skills.map(skill => skill.toLowerCase());
    
    for (const job of jobs) {
      let score = 0;
      const jobTitle = job.title.toLowerCase();
      const jobLocation = job.location.toLowerCase();
      const jobSkills = job.requiredSkills ? job.requiredSkills.map(skill => skill.toLowerCase()) : [];
      const jobDescription = job.description.toLowerCase();
      
      // Title matching (strongest signal)
      for (const title of resumeJobTitles) {
        if (jobTitle.includes(title) || title.includes(jobTitle)) {
          score += 40; // High weight for title match
          break;
        }
      }
      
      // Location matching
      if (resumeData.location && jobLocation) {
        const resumeLocationLower = resumeData.location.toLowerCase();
        if (jobLocation.includes(resumeLocationLower) || resumeLocationLower.includes(jobLocation)) {
          score += 30; // Location is important
        }
      }
      
      // Skills matching
      if (resumeSkills.length > 0 && jobSkills.length > 0) {
        const matchingSkills = resumeSkills.filter(skill => 
          jobSkills.some(jobSkill => jobSkill.includes(skill) || skill.includes(jobSkill))
        );
        score += (matchingSkills.length / Math.max(resumeSkills.length, jobSkills.length)) * 20;
      }
      
      // Content similarity (as a fallback)
      const contentSimilarity = calculateSimilarity(resumeData.content, job.description);
      score += contentSimilarity * 10;
      
      // Normalize score to 0-100 range
      score = Math.min(Math.round(score), 100);
      
      scoredJobs.push({
        job,
        score,
        matchingReason: getMatchingReason(score, resumeJobTitles, jobTitle, resumeSkills, jobSkills)
      });
    }
    
    // Sort by score descending
    scoredJobs.sort((a, b) => b.score - a.score);
    
    // Return top 10 recommendations
    return scoredJobs.slice(0, 10);
  } catch (error) {
    console.error("Error getting job recommendations:", error);
    return [];
  }
};

// Generate a human-readable reason for the match
const getMatchingReason = (score, resumeTitles, jobTitle, resumeSkills, jobSkills) => {
  if (score < 20) return "Low match based on general profile";
  
  const reasons = [];
  
  // Check for title match
  for (const title of resumeTitles) {
    if (jobTitle.includes(title) || title.includes(jobTitle)) {
      reasons.push(`Your experience as ${title} matches this position`);
      break;
    }
  }
  
  // Check for skills match
  const matchingSkills = resumeSkills.filter(skill => 
    jobSkills.some(jobSkill => jobSkill.includes(skill) || skill.includes(jobSkill))
  );
  
  if (matchingSkills.length > 0) {
    if (matchingSkills.length <= 3) {
      reasons.push(`You have matching skills: ${matchingSkills.join(', ')}`);
    } else {
      reasons.push(`You have ${matchingSkills.length} matching skills for this position`);
    }
  }
  
  // If no specific reason found
  if (reasons.length === 0) {
    reasons.push("Your overall profile matches this position");
  }
  
  return reasons.join(". ");
};

// Keyword search functionality
export const keywordSearch = async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.status(400).json({
        message: "Keyword is required",
        success: false,
        error: true
      });
    }
    
    // Find resumes that contain the keyword
    const resumes = await Resume.find({
      $or: [
        { content: { $regex: keyword, $options: 'i' } },
        { name: { $regex: keyword, $options: 'i' } },
        { location: { $regex: keyword, $options: 'i' } },
        { jobTitles: { $regex: keyword, $options: 'i' } },
        { skills: { $regex: keyword, $options: 'i' } }
      ]
    });
    
    // Simple manual ranking without NLP libraries
    const scoredResumes = resumes.map(resume => {
      // Count occurrences of keyword
      const keywordRegex = new RegExp(keyword, 'gi');
      const contentMatches = (resume.content.match(keywordRegex) || []).length;
      
      // Check if keyword matches important fields exactly
      let score = contentMatches; 
      
      // Add points for exact matches in important fields
      if (resume.name.toLowerCase().includes(keyword.toLowerCase())) score += 10;
      if (resume.location.toLowerCase().includes(keyword.toLowerCase())) score += 5;
      if (resume.jobTitles.some(title => title.toLowerCase().includes(keyword.toLowerCase()))) score += 8;
      if (resume.skills.some(skill => skill.toLowerCase().includes(keyword.toLowerCase()))) score += 7;
      
      return { resume, score };
    });
    
    // Sort by score
    scoredResumes.sort((a, b) => b.score - a.score);
    
    res.json({
      results: scoredResumes.map(item => item.resume),
      count: scoredResumes.length,
      success: true,
      error: false
    });
  } catch (error) {
    console.error("Error searching resumes:", error);
    res.status(500).json({ 
      message: "Error searching resumes", 
      error: true,
      success: false
    });
  }
};

export const getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find();
    res.status(200).json({
      resumes,
      count: resumes.length,
      error: false,
      success: true
    });
  } catch (error) {
    console.error("Error fetching resumes:", error);
    res.status(500).json({
      message: "Error while fetching resumes",
      error: true,
      success: false
    });
  }
};

// Get resumes by specific user ID
export const getResumesByUserID = async (req, res) => {
  try {
    const userId = req.id;

    const userResumes = await Resume.find({ user: userId });

    if (userResumes.length === 0) {
      return res.status(404).json({
        message: "No resumes found for this user",
        error: true,
        success: false
      });
    }

    res.status(200).json({
      resumes: userResumes,
      count: userResumes.length,
      success: true,
      error: false
    });

  } catch (error) {
    console.error("Error fetching resumes for user:", error);
    res.status(500).json({
      message: "Server error while fetching user's resumes",
      error: true,
      success: false
    });
  }
};

export const downloadResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.id });

    if (!resume || !resume.filename) {
      return res.status(404).json({
        message: "Resume not found",
        success: false,
        error: true
      });
    }

    const filePath = path.resolve("uploads/resumes", resume.filename);

    res.download(filePath, resume.filename, (err) => {
      if (err) {
        console.error("Download error:", err);
        return res.status(500).json({
          message: "Error downloading resume",
          success: false,
          error: true
        });
      }
    });

  } catch (err) {
    console.error("Error in downloadResume:", err);
    res.status(500).json({
      message: "Server error while downloading",
      success: false,
      error: true
    });
  }
};