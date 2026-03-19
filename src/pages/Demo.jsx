import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar.jsx'

export default function Demo({ setDemoMode }) {
  const navigate = useNavigate()

  function avviaDemo() {
    setDemoMode(true)
    localStorage.setItem('lastCantiereId', 'demo-1')
    navigate('/cantiere/demo-1/anagrafica')
  }

  return (
    <>
      <TopBar title="Modalità Demo" sub="Dati di esempio precompilati" badge="DEMO" backTo="/" />
      <div className="screen-content">
        <div style={{textAlign:'center', padding:'30px 0 20px'}}>
          <div style={{fontSize:48, marginBottom:12}}>🏗</div>
          <div style={{fontSize:18, fontWeight:600, marginBottom:8}}>CSE Verbali — Demo</div>
          <div style={{fontSize:13, color:'var(--text-sec)', lineHeight:1.6, marginBottom:24}}>
            Esplora l'app con un cantiere di esempio già compilato.<br/>
            I dati non vengono salvati.
          </div>
        </div>

        <div className="card" style={{marginBottom:10}}>
          <div className="ctitle">Via Dante Alighieri, 9 – Costabissara</div>
          <div className="csub">Griso Lidia · Manutenzione straordinaria</div>
          <div style={{marginTop:10, fontSize:12, color:'var(--text-sec)'}}>
            <div>✓ Anagrafica completa con organigramma</div>
            <div>✓ 2 imprese con documentazione</div>
            <div>✓ Verbale N°5 in corso di compilazione</div>
            <div>✓ 4 verbali archiviati con prescrizioni</div>
          </div>
        </div>

        <div className="alert warn">⚠ In modalità demo i dati non vengono salvati nel database</div>

        <button className="btnp" onClick={avviaDemo}>Avvia demo →</button>
        <button className="btno" onClick={() => navigate('/')}>Torna all'app reale</button>
      </div>
    </>
  )
}
