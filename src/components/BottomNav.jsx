import { useNavigate, useLocation, useParams } from 'react-router-dom'

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const cantiereId = id || localStorage.getItem('lastCantiereId')

  const isActive = (path) => location.pathname.includes(path)

  return (
    <nav className="bnav">
      <button className={`nbtn ${location.pathname === '/' ? 'active' : ''}`}
        onClick={() => navigate('/')}>
        <div className="ndot">🏗</div>
        <span>Cantieri</span>
      </button>
      <button className={`nbtn ${isActive('anagrafica') ? 'active' : ''}`}
        onClick={() => cantiereId && navigate(`/cantiere/${cantiereId}/anagrafica`)}>
        <div className="ndot">👥</div>
        <span>Anagrafica</span>
      </button>
      <button className={`nbtn ${isActive('verbale') ? 'active' : ''}`}
        onClick={() => cantiereId && navigate(`/cantiere/${cantiereId}/verbale/nuovo/step1`)}>
        <div className="ndot">📋</div>
        <span>Verbale</span>
      </button>
      <button className={`nbtn ${isActive('archivio') ? 'active' : ''}`}
        onClick={() => cantiereId && navigate(`/cantiere/${cantiereId}/archivio`)}>
        <div className="ndot">🗂</div>
        <span>Archivio</span>
      </button>
    </nav>
  )
}
