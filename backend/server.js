const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Groq } = require('groq-sdk');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'PathForge API is running 🚀' });
});

// Main route: Generate career roadmap
app.post('/api/generate-roadmap', async (req, res) => {
  const { name, educationLevel, interests, currentSkills, careerGoal } = req.body;

  if (!name || !educationLevel || !interests || !currentSkills || !careerGoal) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const prompt = `
You are an expert career counselor and roadmap planner AI. Based on the student profile below, generate a detailed, personalized career roadmap.

Student Profile:
- Name: ${name}
- Education Level: ${educationLevel}
- Interests: ${interests}
- Current Skills: ${currentSkills}
- Career Goal: ${careerGoal}

Generate a comprehensive, actionable career roadmap. Return ONLY a valid JSON object with NO markdown, NO code fences, NO extra text. Use EXACTLY this structure:

{
  "careerRecommendation": {
    "title": "Specific job title/role",
    "description": "3-4 sentence description of this career path",
    "reasoning": "2-3 sentences explaining why this is recommended for this specific student based on their profile",
    "averageSalary": "e.g., $70,000 - $120,000/year",
    "jobOutlook": "e.g., Excellent (15% growth expected)"
  },
  "skillsToLearn": [
    "Skill 1",
    "Skill 2",
    "Skill 3",
    "Skill 4",
    "Skill 5",
    "Skill 6"
  ],
  "technologies": [
    { "name": "Technology Name", "category": "e.g., Programming Language / Framework / Tool / Database", "priority": "High" },
    { "name": "Technology Name", "category": "category", "priority": "Medium" },
    { "name": "Technology Name", "category": "category", "priority": "Low" }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "2-3 sentence description of the project and what it demonstrates",
      "skills": ["skill1", "skill2", "skill3"],
      "difficulty": "Beginner",
      "estimatedTime": "e.g., 1-2 weeks"
    },
    {
      "name": "Project Name",
      "description": "description",
      "skills": ["skill1", "skill2"],
      "difficulty": "Intermediate",
      "estimatedTime": "e.g., 3-4 weeks"
    },
    {
      "name": "Project Name",
      "description": "description",
      "skills": ["skill1", "skill2"],
      "difficulty": "Advanced",
      "estimatedTime": "e.g., 6-8 weeks"
    }
  ],
  "courses": [
    {
      "title": "Specific Course Title",
      "platform": "Platform Name",
      "url": "https://www.coursera.org/learn/specific-course-name",
      "description": "1-2 sentence description of what you'll learn",
      "level": "Beginner",
      "free": true
    }
  ],
  "roadmap": [
    {
      "phase": 1,
      "title": "Foundation Phase",
      "duration": "e.g., Month 1-2",
      "tasks": [
        "Specific actionable task 1",
        "Specific actionable task 2",
        "Specific actionable task 3"
      ],
      "milestone": "What you will have achieved by the end of this phase"
    },
    {
      "phase": 2,
      "title": "Building Skills Phase",
      "duration": "Month 3-4",
      "tasks": ["task1", "task2", "task3"],
      "milestone": "milestone description"
    },
    {
      "phase": 3,
      "title": "Hands-On Practice Phase",
      "duration": "Month 5-6",
      "tasks": ["task1", "task2", "task3"],
      "milestone": "milestone description"
    },
    {
      "phase": 4,
      "title": "Portfolio & Job Readiness Phase",
      "duration": "Month 7-8",
      "tasks": ["task1", "task2", "task3"],
      "milestone": "milestone description"
    }
  ]
}

Make all recommendations specific, practical, and tailored to the student's profile. 
CRITICAL: Every course MUST have a REAL, FUNCTIONAL URL. DO NOT provide placeholders like '...' or generic domains. If the specific link is unknown, provide the exact search results URL for that course on its platform (e.g., https://www.udemy.com/courses/search/?q=Python).
Be encouraging and realistic.`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert career counselor and roadmap planner AI. Output pure raw JSON matching the requested structure perfectly. Do NOT output markdown code fences like ```json."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const text = chatCompletion.choices[0]?.message?.content || "";

    let parsedData;
    try {
      // Robust JSON extraction to ignore any conversational fluff
      let cleanedText = text;
      const startIndex = cleanedText.indexOf('{');
      const endIndex = cleanedText.lastIndexOf('}');
      if (startIndex !== -1 && endIndex !== -1) {
        cleanedText = cleanedText.slice(startIndex, endIndex + 1);
      }
      
      parsedData = JSON.parse(cleanedText);
    } catch (parseErr) {
      console.error('JSON parse error:', parseErr.message);
      console.error('Raw AI response:', text.substring(0, 500));
      return res.status(500).json({ error: 'Failed to parse AI response. Please try again.' });
    }

    return res.json({ success: true, data: parsedData });
  } catch (err) {
    console.error('Groq API Error:', err.message);
    return res.status(500).json({ error: 'AI generation failed. Please check your API key and try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 PathForge API running on http://localhost:${PORT}`);
});
