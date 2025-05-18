import { Resume } from "../../models/resume.js";
import { Job } from "../../models/job.model.js";
import { 
  extractDetail, 
  extractTextFromDocx, 
  extractTextFromPdf, 
  calculateSimilarity 
} from "../../utils/resumeParser.js";
import  User  from "../../models/user.model.js";

// Upload resume and parse the content
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
        success: false,
        error: true
      });
    }

    let extractedText = "";
    // Fix the typo in mimetype
    if (req.file.mimetype === "application/pdf") {
      extractedText = await extractTextFromPdf(req.file.path);
    } else if (req.file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      extractedText = await extractTextFromDocx(req.file.path);
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

    const details = extractDetail(extractedText);
    
    const resume = new Resume({...details, user:req.id})
    await resume.save()

    await User.findByIdAndUpdate(req.id, {resume:resume._id})
    
    // Get job recommendations
    const recommendations = await getJobRecommendations(resume);

    res.status(201).json({
      message: "Resume uploaded successfully!",
      // resume: newResume,
      resume: resume,
      recommendations,
      error: false,
      success: true
    });

  } catch (error) {
    console.error("Error uploading resume:", error);
    res.status(500).json({
      message: "Error uploading resume",
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