import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../config/supabase.js'

export default function Step6Firme({ verbale, updateVerbale, cantiereId, verbaleId, onEnter, demoMode }) {
  useEffect(() => { onEnter?.() }, [])
  const navigate = useNavigate()
  const [gps, setGps] = useState(null)
  const [saving, setSaving] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const canvasRef = useRef(null)
  const [drawing, setDrawing] = useState(false)
  const [firmaCSE, setFirmaCSE] = useState(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        setGps({ lat: pos.coords.latitude.toFixed(4), lng: pos.coords.longitude.toFixed(4) })
      })
    }
  }, [])

  function startDraw(e) {
    setDrawing(true)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    const x = (e.touches?.[0]?.clientX || e.clientX) - rect.left
    const y = (e.touches?.[0]?.clientY || e.clientY) - rect.top
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  function draw(e) {
    if (!drawing) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    const x = (e.touches?.[0]?.clientX || e.clientX) - rect.left
    const y = (e.touches?.[0]?.clientY || e.clientY) - rect.top
    ctx.lineWidth = 2
    ctx.strokeStyle = '#1B4F8A'
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  function endDraw() {
    setDrawing(false)
    setFirmaCSE(canvasRef.current.toDataURL())
  }

  function clearFirma() {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setFirmaCSE(null)
  }

  async function salva(archivia) {
    setSaving(true)
    const ora = new Date()
    const dati = {
      cantiere_id: cantiereId,
      data_sopralluogo: ora.toISOString().split('T')[0],
      stato: archivia ? 'archiviato' : 'bozza',
      gps_lat: gps?.lat,
      gps_lng: gps?.lng,
      ora_chiusura: ora.toTimeString().slice(0,5),
      moduli_attivi: verbale.moduli_attivi,
      lavorazioni: verbale.lavorazioni,
      presenti: verbale.presenti,
      checklist: verbale.checklist,
      anomalie: verbale.anomalie,
      prescrizioni: verbale.prescrizioni,
      firme: { cse: firmaCSE }
    }
    const { error } = await supabase.from('verbali').insert([dati])
    setSaving(false)
    if (error) { alert('Errore salvataggio: ' + error.message); return }
    navigate(`/cantiere/${cantiereId}/archivio`)
  }

  return (
    <div className="screen-content">
      <div className="alert warn">⚠ Mostra l'anteprima all'impresa prima di firmare</div>
      <button className="btno" style={{marginTop:0, marginBottom:14}}>👁 Anteprima verbale completo</button>

      <div className="slabel">GPS e ora chiusura</div>
      <div className="card">
        <div className="dr"><span className="dl">Posizione</span>
          <span style={{fontSize:11,fontFamily:'IBM Plex Mono,monospace'}}>{gps ? `${gps.lat}°N ${gps.lng}°E` : 'Rilevamento...'}</span>
        </div>
        <div className="dr"><span className="dl">Ora chiusura</span><span>{new Date().toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'})} · {new Date().toLocaleDateString('it-IT')}</span></div>
      </div>

      <div className="slabel">Firma CSE</div>
      <div className="card">
        <div className="dr"><span className="dl">Franzoi ing. Patrizio</span><span className="badge bg">CSE</span></div>
        {!demoMode ? (
          <>
            <div style={{marginTop:8, border:'1.5px dashed var(--border-med)', borderRadius:'var(--rs)', overflow:'hidden', background:'var(--bg-sec)'}}>
              <canvas ref={canvasRef} width={400} height={80} style={{width:'100%',height:80,display:'block',touchAction:'none'}}
                onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw}
                onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw} />
            </div>
            <button onClick={clearFirma} style={{fontSize:11,color:'var(--text-hint)',background:'none',border:'none',cursor:'pointer',marginTop:4}}>✕ Cancella firma</button>
          </>
        ) : (
          <div className="firma">✍ Firma con il dito qui</div>
        )}
      </div>

      <div className="slabel">Firme imprese</div>
      {(verbale.presenti?.length > 0 ? verbale.presenti : [{impresa:'Carboniero Costruzioni', responsabile:'Mario Rossi'},{impresa:'Rossi Ponteggi', responsabile:'Luigi Bianchi'}]).map((p, i) => (
        <div key={i} className="card">
          <div className="ctitle" style={{fontSize:13}}>{p.impresa} – {p.responsabile}</div>
          <div className="firma" style={{height:70}}>✍ Firma qui</div>
        </div>
      ))}

      {!demoMode ? (
        <>
          <div style={{display:'flex',gap:8,marginTop:14}}>
            <button className="btnsm" style={{padding:13,fontSize:13,fontWeight:500}} onClick={() => salva(false)} disabled={saving}>
              💾 Salva bozza
            </button>
            <button className="btnp" style={{marginTop:0,flex:2}} onClick={() => setShowConfirm(true)} disabled={saving}>
              📦 Salva e archivia
            </button>
          </div>
          <div style={{fontSize:10,color:'var(--text-hint)',textAlign:'center',marginTop:8}}>
            "Salva e archivia" è definitivo. Il verbale non sarà più modificabile.
          </div>
        </>
      ) : (
        <div className="alert success" style={{marginTop:14}}>✓ In modalità demo il verbale non viene salvato</div>
      )}

      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Archivia verbale</h3>
            <p>Il verbale verrà archiviato definitivamente e non potrà più essere modificato. Continuare?</p>
            <div className="modal-btns">
              <button className="btnsm" style={{padding:11}} onClick={() => setShowConfirm(false)}>Annulla</button>
              <button className="btnp" style={{flex:1}} onClick={() => { setShowConfirm(false); salva(true) }}>
                {saving ? 'Salvataggio...' : 'Archivia definitivamente'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
