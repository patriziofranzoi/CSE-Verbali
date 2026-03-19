import { useEffect } from 'react'

const MODULI = [
  { id:'cartello', label:'Cartello e notifica preliminare', gruppo:'generale' },
  { id:'cancello', label:'Cancello e recinzione perimetrale', gruppo:'generale' },
  { id:'baracca', label:'Baracca e WC di cantiere', gruppo:'generale' },
  { id:'documentazione', label:'Documentazione sicurezza (PSC, POS)', gruppo:'generale' },
  { id:'durc', label:'DURC e documentazione imprese', gruppo:'generale' },
  { id:'dpi', label:'DPI lavoratori', gruppo:'generale' },
  { id:'ponteggio', label:'Ponteggio (PIMUS, disegno, libretto)', gruppo:'specifico' },
  { id:'gru', label:'Gru di cantiere', gruppo:'specifico' },
  { id:'quadro', label:'Quadro elettrico di cantiere', gruppo:'specifico' },
  { id:'scavi', label:'Scavi e sbancamenti', gruppo:'specifico' },
  { id:'linee', label:'Linee aeree e sottoservizi', gruppo:'specifico' },
  { id:'quota', label:'Lavori in quota', gruppo:'specifico' },
]

export default function Step3Moduli({ verbale, updateVerbale, nextStep, prevStep, onEnter, demoMode }) {
  useEffect(() => { onEnter?.() }, [])

  const attivi = verbale.moduli_attivi?.length > 0
    ? verbale.moduli_attivi
    : (demoMode ? ['cartello','cancello','documentazione','durc','dpi','ponteggio','gru','quadro','quota'] : [])

  function toggle(id) {
    if (demoMode) return
    const arr = attivi.includes(id) ? attivi.filter(x => x !== id) : [...attivi, id]
    updateVerbale({ moduli_attivi: arr })
  }

  return (
    <div className="screen-content">
      <div style={{fontSize:12, color:'var(--text-sec)', marginBottom:12}}>
        Seleziona i moduli da includere in questo verbale. Puoi escludere ciò che è già stato verificato nei verbali precedenti.
      </div>

      <div className="slabel">Moduli generali</div>
      <div className="card">
        {MODULI.filter(m => m.gruppo === 'generale').map(m => (
          <div key={m.id} className="trow">
            <button className={`tog ${attivi.includes(m.id) ? 'on' : ''}`} onClick={() => toggle(m.id)}></button>
            <span style={{color: attivi.includes(m.id) ? 'var(--text)' : 'var(--text-hint)'}}>{m.label}</span>
          </div>
        ))}
      </div>

      <div className="slabel">Moduli specifici cantiere</div>
      <div className="card">
        {MODULI.filter(m => m.gruppo === 'specifico').map(m => (
          <div key={m.id} className="trow">
            <button className={`tog ${attivi.includes(m.id) ? 'on' : ''}`} onClick={() => toggle(m.id)}></button>
            <span style={{color: attivi.includes(m.id) ? 'var(--text)' : 'var(--text-hint)'}}>{m.label}</span>
          </div>
        ))}
      </div>

      <div style={{fontSize:11, color:'var(--text-hint)', marginBottom:12}}>
        {attivi.length} moduli selezionati
      </div>

      <button className="btnp" onClick={nextStep}>Avanti → Step 4: Checklist</button>
    </div>
  )
}
