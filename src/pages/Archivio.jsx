import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../config/supabase.js'
import TopBar from '../components/TopBar.jsx'

const DEMO_VERBALI = [
  { id:'v1', numero:4, data_sopralluogo:'2025-02-12', stato:'archiviato', prescrizioni:['Adeguare ponteggio','Rinnovare DURC Rossi Ponteggi'] },
  { id:'v2', numero:3, data_sopralluogo:'2025-01-28', stato:'archiviato', prescrizioni:['Integrare documentazione gru'] },
  { id:'v3', numero:2, data_sopralluogo:'2025-01-20', stato:'archiviato', prescrizioni:[] },
  { id:'v4', numero:5, data_sopralluogo:'2025-03-19', stato:'bozza', prescrizioni:[] },
]

export default function Archivio({ demoMode }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [verbali, setVerbali] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    localStorage.setItem('lastCantiereId', id)
    if (demoMode || id === 'demo-1') { setVerbali(DEMO_VERBALI); setLoading(false); return }
    load()
  }, [id])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('verbali').select('*').eq('cantiere_id', id).order('numero', { ascending: false })
    setVerbali(data || [])
    setLoading(false)
  }

  return (
    <>
      <TopBar title="Archivio verbali" sub="Storico sopralluoghi" badge="CSE" backTo={`/cantiere/${id}/anagrafica`} />
      <div className="screen-content">

        <div className="slabel">Verbali archiviati</div>

        {loading && <div className="loading"><div className="spinner"></div>Caricamento...</div>}

        {verbali.filter(v => v.stato === 'archiviato').map(v => (
          <div key={v.id} className="card">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div className="ctitle">Verbale N°{v.numero}</div>
                <div className="csub">
                  {v.data_sopralluogo ? new Date(v.data_sopralluogo).toLocaleDateString('it-IT') : '—'}
                  {v.prescrizioni?.length > 0 ? ` · ${v.prescrizioni.length} prescrizioni` : ' · Nessuna prescrizione'}
                </div>
              </div>
              <span className="badge bb">Archiviato</span>
            </div>
            {v.prescrizioni?.length > 0 && (
              <div style={{marginTop:8,padding:'8px 10px',background:'var(--amber-light)',borderRadius:'var(--rs)',fontSize:11,color:'var(--amber)'}}>
                {v.prescrizioni.map((p,i) => <div key={i}>· {p}</div>)}
              </div>
            )}
            <div className="btnrow">
              <button className="btnsm">📄 PDF</button>
              <button className="btnsm">📝 Word</button>
              <button className="btnsm">📤 Condividi</button>
            </div>
          </div>
        ))}

        <div className="slabel">Bozze in corso</div>
        {verbali.filter(v => v.stato === 'bozza').map(v => (
          <div key={v.id} className="card ab">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div className="ctitle">Verbale N°{v.numero}</div>
                <div className="csub">Ultima modifica: {v.data_sopralluogo ? new Date(v.data_sopralluogo).toLocaleDateString('it-IT') : 'oggi'}</div>
              </div>
              <span className="badge ba">Bozza</span>
            </div>
            <div style={{display:'flex',gap:8,marginTop:10}}>
              <button className="btnp" style={{margin:0,flex:2,padding:10,fontSize:13}}
                onClick={() => navigate(`/cantiere/${id}/verbale/${v.id}/step1`)}>
                Continua compilazione
              </button>
              <button style={{flex:1,padding:10,borderRadius:'var(--rs)',border:'1px solid #f0a0a0',background:'var(--bg-card)',cursor:'pointer',fontSize:11,color:'var(--red)',fontFamily:'IBM Plex Sans,sans-serif'}}>
                Archivia
              </button>
            </div>
          </div>
        ))}

        <div className="slabel">Carica verbale cartaceo</div>
        <div className="card dashed" style={{cursor:'pointer'}}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <div style={{fontSize:24}}>📄</div>
            <div><div className="ctitle">Carica verbale precedente</div><div className="csub">PDF o immagine scansionata</div></div>
          </div>
        </div>

        <div className="slabel">Backup</div>
        <div className="card">
          <div className="btnrow">
            <button className="btnsm" style={{padding:11}}>📦 Esporta backup</button>
            <button className="btnsm" style={{padding:11}}>🔄 Ripristina backup</button>
          </div>
        </div>
      </div>
    </>
  )
}
