import Job from "../../models/job.model.js";

export const searchJobs = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({ success: true, jobs: [] });
    }
    
    // Get all jobs with company data
    const allJobs = await Job.find().populate('company');
    const searchResults = [];
    const searchTerm = q.toLowerCase();
    
    // Linear search implementation
    for (let i = 0; i < allJobs.length; i++) {
      const job = allJobs[i];
      
      // Check multiple fields
      const titleMatch = job.title.toLowerCase().includes(searchTerm);
      const descMatch = job.description.toLowerCase().includes(searchTerm);
      const locationMatch = job.location.toLowerCase().includes(searchTerm);
      const companyMatch = job.company?.name?.toLowerCase().includes(searchTerm);
      
      if (titleMatch || descMatch || locationMatch || companyMatch) {
        searchResults.push(job);
      }
    }
    
    res.json({ success: true, jobs: searchResults });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};