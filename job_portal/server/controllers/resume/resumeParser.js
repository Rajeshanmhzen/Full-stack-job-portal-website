// resumeParser.js
import fs from 'fs/promises';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import path from 'path';

// Helper function to check if file exists
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch (err) {
    return false;
  }
}

// Extract text from PDF
export const extractTextFromPdf = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    return null;
  }
};

// Extract text from DOCX
export const extractTextFromDocx = async (filePath) => {
  try {
    const { value } = await mammoth.extractRawText({ path: filePath });
    return value;
  } catch (error) {
    console.error("Error extracting text from DOCX:", error);
    return null;
  }
};

// Extract details from text
export const extractDetail = (text) => {
  if (!text) {
    return {
      name: "Unknown",
      email: "Not Found",
      phone: "Not Found",
      location: "Not Found",
      jobTitles: [],
      skills: [],
      experience: []
    };
  }

  // Basic information extraction
  const nameMatch = text.match(/\b([A-Z][a-z]+(?: [A-Z][a-z]+){1,2})\b/);
  const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/);
  
  // Location extraction
  // Look for city, state format or common location indicators
  const locationRegexes = [
    /\b([A-Z][a-z]+(?:[\s-][A-Z][a-z]+)*),\s*([A-Z]{2})\b/, // City, State format
    /\bLocation\s*:?\s*([^,\n]+(?:,\s*[^,\n]+)?)/i, // Location: City, State
    /\bAddress\s*:?\s*([^,\n]+(?:,\s*[^,\n]+(?:,\s*[^,\n]+)?))/i // Address with multiple parts
  ];
  
  let location = "Not Found";
  for (const regex of locationRegexes) {
    const match = text.match(regex);
    if (match) {
      location = match[1];
      if (match[2]) location += `, ${match[2]}`; // Add state if available
      break;
    }
  }
  
  // Job title extraction
  const jobTitleRegexes = [
    /\b(Senior|Junior|Lead|Chief|Principal|Full Stack|Front End|Back End|Software|Data|Machine Learning|DevOps|Cloud|Mobile|UI\/UX|Systems|Network|Security|QA|Test)[\s-]?(Developer|Engineer|Architect|Analyst|Scientist|Designer|Administrator|Manager|Specialist|Consultant)\b/g,
    /\b(Project Manager|Product Manager|Program Manager|Technical Lead|Team Lead|Tech Lead|Scrum Master|Agile Coach)\b/g
  ];
  
  const jobTitles = [];
  for (const regex of jobTitleRegexes) {
    const matches = [...text.matchAll(regex)];
    matches.forEach(match => {
      if (match[0] && !jobTitles.includes(match[0])) {
        jobTitles.push(match[0]);
      }
    });
  }
  
  // Skills extraction - common programming languages and technologies
  const skillsRegex = /\b(JavaScript|Python|Java|C\+\+|C#|PHP|Ruby|Swift|Kotlin|Go|Rust|SQL|NoSQL|HTML|CSS|React|Angular|Vue|Node\.js|Express|Django|Flask|Spring|Hibernate|MongoDB|MySQL|PostgreSQL|Oracle|AWS|Azure|GCP|Docker|Kubernetes|Git|Jenkins|CI\/CD|Agile|Scrum|REST|GraphQL|Redux|TensorFlow|PyTorch|Machine Learning|AI|Data Science|Blockchain)\b/gi;
  
  const skillsMatches = [...text.matchAll(skillsRegex)];
  const skills = Array.from(new Set(skillsMatches.map(match => match[0])));
  
  // Experience extraction
  // Look for date ranges followed by text
  const experienceRegex = /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)[\s.-]+\d{4}\s*(?:[-–—]|to)\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December|Present|Current)[\s.-]*\d{0,4}[^\n]*/gi;
  
  const experienceMatches = [...text.matchAll(experienceRegex)];
  const experience = experienceMatches.map(match => match[0].trim());
  
  return {
    name: nameMatch ? nameMatch[0] : "Unknown",
    email: emailMatch ? emailMatch[0] : "Not Found",
    phone: phoneMatch ? phoneMatch[0] : "Not Found",
    location,
    jobTitles,
    skills,
    experience
  };
};

// Simple text similarity function without external NLP libraries
export const calculateSimilarity = (text1, text2) => {
  if (!text1 || !text2) return 0;
  
  // Convert to lowercase and tokenize by splitting on non-word characters
  const tokens1 = text1.toLowerCase().split(/\W+/).filter(token => token.length > 2);
  const tokens2 = text2.toLowerCase().split(/\W+/).filter(token => token.length > 2);
  
  // Create sets of unique tokens
  const uniqueTokens1 = new Set(tokens1);
  const uniqueTokens2 = new Set(tokens2);
  
  // Find intersection
  const intersection = new Set([...uniqueTokens1].filter(token => uniqueTokens2.has(token)));
  
  // Calculate Jaccard similarity (intersection over union)
  const union = new Set([...uniqueTokens1, ...uniqueTokens2]);
  
  return intersection.size / union.size;
};