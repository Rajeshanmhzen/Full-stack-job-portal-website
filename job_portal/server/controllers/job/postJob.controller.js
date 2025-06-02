import { Job } from "../../models/job.model.js";

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
        
        return res.status(201).json({
            message: "Job Created Successfully!",
            job,
            error: false,
            success: true
        })
    } catch(err) {
        res.status(400).json({  // Changed from 404 to 400 for validation errors
            message: err.message || err,
            error: true,
            success: false,
        })
    }
}