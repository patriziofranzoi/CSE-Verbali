import { useEffect } from 'react'

const DEMO_LAV = [
  { impresa:'Carboniero', lavorazione:'Murature interne', inizio:0, durata:45, colore:'#1B4F8A' },
  { impresa:'Carboniero', lavorazione:'Intonaci esterni', inizio:30, durata:40, colore:'#378ADD' },
  { impresa:'Rossi Ponteggi', lavorazione:'Montaggio ponteggio', inizio:10, durata:35, colore:'#3B6D11' },
  { impresa:'Elettro Nord', lavorazione:'Impianto elettrico', inizio:40, durata:30, colore:'#E24B4A' },
]

const FRASI_COORD = [
  'Le imprese operano in aree distinte e compartimentate',
  'Non sussistono rischi di interferenza tra le lavorazioni',
  'È necessario coordinare le seguenti attività lavorative',
  'Le lavorazioni avvengono in sequenza temporale senza sovrapposizioni',
  'La cooperazione tra datori di lavoro è garantita',
]

export default function Step2Lavorazioni({ verbale, updateVerbale, nextStep, prevStep, onEnter, demoMode }) {
  useEffect(() => { onEnter?.() }, [])
  const lavorazioni = verbale.lavorazioni?.length > 0 ? verbale.lavorazioni : (demoMode ? DEMO_LAV : [])
  const frasi = verbale.frasi_coord || []

  const colori = ['#1B4F8A','#378ADD','#3B6D11','#854F0B','#A32D2D','#5F5E5A','#185FA5','#639922']

  function addLav() {
    updateVerbale({ lavorazioni: [...lavorazioni, { impresa:'', lavorazione:'', inizio:0, durata:30, colore: colori[lavorazioni.length % colori.length] }] })
  }

  function updateLav(i, k, v) {
    const arr = [...lavorazioni]
    arr[i] = { ...arr[i], [k]: v }
    updateVerbale({ lavorazioni: arr })
  }

  function toggleFrase(f) {
    updateVerbale({ frasi_coord: frasi.includes(f) ? frasi.filter(x => x !== f) : [...frasi, f] })
  }

  // Detect overlaps
  const hasOverlap = lavorazioni.some((a, i) =>
    lavorazioni.some((b, j) => i !== j && a.impresa !== b.impresa &&
      a.inizio < b.inizio + b.durata && a.inizio + a.durata > b.inizio)
  )

  return (
    <div className="screen-content">
      <div className="slabel">Cronoprogramma dinamico</div>
      <div className="card">
        {lavorazioni.map((l, i) => (
          <div key={i} className="ganttrow">
            <div className="gantlbl">{l.lavorazione || `Lav. ${i+1}`}</div>
            <div className="ganttrack">
              <div className="gantbar" style={{left:`${l.inizio}%`, width:`${l.durata}%`, background: l.colore || '#1B4F8A'}}>
                {l.impresa}
              </div>
            </div>
          </div>
        ))}
        {hasOverlap && <div style={{fontSize:10,color:'var(--red)',marginTop:6}}>⚠ Sovrapposizione rilevata tra lavorazioni</div>}
      </div>

      {hasOverlap && <div className="alert warn">⚠ Verificare le interferenze tra lavorazioni sovrapposte</div>}

      {!demoMode && (
        <>
          <div className="slabel">Aggiungi lavorazione</div>
          {lavorazioni.map((l, i) => (
            <div key={i} className="card">
              <div className="ctitle" style={{fontSize:12,marginBottom:6}}>Lavorazione {i+1}</div>
              <label className="inp-label">Impresa</label>
              <input className="inp" value={l.impresa} onChange={e => updateLav(i,'impresa',e.target.value)} />
              <label className="inp-label">Lavorazione</label>
              <input className="inp" value={l.lavorazione} onChange={e => updateLav(i,'lavorazione',e.target.value)} />
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginTop:6}}>
                <div>
                  <label className="inp-label">Inizio (%)</label>
                  <input className="inp" type="number" min="0" max="100" value={l.inizio} onChange={e => updateLav(i,'inizio',Number(e.target.value))} />
                </div>
                <div>
                  <label className="inp-label">Durata (%)</label>
                  <input className="inp" type="number" min="5" max="100" value={l.durata} onChange={e => updateLav(i,'durata',Number(e.target.value))} />
                </div>
              </div>
            </div>
          ))}
          <button className="btno" onClick={addLav}>+ Aggiungi lavorazione</button>
        </>
      )}

      <div className="slabel">Coordinamento interferenze</div>
      <div className="card">
        {FRASI_COORD.map(f => (
          <div key={f} className="crow" onClick={() => !demoMode && toggleFrase(f)}>
            <div className={`cbox ${frasi.includes(f) ? 'si' : ''}`} style={{cursor: demoMode ? 'default':'pointer'}}>
              {frasi.includes(f) ? '✓' : ''}
            </div>
            <span style={{fontSize:12}}>{f}</span>
          </div>
        ))}
      </div>

      <button className="btnp" style={{marginTop:8}} onClick={nextStep}>Avanti → Step 3: Moduli</button>
    </div>
  )
}
