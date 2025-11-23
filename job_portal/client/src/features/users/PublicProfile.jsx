import { Card, Avatar, Badge, Button } from "@mantine/core";
import { MdLocationOn, MdEmail, MdPhone } from "react-icons/md";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { USER_API_END_POINT, SERVER_BASE_URL } from "../../utils/constant";

const PublicProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/profile/${userId}`);
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[400px]">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center py-8">User not found</div>;
  }
  
  const publicUser = {
    fullname: user.fullname || "User",
    email: user.email,
    profilePic: user.profilePic,
    location: user.location || "Location not specified",
    role: user.role,
    skills: user.skills || [],
    experienceYears: user.experienceYears,
    experience: user.experience || [],
    certifications: user.certifications || []
  };

  return (
    <div className="max-w-6xl mx-auto mt-6 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Public Profile Card */}
        <div className="lg:col-span-1">
          <Card className="theme-card p-0 overflow-hidden">
            {/* Cover Photo */}
            <div className="h-20 bg-gradient-to-r from-blue-600 to-purple-600 relative"></div>
            
            {/* Profile Section */}
            <div className="px-6 pb-6">
              <div className="relative -mt-12 mb-4">
                <Avatar
                  src={publicUser?.profilePic ? `${SERVER_BASE_URL}/uploads/user-profiles/${publicUser.profilePic}` : null}
                  size={96}
                  className="border-4 border-white dark:border-gray-800 mx-auto"
                />
              </div>
              
              <div className="text-center">
                <h2 className="text-xl font-bold mb-1">{publicUser.fullname}</h2>
                <Badge color={publicUser.role === 'recruiter' ? 'blue' : 'green'} className="mb-2">
                  {publicUser.role === 'recruiter' ? 'Recruiter' : 'Job Seeker'}
                </Badge>
                <p className="flex items-center justify-center gap-1 text-gray-500 text-sm mb-4">
                  <MdLocationOn size={16} />
                  {publicUser.location}
                </p>
                {publicUser.experienceYears && (
                  <p className="text-sm text-gray-600 mb-4">
                    {publicUser.experienceYears} years of experience
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Button 
                  fullWidth 
                  variant="filled" 
                  color="blue"
                  size="sm"
                >
                  Connect
                </Button>
                <Button 
                  fullWidth 
                  variant="outline" 
                  size="sm"
                >
                  Send Message
                </Button>
              </div>
            </div>
          </Card>

          {/* Public Contact Info Card */}
          <Card className="theme-card mt-4">
            <h3 className="font-semibold mb-3">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FaLinkedin className="text-blue-600" size={18} />
                <span className="text-sm">LinkedIn Profile</span>
              </div>
              <div className="flex items-center gap-3">
                <FaGithub className="text-gray-700 dark:text-gray-300" size={18} />
                <span className="text-sm">GitHub Profile</span>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Contact details are private. Connect to view.
              </p>
            </div>
          </Card>

          {/* Skills Card */}
          <Card className="theme-card mt-4">
            <h3 className="font-semibold mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {publicUser.skills.map((skill, i) => (
                <Badge key={i} variant="light" color="blue" size="sm">
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-2">
          <Card className="theme-card">
            <h3 className="font-semibold mb-3">Profile Information</h3>
            <div className="space-y-3">
              <div>
                <span className="font-medium">Role:</span> {publicUser.role === 'recruiter' ? 'Recruiter' : 'Job Seeker'}
              </div>
              <div>
                <span className="font-medium">Location:</span> {publicUser.location}
              </div>
              {publicUser.experienceYears && (
                <div>
                  <span className="font-medium">Experience:</span> {publicUser.experienceYears} years
                </div>
              )}
            </div>
          </Card>

          {publicUser.experience.length > 0 && (
            <Card className="theme-card mt-4">
              <h3 className="font-semibold mb-3">Experience</h3>
              <div className="space-y-4">
                {publicUser.experience.map((exp, i) => (
                  <div key={i} className="border-l-2 border-blue-500 pl-4">
                    <h4 className="font-medium">{exp.role}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{exp.company}</p>
                    <p className="text-xs text-gray-500">{exp.startDate} - {exp.endDate || 'Present'}</p>
                    <p className="text-sm mt-2">{exp.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {publicUser.certifications.length > 0 && (
            <Card className="theme-card mt-4">
              <h3 className="font-semibold mb-3">Certifications</h3>
              <div className="space-y-3">
                {publicUser.certifications.map((cert, i) => (
                  <div key={i} className="border-l-2 border-green-500 pl-4">
                    <h4 className="font-medium">{cert.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{cert.organization}</p>
                    <p className="text-xs text-gray-500">{cert.issueDate}</p>
                    {cert.certificateId && (
                      <p className="text-xs text-gray-500">ID: {cert.certificateId}</p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;