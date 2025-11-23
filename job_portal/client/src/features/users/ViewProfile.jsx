// import { useSelector } from "react-redux";
import { Button, Card, Avatar, Badge } from "@mantine/core";
import { MdLocationOn, MdWork, MdDownload, MdEdit, MdEmail, MdPhone } from "react-icons/md";
import { FaLinkedin, FaGithub, FaGlobe } from "react-icons/fa";
import { RESUME_API_END_POINT, SERVER_BASE_URL } from "../../utils/constant";

const UserProfile = () => {
  // Mock data for design preview
  const mockUser = {
    fullname: "John Doe",
    email: "john.doe@example.com",
    phoneNumber: "+977-9841234567",
    profilePic: null
  };
  
  const mockResume = {
    name: "John Doe",
    jobTitles: ["Full Stack Developer"],
    location: "Kathmandu, Nepal",
    objective: "Passionate full-stack developer with 3+ years of experience in building scalable web applications. Skilled in React, Node.js, and modern web technologies. Looking to contribute to innovative projects and grow professionally.",
    skills: ["JavaScript", "React", "Node.js", "MongoDB", "Express.js", "TypeScript", "Python", "AWS"],
    experience: ["3 years"],
    projects: [
      "E-commerce Platform - Built with React and Node.js",
      "Task Management App - MERN stack application",
      "Weather Dashboard - React with API integration"
    ]
  };

  const handleDownload = () => {
    alert("Resume download feature");
  };

  return (
    <div className="max-w-6xl mx-auto mt-6 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Main Profile Card */}
        <div className="lg:col-span-1">
          <Card className="theme-card p-0 overflow-hidden">
            {/* Cover Photo */}
            <div className="h-20 bg-gradient-to-r from-blue-600 to-purple-600 relative">
              <Button 
                variant="subtle" 
                size="xs" 
                className="absolute top-2 right-2 text-white hover:bg-white/20"
                leftSection={<MdEdit size={14} />}
              >
                Edit
              </Button>
            </div>
            
            {/* Profile Section */}
            <div className="px-6 pb-6">
              <div className="relative -mt-12 mb-4">
                <Avatar
                  src={mockUser?.profilePic ? `${SERVER_BASE_URL}/uploads/user-profiles/${mockUser.profilePic}` : null}
                  size={96}
                  className="border-4 border-white dark:border-gray-800 mx-auto"
                />
              </div>
              
              <div className="text-center">
                <h2 className="text-xl font-bold mb-1">{mockResume?.name || mockUser?.fullname}</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                  {mockResume?.jobTitles?.[0] || "Professional"}
                </p>
                <p className="flex items-center justify-center gap-1 text-gray-500 text-sm mb-4">
                  <MdLocationOn size={16} />
                  {mockResume?.location || "Location not set"}
                </p>
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
                  onClick={handleDownload}
                  leftSection={<MdDownload size={16} />}
                >
                  Download Resume
                </Button>
              </div>
            </div>
          </Card>

          {/* Contact Info Card */}
          <Card className="theme-card mt-4">
            <h3 className="font-semibold mb-3">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MdEmail className="text-gray-500" size={18} />
                <span className="text-sm">{mockUser?.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <MdPhone className="text-gray-500" size={18} />
                <span className="text-sm">{mockUser?.phoneNumber || "Not provided"}</span>
              </div>
              <div className="flex items-center gap-3">
                <FaLinkedin className="text-blue-600" size={18} />
                <span className="text-sm">LinkedIn Profile</span>
              </div>
              <div className="flex items-center gap-3">
                <FaGithub className="text-gray-700 dark:text-gray-300" size={18} />
                <span className="text-sm">GitHub Profile</span>
              </div>
            </div>
          </Card>

          {/* Profile Analytics Card */}
          <Card className="theme-card mt-4">
            <h3 className="font-semibold mb-3">Profile Analytics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Profile views</span>
                <span className="text-sm font-semibold text-blue-600">127</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Post impressions</span>
                <span className="text-sm font-semibold text-blue-600">1,234</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Search appearances</span>
                <span className="text-sm font-semibold text-blue-600">89</span>
              </div>
            </div>
          </Card>

          {/* Profile Completion Card */}
          <Card className="theme-card mt-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Profile Strength</h3>
              <span className="text-sm font-semibold text-green-600">85%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
              <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Add profile photo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Add work experience</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Add education</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Add 3 more skills</span>
              </div>
            </div>
          </Card>

          {/* Who Viewed Your Profile Card */}
          <Card className="theme-card mt-4">
            <h3 className="font-semibold mb-3">Who viewed your profile</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar size={32} src={null} />
                <div className="flex-1">
                  <p className="text-sm font-medium">Sarah Johnson</p>
                  <p className="text-xs text-gray-500">UI/UX Designer at TechCorp</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Avatar size={32} src={null} />
                <div className="flex-1">
                  <p className="text-sm font-medium">Mike Chen</p>
                  <p className="text-xs text-gray-500">Senior Developer at StartupXYZ</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Avatar size={32} src={null} />
                <div className="flex-1">
                  <p className="text-sm font-medium">Lisa Wang</p>
                  <p className="text-xs text-gray-500">HR Manager at BigTech</p>
                </div>
              </div>
            </div>
            <Button variant="subtle" size="xs" fullWidth className="mt-3">
              View all profile viewers
            </Button>
          </Card>

          {/* Skills Card */}
          <Card className="theme-card mt-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Skills</h3>
              <Button variant="subtle" size="xs" leftSection={<MdEdit size={14} />}>
                Edit
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {mockResume?.skills?.map((skill, i) => (
                <Badge key={i} variant="light" color="blue" size="sm">
                  {skill}
                </Badge>
              )) || <p className="text-gray-500 text-sm">No skills added</p>}
            </div>
          </Card>

          {/* Quick Actions Card */}
          <Card className="theme-card mt-4">
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="light" size="sm" fullWidth justify="start">
                Add work experience
              </Button>
              <Button variant="light" size="sm" fullWidth justify="start">
                Add education
              </Button>
              <Button variant="light" size="sm" fullWidth justify="start">
                Add skills
              </Button>
              <Button variant="light" size="sm" fullWidth justify="start">
                Request recommendation
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-2">
          <Card className="theme-card">
            <h3 className="font-semibold mb-3">About</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {mockResume?.objective || "No description available. Add a professional summary to showcase your experience and goals."}
            </p>
          </Card>

          <Card className="theme-card mt-4">
            <h3 className="font-semibold mb-3">Experience</h3>
            <p className="text-gray-500 text-sm">
              {mockResume?.experience?.length ? `${mockResume.experience.length} years of experience` : "No experience added"}
            </p>
          </Card>

          <Card className="theme-card mt-4">
            <h3 className="font-semibold mb-3">Projects</h3>
            {mockResume?.projects?.length ? (
              <ul className="space-y-2">
                {mockResume.projects.map((project, i) => (
                  <li key={i} className="text-sm text-gray-600 dark:text-gray-400">
                    • {project}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No projects added</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;