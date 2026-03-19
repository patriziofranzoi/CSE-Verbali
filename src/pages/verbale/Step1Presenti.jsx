import { useEffect } from 'react'

const DEMO_PRESENTI = [
  { impresa: 'Carboniero Costruzioni', responsabile: 'Mario Rossi', lavoratori: 3 },
  { impresa: 'Rossi Ponteggi S.r.l.', responsabile: 'Luigi Bianchi', lavoratori: 1 },
]

export default function Step1Presenti({ verbale, updateVerbale, nextStep, prevStep, onEnter, demoMode }) {
  useEffect(() => { onEnter?.() }, [])
  const presenti = verbale.presenti?.length > 0 ? verbale.presenti : (demoMode ? DEMO_PRESENTI : [])

  function addPresente() {
    updateVerbale({ presenti: [...presenti, { impresa: '', responsabile: '', lavoratori: 1 }] })
  }

  function updatePresente(i, k, v) {
    const arr = [...presenti]
    arr[i] = { ...arr[i], [k]: v }
    updateVerbale({ presenti: arr })
  }

  function removePresente(i) {
    updateVerbale({ presenti: presenti.filter((_, idx) => idx !== i) })
  }

  return (
    <div className="screen-content">
      <div className="slabel">Chi è in cantiere oggi</div>

      {presenti.map((p, i) => (
        <div key={i} className="card">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
            <div className="ctitle" style={{fontSize:13}}>Impresa {i + 1}</div>
            {!demoMode && <button onClick={() => removePresente(i)} style={{background:'none',border:'none',color:'var(--red)',cursor:'pointer',fontSize:12}}>✕ Rimuovi</button>}
          </div>
          <label className="inp-label">Ragione sociale</label>
          <input className="inp" placeholder="Nome impresa" value={p.impresa} onChange={e => updatePresente(i, 'impresa', e.target.value)} readOnly={demoMode} />
          <label className="inp-label">Responsabile / Preposto</label>
          <input className="inp" placeholder="Nome e cognome" value={p.responsabile} onChange={e => updatePresente(i, 'responsabile', e.target.value)} readOnly={demoMode} />
          <label className="inp-label">N° lavoratori presenti</label>
          <input className="inp" type="number" min="1" value={p.lavoratori} onChange={e => updatePresente(i, 'lavoratori', e.target.value)} readOnly={demoMode} />
        </div>
      ))}

      {!demoMode && <button className="btno" onClick={addPresente}>+ Aggiungi impresa / lav. autonomo</button>}

      <button className="btnp" style={{marginTop:14}} onClick={nextStep}>Avanti → Step 2: Lavorazioni</button>
    </div>
  )
}
