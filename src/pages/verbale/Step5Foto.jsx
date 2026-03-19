import { useEffect, useState } from 'react'

export default function Step5Foto({ verbale, updateVerbale, nextStep, prevStep, onEnter, demoMode }) {
  useEffect(() => { onEnter?.() }, [])
  const foto = verbale.foto || (demoMode ? [
    { id:1, didascalia:'Ponteggio lato nord – disegno esecutivo mancante', stampa:true, preview:'📷' },
    { id:2, didascalia:'Vista generale cantiere', stampa:false, preview:'📷' },
  ] : [])

  function addFoto(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const nuova = { id: Date.now(), preview: ev.target.result, didascalia: '', stampa: true, file }
      updateVerbale({ foto: [...foto, nuova] })
    }
    reader.readAsDataURL(file)
  }

  function updateFoto(id, k, v) {
    updateVerbale({ foto: foto.map(f => f.id === id ? { ...f, [k]: v } : f) })
  }

  function removeFoto(id) {
    updateVerbale({ foto: foto.filter(f => f.id !== id) })
  }

  return (
    <div className="screen-content">
      <div style={{fontSize:12, color:'var(--text-sec)', marginBottom:12}}>
        Le foto con didascalia vengono raggruppate in fondo al verbale con riferimento al paragrafo
      </div>

      {foto.map(f => (
        <div key={f.id} className="card">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
            <div className="ctitle" style={{fontSize:12}}>Foto</div>
            {!demoMode && <button onClick={() => removeFoto(f.id)} style={{background:'none',border:'none',color:'var(--red)',cursor:'pointer',fontSize:12}}>✕ Rimuovi</button>}
          </div>
          <div style={{width:'100%',height:120,borderRadius:'var(--rs)',background:'var(--blue-light)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:40,marginBottom:8}}>
            {f.preview?.startsWith('data:') ? <img src={f.preview} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'var(--rs)'}} alt="" /> : f.preview}
          </div>
          <input className="inp" placeholder="Didascalia: descrivi cosa mostra la foto..."
            value={f.didascalia} onChange={e => !demoMode && updateFoto(f.id,'didascalia',e.target.value)} readOnly={demoMode} />
          <div style={{display:'flex',alignItems:'center',gap:10,marginTop:10}}>
            <span style={{fontSize:11,color:'var(--text-hint)',flex:1}}>Stampa nel verbale</span>
            <button className={`tog ${f.stampa ? 'on' : ''}`} onClick={() => !demoMode && updateFoto(f.id,'stampa',!f.stampa)}></button>
          </div>
        </div>
      ))}

      {!demoMode && (
        <div style={{display:'flex',gap:8,marginTop:4}}>
          <label style={{flex:1,cursor:'pointer'}}>
            <input type="file" accept="image/*" capture="environment" onChange={addFoto} style={{display:'none'}} />
            <div className="btno" style={{textAlign:'center',margin:0}}>📷 Scatta foto</div>
          </label>
          <label style={{flex:1,cursor:'pointer'}}>
            <input type="file" accept="image/*" onChange={addFoto} style={{display:'none'}} />
            <div className="btno" style={{textAlign:'center',margin:0}}>🖼 Dalla galleria</div>
          </label>
        </div>
      )}

      <button className="btnp" style={{marginTop:14}} onClick={nextStep}>Avanti → Step 6: Firme</button>
    </div>
  )
}
