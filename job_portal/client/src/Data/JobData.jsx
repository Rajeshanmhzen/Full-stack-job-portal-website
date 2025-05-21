import { FaSearch,FaBriefcase } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { TbRecharging } from "react-icons/tb";
 const dropdownData = [
    {
        title:"Job Title", 
        icon:FaSearch,
         options:["Designer", "Developer", "Product Manager", "Marketing Specialist", "Data Anayst", "Sale Executive", "Content Writer", "Customer Support"]
    },
    {
        title:"Location", 
        icon:FaLocationDot,
         options:["Pulchok", "Kupondole", "baagbazar", "new Baneshwor", "Bhaktapur", "Langkhel", "Balkumari", "teku"]
    },
     {
        title:"Experience", 
        icon:FaBriefcase,
         options:["Entry Level", "Intermediate", "Expert"]
    },
    {
        title:"Job Type", 
        icon:TbRecharging,
         options:["Full Time ", "Part Time", "Contract"]
    }
];


const companies = ["Google", "Amazon", "Figma", "Netflix", "Meta", "Microsoft", "Pinterest", "Slack", "Spotify", "Oracle", "Walmart"];

const jobCategory = [
  // Add your job categories here
  "Software Engineering",
  "Data Science",
  "Product Management",
  "Design",
  "Marketing",
  "Sales",
  "Operations",
  "Finance",
  "Human Resources",
  "Customer Success"
];

const work = [
  {
    "name": "Build Your Resume",
    "desc": "Create a standout resume with your skills."
  },
  {
    "name": "Apply for Job",
    "desc": "Find and apply for jobs that match your skills."
  },
  {
    "name": "Get Hired",
    "desc": "Connect with employers and start your new job."
  }
];

const testimonials = [
  {
    "name": "Sarah Johnson",
    "role": "Software Engineer at Google",
    "image": "/api/placeholder/150/150",
    "testimonial": "This platform helped me land my dream job at Google. The resume builder and job matching features are incredible!"
  },
  {
    "name": "Michael Chen",
    "role": "Product Manager at Amazon",
    "image": "/api/placeholder/150/150",
    "testimonial": "I found the perfect role that matched my skills exactly. The application process was smooth and efficient."
  },
  {
    "name": "Emily Rodriguez",
    "role": "UX Designer at Figma",
    "image": "/api/placeholder/150/150",
    "testimonial": "The career guidance and networking opportunities here are unmatched. Highly recommend to anyone job hunting!"
  },
  {
    "name": "David Park",
    "role": "Data Scientist at Netflix",
    "image": "/api/placeholder/150/150",
    "testimonial": "Within 2 weeks of using this platform, I had multiple interviews lined up. The quality of job matches is outstanding."
  },
  {
    "name": "Lisa Thompson",
    "role": "Marketing Manager at Meta",
    "image": "/api/placeholder/150/150",
    "testimonial": "The resume optimization suggestions helped me get noticed by top companies. Now I'm working at my dream company!"
  }
];

// Additional data that might be useful for a job platform
const skills = [
  "JavaScript", "Python", "React", "Node.js", "SQL", "MongoDB", "AWS", 
  "Docker", "Kubernetes", "Machine Learning", "Data Analysis", "UI/UX Design",
  "Project Management", "Agile", "Scrum", "Digital Marketing", "SEO", "Content Writing"
];


export {
    dropdownData,
  companies,
  jobCategory,
  work,
  testimonials,
  skills
};