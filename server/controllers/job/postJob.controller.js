import Job from "../../models/job.model.js";
import { Recommendation } from "../../models/recommendation.model.js";
import { Resume } from "../../models/resume.js";
import { getJobRecommendations } from "../resume/resume.controller.js";
import { createNotification } from "../notification/notification.controller.js";

export const postJob = async(req, res) => {
    try {
        const {title, description, requirement, salary, jobType, experience, position, location, companyId} = req.body
        const userId = req.id;
        
        if(!title) {
            throw new Error("Please provide title")
        }
        if(!description) {
            throw new Error("Please provide description")
        }
        if(!requirement) {
            throw new Error("Please provide requirement")
        }
        if(!salary) {
            throw new Error("Please provide salary")
        }
        if(!jobType) {
            throw new Error("Please provide jobType")
        }
        if(!experience) {
            throw new Error("Please provide experience")
        }
        if(!position) {
            throw new Error("Please provide position")
        }
        
        const job = await Job.create({
            title, 
            description, 
            requirement: requirement.split(","),
            salary: Number(salary), 
            type: jobType, 
            experienceLevel: experience,
            position,
            company: companyId,
            location,
            created_by: userId
        })
        
        await job.populate('company', 'name logo');
        
        // Generate recommendations for all users with resumes
        const resumes = await Resume.find().populate('user');
        console.log(`Found ${resumes.length} resumes to check for recommendations`);

        for(const resume of resumes) {
            try {
                // Create a single job array for recommendation scoring
                const singleJobRecommendations = await getJobRecommendations(resume);
                const jobRecommendation = singleJobRecommendations.find(r => 
                    r.job && r.job._id && r.job._id.toString() === job._id.toString()
                );
                
                if(jobRecommendation && jobRecommendation.score >= 30) {
                    // Check if recommendation already exists
                    const existingRec = await Recommendation.findOne({
                        user: resume.user._id,
                        job: job._id
                    });
                    
                    if (!existingRec) {
                        await Recommendation.create({
                            user: resume.user._id,
                            resume: resume._id,
                            job: job._id,
                            score: jobRecommendation.score,
                            matchingReason: jobRecommendation.matchingReason,
                        });
                        
                        await createNotification(
                            resume.user._id, 
                            `New job recommendation: ${title} at ${job.company?.name || 'Company'} (${jobRecommendation.score}% match)`
                        );
                        
                        console.log(`Created recommendation for user ${resume.user._id} with score ${jobRecommendation.score}`);
                    }
                }
            } catch (error) {
                console.error(`Error creating recommendation for user ${resume.user._id}:`, error);
            }
        }
        
        return res.status(201).json({
            message: "Job Created Successfully!",
            job,
            error: false,
            success: true
        })
    } catch(err) {
        res.status(400).json({  
            message: err.message || err,
            error: true,
            success: false,
        })
    }
}