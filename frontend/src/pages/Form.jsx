import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Form.css'

const EDUCATION_OPTIONS = [
  'High School',
  'Undergraduate (1st Year)',
  'Undergraduate (2nd Year)',
  'Undergraduate (3rd Year)',
  'Undergraduate (Final Year)',
  'Graduate / Masters',
  'PhD',
  'Bootcamp / Self-taught',
  'Working Professional',
]

const PANEL_FEATURES = [
  ['🎯', 'Career Recommendation'],
  ['🛠️', 'Skills to Learn'],
  ['💻', 'Technologies & Tools'],
  ['🚀', 'Project Ideas'],
  ['📚', 'Curated Courses'],
  ['🗺️', 'Phase-by-Phase Roadmap'],
]

export default function Form() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '',
    educationLevel: '',
    interests: '',
    currentSkills: '',
    careerGoal: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function validateStep(s) {
    setError('')
    if (s === 1) {
      if (!form.name || !form.educationLevel) { setError('Please fill in your basic info.'); return false; }
    } else if (s === 2) {
      if (!form.interests || !form.currentSkills) { setError('Tell us more about your skills and interests.'); return false; }
    }
    return true
  }

  function nextStep() {
    if (validateStep(step)) setStep(s => s + 1)
  }

  function prevStep() {
    setError('')
    setStep(s => s - 1)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.careerGoal) { setError('Please define your career goal.'); return }

    setError('')
    setLoading(true)

    try {
      // Linked to your live Render backend
      const baseURL = import.meta.env.VITE_API_URL || 'https://pathforge-ai-api.onrender.com';
      const res = await axios.post(`${baseURL}/api/generate-roadmap`, form)
      sessionStorage.setItem('roadmap', JSON.stringify(res.data.data))
      sessionStorage.setItem('userName', form.name)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to generate roadmap. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const progress = Math.round((step / 3) * 100)

  return (
    <div className="form-page">
      <div className="orb orb-purple" />
      <div className="orb orb-pink" />

      {/* ── Header ────────────────────────────── */}
      <header className="header-container">
        <div className="floating-logo" onClick={() => navigate('/')}>
          <span className="logo-icon">⚡</span>
          <span className="gradient-text">PathForge</span>
        </div>

        <div className="header-actions">
          <button className="btn-secondary btn-sm" onClick={() => navigate('/')}>
            back
          </button>
        </div>
      </header>

      <div className="form-container">

        {/* Left panel - Visual Summary */}
        <div className="form-panel-left slide-up">
          <h1 className="panel-title">
            Build Your <br />
            <span className="gradient-text">Career Roadmap</span>
          </h1>
          <p className="panel-sub">
            Our AI engine connects your background with the industry's latest requirements.
          </p>

          <div className="panel-features">
            {PANEL_FEATURES.map(([icon, label]) => (
              <div key={label} className="panel-feature-item">
                <span>{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — Multi-Step Form */}
        <div className="form-panel-right slide-up-d2">

          <div className="stepper-wrap neu-inset">
            <div className={`step-dot ${step >= 1 ? 'active' : ''}`} />
            <div className={`step-dot ${step >= 2 ? 'active' : ''}`} />
            <div className={`step-dot ${step >= 3 ? 'active' : ''}`} />
          </div>

          <div className="form-card neu-card">

            <form onSubmit={handleSubmit} className="fields">

              {/* Step 1: Identity */}
              {step === 1 && (
                <div className="fade-in">
                  <h2 className="form-card-title">Basic Info</h2>
                  <p className="form-card-sub">Let's start with the basics.</p>

                  <div className="field-group">
                    <label className="field-label">👤 Full Name</label>
                    <input
                      name="name"
                      type="text"
                      className="neu-input"
                      placeholder="e.g. Riya Sharma"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="field-group">
                    <label className="field-label">🎓 Education Level</label>
                    <select
                      name="educationLevel"
                      className="neu-input neu-select"
                      value={form.educationLevel}
                      onChange={handleChange}
                    >
                      <option value="">Select your education</option>
                      {EDUCATION_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-actions" style={{ marginTop: '20px' }}>
                    <button type="button" className="btn-primary" onClick={nextStep} style={{ width: '100%' }}>
                      Next Step →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Experience */}
              {step === 2 && (
                <div className="fade-in">
                  <h2 className="form-card-title">Your Spark</h2>
                  <p className="form-card-sub">Tell us what you're passionate about.</p>

                  <div className="field-group">
                    <label className="field-label">❤️ Interests & Passions</label>
                    <textarea
                      name="interests"
                      className="neu-input neu-textarea"
                      placeholder="e.g. Web dev, psychology, crypto..."
                      value={form.interests}
                      onChange={handleChange}
                      rows={3}
                    />
                  </div>

                  <div className="field-group">
                    <label className="field-label">🛠️ Current Skills</label>
                    <textarea
                      name="currentSkills"
                      className="neu-input neu-textarea"
                      placeholder="e.g. Python, Excel, Public Speaking..."
                      value={form.currentSkills}
                      onChange={handleChange}
                      rows={3}
                    />
                  </div>

                  <div className="form-actions" style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                    <button type="button" className="btn-secondary" onClick={prevStep} style={{ flex: 1 }}>Back</button>
                    <button type="button" className="btn-primary" onClick={nextStep} style={{ flex: 1 }}>Next Step →</button>
                  </div>
                </div>
              )}

              {/* Step 3: Goal */}
              {step === 3 && (
                <div className="fade-in">
                  <h2 className="form-card-title">Ambition</h2>
                  <p className="form-card-sub">What's your dream role?</p>

                  <div className="field-group">
                    <label className="field-label">🚀 Career Goal</label>
                    <input
                      name="careerGoal"
                      type="text"
                      className="neu-input"
                      placeholder="e.g. Senior Software Engineer at Google"
                      value={form.careerGoal}
                      onChange={handleChange}
                    />
                  </div>

                  {error && <div className="error-box">⚠️ {error}</div>}

                  <div className="form-actions" style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                    <button type="button" className="btn-secondary" onClick={prevStep} style={{ flex: 1 }} disabled={loading}>Back</button>
                    <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={loading}>
                      {loading ? 'Forging Roadmap...' : '⚡ Generate Roadmap'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
