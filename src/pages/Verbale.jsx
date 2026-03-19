import { useState, useEffect } from 'react'
import { useParams, useNavigate, Routes, Route } from 'react-router-dom'
import { supabase } from '../config/supabase.js'
import TopBar from '../components/TopBar.jsx'
import Step1Presenti from './verbale/Step1Presenti.jsx'
import Step2Lavorazioni from './verbale/Step2Lavorazioni.jsx'
import Step3Moduli from './verbale/Step3Moduli.jsx'
import Step4Checklist from './verbale/Step4Checklist.jsx'
import Step5Foto from './verbale/Step5Foto.jsx'
import Step6Firme from './verbale/Step6Firme.jsx'

const STEPS = [
  { num: 1, title: 'Imprese presenti', path: 'step1' },
  { num: 2, title: 'Lavorazioni e Gantt', path: 'step2' },
  { num: 3, title: 'Selezione moduli', path: 'step3' },
  { num: 4, title: 'Checklist', path: 'step4' },
  { num: 5, title: 'Foto', path: 'step5' },
  { num: 6, title: 'Anteprima e firme', path: 'step6' },
]

export default function Verbale({ demoMode }) {
  const { id, vid } = useParams()
  const navigate = useNavigate()
  const [verbale, setVerbale] = useState({ moduli_attivi: [], lavorazioni: [], presenti: [], checklist: {}, anomalie: [], prescrizioni: [], firme: {} })
  const [currentStep, setCurrentStep] = useState(1)

  useEffect(() => {
    localStorage.setItem('lastCantiereId', id)
  }, [id])

  function goStep(n) {
    setCurrentStep(n)
    navigate(`/cantiere/${id}/verbale/${vid}/step${n}`)
  }

  function nextStep() { if (currentStep < 6) goStep(currentStep + 1) }
  function prevStep() {
    if (currentStep > 1) goStep(currentStep - 1)
    else navigate(`/cantiere/${id}/anagrafica`)
  }

  function updateVerbale(patch) {
    setVerbale(v => ({ ...v, ...patch }))
    // Auto-save to localStorage
    localStorage.setItem(`verbale_${vid}`, JSON.stringify({ ...verbale, ...patch }))
  }

  const stepProps = { verbale, updateVerbale, nextStep, prevStep, cantiereId: id, verbaleId: vid, demoMode }

  const currentTitle = STEPS.find(s => s.num === currentStep)?.title || 'Verbale'

  return (
    <>
      <TopBar
        title={currentTitle}
        sub={`Step ${currentStep} di 6`}
        badge={`N°${vid === 'nuovo' ? 'nuovo' : vid?.slice(0,4)}`}
        backTo={currentStep > 1 ? undefined : `/cantiere/${id}/anagrafica`}
      />
      {currentStep > 1 && (
        <div style={{background:'var(--blue)',paddingBottom:8,paddingLeft:16}}>
          <button className="back-btn" onClick={prevStep}>← Step {currentStep - 1}</button>
        </div>
      )}

      {/* Progress bar */}
      <div style={{height:3, background:'var(--bg-sec)'}}>
        <div style={{height:'100%', background:'var(--blue)', width:`${(currentStep/6)*100}%`, transition:'width .3s'}}></div>
      </div>

      <div style={{display:'flex', gap:4, padding:'10px 16px 0', overflowX:'auto'}}>
        {STEPS.map(s => (
          <div key={s.num} onClick={() => s.num <= currentStep && goStep(s.num)}
            style={{display:'flex', alignItems:'center', gap:5, flexShrink:0, cursor: s.num <= currentStep ? 'pointer' : 'default'}}>
            <div style={{width:20,height:20,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:600,
              background: s.num < currentStep ? 'var(--green-light)' : s.num === currentStep ? 'var(--blue)' : 'var(--bg-sec)',
              color: s.num < currentStep ? 'var(--green)' : s.num === currentStep ? 'white' : 'var(--text-hint)'}}>
              {s.num < currentStep ? '✓' : s.num}
            </div>
            {s.num < 6 && <div style={{width:16,height:1,background:'var(--border)'}}></div>}
          </div>
        ))}
      </div>

      <Routes>
        <Route path="step1" element={<Step1Presenti {...stepProps} onEnter={() => setCurrentStep(1)} />} />
        <Route path="step2" element={<Step2Lavorazioni {...stepProps} onEnter={() => setCurrentStep(2)} />} />
        <Route path="step3" element={<Step3Moduli {...stepProps} onEnter={() => setCurrentStep(3)} />} />
        <Route path="step4" element={<Step4Checklist {...stepProps} onEnter={() => setCurrentStep(4)} />} />
        <Route path="step5" element={<Step5Foto {...stepProps} onEnter={() => setCurrentStep(5)} />} />
        <Route path="step6" element={<Step6Firme {...stepProps} onEnter={() => setCurrentStep(6)} />} />
      </Routes>
    </>
  )
}
