import User from "../../models/user.model.js";

export const searchUsers = async (req, res) => {
  try {
    const { q, role, location, page = 1, limit = 10 } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({ success: true, users: [], total: 0 });
    }

    const searchQuery = {
      $and: [
        {
          $or: [
            { fullname: { $regex: q, $options: 'i' } },
            { skills: { $regex: q, $options: 'i' } },
            { location: { $regex: q, $options: 'i' } }
          ]
        },
        role && { role },
        location && { location: { $regex: location, $options: 'i' } },
        { isVerified: true }
      ].filter(Boolean)
    };

    const [users, total] = await Promise.all([
      User.find(searchQuery)
        .select('fullname email role profilePic location skills experienceYears')
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ fullname: 1 }),
      User.countDocuments(searchQuery)
    ]);

    res.json({
      success: true,
      users,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching users'
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId)
      .select('-password -failedAttempts -lockUntil')
      .populate('resume', 'skills experience education');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile'
    });
  }
};