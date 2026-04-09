import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

export default function Dashboard() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    try {
      const storedData = sessionStorage.getItem('roadmap')
      const storedName = sessionStorage.getItem('userName')
      
      if (!storedData) {
        navigate('/')
        return
      }
      
      setData(JSON.parse(storedData))
      setUserName(storedName || 'Explorer')
    } catch (err) {
      console.error('Failed to parse roadmap data', err)
      navigate('/')
    }
  }, [navigate])

  if (!data) return (
    <div className="dashboard-page flex-center" style={{ height: '100vh', flexDirection: 'column', gap: '20px' }}>
      <div className="spinner"></div>
      <p style={{ color: 'var(--text-light)', fontWeight: 600 }}>Loading your personalized roadmap...</p>
    </div>
  )

  return (
    <div className="dashboard-page">
      <div className="orb orb-pink" />
      <div className="neon-bg-element" style={{ top: '15%', left: '-5%', transform: 'rotate(-5deg)', opacity: 0.2 }} />
      <div className="neon-bg-element" style={{ bottom: '20%', right: '-5%', transform: 'rotate(8deg)', opacity: 0.15 }} />
      <div className="neon-bg-element" style={{ top: '15%', left: '-5%', transform: 'rotate(-5deg)', opacity: 0.3 }} />
      <div className="neon-bg-element" style={{ bottom: '25%', right: '-5%', transform: 'rotate(12deg)', opacity: 0.2 }} />
      
      {/* ── Header ────────────────────────────── */}
      <header className="header-container">
        <div className="floating-logo" onClick={() => navigate('/')}>
          <span className="logo-icon">⚡</span>
          <span className="gradient-text">PathForge</span>
        </div>

        <div className="header-actions">
          <button className="btn-secondary btn-sm" onClick={() => navigate('/')}>
            Start Over
          </button>
        </div>
      </header>

      <main className="dash-container">
        
        {/* Header Section - Bento Grid */}
        <header className="dash-header bento-grid slide-up-d1">
          <div className="bento-item bento-main neu-card">
            <div className="dash-greeting">Hey {userName}, your path to...</div>
            <h1 className="dash-role gradient-text">{data.careerRecommendation.title}</h1>
            <p className="dash-role-desc">{data.careerRecommendation.description}</p>
          </div>

          <div className="bento-item bento-stat-salary neu-card">
            <span className="stat-icon">💰</span>
            <div className="stat-lbl">Avg. Salary</div>
            <div className="stat-val fw-900">{data.careerRecommendation.averageSalary}</div>
          </div>

          <div className="bento-item bento-stat-outlook neu-card">
            <span className="stat-icon">📈</span>
            <div className="stat-lbl">Job Outlook</div>
            <div className="stat-val fw-900">{data.careerRecommendation.jobOutlook}</div>
          </div>

          <div className="bento-item bento-reasoning neu-card">
            <div className="flex items-center gap-8 mb-8">
              <span className="stat-icon" style={{ fontSize: '1.2rem' }}>🎯</span>
              <div className="stat-lbl" style={{ marginBottom: 0 }}>Why this role?</div>
            </div>
            <p className="stat-val" style={{ fontSize: '0.88rem', lineHeight: '1.6', color: 'var(--text-light)' }}>
              {data.careerRecommendation.reasoning}
            </p>
          </div>
        </header>

        <div className="dash-grid">
          
          {/* Left Column */}
          <div className="dash-col-left">
            
            {/* Skills & Technologies */}
            <section className="dash-section slide-up-d2">
              <div className="section-heading">
                <div className="icon-box">🧠</div>
                <h2>Core Skills to Master</h2>
              </div>
              <div className="neu-card p-24">
                <div className="skills-wrap">
                  {data?.skillsToLearn?.map(skill => (
                    <span key={skill} className="badge badge-skill">{skill}</span>
                  ))}
                </div>
                
                <div className="divider" />
                
                <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Technologies</h3>
                <div className="tech-list">
                  {data?.technologies?.map(tech => (
                    <div key={tech.name} className="tech-item neu-inset-sm">
                      <div className="tech-info">
                        <div className="fw-600">{tech.name}</div>
                        <div className="text-muted" style={{ fontSize: '0.8rem' }}>{tech.category}</div>
                      </div>
                      <span className={`priority-pill priority-${tech.priority?.toLowerCase() || 'medium'}`}>
                        {tech.priority} Priority
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Curated Courses */}
            <section className="dash-section slide-up-d3">
              <div className="section-heading">
                <div className="icon-box">📚</div>
                <h2>Recommended Courses</h2>
              </div>
              <div className="courses-list">
                {data?.courses?.map((course, i) => (
                  <div key={i} className="neu-card p-24 hover-lift">
                    <div className="flex justify-between items-center" style={{ marginBottom: '12px' }}>
                      <span className={`diff-pill diff-${course.level.toLowerCase()}`}>{course.level}</span>
                      <span className={`free-pill free-${course.free ? 'yes' : 'no'}`}>
                        {course.free ? 'Free' : 'Paid'}
                      </span>
                    </div>
                    <h3 className="fw-700" style={{ fontSize: '1.2rem', marginBottom: '6px' }}>{course.title}</h3>
                    <div className="course-platform">
                      Platform: {course.url?.startsWith('http') ? (
                        <a href={course.url} target="_blank" rel="noopener noreferrer" className="course-link">{course.platform}</a>
                      ) : (
                        <span className="text-accent">{course.platform}</span>
                      )}
                    </div>
                    <p className="text-light" style={{ fontSize: '0.9rem' }}>{course.description}</p>
                  </div>
                ))}
              </div>
            </section>
            
            {/* Project Ideas */}
            <section className="dash-section slide-up-d4">
              <div className="section-heading">
                <div className="icon-box">🛠️</div>
                <h2>Projects to Build Portfolio</h2>
              </div>
              <div className="projects-list">
                {data?.projects?.map((proj, i) => (
                  <div key={i} className="neu-inset p-24">
                    <div className="flex justify-between items-center wrap gap-12" style={{ marginBottom: '12px' }}>
                      <h3 className="fw-700" style={{ fontSize: '1.1rem' }}>{proj.name}</h3>
                      <span className={`diff-pill diff-${proj.difficulty.toLowerCase()}`}>{proj.difficulty}</span>
                    </div>
                    <p className="text-light" style={{ fontSize: '0.9rem', marginBottom: '16px' }}>
                      {proj.description}
                    </p>
                    <div className="flex wrap gap-8 items-center" style={{ marginBottom: '16px' }}>
                      <span className="text-muted" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Skills:</span>
                      {proj?.skills?.map(s => (
                        <span key={s} className="badge" style={{ fontSize: '0.7rem', padding: '3px 10px' }}>{s}</span>
                      ))}
                    </div>
                    <div className="text-accent fw-600" style={{ fontSize: '0.85rem' }}>
                      <span style={{ marginRight: '6px' }}>⏱️</span> 
                      Estimated time: {proj.estimatedTime}
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right Column - Timeline Roadmap */}
          <div className="dash-col-right">
            <section className="dash-section slide-up-d5 sticky-timeline">
              <div className="section-heading">
                <div className="icon-box">🗺️</div>
                <h2>Your Step-by-step Plan</h2>
              </div>
              
              <div className="neu-card p-24">
                <div className="timeline-container">
                  {data?.roadmap?.map((phase, i) => (
                    <div key={phase.phase} className="timeline-phase">
                      <div className="timeline-dot-wrap">
                        <div className="timeline-dot">{phase.phase}</div>
                        {i < data.roadmap.length - 1 && <div className="timeline-connector" />}
                      </div>
                      
                      <div className="timeline-content neu-inset-sm p-20">
                        <div className="flex justify-between items-center wrap gap-8" style={{ marginBottom: '12px' }}>
                          <h3 className="fw-700 text-accent" style={{ fontSize: '1.2rem' }}>{phase.title}</h3>
                          <span className="badge">{phase.duration}</span>
                        </div>
                        
                        <ul className="phase-tasks">
                          {phase?.tasks?.map((task, tIdx) => (
                            <li key={tIdx}>
                              <span className="task-check">✅</span>
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <div className="phase-milestone">
                          <strong>Milestone:</strong> {phase.milestone}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="timeline-end">
                    <div className="timeline-dot" style={{ background: 'var(--neu-bg)', color: 'var(--accent)', border: '2px solid var(--accent)' }}>🎉</div>
                    <div className="fw-700" style={{ marginLeft: '20px', fontSize: '1.1rem' }}>Job Ready!</div>
                  </div>
                </div>
              </div>
            </section>
          </div>

        </div>
      </main>
      
      {/* Footer */}
      <footer className="footer slide-up-d6" style={{ marginTop: '60px' }}>
        <button className="back-to-top" onClick={() => window.scrollTo(0, 0)}>
          Back to Top <span>↑</span>
        </button>
        <p>Built with Advanced AI · Roadmap generated for {userName} · {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}
