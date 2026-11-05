import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { SEVIYELER } from '../icerik'
import { useIlerleme, karistir, SINAV_ESIK, SINAV_SORU } from '../icerik/ilerleme'
import { db } from '../depo/db'
import { SoruKart } from './Ders'
import { Yukleniyor } from '../bilesenler/ortak'
import type { Beceri, Soru } from '../icerik/tipler'

export default function Sinav() {
  const no = Number(useParams().seviye)
  const s = SEVIYELER.find(x => x.no === no)
  const il = useIlerleme()
  const [deneme, setDeneme] = useState(0)
  const sorular = useMemo(() => {
    if (!s) return []
    // her dersten en az bir soru, kalan yer ek sorular ve rastgele seçim
    const havuz: (Soru & { beceri: Beceri })[] = s.dersler.flatMap(d => d.quiz.map(q => ({ ...q, beceri: d.beceri })))
    const ek = s.sinavEk.map(q => ({ ...q, beceri: s.dersler[0].beceri }))
    const birer = s.dersler.map(d => ({ ...karistir(d.quiz)[0], beceri: d.beceri }))
    const kalan = karistir([...ek, ...havuz.filter(q => !birer.some(b => b.soru === q.soru))])
    return karistir([...birer, ...kalan].slice(0, Math.max(SINAV_SORU, birer.length)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s, deneme])
  const [cevap, setCevap] = useState<Record<number, number>>({})
  const [sonuc, setSonuc] = useState<{ dogru: number; gecti: boolean } | null>(null)
  if (!s) return <Navigate to="/ogren" />
  if (!il) return <Yukleniyor />
  if (!il.sinavAcik(no)) return <Navigate to="/ogren" />

  const bitti = Object.keys(cevap).length === sorular.length
  async function bitir() {
    const dogru = sorular.filter((q, i) => cevap[i] === q.dogru).length
    const gecti = dogru / sorular.length >= SINAV_ESIK
    await db.sinav.add({ tarih: new Date().toISOString(), seviye: no, dogru, toplam: sorular.length, gecti })
    // beceri puanına katkı
    const b: Record<string, { d: number; t: number }> = {}
    sorular.forEach((q, i) => { const x = (b[q.beceri] ??= { d: 0, t: 0 }); x.t++; if (cevap[i] === q.dogru) x.d++ })
    for (const [beceri, x] of Object.entries(b)) await db.quiz.add({ tarih: new Date().toISOString(), dersId: `sinav-${no}`, seviye: no, beceri, dogru: x.d, toplam: x.t })
    setSonuc({ dogru, gecti }); window.scrollTo(0, 0)
  }

  return (
    <>
      <div className="soluk kucuk"><Link to="/ogren">← Öğren</Link></div>
      <h1>Seviye {no} sınavı</h1>
      {sonuc ? <div className={`kart ${sonuc.gecti ? 'vurgu' : 'kotu'}`}>
        <div className="buyuk">{sonuc.dogru}/{sorular.length}</div>
        {sonuc.gecti ? <p>Geçtiniz. Seviye {no + 1} açıldı. Bu, konuyu bildiğinizi gösterir; uyguladığınızı göstermez. Görevleri ve sanal portföyü ihmal etmeyin.</p>
          : <p>Geçme sınırı %{SINAV_ESIK * 100}. Aşağıda yanlışlarınızın açıklamaları var. İlgili dersleri tekrar okuyun; sınav her denemede farklı sorularla gelir.</p>}
        {!sonuc.gecti && <button onClick={() => { setCevap({}); setSonuc(null); setDeneme(deneme + 1) }}>Yeniden dene</button>}
      </div> : <p className="soluk kucuk">{sorular.length} soru. Cevabınızı verdikten sonra açıklama görürsünüz; geri dönüş yok.</p>}
      {sorular.map((q, i) => (!sonuc || cevap[i] !== q.dogru) &&
        <SoruKart key={`${deneme}-${i}`} s={q} no={i + 1} cevap={cevap[i]} onCevap={c => setCevap({ ...cevap, [i]: c })} />)}
      {!sonuc && <button className="ana" style={{ width: '100%' }} disabled={!bitti} onClick={bitir}>Sınavı bitir</button>}
    </>
  )
}
