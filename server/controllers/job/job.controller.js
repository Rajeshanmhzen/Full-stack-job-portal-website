import Job from "../../models/job.model.js";
import cache from "../../utils/cache.js";

export const searchJobs = async (req, res) => {
  try {
    const { 
      q, 
      page = 1, 
      limit = 20, 
      sortBy = 'createdAt',
      location,
      type,
      minSalary,
      maxSalary 
    } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({ success: true, jobs: [], total: 0 });
    }

    // Create cache key
    const cacheKey = cache.generateKey('job_search', { q, page, limit, sortBy, location, type, minSalary, maxSalary });
    
    // Check cache first
    const cachedResult = await cache.get(cacheKey);
    if (cachedResult) {
      return res.json({ ...cachedResult, cached: true });
    }

    // Optimized MongoDB query
    const searchQuery = {
      $and: [
        {
          $or: [
            { title: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { location: { $regex: q, $options: 'i' } }
          ]
        },
        location && { location: { $regex: location, $options: 'i' } },
        type && { type },
        minSalary && { salary: { $gte: +minSalary } },
        maxSalary && { salary: { $lte: +maxSalary } }
      ].filter(Boolean)
    };
    
    const sortOptions = {
      'createdAt': { createdAt: -1 },
      'applications': { applicationCount: -1 },
      'salary': { salary: -1 },
      'recent_applications': { lastApplicationDate: -1 }
    };

    // Use simple find with populate (more reliable)
    const [jobs, totalResult] = await Promise.all([
      Job.find(searchQuery)
        .populate('company', 'name logo location')
        .sort(sortOptions[sortBy] || { createdAt: -1 })
        .skip((page - 1) * parseInt(limit))
        .limit(parseInt(limit)),
      Job.countDocuments(searchQuery)
    ]);

    const result = {
      success: true,
      jobs,
      total: totalResult,
      page: parseInt(page),
      totalPages: Math.ceil(totalResult / limit),
      cached: false
    };

    // Cache the result for 5 minutes
    await cache.set(cacheKey, result, 300);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};
