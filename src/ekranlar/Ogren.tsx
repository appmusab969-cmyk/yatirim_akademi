import { Link } from 'react-router-dom'
import { SEVIYELER, PLANLANAN } from '../icerik'
import { useIlerleme, SINAV_ESIK } from '../icerik/ilerleme'
import { BECERI_AD, type Beceri } from '../icerik/tipler'
import { Yukleniyor } from '../bilesenler/ortak'

export default function Ogren() {
  const il = useIlerleme()
  if (!il) return <Yukleniyor />
  const beceriler = Object.entries(il.beceri) as [Beceri, { d: number; t: number }][]
  const zayif = beceriler.filter(([, x]) => x.t >= 5).sort((a, b) => a[1].d / a[1].t - b[1].d / b[1].t)[0]
  return (
    <>
      <h1>Öğren</h1>
      {beceriler.length > 0 && <div className="kart">
        <b>Beceri puanları</b> <span className="soluk kucuk">(quiz ve sınav doğru oranı)</span>
        {beceriler.map(([b, x]) => <div key={b} style={{ margin: '.4rem 0' }}>
          <div className="satir ara kucuk"><span>{BECERI_AD[b]}</span><span>{Math.round(x.d / x.t * 100)} · {x.t} soru</span></div>
          <div className="ilerleme"><div style={{ width: `${x.d / x.t * 100}%` }} /></div></div>)}
        {zayif && zayif[1].d / zayif[1].t < 0.75 && <div className="kucuk uyari-r">En zayıf alan: {BECERI_AD[zayif[0]]}. Bu alandaki derslerin quizlerini tekrar edin.</div>}
      </div>}
      {SEVIYELER.map(s => {
        const acik = il.acik(s.no), gecti = il.gecilen.has(s.no)
        const biten = s.dersler.filter(d => d.id in il.enIyiQuiz).length
        return <div key={s.no} className={`kart ${gecti ? 'vurgu' : ''} ${acik ? '' : 'kilit'}`}>
          <div className="satir ara"><h2 style={{ margin: 0 }}>Seviye {s.no}: {s.ad}</h2><span className="etiket">{gecti ? 'geçildi ✓' : acik ? `${biten}/${s.dersler.length}` : '🔒 kilitli'}</span></div>
          <div className="soluk kucuk">{s.amac}</div>
          {acik ? <>
            {s.dersler.map(d => {
              const q = il.enIyiQuiz[d.id]
              return <Link key={d.id} to={`/ders/${d.id}`} className="dugme secenek" style={{ justifyContent: 'space-between' }}>
                <span>{d.id} · {d.baslik}</span>
                <span className="kucuk soluk">{q !== undefined ? `${Math.round(q * 100)}%` : `${d.dakika} dk`}{il.gorevTamam.has(d.id) ? ' · görev ✓' : ''}</span>
              </Link>
            })}
            {il.sinavAcik(s.no) ? <Link className="dugme ana" to={`/sinav/${s.no}`} style={{ marginTop: '.5rem' }}>Seviye {s.no} sınavı (geçme: %{SINAV_ESIK * 100})</Link>
              : <div className="kucuk soluk" style={{ marginTop: '.5rem' }}>Sınav, tüm derslerin quizini en az bir kez çözünce açılır.</div>}
          </> : <div className="kucuk">Seviye {s.no - 1} sınavını geçince açılır.</div>}
        </div>
      })}
      {PLANLANAN.map(p => <div key={p.no} className="kart kilit"><b>Seviye {p.no}: {p.ad}</b><div className="kucuk soluk">MVP sonrası eklenecek · {p.konular}</div></div>)}
    </>
  )
}
