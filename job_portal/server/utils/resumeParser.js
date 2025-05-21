import fs from 'fs/promises';
import { PDFExtract } from 'pdf.js-extract';
import mammoth from 'mammoth';
import path from 'path';

// Helper: Check if file exists
export async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// PDF Extractor
export const extractTextFromPdf = async (filePath) => {
  try {
    const pdfExtract = new PDFExtract();
    const data = await pdfExtract.extract(filePath, {});
    return data.pages.map(page => page.content.map(item => item.str).join(' ')).join('\n');
  } catch (error) {
    console.error("PDF extraction error:", error);
    return null;
  }
};

// DOCX Extractor
export const extractTextFromDocx = async (filePath) => {
  try {
    const { value } = await mammoth.extractRawText({ path: filePath });
    return value;
  } catch (error) {
    console.error("DOCX extraction error:", error);
    return null;
  }
};

// Resume Detail Extractor
export const extractDetail = (text, filename) => {
  if (!text) return {};

  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const cleanText = text.replace(/\r?\n|\r/g, ' ').trim();

  // 1. Name (first line or capitalized name-like pattern)
  let name = "Unknown";
  if (lines.length > 0 && /^[A-Z\s]{5,}$/.test(lines[0])) {
    name = lines[0].split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  } else {
    const nameMatch = cleanText.match(/\b[A-Z][a-z]+\s[A-Z][a-z]+/);
    if (nameMatch) name = nameMatch[0];
  }

  // 2. Email
  const emailMatch = cleanText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
  const email = emailMatch ? emailMatch[0] : "Not Found";

  // 3. Website
  const websiteRegex = /(https?:\/\/[^\s|]+|www\.[^\s|]+)/i;
  const websitematch = cleanText.match(websiteRegex);
  const website = websitematch ? websitematch[0].trim() : '';

  // 4. Phone
  const phoneMatch = cleanText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : "Not Found";

  // 5. Location (try from address or known cities)
  const locationMatch = cleanText.match(/\b(Siddhipur|Lalitpur|Kathmandu|Bhaktapur|Pokhara|Butwal|Nepalgunj)\b/i);
  const location = locationMatch ? locationMatch[0] : "Not Found";

  // 6. Skills
  const skillRegex = /\b(HTML5?|CSS3?|JavaScript|React|Vue\.js?|Angular|Bootstrap|Tailwind|GitHub|GitLab|GraphQL|TypeScript|Webpack|NPM|Babel|Jest|Figma|Adobe XD|Sketch|Cypress|Jest|REST|Responsive Design)\b/gi;
  const skills = [...new Set([...cleanText.matchAll(skillRegex)].map(m => m[0]))];

  // 7. Job Titles
  const jobTitleRegex = /\b(Frontend|Backend|Full Stack|UI\/UX|Web) Developer\b/gi;
  const jobTitles = [...new Set([...cleanText.matchAll(jobTitleRegex)].map(m => m[0]))];

  // 8. Multiple Experience Dates
  const experienceRegex = /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s.-]*\d{4}\s*[-–—to]+\s*(?:Present|\w{3,9}\s\d{4}|\d{4})/gi;
  const experience = [...cleanText.matchAll(experienceRegex)].map(m => m[0]);

  // 9.project
  const projectStart = lines.findIndex(line => /^Projects$/i.test(line));
  let rawProjects = [];
  if (projectStart !== -1) {
    for (let i = projectStart + 1; i < lines.length; i++) {
      if (/^(Experience|Education|Skills|Certifications|Objective)$/i.test(lines[i])) break;
      if (lines[i].length > 10) rawProjects.push(lines[i]);
    }
  }
  const projects = rawProjects.map(project => {
    const [title] = project.split(/(?<=\))|(?<=\.)/);
    return title.trim();
  });

  return {
    filename,
    content:text,
    name,
    email,
    phone,
    location,
    jobTitles,
    skills,
    website,
    experience,
    projects,
  };
};


// Simple Jaccard Similarity
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
