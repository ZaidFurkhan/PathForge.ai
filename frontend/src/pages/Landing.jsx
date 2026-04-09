import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Landing.css'

export default function Landing() {
  const navigate = useNavigate()
  const [activePersona, setActivePersona] = useState(0)

  const personas = [
    {
      name: 'Alex Johnson',
      role: 'Full-Stack Developer',
      avatar: '👨‍💻',
      phases: ['Foundations', 'Core Skills', 'Projects', 'Job Ready'],
      progress: 3
    },
    {
      name: 'Sarah Chen',
      role: 'Data Scientist',
      avatar: '👩‍🔬',
      phases: ['Math Basics', 'Python/SQL', 'ML Models', 'Portfolio'],
      progress: 2
    },
    {
      name: 'Marcus Li',
      role: 'UI/UX Designer',
      avatar: '🎨',
      phases: ['Design Theory', 'Figma Mastery', 'Prototyping', 'Hired'],
      progress: 3
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setActivePersona(prev => (prev + 1) % personas.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [personas.length])

  const features = [
    { icon: '🎯', title: 'Career Matching', desc: 'Advanced AI analyses your skills and goals to recommend the perfect career path.' },
    { icon: '🗺️', title: 'Step-by-Step Roadmap', desc: 'Get a phased, timeline-based learning plan built just for you.' },
    { icon: '📚', title: 'Curated Courses', desc: 'Handpicked courses and resources aligned with your specific goal.' },
    { icon: '🛠️', title: 'Project Ideas', desc: 'Real-world projects to build your portfolio and prove your skills.' },
    { icon: '⚡', title: 'Instant Results', desc: 'Powered by High-Performance AI — your roadmap generates in seconds.' },
    { icon: '🆓', title: 'Completely Free', desc: 'No signup. No paywall. Just fill out the form and go.' },
  ]

  const steps = [
    { num: '01', label: 'Fill your profile', desc: 'Tell us your education, interests, skills and career goals.' },
    { num: '02', label: 'AI generates roadmap', desc: 'Our AI engine processes your profile and builds a personalised plan.' },
    { num: '03', label: 'Start your journey', desc: 'Follow your step‑by‑step roadmap, learn skills and land your dream job.' },
  ]

  return (
    <div className="landing">
      {/* Decorative orbs */}
      <div className="orb orb-purple" />
      <div className="orb orb-pink" />
      <div className="orb orb-green" />
      <div className="neon-bg-element" style={{ top: '20%', left: '-10%', transform: 'rotate(-15deg)' }} />
      <div className="neon-bg-element" style={{ bottom: '30%', right: '-10%', transform: 'rotate(10deg)' }} />

      {/* ── Header ────────────────────────────── */}
      <header className="header-container">
        <div className="floating-logo" onClick={() => navigate('/')}>
          <span className="logo-icon">⚡</span>
          <span className="gradient-text">PathForge</span>
        </div>

        <nav className="header-nav">
          <a href="#about-us" className="nav-link">About Us</a>
          <a href="#how-it-works" className="nav-link">How it Works</a>
        </nav>
      </header>

      {/* ── Hero ─────────────────────────────── */}
      <section className="hero">
        <div className="hero-beams">
          <div className="beam beam-1" />
          <div className="beam beam-2" />
          <div className="beam beam-3" />
        </div>
        <div className="hero-aura" />

        {/* Light Streak Particles */}
        <div className="particle-container">
          <div className="particle" style={{ left: '10%', animationDelay: '0s' }} />
          <div className="particle" style={{ left: '25%', animationDelay: '2s' }} />
          <div className="particle" style={{ left: '40%', animationDelay: '1s' }} />
          <div className="particle" style={{ left: '55%', animationDelay: '4s' }} />
          <div className="particle" style={{ left: '70%', animationDelay: '3s' }} />
          <div className="particle" style={{ left: '85%', animationDelay: '5s' }} />
          <div className="particle" style={{ left: '95%', animationDelay: '1.5s' }} />
        </div>

        <div className="pill-badge slide-up">
          <span className="badge-dot" />
          AI Roadmap Engine v2.0
        </div>

        <h1 className="hero-title slide-up-d1">
          Forge Your<br />
          <span className="gradient-text">Career Path</span>
        </h1>

        <p className="hero-subtitle slide-up-d2">
          Stop guessing your next step. PathForge uses AI to generate a custom,
          step‑by‑step career roadmap based on your unique skills, interests and goals —
          in seconds.
        </p>

        <div className="hero-actions slide-up-d3">
          <button className="btn-primary btn-lg" onClick={() => navigate('/generate')}>
            🚀 Generate Your Career Roadmap
          </button>
        </div>

        <div className="hero-stats slide-up-d4">
          {[['AI-Powered', 'Recommendations'], ['100%', 'Personalised'], ['Free', 'No Sign-Up']].map(([val, label]) => (
            <div key={label} className="stat-item">
              <div className="stat-val gradient-text">{val}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>

        {/* Persona Card Stack */}
        <div className="hero-card-stack slide-up-d5">
          {personas.map((p, idx) => {
            let status = 'hidden';

            // Logic to track: 1. Previous (Shuffling out), 2. Active (Center), 3. Next (Waiting behind)
            const isPrev = idx === (activePersona - 1 + personas.length) % personas.length;
            const isActive = idx === activePersona;
            const isNext = idx === (activePersona + 1) % personas.length;

            if (isActive) status = 'active';
            else if (isNext) status = 'next';
            else if (isPrev) status = 'prev';

            return (
              <div key={p.name} className={`demo-card-wrap ${status}`}>
                <div className="demo-card neu-card">
                  <div className="demo-header">
                    <div className="demo-avatar">{p.avatar}</div>
                    <div>
                      <div className="demo-name">{p.name}</div>
                      <div className="demo-role gradient-text">→ {p.role}</div>
                    </div>
                  </div>
                  <div className="demo-phases">
                    {p.phases.map((phase, i) => (
                      <div key={phase} className="demo-phase">
                        <div className="demo-phase-dot" style={{ background: i < p.progress ? 'var(--g-accent)' : 'var(--neu-shadow-dark)' }} />
                        <span style={{ color: i < p.progress ? 'var(--text)' : 'var(--text-muted)', fontWeight: i < p.progress ? 600 : 400 }}>{phase}</span>
                        {i < p.progress && <span className="demo-check">✓</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="scroll-indicator">
          <div className="scroll-wheel" />
        </div>
      </section>

      {/* ── About Us ─────────────────────────── */}
      <section className="about-section slide-up-d6" id="about-us">
        <div className="section-label">Our Mission</div>
        <div className="about-card neu-card">
          <h2 className="section-title">Empowering the <span className="gradient-text">Next Generation</span></h2>
          <p className="about-text">
            PathForge was born out of a simple idea: career guidance shouldn't be a luxury.
            We use cutting-edge AI to break down complex professional journeys into
            achievable, step-by-step milestones. Whether you're a student starting out
            or a professional pivoting to a new field, we're here to forge your path to success.
          </p>
          <div className="about-stats">
            <div className="a-stat">
              <div className="a-val">100%</div>
              <div className="a-lbl">AI-Driven</div>
            </div>
            <div className="a-stat">
              <div className="a-val">Free</div>
              <div className="a-lbl">Always</div>
            </div>
            <div className="a-stat">
              <div className="a-val">Fast</div>
              <div className="a-lbl">Real-time</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Grid ────────────────────── */}
      <section className="features-section">
        <div className="section-label">Why PathForge?</div>
        <h2 className="section-title">Everything You Need to <span className="gradient-text">Level Up</span></h2>
        <p className="section-sub">One tool. All the clarity. Zero guesswork.</p>

        <div className="features-grid">
          {features.map((f, i) => (
            <div key={f.title} className={`feature-card neu-card hover-lift slide-up-d${Math.min(i + 1, 6)}`}>
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────── */}
      <section className="how-section" id="how-it-works">
        <div className="section-label">Simple Process</div>
        <h2 className="section-title">How It <span className="gradient-text">Works</span></h2>

        <div className="steps-row">
          {steps.map((s, i) => (
            <div key={s.num} className="step-item">
              <div className="step-num gradient-text">{s.num}</div>
              <div className="step-card neu-card hover-lift">
                <h3 className="step-label">{s.label}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
              {i < steps.length - 1 && <div className="step-arrow">→</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ───────────────────────────── */}
      <footer className="footer">
        <button className="back-to-top" onClick={() => window.scrollTo(0, 0)}>
          Back to Top <span>↑</span>
        </button>
        <span className="logo">
          <span className="logo-icon">⚡</span>
          <span className="gradient-text">PathForge</span>
        </span>
        <p>Built with Advanced AI · {new Date().getFullYear()}</p>
      </footer>
    </div >
  )
}
