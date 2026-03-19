import { useNavigate } from 'react-router-dom'

export default function TopBar({ title, sub, badge, backTo }) {
  const navigate = useNavigate()
  return (
    <div className="topbar">
      {backTo && (
        <button className="back-btn" onClick={() => navigate(backTo)}>
          ← Indietro
        </button>
      )}
      <div className="topbar-row">
        <div>
          <h1>{title}</h1>
          {sub && <div className="sub">{sub}</div>}
        </div>
        {badge && <div className="topbar-badge">{badge}</div>}
      </div>
    </div>
  )
}
