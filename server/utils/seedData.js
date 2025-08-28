import Job from "../models/job.model.js";
import { Company } from "../models/company.model.js";
import { Recommendation } from "../models/recommendation.model.js";

export const seedJobsAndRecommendations = async (userId, resumeId) => {
  try {
    // Create sample companies
    const companies = await Company.insertMany([
      {
        name: "TechCorp Solutions",
        description: "Leading technology company",
        website: "https://techcorp.com",
        location: "Kathmandu, Nepal"
      },
      {
        name: "Digital Innovations",
        description: "Digital transformation experts",
        website: "https://digitalinnovations.com",
        location: "Pokhara, Nepal"
      },
      {
        name: "StartupHub",
        description: "Fast-growing startup",
        website: "https://startuphub.com",
        location: "Lalitpur, Nepal"
      }
    ]);

    // Create sample jobs
    const jobs = await Job.insertMany([
      {
        title: "Backend Developer",
        description: "We are looking for an experienced backend developer to join our team. You will work with Node.js, Express, and MongoDB to build scalable applications.",
        requirements: ["Node.js", "Express", "MongoDB", "REST APIs"],
        location: "Kathmandu",
        type: "Full-time",
        experienceLevel: "Mid-level",
        salary: 80000,
        company: companies[0]._id,
        createdBy: userId
      },
      {
        title: "Full Stack Developer",
        description: "Join our dynamic team as a full stack developer. Work with React, Node.js, and modern web technologies to create amazing user experiences.",
        requirements: ["React", "Node.js", "JavaScript", "MongoDB"],
        location: "Pokhara",
        type: "Full-time",
        experienceLevel: "Senior",
        salary: 120000,
        company: companies[1]._id,
        createdBy: userId
      },
      {
        title: "Software Engineer",
        description: "We're seeking a talented software engineer to develop innovative solutions. Experience with modern programming languages and frameworks required.",
        requirements: ["JavaScript", "Python", "Git", "Agile"],
        location: "Lalitpur",
        type: "Full-time",
        experienceLevel: "Entry-level",
        salary: 60000,
        company: companies[2]._id,
        createdBy: userId
      },
      {
        title: "Frontend Developer",
        description: "Create beautiful and responsive user interfaces using React, Vue.js, and modern CSS frameworks.",
        requirements: ["React", "Vue.js", "CSS", "JavaScript"],
        location: "Kathmandu",
        type: "Part-time",
        experienceLevel: "Mid-level",
        salary: 70000,
        company: companies[0]._id,
        createdBy: userId
      },
      {
        title: "DevOps Engineer",
        description: "Manage our cloud infrastructure and deployment pipelines. Experience with AWS, Docker, and Kubernetes preferred.",
        requirements: ["AWS", "Docker", "Kubernetes", "CI/CD"],
        location: "Remote",
        type: "Full-time",
        experienceLevel: "Senior",
        salary: 150000,
        company: companies[1]._id,
        createdBy: userId
      }
    ]);

    // Create recommendations for the user
    const recommendations = await Recommendation.insertMany([
      {
        user: userId,
        resume: resumeId,
        job: jobs[0]._id,
        score: 85,
        matchingReason: "Your backend development experience matches this position perfectly"
      },
      {
        user: userId,
        resume: resumeId,
        job: jobs[1]._id,
        score: 78,
        matchingReason: "Your full stack skills align well with this role"
      },
      {
        user: userId,
        resume: resumeId,
        job: jobs[2]._id,
        score: 65,
        matchingReason: "Your programming experience matches this software engineer position"
      },
      {
        user: userId,
        resume: resumeId,
        job: jobs[3]._id,
        score: 72,
        matchingReason: "Your frontend development skills are a good match"
      },
      {
        user: userId,
        resume: resumeId,
        job: jobs[4]._id,
        score: 45,
        matchingReason: "Some of your technical skills align with this DevOps role"
      }
    ]);

    console.log(`Created ${companies.length} companies, ${jobs.length} jobs, and ${recommendations.length} recommendations`);
    
    return {
      companies: companies.length,
      jobs: jobs.length,
      recommendations: recommendations.length
    };

  } catch (error) {
    console.error("Error seeding data:", error);
    throw error;
  }
};