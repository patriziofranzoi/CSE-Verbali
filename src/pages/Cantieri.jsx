import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../config/supabase.js'
import TopBar from '../components/TopBar.jsx'

const DEMO_CANTIERI = [
  { id: 'demo-1', nome: 'Via Dante Alighieri, 9', indirizzo: 'Costabissara (VI)', committente: 'Griso Lidia', stato: 'attivo', verbali_count: 4, durc_ok: true },
  { id: 'demo-2', nome: 'Via Roma, 42', indirizzo: 'Vicenza', committente: 'Condominio Rossi', stato: 'attivo', verbali_count: 2, durc_ok: false },
  { id: 'demo-3', nome: 'Viale Europa, 15', indirizzo: 'Arzignano (VI)', committente: 'Bianchi S.r.l.', stato: 'attivo', verbali_count: 1, durc_ok: true },
]

export default function Cantieri({ demoMode, setDemoMode }) {
  const navigate = useNavigate()
  const [cantieri, setCantieri] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => {
    if (demoMode) { setCantieri(DEMO_CANTIERI); setLoading(false); return }
    loadCantieri()
  }, [demoMode])

  async function loadCantieri() {
    setLoading(true)
    const { data } = await supabase.from('cantieri').select('*').order('created_at', { ascending: false })
    setCantieri(data || [])
    setLoading(false)
  }

  async function deleteCantiere(id) {
    await supabase.from('cantieri').delete().eq('id', id)
    setDeleteId(null)
    loadCantieri()
  }

  function openCantiere(id) {
    localStorage.setItem('lastCantiereId', id)
    navigate(`/cantiere/${id}/anagrafica`)
  }

  const durcAlert = cantieri.filter(c => c.durc_ok === false).length

  return (
    <>
      <TopBar title="Cantieri" sub="I tuoi cantieri attivi" badge="CSE" />
      <div className="screen-content">
        <div className="srow">
          <div className="sc"><div className="sl">Cantieri attivi</div><div className="sv">{cantieri.length}</div></div>
          <div className="sc"><div className="sl">DURC in scadenza</div><div className="sv" style={{color: durcAlert > 0 ? 'var(--red)' : 'var(--green)'}}>{durcAlert}</div></div>
        </div>

        {durcAlert > 0 && <div className="alert danger">⚠ {durcAlert} cantiere con DURC in scadenza</div>}

        <div style={{display:'flex', gap:8, marginBottom:14}}>
          <button className="btnp" style={{flex:2}} onClick={() => navigate('/cantiere/nuovo')}>+ Nuovo cantiere</button>
          <button onClick={() => { setDemoMode(true); navigate('/cantiere/demo-1/anagrafica') }}
            style={{flex:1, background:'var(--amber-light)', color:'var(--amber)', border:'1px solid var(--amber)', borderRadius:'var(--rs)', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'IBM Plex Sans,sans-serif'}}>
            Demo
          </button>
        </div>

        <div className="slabel">Cantieri</div>

        {loading && <div className="loading"><div className="spinner"></div>Caricamento...</div>}

        {!loading && cantieri.length === 0 && (
          <div className="card" style={{textAlign:'center', padding:30}}>
            <div style={{fontSize:32, marginBottom:10}}>🏗</div>
            <div className="ctitle">Nessun cantiere</div>
            <div className="csub">Crea il tuo primo cantiere</div>
          </div>
        )}

        {cantieri.map(c => (
          <div key={c.id} className="card" style={{cursor:'pointer'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}
              onClick={() => openCantiere(c.id)}>
              <div style={{flex:1}}>
                <div className="ctitle">{c.nome}</div>
                <div className="csub">{c.committente} · {c.indirizzo}</div>
              </div>
              <span className={`badge ${c.durc_ok === false ? 'ba' : 'bg'}`} style={{marginLeft:8, flexShrink:0}}>
                {c.durc_ok === false ? 'DURC scad.' : 'Attivo'}
              </span>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:10}}>
              <span style={{fontSize:11, color:'var(--text-sec)'}}>
                Verbali: {c.verbali_count || 0}
              </span>
              <div style={{display:'flex', gap:6}}>
                <button className="btnsm" style={{padding:'4px 10px'}}
                  onClick={() => openCantiere(c.id)}>Apri</button>
                <button className="btnsm" style={{padding:'4px 10px', color:'var(--blue)'}}
                  onClick={() => { /* duplica */ }}>Duplica</button>
                {!demoMode && (
                  <button className="btnsm" style={{padding:'4px 10px', color:'var(--red)'}}
                    onClick={() => setDeleteId(c.id)}>Elimina</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {deleteId && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Elimina cantiere</h3>
            <p>Sei sicuro? Tutti i verbali e i dati associati verranno eliminati definitivamente.</p>
            <div className="modal-btns">
              <button className="btnsm" style={{padding:11}} onClick={() => setDeleteId(null)}>Annulla</button>
              <button className="btnp" style={{background:'var(--red)', flex:1}}
                onClick={() => deleteCantiere(deleteId)}>Elimina definitivamente</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
