const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const NodeCache = require('node-cache');

const jobCache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Job matching endpoint
router.post('/match', async (req, res) => {
  try {
    const { userProfile, jobDescription } = req.body;

    // Check cache first
    const cacheKey = `${JSON.stringify(userProfile)}_${jobDescription}`;
    const cachedResult = jobCache.get(cacheKey);
    if (cachedResult) {
      return res.json(cachedResult);
    }

    // Generate match analysis using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `
      Analyze the job match between the candidate profile and job description:
      
      Candidate Profile:
      ${JSON.stringify(userProfile, null, 2)}
      
      Job Description:
      ${jobDescription}
      
      Provide a JSON response with:
      1. Match percentage (0-100)
      2. Key matching skills
      3. Missing skills
      4. Recommendations
    `;

    const result = await model.generateContent(prompt);
    const response = JSON.parse(result.response.text());

    // Cache the result
    jobCache.set(cacheKey, response);

    res.json(response);
  } catch (error) {
    console.error('AI Matching Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get job recommendations
router.post('/recommendations', async (req, res) => {
  try {
    const { userProfile } = req.body;
    
    // Use Grok AI for job recommendations
    // Note: This is a placeholder as Grok AI's API isn't publicly available yet
    // Replace with actual Grok AI implementation when available
    
    const recommendations = {
      jobs: [
        // Simulated recommendations
        {
          title: "Sample Job",
          company: "Sample Company",
          matchScore: 95,
          skills: ["JavaScript", "React", "Node.js"],
          salary: "$100,000 - $120,000"
        }
      ],
      careerPath: {
        current: "Junior Developer",
        next: "Senior Developer",
        timeframe: "1-2 years",
        requiredSkills: ["System Design", "Team Leadership"]
      }
    };

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;