import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../config/supabase.js'
import TopBar from '../components/TopBar.jsx'

const DEMO = {
  cantiere: { id:'demo-1', nome:'Via Dante Alighieri, 9', indirizzo:'Costabissara (VI)', committente:'Griso Lidia', cse:'Franzoi ing. Patrizio', csp:'—', progettista:'—', direttore_lavori:'—', responsabile_lavori:'—', data_inizio:'2025-01-15', data_notifica:'2025-01-10', durata_giorni:180, importo_lavori:128000, costi_sicurezza:4200, moduli:{ponteggio:true,gru:true,wc:true,baracca:true,quadro_elettrico:true} },
  imprese: [
    { id:'imp-1', ragione_sociale:'Carboniero Costruzioni S.r.l.', piva:'03775030244', tipo:'affidataria', durc_emissione:'2024-11-12', pos:true, pimus:true, durc:true, visura:true, patente_punti:true, attestati_lavoratori:false },
    { id:'imp-2', ragione_sociale:'Rossi Ponteggi S.r.l.', piva:'', tipo:'subappalto', subappalto_di:'imp-1', durc_emissione:'2024-09-05', pos:true, pimus:true, durc:false, visura:true, patente_punti:false, attestati_lavoratori:false },
  ]
}

function durcScadenza(dataEmissione) {
  if (!dataEmissione) return null
  const d = new Date(dataEmissione)
  d.setDate(d.getDate() + 120)
  return d
}

function finePrevisione(dataInizio, giorni) {
  if (!dataInizio || !giorni) return null
  const d = new Date(dataInizio)
  d.setDate(d.getDate() + parseInt(giorni))
  return d.toLocaleDateString('it-IT')
}

