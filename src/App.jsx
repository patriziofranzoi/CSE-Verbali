import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import Cantieri from './pages/Cantieri.jsx'
import Anagrafica from './pages/Anagrafica.jsx'
import NuovoCantiere from './pages/NuovoCantiere.jsx'
import Verbale from './pages/Verbale.jsx'
import Archivio from './pages/Archivio.jsx'
import Demo from './pages/Demo.jsx'
import BottomNav from './components/BottomNav.jsx'

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [demoMode, setDemoMode] = useState(false)

  const showNav = ['/', '/archivio', '/demo'].some(p => location.pathname === p)
    || location.pathname.startsWith('/cantiere/')

  return (
    <div className="shell">
      {demoMode && (
        <div className="demo-banner">
          MODALITÀ DEMO — I dati non vengono salvati
          <button onClick={() => { setDemoMode(false); navigate('/') }}
            style={{marginLeft:10,background:'none',border:'none',color:'white',cursor:'pointer',textDecoration:'underline',fontSize:11}}>
            Esci
          </button>
        </div>
      )}
      <Routes>
        <Route path="/" element={<Cantieri demoMode={demoMode} setDemoMode={setDemoMode} />} />
        <Route path="/cantiere/:id/anagrafica" element={<Anagrafica demoMode={demoMode} />} />
        <Route path="/cantiere/nuovo" element={<NuovoCantiere />} />
        <Route path="/cantiere/:id/verbale/:vid/*" element={<Verbale demoMode={demoMode} />} />
        <Route path="/cantiere/:id/archivio" element={<Archivio demoMode={demoMode} />} />
        <Route path="/demo" element={<Demo setDemoMode={setDemoMode} />} />
      </Routes>
      {showNav && <BottomNav />}
    </div>
  )
}
