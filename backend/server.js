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
You are an expert career counselor and roadmap planner AI. Based on the student profile below, generate a highly personalised, realistic career roadmap.

STRICT RULES — follow every rule or the output is invalid:

1. RESPECT THE CAREER GOAL EXACTLY. If the student wants to be a Singer, Dancer, Chef, Doctor, Athlete, Artist, or anything else — build the roadmap for THAT career. Do NOT redirect them to tech or an unrelated field.

2. "technologies" should list tools, software, instruments, apps, or equipment RELEVANT to the chosen career. For a Singer: DAWs (GarageBand, Audacity), mic types, SoundCloud, Spotify for Artists. For a Chef: cooking equipment, recipe apps. NOT programming languages unless the goal is software.

3. "projects" must be HANDS-ON real activities for the career. For a Singer: record a demo, perform at open mic, launch a YouTube channel. For a Chef: cook a 3-course meal, host a dinner pop-up. Include exactly 5 projects.

4. "roadmap" phases must be DYNAMIC — between 3 and 6 phases total, with a REALISTIC total timeline:
   - A singer: 1–2 years
   - A web developer: 6–10 months
   - A doctor: use years (e.g., "Year 1–2")
   - A chef: 1–2 years
   Never default to a fixed 8-month / 4-phase structure.

5. Course URLs MUST be search-page URLs that always work. Use these exact formats:
   - YouTube:  https://www.youtube.com/results?search_query=topic+keywords
   - Udemy:    https://www.udemy.com/courses/search/?q=topic+keywords
   - Coursera: https://www.coursera.org/search?query=topic+keywords
   Encode spaces as + signs. NEVER use direct course links that may break.

6. Be honest about competitive careers (music, acting, sports). Do not over-promise income or outcomes.

Student Profile:
- Name: ${name}
- Education Level: ${educationLevel}
- Interests: ${interests}
- Current Skills: ${currentSkills}
- Career Goal: ${careerGoal}

Return ONLY a valid JSON object. No markdown. No code fences. No extra text. Use EXACTLY this structure:

{
  "careerRecommendation": {
    "title": "Specific role aligned with career goal",
    "description": "3–4 sentences describing this career and what it involves day-to-day",
    "reasoning": "2–3 sentences explaining why this is a good fit based on the student's profile",
    "averageSalary": "Realistic salary range, e.g. $25,000 – $80,000/year or Highly variable",
    "jobOutlook": "Honest outlook, e.g. Competitive but growing (8% growth expected)"
  },
  "skillsToLearn": [
    "6 to 8 specific, relevant skills for this career"
  ],
  "technologies": [
    { "name": "Tool/App/Instrument/Software name", "category": "Relevant category for this career", "priority": "High" },
    { "name": "Tool/App/Instrument/Software name", "category": "category", "priority": "High" },
    { "name": "Tool/App/Instrument/Software name", "category": "category", "priority": "Medium" },
    { "name": "Tool/App/Instrument/Software name", "category": "category", "priority": "Medium" },
    { "name": "Tool/App/Instrument/Software name", "category": "category", "priority": "Low" }
  ],
  "projects": [
    {
      "name": "Hands-on activity or project name",
      "description": "2–3 sentences on what this involves and what it proves",
      "skills": ["skill1", "skill2", "skill3"],
      "difficulty": "Beginner",
      "estimatedTime": "1–2 weeks"
    },
    {
      "name": "Project name",
      "description": "description",
      "skills": ["skill1", "skill2"],
      "difficulty": "Beginner",
      "estimatedTime": "2–3 weeks"
    },
    {
      "name": "Project name",
      "description": "description",
      "skills": ["skill1", "skill2"],
      "difficulty": "Intermediate",
      "estimatedTime": "1 month"
    },
    {
      "name": "Project name",
      "description": "description",
      "skills": ["skill1", "skill2"],
      "difficulty": "Intermediate",
      "estimatedTime": "4–6 weeks"
    },
    {
      "name": "Project name",
      "description": "description",
      "skills": ["skill1", "skill2"],
      "difficulty": "Advanced",
      "estimatedTime": "2–3 months"
    }
  ],
  "courses": [
    {
      "title": "Descriptive resource title for this career",
      "platform": "YouTube",
      "url": "https://www.youtube.com/results?search_query=relevant+career+topic",
      "description": "What the student will learn from this resource",
      "level": "Beginner",
      "free": true
    },
    {
      "title": "Course title",
      "platform": "Udemy",
      "url": "https://www.udemy.com/courses/search/?q=relevant+career+topic",
      "description": "description",
      "level": "Intermediate",
      "free": false
    },
    {
      "title": "Course title",
      "platform": "Coursera",
      "url": "https://www.coursera.org/search?query=relevant+career+topic",
      "description": "description",
      "level": "Intermediate",
      "free": false
    },
    {
      "title": "Course title",
      "platform": "YouTube",
      "url": "https://www.youtube.com/results?search_query=advanced+career+topic",
      "description": "description",
      "level": "Advanced",
      "free": true
    }
  ],
  "roadmap": [
    {
      "phase": 1,
      "title": "Phase title specific to this career",
      "duration": "Realistic duration, e.g. Month 1–3 or Year 1",
      "tasks": [
        "Specific actionable task 1",
        "Specific actionable task 2",
        "Specific actionable task 3",
        "Specific actionable task 4"
      ],
      "milestone": "Concrete, measurable achievement by end of this phase"
    }
  ]
}

REMEMBER: Generate 3–6 roadmap phases. Total duration must be realistic for the career. All course URLs must be search-page URLs. Everything must be specific to the stated career goal.`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert career counselor and roadmap planner AI. Output pure raw JSON matching the requested structure perfectly. Do NOT output markdown code fences. Respect the student's career goal exactly — if they want to be a singer, chef, athlete, or anything else, build for that career."
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
