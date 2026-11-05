import { useVeri, type Fiyatlar } from '../veri/yukle'
import { usePortfoy } from '../veri/portfoyHook'
import { girisKontrolleri, cikisKontrolleri, surecPuani, ceyrek, CEYREK_METNI, zararKesUyarisi, istatistik, type Karar } from '../motor/karar'
import { Yukleniyor, Degisim, sayi } from '../bilesenler/ortak'
import type { Parametreler } from '../motor/parametreler'

/** Net getiri: giriş ve çıkış maliyetleri yaklaşık olarak düşülür. */
function netGetiri(k: Karar, p: Parametreler, tur: string | undefined) {
  if (k.cikisFiyat === undefined) return null
  const c = tur === 'hisse' ? p.hisseKomisyon * (1 + p.bsmv) : tur === 'fon' ? p.fonKomisyon : p.dovizAltinMakas
  return (k.cikisFiyat * (1 - c)) / (k.girisFiyat * (1 + c)) - 1
}

function KararKart({ k, p, guncel, tur }: { k: Karar; p: Parametreler; guncel: number | undefined; tur?: string }) {
  const giris = girisKontrolleri(k, p.maxPozisyonOrani), cikis = cikisKontrolleri(k)
  const s = surecPuani([...giris, ...cikis])
  const oran = s.azami ? s.puan / s.azami : 0
  const g = netGetiri(k, p, tur)
  const uyari = zararKesUyarisi(k, guncel)
  const c = g !== null ? ceyrek(oran, g) : null
  return (
    <div className={`kart ${c === 'sansli' || c === 'hak_edilmis_hata' ? 'uyari' : uyari ? 'kotu' : ''}`}>
      <div className="satir ara"><b>{k.kod}</b><span className="soluk kucuk">{k.tarih.slice(0, 10)}{k.kapanisTarih ? ' → ' + k.kapanisTarih.slice(0, 10) : ' · açık'}</span></div>
      <div className="kucuk">Giriş {sayi(k.girisFiyat, 4)} · hedef {sayi(k.hedefFiyat, 4)} · zarar kes {sayi(k.zararKes, 4)}{k.cikisFiyat !== undefined && <> · çıkış {sayi(k.cikisFiyat, 4)}</>}</div>
      <div className="kucuk soluk">“{k.neden}”</div>
      {uyari && <div className="kotu-r"><b>⚠ {uyari}</b></div>}
      {!k.kapanisTarih && guncel !== undefined && <div className="kucuk">Şu an: {sayi(guncel, 4)} (<Degisim x={guncel / k.girisFiyat - 1} />)</div>}
      <div style={{ marginTop: '.5rem' }}><b>Süreç puanı:</b> {s.puan}/{s.azami} {!k.kapanisTarih && <span className="soluk kucuk">(çıkış kontrolleri kapanışta eklenir)</span>}</div>
      {[...giris, ...cikis].map(x => <div key={x.ad} className="kucuk">{x.gecti === null ? '○' : x.gecti ? <span className="iyi">✓</span> : <span className="kotu-r">✗</span>} {x.ad}: <span className="soluk">{x.aciklama}</span></div>)}
      {c && g !== null && <div className="kart" style={{ marginBottom: 0 }}>
        <div>Sonuç (maliyet dahil yaklaşık): <Degisim x={g} /></div>
        <div><b>{CEYREK_METNI[c][0]}</b></div><div className="kucuk">{CEYREK_METNI[c][1]}</div>
        {k.cikisAciklama && <div className="kucuk soluk">Çıkış notunuz: “{k.cikisAciklama}”</div>}
      </div>}
    </div>
  )
}

export default function Gunluk() {
  const f = useVeri<Fiyatlar>('fiyatlar')
  const pf = usePortfoy(f.veri)
  if (!pf.hazir) return <Yukleniyor />
  const kararlar = [...(pf.kararlar ?? [])].sort((a, b) => b.tarih.localeCompare(a.tarih))
  const acik = kararlar.filter(k => !k.kapanisTarih), kapali = kararlar.filter(k => k.kapanisTarih)
  const ist = istatistik(kapali.map(k => {
    const s = surecPuani([...girisKontrolleri(k, pf.p.maxPozisyonOrani), ...cikisKontrolleri(k)])
    return { getiri: netGetiri(k, pf.p, f.veri?.varliklar[k.kod]?.tur) ?? 0, surecOrani: s.azami ? s.puan / s.azami : 0 }
  }))
  return (
    <>
      <h1>Karar Günlüğü</h1>
      {ist ? <div className="kart vurgu">
        <b>İstatistik ({ist.n} kapalı karar)</b>
        <div>İsabet oranı: {(ist.isabet * 100).toFixed(0)}% · Ort. kazanç <Degisim x={ist.ortKazanc} /> · Ort. kayıp <Degisim x={ist.ortKayip} /></div>
        <div>Ortalama süreç puanı: {(ist.ortSurec * 100).toFixed(0)}/100 · "Şanslıydın" sayısı: {ist.sansliSayisi}</div>
        {ist.n < 20 && <div className="kucuk uyari-r">{ist.n} karar istatistiksel olarak çok az: isabet oranı bu örneklemle şansla kolayca açıklanabilir. En az 20-30 kararı bekleyin.</div>}
      </div> : <p className="soluk">Henüz kapanmış karar yok. İstatistikler ilk kapanıştan sonra oluşur.</p>}
      <h2>Açık kararlar ({acik.length})</h2>
      {acik.map(k => <KararKart key={k.id} k={k} p={pf.p} guncel={pf.fiyat(k.kod)} tur={f.veri?.varliklar[k.kod]?.tur} />)}
      <h2>Kapalı kararlar ({kapali.length})</h2>
      {kapali.map(k => <KararKart key={k.id} k={k} p={pf.p} guncel={undefined} tur={f.veri?.varliklar[k.kod]?.tur} />)}
    </>
  )
}
