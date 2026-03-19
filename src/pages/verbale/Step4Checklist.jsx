import { useEffect } from 'react'

const VOCI = {
  cartello: [
    { id:'cartello_esposto', label:'Il cartello è esposto, visibile e completo' },
    { id:'notifica_esposta', label:'La notifica preliminare è esposta all\'ingresso' },
  ],
  cancello: [
    { id:'cancello_funzionale', label:'Il cancello è funzionale e rimane chiuso' },
    { id:'recinzione_completa', label:'La recinzione è completa e regolamentare' },
    { id:'recinzione_segnaletica', label:'La segnaletica di cantiere è presente' },
  ],
  baracca: [
    { id:'baracca_presente', label:'La baracca di cantiere è presente' },
    { id:'wc_presente', label:'Il WC di cantiere è presente e funzionante' },
  ],
  documentazione: [
    { id:'psc_presente', label:'La documentazione PSC e allegati è presente' },
    { id:'verbali_presenti', label:'I verbali precedenti sono conservati in cantiere' },
  ],
  durc: [
    { id:'durc_ok', label:'Il DURC di tutte le imprese è in regola' },
    { id:'pos_presenti', label:'I POS delle imprese sono presenti in cantiere' },
  ],
  dpi: [
    { id:'dpi_corretti', label:'I lavoratori utilizzano correttamente i DPI' },
    { id:'dpi_adeguati', label:'I DPI sono adeguati alle lavorazioni svolte' },
  ],
  ponteggio: [
    { id:'pimus', label:'PIMUS presente e aggiornato' },
    { id:'disegno_ponteggio', label:'Disegno esecutivo del ponteggio presente' },
    { id:'libretto_ponteggio', label:'Libretto autorizzazione ministeriale presente' },
    { id:'ponteggio_conforme', label:'Il ponteggio è conforme al progetto' },
  ],
  gru: [
    { id:'gru_doc', label:'La documentazione della gru è completa' },
    { id:'gru_conforme', label:'La gru è conforme e in regola' },
  ],
  quadro: [
    { id:'quadro_certificato', label:'Il quadro elettrico è certificato' },
    { id:'quadro_denuncia', label:'È stata effettuata la denuncia dell\'impianto' },
  ],
  scavi: [
    { id:'scavi_armati', label:'Gli scavi sono adeguatamente armati' },
    { id:'scavi_segnalati', label:'Gli scavi sono segnalati e protetti' },
  ],
  linee: [
    { id:'linee_segnalate', label:'Le linee aeree sono segnalate e protette' },
    { id:'sottoservizi_mappati', label:'I sottoservizi sono stati mappati' },
  ],
  quota: [
    { id:'ancoraggi', label:'I sistemi di ancoraggio sono presenti e in regola' },
    { id:'imbracature', label:'Le imbracature sono certificate e in buono stato' },
  ],
}

const PRESCRIZIONI_PRECOMP = {
  cartello_esposto: ['Installare/integrare il cartello di cantiere'],
  notifica_esposta: ['Esporre la notifica preliminare aggiornata all\'ingresso'],
  cancello_funzionale: ['Mantenere chiusi gli accessi di cantiere'],
  recinzione_completa: ['Completare/integrare la recinzione di cantiere'],
  pimus: ['Integrare il PIMUS del ponteggio'],
  disegno_ponteggio: ['Adeguare il ponteggio metallico integrando il disegno esecutivo'],
  libretto_ponteggio: ['Integrare il libretto di autorizzazione ministeriale'],
  durc_ok: ['Rinnovare il DURC delle imprese non in regola'],
  pos_presenti: ['Le imprese devono integrare la documentazione POS'],
  dpi_corretti: ['Si raccomanda l\'utilizzo corretto dei DPI da parte di tutte le maestranze'],
  quadro_certificato: ['Integrare la documentazione dell\'impianto elettrico'],
}

