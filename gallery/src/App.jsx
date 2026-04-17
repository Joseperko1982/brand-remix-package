import { useState } from 'react'
import data from './data.json'
import './App.css'

const agents = Object.entries(data)

function KeyframeStrip({ keyframes, color }) {
  return (
    <div className="kf-strip">
      {keyframes.map((kf, i) => (
        <div key={i} className="kf-dot-group">
          <div
            className="kf-dot"
            style={{ background: i === 0 ? color : 'var(--border)' }}
          />
          {i < keyframes.length - 1 && <div className="kf-line" />}
        </div>
      ))}
    </div>
  )
}

function StoryCard({ ad, agent, index, onSelect }) {
  const kfs = ad.keyframes || []
  return (
    <div
      className="story-card"
      onClick={() => onSelect(ad)}
      style={{ '--agent-color': agent.color, animationDelay: `${index * 80}ms` }}
    >
      <div className="sc-header">
        <span className="sc-persona">{ad.persona}</span>
        <span className="sc-template">{ad.template}</span>
      </div>
      <div className="sc-stage">{ad.stage}</div>

      <div className="sc-arc">{ad.narrative_arc}</div>

      <div className="sc-keyframes">
        {kfs.map((kf, i) => (
          <div key={i} className="sc-kf">
            <span className="sc-kf-num">KF{kf.kf}</span>
            <span className="sc-kf-headline">{kf.headline}</span>
          </div>
        ))}
      </div>

      <div className="sc-footer">
        <span className="sc-cta">{ad.cta}</span>
        <span className="sc-colour">{ad.vehicle_colour}</span>
      </div>
    </div>
  )
}

function AdDetail({ ad, agent, onClose }) {
  const [activeKf, setActiveKf] = useState(0)
  const kfs = ad.keyframes || []
  const kf = kfs[activeKf] || {}
  const np = kf.nano_prompt || {}

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-panel" onClick={e => e.stopPropagation()}>
        <button className="detail-close" onClick={onClose}>×</button>

        <div className="detail-header">
          <div className="detail-id" style={{ color: agent.color }}>{ad.ad_id}</div>
          <div className="detail-meta">
            {ad.template} — {ad.template_name} · {ad.vehicle_colour}
          </div>
          <div className="detail-arc">{ad.narrative_arc}</div>
        </div>

        {/* Keyframe selector */}
        <div className="kf-tabs">
          {kfs.map((k, i) => (
            <button
              key={i}
              className={`kf-tab ${activeKf === i ? 'active' : ''}`}
              onClick={() => setActiveKf(i)}
              style={activeKf === i ? { borderColor: agent.color } : {}}
            >
              KF{k.kf}
            </button>
          ))}
        </div>

        {/* Active keyframe */}
        <div className="kf-detail">
          <div className="kf-headline">{kf.headline}</div>
          <div className="kf-scene">{kf.scene}</div>

          <div className="kf-section">
            <div className="kf-label">Seed</div>
            <div className="kf-value">{kf.seed_image || 'none'}</div>
          </div>

          <div className="kf-section">
            <div className="kf-label">Model</div>
            <div className="kf-value">{np.model} · {np.aspect_ratio}</div>
          </div>

          <div className="kf-section">
            <div className="kf-label">Drift</div>
            <div className="kf-value">{np.drift_notes}</div>
          </div>

          <div className="kf-section">
            <div className="kf-label">Nano Banana Prompt</div>
            <div className="kf-prompt">{np.prompt}</div>
          </div>
        </div>

        <div className="detail-cta">{ad.cta}</div>
      </div>
    </div>
  )
}

function AgentTab({ agentKey, agent, active, onClick }) {
  return (
    <button
      className={`tab ${active ? 'active' : ''}`}
      onClick={onClick}
      style={{ '--agent-color': agent.color }}
    >
      <span className="tab-name">{agentKey.toUpperCase()}</span>
      <span className="tab-drift">{agent.drift}%</span>
    </button>
  )
}

export default function App() {
  const [activeAgent, setActiveAgent] = useState('kai')
  const [selectedAd, setSelectedAd] = useState(null)
  const agentData = data[activeAgent]

  return (
    <div className="app">
      <header>
        <div className="logo">MUSE</div>
        <div className="subtitle">ELEXIO Creative Gallery</div>
      </header>

      <nav className="tabs">
        {agents.map(([key, agent]) => (
          <AgentTab
            key={key}
            agentKey={key}
            agent={agent}
            active={activeAgent === key}
            onClick={() => setActiveAgent(key)}
          />
        ))}
      </nav>

      <div className="agent-info">
        <h2 style={{ color: agentData.color }}>{agentData.title}</h2>
        <div className="drift-bar">
          <div className="drift-track">
            <div className="drift-fill" style={{ width: `${agentData.drift}%`, background: agentData.color }} />
          </div>
          <span className="drift-label">{agentData.drift}% drift</span>
        </div>
        <div className="agent-stats">
          <span>{agentData.ad_count} ads</span>
          <span>·</span>
          <span>{agentData.prompt_count} keyframes</span>
          <span>·</span>
          <span>4 personas</span>
        </div>
      </div>

      <div className="story-grid">
        {(agentData.ads || []).map((ad, i) => (
          <StoryCard
            key={`${activeAgent}-${i}`}
            ad={ad}
            agent={agentData}
            index={i}
            onSelect={setSelectedAd}
          />
        ))}
      </div>

      {selectedAd && (
        <AdDetail
          ad={selectedAd}
          agent={agentData}
          onClose={() => setSelectedAd(null)}
        />
      )}
    </div>
  )
}
