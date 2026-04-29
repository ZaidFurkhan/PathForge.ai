<p align="center">
  <h1 align="center">⚡ PathForge.ai</h1>
  <p align="center"><strong>AI-Powered Personalized Career Roadmap Generator</strong></p>
  <p align="center">
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#implementation">Implementation</a> •
    <a href="#api-reference">API Reference</a> •
    <a href="#getting-started">Getting Started</a>
  </p>
</p>

---

## 🚀 What is PathForge?

PathForge is a full-stack web application that uses **Groq's LLaMA 3.3 70B** large language model to generate hyper-personalized, actionable career roadmaps. Users fill out a multi-step profile form, and the AI engine returns a structured career plan including:

- 🎯 **Career Recommendation** — Best-fit role with salary & job outlook
- 🧠 **Skills to Master** — 6+ core skills tailored to the goal
- 💻 **Technologies & Tools** — Prioritized tech stack (High / Medium / Low)
- 🛠️ **Portfolio Projects** — Beginner → Advanced project ideas
- 📚 **Curated Courses** — Real courses with functional URLs
- 🗺️ **Phase-by-Phase Roadmap** — 4-phase timeline with milestones

**Free. No sign-up. Results in seconds.**

---

## Tech Stack

### Frontend

| Technology | Version | Role |
|---|---|---|
| React | 18.2.0 | Component-based UI library |
| React Router DOM | 6.22.1 | Client-side routing (3 pages) |
| Vite | 5.1.0 | Build tool & dev server with HMR |
| Axios | 1.6.7 | HTTP client for API requests |
| Vanilla CSS | — | Custom Neumorphism design system |
| Inter (Google Fonts) | — | Primary typeface |

### Backend

| Technology | Version | Role |
|---|---|---|
| Node.js | — | JavaScript runtime |
| Express.js | 5.2.1 | REST API server |
| Groq SDK | 1.1.2 | LLM API client |
| dotenv | 17.4.1 | Environment variable management |
| CORS | 2.8.6 | Cross-origin middleware |

### AI Engine

