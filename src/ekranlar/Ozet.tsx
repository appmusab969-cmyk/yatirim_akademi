import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useVeri, makroSec, useElle, degisim, type Fiyatlar, type Makro, type Haberler, type Meta, type Kalem, type Varlik } from '../veri/yukle'
import { DurumEtiketi, VeriSeridi, Yukleniyor, VeriYok, sayi, Degisim } from '../bilesenler/ortak'

const yz = (x: number) => (x * 100).toLocaleString('tr-TR', { maximumFractionDigits: 1, minimumFractionDigits: 1 }) + '%'

function KalemKart({ baslik, k, birim, ek, neDemek }: { baslik: string; k: Kalem | undefined; birim?: string; ek?: ReactNode; neDemek: ReactNode }) {
  const var_ = k && k.deger !== null
  return (
    <div className={`kart ${!var_ ? 'kotu' : ''}`}>
      <div className="satir ara"><b>{baslik}</b>{k && <DurumEtiketi k={k} />}</div>
      {var_ ? <div className="buyuk">{sayi(k!.deger, 2)} <span className="soluk kucuk">{birim ?? k!.birim}</span></div>
        : <div className="kotu-r">Yeterli veri yok</div>}
      {ek}
      <div className="kucuk" style={{ marginTop: '.4rem' }}><b>Bu ne demek?</b> {neDemek}</div>
      {k?.not && <div className="kucuk uyari-r">{k.not}</div>}
      <VeriSeridi kaynak={k?.kaynak} tarih={k?.tarih} />
    </div>
  )
}

function FiyatKart({ v, baslik, neDemek }: { v: Varlik | undefined; baslik: string; neDemek: (d1: number | null, d20: number | null) => ReactNode }) {
  const d1 = degisim(v?.gecmis, 1), d20 = degisim(v?.gecmis, 20)
  return <KalemKart baslik={baslik} k={v} ek={<div className="satir kucuk">1 gün: <Degisim x={d1} /> · 20 iş günü: <Degisim x={d20} /></div>} neDemek={neDemek(d1, d20)} />
}