export default function Anagrafica({ demoMode }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cantiere, setCantiere] = useState(null)
  const [imprese, setImprese] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})

  useEffect(() => {
    localStorage.setItem('lastCantiereId', id)
    if (demoMode || id === 'demo-1') { setCantiere(DEMO.cantiere); setImprese(DEMO.imprese); setLoading(false); return }
    load()
  }, [id, demoMode])

  async function load() {
    setLoading(true)
    const { data: c } = await supabase.from('cantieri').select('*').eq('id', id).single()
    const { data: imp } = await supabase.from('imprese').select('*').eq('cantiere_id', id)
    setCantiere(c); setImprese(imp || []); setForm(c || {}); setLoading(false)
  }

  async function saveEdit() {
    await supabase.from('cantieri').update(form).eq('id', id)
    setCantiere(form); setEditing(false)
  }

  const moduli = cantiere?.moduli || {}
  const moduliLabels = {ponteggio:'Ponteggio',gru:'Gru',wc:'WC',baracca:'Baracca',quadro_elettrico:'Quadro elett.',scavi:'Scavi',linee_aeree:'Linee aeree',lavori_quota:'Quota',sottoservizi:'Sottoservizi'}

  if (loading) return <><TopBar title="Anagrafica" backTo="/" /><div className="loading"><div className="spinner"></div>Caricamento...</div></>
  if (!cantiere) return <><TopBar title="Anagrafica" backTo="/" /><div className="screen-content"><div className="alert danger">Cantiere non trovato</div></div></>

  return (
    <>
      <TopBar title="Anagrafica" sub={cantiere.nome} badge="CSE" backTo="/" />
      <div className="screen-content">

        <div className="hero">
          <div className="hl">Cantiere</div>
          <div className="hn">{cantiere.nome}</div>
          <div className="ha">{cantiere.indirizzo} · {cantiere.committente}</div>
          <div className="hm">
            {cantiere.data_inizio && <span>Inizio: {new Date(cantiere.data_inizio).toLocaleDateString('it-IT')}</span>}
            {cantiere.durata_giorni && cantiere.data_inizio && <span>Fine: {finePrevisione(cantiere.data_inizio, cantiere.durata_giorni)}</span>}
            {cantiere.importo_lavori && <span>€ {Number(cantiere.importo_lavori).toLocaleString('it-IT')}</span>}
          </div>
          <div className="pills">
            {Object.entries(moduli).map(([k, v]) => v && <span key={k} className="pill on">{moduliLabels[k]}</span>)}
          </div>
        </div>

        <div className="slabel">Figure del cantiere</div>
        {editing ? (
          <div className="card">
            {[['cse','CSE'],['committente','Committente'],['csp','CSP'],['progettista','Progettista'],['direttore_lavori','Direttore Lavori'],['responsabile_lavori','Resp. Lavori']].map(([k,l]) => (
              <div key={k}>
                <label className="inp-label">{l}</label>
                <input className="inp" value={form[k]||''} onChange={e => setForm(f=>({...f,[k]:e.target.value}))} />
              </div>
            ))}
            <div style={{display:'flex',gap:8,marginTop:12}}>
              <button className="btnsm" style={{padding:10}} onClick={() => setEditing(false)}>Annulla</button>
              <button className="btnp" style={{marginTop:0,flex:1}} onClick={saveEdit}>Salva modifiche</button>
            </div>
          </div>
        ) : (
          <div className="card">
            {[['CSE', cantiere.cse],['Committente', cantiere.committente],['CSP', cantiere.csp],['Progettista', cantiere.progettista],['DL', cantiere.direttore_lavori],['Resp. Lavori', cantiere.responsabile_lavori]].map(([l,v]) => (
              <div key={l} className="dr"><span className="dl">{l}</span><span className="dv">{v||'—'}</span></div>
            ))}
            {!demoMode && <button className="btno" style={{marginTop:10}} onClick={() => { setEditing(true); setForm(cantiere) }}>✏️ Modifica anagrafica</button>}
          </div>
        )}

        <div className="slabel">Organigramma</div>
        <div className="card">
          <div className="orgwrap">
            <div className="orgchart">
              <div className="orgrow"><div className="orgnode top">{cantiere.committente}<br/><span style={{fontSize:9,opacity:.8}}>(Committente)</span></div></div>
              <div className="orgline"><div className="orgv"></div></div>
              <div className="orgrow" style={{gap:16}}>
                <div className="orgnode mid">{cantiere.cse||'CSE'}<br/><span style={{fontSize:9}}>(CSE)</span></div>
                <div className="orgnode mid">{cantiere.direttore_lavori||'—'}<br/><span style={{fontSize:9}}>(DL)</span></div>
              </div>
              {imprese.filter(i => i.tipo === 'affidataria').length > 0 && <>
                <div className="orgline" style={{marginLeft:'-60px'}}><div className="orgv"></div></div>
                <div className="orgrow">
                  {imprese.filter(i => i.tipo === 'affidataria').map(i => (
                    <div key={i.id} className="orgnode imp">{i.ragione_sociale}<br/><span style={{fontSize:9}}>(Affidataria)</span></div>
                  ))}
                </div>
                {imprese.filter(i => i.tipo === 'subappalto').length > 0 && <>
                  <div className="orgline"><div className="orghconn"></div></div>
                  <div className="orgrow" style={{gap:8}}>
                    {imprese.filter(i => i.tipo === 'subappalto').map(i => (
                      <div key={i.id} className={`orgnode ${i.durc ? 'imp' : 'impw'}`}>{i.ragione_sociale}<br/><span style={{fontSize:9}}>(Sub)</span></div>
                    ))}
                  </div>
                </>}
              </>}
            </div>
          </div>
        </div>

        <div className="slabel">Imprese e documentazione</div>
        {imprese.map(imp => {
          const scad = durcScadenza(imp.durc_emissione)
          const scaduta = scad && scad < new Date()
          return (
            <div key={imp.id} className={`card ${scaduta ? 'ar' : ''}`}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                <div>
                  <div className="ctitle">{imp.ragione_sociale}</div>
                  <div className="csub">{imp.tipo === 'affidataria' ? 'Affidataria' : 'Subappalto'}{imp.piva ? ` · P.IVA ${imp.piva}` : ''}</div>
                </div>
                <span className={`badge ${scaduta ? 'br' : 'bg'}`}>{scaduta ? 'DURC scad.' : 'DURC ok'}</span>
              </div>
              {imp.durc_emissione && (
                <div style={{marginTop:8}}>
                  <div className="dr" style={{fontSize:12}}><span className="dl">Emissione DURC</span><span>{new Date(imp.durc_emissione).toLocaleDateString('it-IT')}</span></div>
                  <div className="dr" style={{fontSize:12}}><span className="dl">Scadenza +120gg</span><span style={{color: scaduta ? 'var(--red)' : 'var(--green)', fontWeight:500}}>{scad?.toLocaleDateString('it-IT')} {scaduta ? '· scaduto' : '✓'}</span></div>
                </div>
              )}
              <div className="docgrid">
                {[['pos','POS'],['durc','DURC'],['visura','Visura'],['patente_punti','Patente punti'],['attestati_lavoratori','Attestati lav.'],['pimus','PIMUS']].map(([k,l]) => (
                  <div key={k} className="docitem">
                    <div className={`docdot ${imp[k] ? 'ok' : 'ko'}`}></div>
                    {l}
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {!demoMode && <button className="btno">+ Aggiungi impresa / lav. autonomo</button>}

        <div className="slabel">Date e importi</div>
        <div className="card">
          {[
            ['Inizio lavori', cantiere.data_inizio ? new Date(cantiere.data_inizio).toLocaleDateString('it-IT') : '—'],
            ['Notifica preliminare', cantiere.data_notifica ? new Date(cantiere.data_notifica).toLocaleDateString('it-IT') : '—'],
            ['Durata prevista', cantiere.durata_giorni ? `${cantiere.durata_giorni} gg` : '—'],
            ['Fine prevista', finePrevisione(cantiere.data_inizio, cantiere.durata_giorni) || '—'],
            ['Importo lavori', cantiere.importo_lavori ? `€ ${Number(cantiere.importo_lavori).toLocaleString('it-IT')}` : '—'],
            ['Costi sicurezza', cantiere.costi_sicurezza ? `€ ${Number(cantiere.costi_sicurezza).toLocaleString('it-IT')}` : '—'],
          ].map(([l,v]) => <div key={l} className="dr"><span className="dl">{l}</span><span className="dv">{v}</span></div>)}
        </div>

        <button className="btnp" style={{marginTop:8}}
          onClick={() => navigate(`/cantiere/${id}/verbale/nuovo/step1`)}>
          + Nuovo verbale di sopralluogo
        </button>
      </div>
    </>
  )
}
