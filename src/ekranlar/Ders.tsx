import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { DERS_HARITA, SEVIYELER } from '../icerik'
import { useIlerleme } from '../icerik/ilerleme'
import { db } from '../depo/db'
import { Metin } from '../bilesenler/Metin'
import type { Soru } from '../icerik/tipler'

export function SoruKart({ s, no, cevap, onCevap }: { s: Soru; no: number; cevap: number | undefined; onCevap: (i: number) => void }) {
  return <div className="kart">
    <b>{no}. {s.soru}</b>
    {s.secenekler.map((x, i) => {
      const sinif = cevap === undefined ? '' : i === s.dogru ? 'dogru' : i === cevap ? 'yanlis' : ''
      return <button key={i} className={`secenek ${sinif}`} disabled={cevap !== undefined} onClick={() => onCevap(i)}>{String.fromCharCode(65 + i)}) {x}</button>
    })}
    {cevap !== undefined && <div className="kucuk" style={{ marginTop: '.4rem' }}>
      <b className={cevap === s.dogru ? 'iyi' : 'kotu-r'}>{cevap === s.dogru ? 'Doğru.' : 'Yanlış.'}</b> <Metin m={s.aciklama} /></div>}
  </div>
}

export default function Ders() {
  const { id = '' } = useParams()
  const d = DERS_HARITA[id]
  const il = useIlerleme()
  const [cevaplar, setCevaplar] = useState<Record<number, number>>({})
  const [kaydedildi, setKaydedildi] = useState(false)
  const gorev = useLiveQuery(() => db.gorev.get(id), [id])
  const [not, setNot] = useState('')
  useEffect(() => { setCevaplar({}); setKaydedildi(false); window.scrollTo(0, 0) }, [id])
  useEffect(() => { setNot(gorev?.not ?? '') }, [gorev])
  const bitti = !!d && Object.keys(cevaplar).length === d.quiz.length
  const dogru = d ? d.quiz.filter((s, i) => cevaplar[i] === s.dogru).length : 0
  useEffect(() => {
    if (!d || !bitti || kaydedildi) return
    setKaydedildi(true)
    db.quiz.add({ tarih: new Date().toISOString(), dersId: d.id, seviye: d.seviye, beceri: d.beceri, dogru, toplam: d.quiz.length })
  }, [bitti, kaydedildi, d, dogru])
  if (!d) return <Navigate to="/ogren" />
  if (il && !il.acik(d.seviye)) return <Navigate to="/ogren" />
  const seviye = SEVIYELER.find(s => s.no === d.seviye)!
  const sira = seviye.dersler.findIndex(x => x.id === d.id)
  const sonraki = seviye.dersler[sira + 1]

  return (
    <>
      <div className="soluk kucuk"><Link to="/ogren">← Seviye {d.seviye}</Link> · {d.dakika} dk okuma</div>
      <h1>{d.baslik}</h1>
      {d.bolumler.map((b, i) => {
        switch (b.tip) {
          case 'metin': return <Metin key={i} m={b.metin} />
          case 'terim': return <div key={i} className="terim"><b>{b.terim}:</b> <Metin m={b.tanim} /></div>
          case 'formul': return <div key={i}><div className="kucuk soluk">{b.ad}</div><code className="formul">{b.formul}</code>{b.aciklama && <Metin m={b.aciklama} />}</div>
          case 'ornek': return <div key={i} className="kart"><b>Gerçek örnek: {b.baslik}</b><Metin m={b.metin} /><div className="serit">Kaynak: {b.kaynak}</div></div>
          case 'uyari': return <div key={i} className="kart uyari"><Metin m={b.metin} /></div>
        }
      })}

      <h2>Quiz</h2>
      {d.quiz.map((s, i) => <SoruKart key={i} s={s} no={i + 1} cevap={cevaplar[i]} onCevap={c => setCevaplar({ ...cevaplar, [i]: c })} />)}
      {bitti && <div className={`kart ${dogru / d.quiz.length >= 0.8 ? 'vurgu' : 'uyari'}`}>
        <b>{dogru}/{d.quiz.length}</b>{' '}
        {dogru === d.quiz.length ? 'Hepsi doğru. Görevi yapmadan bilgi kalıcı olmaz.' : dogru / d.quiz.length >= 0.6 ? 'Fena değil ama yanlışlarınızın açıklamalarını okuyun; sınavda benzerleri çıkacak.' : 'Bu ders henüz oturmamış. Metni tekrar okuyup quizi baştan çözün; acele etmeyin.'}
        <div><button style={{ marginTop: '.5rem' }} onClick={() => { setCevaplar({}); setKaydedildi(false) }}>Quizi tekrar çöz</button></div>
      </div>}

      <h2>Bunu uygula: {d.gorev.baslik}</h2>
      <div className="kart">
        <ol>{d.gorev.adimlar.map((a, i) => <li key={i}><Metin m={a} /></li>)}</ol>
        <label>Notlarım / bulduklarım</label>
        <textarea value={not} onChange={e => setNot(e.target.value)} />
        <div className="satir" style={{ marginTop: '.5rem' }}>
          <button className={gorev?.tamam ? '' : 'ana'} onClick={() => db.gorev.put({ dersId: d.id, tamam: !gorev?.tamam, not, tarih: new Date().toISOString() })}>{gorev?.tamam ? 'Tamamlandı ✓ (geri al)' : 'Görevi tamamladım'}</button>
          <button onClick={() => db.gorev.put({ dersId: d.id, tamam: !!gorev?.tamam, not, tarih: new Date().toISOString() })}>Notu kaydet</button>
        </div>
      </div>

      <h2>Kaynaklar</h2>
      <ul className="kucuk">{d.kaynaklar.map((k, i) => <li key={i}>{k.url ? <a href={k.url} target="_blank" rel="noreferrer">{k.ad}</a> : k.ad}</li>)}</ul>
      {sonraki ? <Link className="dugme ana" to={`/ders/${sonraki.id}`}>Sonraki: {sonraki.baslik} →</Link> : <Link className="dugme ana" to="/ogren">Seviye haritasına dön</Link>}
    </>
  )
}