export default function Step4Checklist({ verbale, updateVerbale, nextStep, prevStep, onEnter, demoMode }) {
  useEffect(() => { onEnter?.() }, [])

  const attivi = verbale.moduli_attivi?.length > 0
    ? verbale.moduli_attivi
    : ['cartello','cancello','documentazione','durc','dpi','ponteggio','gru','quota']

  const checklist = verbale.checklist || {}
  const anomalie = verbale.anomalie || []
  const prescrizioni = verbale.prescrizioni || []

  function setCheck(id, val) {
    const newChecklist = { ...checklist, [id]: val }
    updateVerbale({ checklist: newChecklist })

    if (val === 'no') {
      if (!anomalie.find(a => a.id === id)) {
        updateVerbale({ anomalie: [...anomalie, { id, label: getLabelById(id), prescrizioni: [] }] })
      }
    } else {
      updateVerbale({ anomalie: anomalie.filter(a => a.id !== id) })
    }
  }

  function getLabelById(id) {
    for (const voci of Object.values(VOCI)) {
      const v = voci.find(x => x.id === id)
      if (v) return v.label
    }
    return id
  }

  function togglePrescrizione(anomaliaId, presc) {
    const newAnom = anomalie.map(a => {
      if (a.id !== anomaliaId) return a
      const has = a.prescrizioni.includes(presc)
      return { ...a, prescrizioni: has ? a.prescrizioni.filter(p => p !== presc) : [...a.prescrizioni, presc] }
    })
    updateVerbale({ anomalie: newAnom })
  }

  return (
    <div className="screen-content">
      {attivi.map(modulo => {
        const voci = VOCI[modulo]
        if (!voci) return null
        const label = modulo.charAt(0).toUpperCase() + modulo.slice(1).replace('_', ' ')
        return (
          <div key={modulo}>
            <div className="slabel">{label}</div>
            <div className="card">
              {voci.map(v => {
                const stato = demoMode
                  ? (v.id === 'disegno_ponteggio' ? 'no' : 'si')
                  : checklist[v.id]
                return (
                  <div key={v.id} className="crow">
                    <button className={`cbox ${stato === 'si' ? 'si' : stato === 'no' ? 'no' : ''}`}
                      onClick={() => { if (!demoMode) setCheck(v.id, stato === 'si' ? 'no' : stato === 'no' ? null : 'si') }}>
                      {stato === 'si' ? '✓' : stato === 'no' ? '✗' : ''}
                    </button>
                    <span style={{fontSize:12, color: stato === 'no' ? 'var(--red)' : 'var(--text)'}}>{v.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {(anomalie.length > 0 || demoMode) && (
        <>
          <div className="slabel">Anomalie e prescrizioni</div>
          {(demoMode ? [{ id:'disegno_ponteggio', label:'Disegno esecutivo ponteggio mancante', prescrizioni:['Adeguare il ponteggio metallico integrando il disegno esecutivo'] }] : anomalie).map(a => (
            <div key={a.id} className="card ar">
              <div className="ctitle" style={{fontSize:13, color:'var(--red)'}}>⚠ {a.label}</div>
              <div style={{marginTop:10, fontSize:12, color:'var(--text-sec)', marginBottom:6}}>Prescrizioni precompilate:</div>
              {(PRESCRIZIONI_PRECOMP[a.id] || []).map(p => (
                <div key={p} className="crow">
                  <button className={`cbox ${a.prescrizioni.includes(p) ? 'si' : ''}`}
                    onClick={() => !demoMode && togglePrescrizione(a.id, p)}>
                    {a.prescrizioni.includes(p) ? '✓' : ''}
                  </button>
                  <span style={{fontSize:12}}>{p}</span>
                </div>
              ))}
              {a.prescrizioni.length > 0 && (
                <div className="presc">Prescrizione attiva: {a.prescrizioni[0]}</div>
              )}
              {!demoMode && (
                <textarea className="inp" style={{marginTop:10, height:60, resize:'none'}}
                  placeholder="Prescrizione personalizzata aggiuntiva..."></textarea>
              )}
            </div>
          ))}
        </>
      )}

      <button className="btnp" style={{marginTop:8}} onClick={nextStep}>Avanti → Step 5: Foto</button>
    </div>
  )
}
