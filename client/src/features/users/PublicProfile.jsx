import { Card, Avatar, Badge, Button } from "@mantine/core";
import { MdLocationOn, MdEmail, MdPhone } from "react-icons/md";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { useParams } from "react-router-dom";

const PublicProfile = () => {
  const { userId } = useParams();
  
  // Mock data for public profile
  const publicUser = {
    fullname: "John Doe",
    email: "john.doe@example.com", // This would be hidden for privacy
    phoneNumber: "+977-9841234567", // This would be hidden for privacy
    profilePic: null,
    jobTitle: "Full Stack Developer",
    location: "Kathmandu, Nepal",
    about: "Passionate full-stack developer with 3+ years of experience in building scalable web applications. Skilled in React, Node.js, and modern web technologies.",
    skills: ["JavaScript", "React", "Node.js", "MongoDB", "Express.js", "TypeScript", "Python", "AWS"],
    experience: [
      {
        title: "Senior Full Stack Developer",
        company: "TechCorp Nepal",
        duration: "2022 - Present",
        description: "Leading development of enterprise web applications using React and Node.js"
      },
      {
        title: "Frontend Developer", 
        company: "StartupXYZ",
        duration: "2021 - 2022",
        description: "Developed responsive web applications and improved user experience"
      }
    ],
    education: [
      {
        degree: "Bachelor of Computer Engineering",
        school: "Tribhuvan University",
        year: "2021"
      }
    ]
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
                  src={publicUser?.profilePic}
                  size={96}
                  className="border-4 border-white dark:border-gray-800 mx-auto"
                />
              </div>
              
              <div className="text-center">
                <h2 className="text-xl font-bold mb-1">{publicUser.fullname}</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                  {publicUser.jobTitle}
                </p>
                <p className="flex items-center justify-center gap-1 text-gray-500 text-sm mb-4">
                  <MdLocationOn size={16} />
                  {publicUser.location}
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
            <h3 className="font-semibold mb-3">About</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {publicUser.about}
            </p>
          </Card>

          <Card className="theme-card mt-4">
            <h3 className="font-semibold mb-3">Experience</h3>
            <div className="space-y-4">
              {publicUser.experience.map((exp, i) => (
                <div key={i} className="border-l-2 border-blue-500 pl-4">
                  <h4 className="font-medium">{exp.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{exp.company}</p>
                  <p className="text-xs text-gray-500">{exp.duration}</p>
                  <p className="text-sm mt-2">{exp.description}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="theme-card mt-4">
            <h3 className="font-semibold mb-3">Education</h3>
            <div className="space-y-3">
              {publicUser.education.map((edu, i) => (
                <div key={i} className="border-l-2 border-green-500 pl-4">
                  <h4 className="font-medium">{edu.degree}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{edu.school}</p>
                  <p className="text-xs text-gray-500">{edu.year}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;