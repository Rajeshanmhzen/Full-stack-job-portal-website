import Job from '../../models/job.model.js';
import { Company } from '../../models/company.model.js';

const jobTemplates = [
  {
    title: "Frontend Developer",
    description: "We are looking for a skilled Frontend Developer to join our team.",
    requirement: ["React.js", "JavaScript", "HTML", "CSS", "TypeScript"],
    salary: 800000,
    experienceLevel: "Mid Level",
    type: "Full-time",
    position: "2"
  },
  {
    title: "Backend Developer", 
    description: "Looking for an experienced Backend Developer to build scalable APIs.",
    requirement: ["Node.js", "Express.js", "MongoDB", "REST API", "JavaScript"],
    salary: 850000,
    experienceLevel: "Mid Level",
    type: "Full-time",
    position: "2"
  },
  {
    title: "UI/UX Designer",
    description: "Creative UI/UX Designer needed to design intuitive user interfaces.",
    requirement: ["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research"],
    salary: 750000,
    experienceLevel: "Mid Level", 
    type: "Full-time",
    position: "1"
  },
  {
    title: "Project Manager",
    description: "Experienced Project Manager needed to lead cross-functional teams.",
    requirement: ["Project Management", "Agile", "Scrum", "JIRA", "Team Leadership"],
    salary: 1200000,
    experienceLevel: "Senior Level",
    type: "Full-time",
    position: "1"
  }
];

export const seedJobs = async (req, res) => {
  try {
    const companies = await Company.find();
    
    if (companies.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No companies found. Please create companies first."
      });
    }

    await Job.deleteMany({});
    
    const jobs = [];
    
    for (const company of companies) {
      const selectedJobs = jobTemplates.slice(0, 3);
      
      for (const jobTemplate of selectedJobs) {
        const job = {
          ...jobTemplate,
          company: company._id,
          location: company.location || "Kathmandu",
          created_by: company.userId
        };
        jobs.push(job);
      }
    }
    
    const insertedJobs = await Job.insertMany(jobs);
    
    res.status(200).json({
      success: true,
      message: `Successfully created ${insertedJobs.length} jobs`,
      jobsCount: insertedJobs.length
    });
    
  } catch (error) {
    console.error('Error seeding jobs:', error);
    res.status(500).json({
      success: false,
      message: "Failed to seed jobs",
      error: error.message
    });
  }
};