| Component | Detail |
|---|---|
| Provider | Groq Cloud |
| Model | `llama-3.3-70b-versatile` |
| Output Mode | `response_format: { type: "json_object" }` |
| Prompt Pattern | System prompt + structured user prompt with strict JSON schema |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Browser                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         React SPA (Vite + React Router)               │  │
│  │                                                       │  │
│  │   Landing (/）──→ Form (/generate) ──→ Dashboard      │  │
│  │                       │              (/dashboard)     │  │
│  │                       │  sessionStorage               │  │
│  └───────────────────────┼───────────────────────────────┘  │
│                          │ POST /api/generate-roadmap       │
└──────────────────────────┼──────────────────────────────────┘
                           │ Axios
┌──────────────────────────┼──────────────────────────────────┐
│              Express.js Backend (Port 5000)                 │
│                          │                                  │
│   ┌──────────────────────▼──────────────────────────────┐  │
│   │  1. Validate input (5 required fields)              │  │
│   │  2. Build system + user prompt                      │  │
│   │  3. Call Groq API (LLaMA 3.3 70B)                   │  │
│   │  4. Extract & parse JSON from response              │  │
│   │  5. Return structured roadmap                       │  │
│   └─────────────────────────────────────────────────────┘  │
│                          │ Groq SDK                         │
└──────────────────────────┼──────────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────────┐
│              Groq Cloud (LLaMA 3.3 70B)                     │
│                          │                                  │
│   Receives prompt → Generates structured JSON roadmap       │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation

### Project Structure

```
pathforge/
├── .env.example              # Environment variable template
├── .gitignore                # Git exclusion rules
├── LICENSE                   # MIT License
├── README.md                 # This file
│
├── backend/
│   ├── .env                  # API keys (gitignored)
│   ├── package.json          # Dependencies & scripts
│   ├── server.js             # ★ Express API — single endpoint
│   ├── get-models.js         # Debug: list available Gemini models
│   ├── test-gemini.js        # Test: Gemini API connectivity
│   └── test-backend-direct.js# Test: local API endpoint
│
└── frontend/
    ├── index.html            # Entry HTML — meta tags, fonts
    ├── package.json          # Dependencies & scripts
    ├── vite.config.js        # Vite config with /api proxy
    └── src/
        ├── main.jsx          # React mount + BrowserRouter
        ├── App.jsx           # Route definitions
        ├── index.css         # ★ Global design system (594 lines)
        ├── components/       # Reserved for reusable components
        └── pages/
            ├── Landing.jsx   # Marketing landing page
            ├── Landing.css   # Landing styles + animations
            ├── Form.jsx      # Multi-step career profile form
            ├── Form.css      # Form styles
            ├── Dashboard.jsx # AI roadmap results display
            └── Dashboard.css # Dashboard layout styles
```

### How It Works — Step by Step

#### Step 1: User fills the multi-step form (`Form.jsx`)

The form collects 5 fields across 3 wizard steps:

| Step | Fields | Validation |
|---|---|---|
| 1. Basic Info | `name`, `educationLevel` | Both required |
| 2. Your Spark | `interests`, `currentSkills` | Both required |
| 3. Ambition | `careerGoal` | Required |

State is managed with React's `useState`:
```jsx
const [step, setStep] = useState(1)
const [form, setForm] = useState({
  name: '', educationLevel: '', interests: '', currentSkills: '', careerGoal: ''
})
```

#### Step 2: Frontend sends POST request to backend

On form submission, Axios sends the form data to the Express API:

```jsx
const baseURL = import.meta.env.VITE_API_URL || 'https://pathforge-ai-api.onrender.com';
const res = await axios.post(`${baseURL}/api/generate-roadmap`, form);
```

In development, Vite's proxy forwards `/api` requests to `localhost:5000`:
```js
// vite.config.js
proxy: { '/api': { target: 'http://localhost:5000', changeOrigin: true } }
```

#### Step 3: Backend validates & builds the AI prompt (`server.js`)

The server validates all 5 fields, then constructs a detailed prompt:

```js
app.post('/api/generate-roadmap', async (req, res) => {
  const { name, educationLevel, interests, currentSkills, careerGoal } = req.body;
  // Validate all fields exist
  // Build structured prompt with exact JSON schema
});
```

The prompt includes:
- The student's complete profile
- An exact JSON schema the AI must follow
- Instructions for real course URLs
- System prompt enforcing raw JSON output (no markdown)

#### Step 4: Groq SDK calls LLaMA 3.3 70B

```js
const chatCompletion = await groq.chat.completions.create({
  messages: [
    { role: "system", content: "You are an expert career counselor..." },
    { role: "user", content: prompt }
  ],
  model: "llama-3.3-70b-versatile",
  response_format: { type: "json_object" }   // ← Forces structured JSON
});
```

Key design decisions:
- **`response_format: json_object`** — Groq's structured output mode guarantees valid JSON
- **System prompt** — Reinforces "no markdown, raw JSON only"
- **70B model** — Chosen for high-quality, nuanced career advice

#### Step 5: Backend parses and returns the response

Robust JSON extraction handles any LLM output quirks:

```js
let cleanedText = text;
const startIndex = cleanedText.indexOf('{');
const endIndex = cleanedText.lastIndexOf('}');
if (startIndex !== -1 && endIndex !== -1) {
  cleanedText = cleanedText.slice(startIndex, endIndex + 1);
}
parsedData = JSON.parse(cleanedText);
return res.json({ success: true, data: parsedData });
```

#### Step 6: Frontend stores data & renders dashboard

```jsx
sessionStorage.setItem('roadmap', JSON.stringify(res.data.data));
sessionStorage.setItem('userName', form.name);
navigate('/dashboard');
```

The **Dashboard** (`Dashboard.jsx`) reads from `sessionStorage` on mount and renders:
- **Bento grid header** — Career title, salary, outlook, reasoning
- **Skills section** — Badge pills for each skill
- **Technologies** — Grid with High/Medium/Low priority pills
- **Courses** — Cards with level badges, platform links
- **Projects** — Cards with difficulty, skills used, time estimates
- **Timeline Roadmap** — Vertical timeline with 4 phases, tasks, and milestones

---

## API Reference

### `GET /`

Health check endpoint.

**Response:**
```json
{ "status": "PathForge API is running 🚀" }
```

### `POST /api/generate-roadmap`

Generates a personalized career roadmap.

**Request Body:**
```json
{
  "name": "Riya Sharma",
  "educationLevel": "Undergraduate (2nd Year)",
  "interests": "Web development, AI, Design",
  "currentSkills": "Python, HTML, CSS",
  "careerGoal": "Full-Stack Developer"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "careerRecommendation": {
      "title": "Full-Stack Developer",
      "description": "...",
      "reasoning": "...",
      "averageSalary": "$70,000 - $120,000/year",
      "jobOutlook": "Excellent (15% growth)"
    },
    "skillsToLearn": ["React", "Node.js", "PostgreSQL", "Docker", "Git", "REST APIs"],
    "technologies": [
      { "name": "React", "category": "Framework", "priority": "High" }
    ],
    "projects": [
      {
        "name": "Portfolio Website",
        "description": "...",
        "skills": ["HTML", "CSS", "JS"],
        "difficulty": "Beginner",
        "estimatedTime": "1-2 weeks"
      }
    ],
    "courses": [
      {
        "title": "Complete Web Developer 2026",
        "platform": "Udemy",
        "url": "https://www.udemy.com/...",
        "description": "...",
        "level": "Beginner",
        "free": false
      }
    ],
    "roadmap": [
      {
        "phase": 1,
        "title": "Foundation Phase",
        "duration": "Month 1-2",
        "tasks": ["Learn HTML/CSS", "Build 3 sites", "Learn Git"],
        "milestone": "Can build responsive static websites"
      }
    ]
  }
}
```

**Error Responses:**

| Status | Cause |
|---|---|
| `400` | Missing required field(s) |
| `500` | AI response parse failure or Groq API error |

---

## Design System

PathForge uses a custom **Neumorphism** design system built with vanilla CSS.

### Color Palette
| Color | Hex | Usage |
|---|---|---|
| Navy Background | `#111622` | Page background |
| Electric Blue | `#1B54FF` | Primary accent |
| Neon Cyan | `#83F9FF` | Highlights, gradients |
| Vibrant Purple | `#913DFF` | Decorative elements |
| CTA Orange | `#FEB122` | Buttons, CTAs |

### Shadow Tokens
- `--s-raised` / `--s-raised-sm` / `--s-raised-lg` — Elevated elements
- `--s-inset` / `--s-inset-sm` — Pressed/sunken elements

### Animations
| Animation | Used On |
|---|---|
| `shimmer-sweep` | CTA button highlight |
| `floatOrb` | Background decorative orbs |
| `beamSway` | Aurora hero beams |
| `driftDown` | Light streak particles |
| `slideUp` (staggered) | Page entrance animations |

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- A Groq API key — get one free at [console.groq.com/keys](https://console.groq.com/keys)

### 1. Clone the repository
```bash
git clone https://github.com/ZaidFurkhan/PathForge.ai.git
cd PathForge.ai
```

### 2. Setup the backend
```bash
cd backend
npm install
```

Create a `.env` file:
```env
GROQ_API_KEY=your_groq_api_key_here
PORT=5000
```

Start the server:
```bash
npm run dev
```

### 3. Setup the frontend
```bash
cd frontend
npm install
npm run dev
```

The app will be running at **http://localhost:5173** with API calls proxied to port 5000.

### 4. Build for production
```bash
cd frontend
npm run build    # Outputs to dist/
npm run preview  # Preview the build
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | ✅ | Your Groq API key |
| `PORT` | ❌ | Backend port (default: 5000) |
| `VITE_API_URL` | ❌ | Override backend URL in frontend |

---

## Author

**Md. Aman Ul Haq**