export default function Ozet() {
  const f = useVeri<Fiyatlar>('fiyatlar'), m = useVeri<Makro>('makro'), h = useVeri<Haberler>('haberler'), meta = useVeri<Meta>('meta')
  const elle = useElle()
  if (f.yukleniyor || m.yukleniyor) return <Yukleniyor />
  const v = f.veri?.varliklar ?? {}
  const mk = m.veri?.kalemler ?? {}
  const pf = makroSec(mk.politika_faizi, elle.politika_faizi)
  const tufeY = makroSec(mk.tufe_yillik, elle.tufe_yillik)
  const tufeA = makroSec(mk.tufe_aylik, elle.tufe_aylik)
  const usd20 = degisim(v.USDTRY?.gecmis, 20), xu20 = degisim(v.XU100?.gecmis, 20)
  const reel = pf.deger !== null && tufeY.deger !== null ? (1 + pf.deger / 100) / (1 + tufeY.deger / 100) - 1 : null
  const aylikYillik = tufeA.deger !== null ? Math.pow(1 + tufeA.deger / 100, 12) - 1 : null

  return (
    <>
      <h1>Günlük Özet</h1>
      {f.hata?.startsWith('Parola') || f.hata?.startsWith('Veri parolası') ? <div className="kart kotu" role="alert"><b>{f.hata}</b> <Link to="/ayarlar">Ayarlar › Veri parolası</Link></div> :
       f.hata && <VeriYok neden={`Fiyat dosyası okunamadı: ${f.hata}. Çevrimdışıysanız ve uygulamayı daha önce hiç çevrimiçi açmadıysanız cache boş olabilir.`} />}
      {meta.veri && Object.values(meta.veri.sonuc).some(s => s !== 'ok') && <div className="kart uyari">Son veri çekiminde hata oldu; bazı değerler eski. Ayrıntı: Ayarlar › Veri durumu.</div>}

      <FiyatKart baslik="Dolar / TL" v={v.USDTRY} neDemek={(d1) => <>1 doların kaç TL ettiği. {d1 !== null && <>Dün {d1 >= 0 ? 'yükseldi' : 'düştü'}. </>}
        {usd20 !== null && tufeA.deger !== null && <>Son ~1 ayda kur {yz(usd20)} değişti, son aylık enflasyon {yz(tufeA.deger / 100)}. Kur enflasyondan yavaş artıyorsa TL "reel olarak değerleniyor" demektir: dolar tutan Türk yatırımcı alım gücü kaybeder. (Kaba karşılaştırma; dönemler tam örtüşmez.)</>}</>} />

      <FiyatKart baslik="Gram altın" v={v.GRAM_ALTIN} neDemek={() => <>Gram altın ≈ ons altın (USD) × Dolar/TL ÷ 31,1035. Yani iki şeye birden bağlı: dünya altın fiyatı ve kur. Kur sabitken bile ons düşerse gram düşer.</>} />

      <FiyatKart baslik="BIST 100" v={v.XU100} neDemek={() => <>Borsa İstanbul'daki 100 büyük şirketin fiyat endeksi (temettü dahil değil).{' '}
        {xu20 !== null && usd20 !== null && <>Son ~1 ayda TL bazında {yz(xu20)}, dolar bazında {yz((1 + xu20) / (1 + usd20) - 1)}. Yüksek enflasyonda TL bazlı yükseliş yanıltıcı olabilir; dolar ve enflasyon bazlı getiriye de bakın.</>}</>} />

      <KalemKart baslik="Politika faizi (TCMB 1 hafta repo)" k={pf} neDemek={<>Merkez bankasının bankalara verdiği bir haftalık borcun faizi; mevduat ve kredi faizlerinin çapası.{' '}
        {reel !== null ? <>Yıllık enflasyona göre reel politika faizi ≈ <b>{yz(reel)}</b> {reel > 0 ? '(pozitif: para politikası sıkı tarafta)' : '(negatif: enflasyonun altında, gevşek)'}. Not: bu geçmiş enflasyonla hesaplanır; piyasa beklenen enflasyona bakar.</> : <>Reel faiz hesabı için hem faiz hem enflasyon gerekli.</>}
        {mk.gecelik_borc_alma?.deger != null && <> Gecelik koridor: %{mk.gecelik_borc_alma.deger}–%{mk.gecelik_borc_verme?.deger}.</>}</>} />

      <KalemKart baslik="Enflasyon (TÜFE, yıllık)" k={tufeY} neDemek={<>Tüketici fiyatlarının 12 ayda ortalama ne kadar arttığı. Paranız bundan az getiri kazanıyorsa reel olarak fakirleşiyorsunuz.
        {aylikYillik !== null && <> Son aylık %{sayi(tufeA.deger, 2)}; bu hız 12 ay sürseydi yıllık {yz(aylikYillik)} olurdu. Aylık hız yıllıktan düşükse enflasyon gerileme eğiliminde demektir.</>}</>} />

      <h2>Haberler</h2>
      {h.veri?.haberler?.length ? <div className="kart">
        {h.veri.haberler.slice(0, 10).map((x, i) => (
          <div key={i} style={{ padding: '.45rem 0', borderBottom: '1px solid var(--cizgi)' }}>
            <a href={x.link} target="_blank" rel="noreferrer">{x.baslik}</a>
            <div className="soluk kucuk">{x.kaynak} · {x.tarih?.replace('T', ' ') ?? 'tarih yok'}</div>
          </div>))}
        <div className="kucuk soluk" style={{ marginTop: '.5rem' }}>Haberlere ait "kimi nasıl etkiler" yorumu bilinçli olarak yok: bunu Haber Antrenmanı'nda (MVP sonrası) siz yazacaksınız.</div>
        <VeriSeridi kaynak="RSS: AA, Bloomberg HT, TRT Haber, NTV" tarih={h.veri.uretildi} />
      </div> : <VeriYok neden="Haber dosyası yok veya boş." />}

      <div className="kart vurgu"><b>Bugün ne öğrenmeli?</b> <Link to="/ogren">Derslere git →</Link></div>
      <VeriSeridi kaynak="veri_hatti/cek_gunluk.py (günde 1 kez)" tarih={meta.veri?.uretildi ?? f.veri?.uretildi} />
    </>
  )
}
