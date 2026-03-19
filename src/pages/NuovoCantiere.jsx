import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../config/supabase.js'
import TopBar from '../components/TopBar.jsx'

const MODULI_DEFAULT = {
  ponteggio: false, gru: false, wc: false, baracca: false,
  quadro_elettrico: false, scavi: false, linee_aeree: false,
  lavori_quota: false, sottoservizi: false
}

export default function NuovoCantiere() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    nome: '', indirizzo: '', committente: '', cse: 'Franzoi ing. Patrizio',
    csp: '', progettista: '', direttore_lavori: '', responsabile_lavori: '',
    data_inizio: '', data_notifica: '', durata_giorni: '',
    importo_lavori: '', costi_sicurezza: '', stato: 'attivo'
  })
  const [moduli, setModuli] = useState(MODULI_DEFAULT)

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }
  function setMod(k) { setModuli(m => ({ ...m, [k]: !m[k] })) }

  async function salva() {
    if (!form.nome || !form.committente) return alert('Inserisci almeno nome cantiere e committente')
    setSaving(true)
    const { data, error } = await supabase.from('cantieri').insert([{ ...form, moduli }]).select()
    if (error) { alert('Errore: ' + error.message); setSaving(false); return }
    const id = data[0].id
    localStorage.setItem('lastCantiereId', id)
    navigate(`/cantiere/${id}/anagrafica`)
  }

  return (
    <>
      <TopBar title="Nuovo cantiere" sub="Inserisci i dati" badge="NEW" backTo="/" />
      <div className="screen-content">

        <div className="slabel">Dati cantiere</div>
        <div className="card">
          <label className="inp-label">Nome / indirizzo cantiere *</label>
          <input className="inp" placeholder="es. Via Dante Alighieri, 9 – Costabissara" value={form.nome} onChange={e => set('nome', e.target.value)} />
          <label className="inp-label">Indirizzo completo</label>
          <input className="inp" placeholder="Comune, provincia, CAP" value={form.indirizzo} onChange={e => set('indirizzo', e.target.value)} />
          <label className="inp-label">Committente *</label>
          <input className="inp" placeholder="Nome e cognome o ragione sociale" value={form.committente} onChange={e => set('committente', e.target.value)} />
        </div>

        <div className="slabel">Figure professionali</div>
        <div className="card">
          <label className="inp-label">CSE (Coordinatore Esecuzione)</label>
          <input className="inp" value={form.cse} onChange={e => set('cse', e.target.value)} />
          <label className="inp-label">CSP (Coordinatore Progettazione)</label>
          <input className="inp" placeholder="—" value={form.csp} onChange={e => set('csp', e.target.value)} />
          <label className="inp-label">Progettista</label>
          <input className="inp" placeholder="—" value={form.progettista} onChange={e => set('progettista', e.target.value)} />
          <label className="inp-label">Direttore dei Lavori</label>
          <input className="inp" placeholder="—" value={form.direttore_lavori} onChange={e => set('direttore_lavori', e.target.value)} />
          <label className="inp-label">Responsabile dei Lavori</label>
          <input className="inp" placeholder="—" value={form.responsabile_lavori} onChange={e => set('responsabile_lavori', e.target.value)} />
        </div>

        <div className="slabel">Date e importi</div>
        <div className="card">
          <label className="inp-label">Data inizio lavori</label>
          <input className="inp" type="date" value={form.data_inizio} onChange={e => set('data_inizio', e.target.value)} />
          <label className="inp-label">Data notifica preliminare</label>
          <input className="inp" type="date" value={form.data_notifica} onChange={e => set('data_notifica', e.target.value)} />
          <label className="inp-label">Durata prevista (giorni)</label>
          <input className="inp" type="number" placeholder="es. 180" value={form.durata_giorni} onChange={e => set('durata_giorni', e.target.value)} />
          <label className="inp-label">Importo lavori (€)</label>
          <input className="inp" type="number" placeholder="es. 128000" value={form.importo_lavori} onChange={e => set('importo_lavori', e.target.value)} />
          <label className="inp-label">Costi sicurezza (€)</label>
          <input className="inp" type="number" placeholder="es. 4200" value={form.costi_sicurezza} onChange={e => set('costi_sicurezza', e.target.value)} />
        </div>

        <div className="slabel">Moduli presenti in cantiere</div>
        <div className="card">
          {[
            ['ponteggio','Ponteggio'],['gru','Gru di cantiere'],['wc','WC di cantiere'],
            ['baracca','Baracca di cantiere'],['quadro_elettrico','Quadro elettrico'],
            ['scavi','Scavi e sbancamenti'],['linee_aeree','Linee aeree'],
            ['lavori_quota','Lavori in quota'],['sottoservizi','Sottoservizi']
          ].map(([k, label]) => (
            <div key={k} className="trow">
              <button className={`tog ${moduli[k] ? 'on' : ''}`} onClick={() => setMod(k)}></button>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <button className="btnp" onClick={salva} disabled={saving} style={{marginTop:8}}>
          {saving ? 'Salvataggio...' : 'Crea cantiere'}
        </button>
        <button className="btno" onClick={() => navigate('/')}>Annulla</button>
      </div>
    </>
  )
}
