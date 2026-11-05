import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useVeri, degisim, gunFarki, type Fiyatlar } from '../veri/yukle'
import { usePortfoy } from '../veri/portfoyHook'
import { emirHazirla, tl } from '../motor/portfoy'
import { islemMaliyeti } from '../motor/maliyet'
import { girisKontrolleri, surecPuani, type Karar, type CikisNedeni } from '../motor/karar'
import type { VarlikTuru } from '../motor/parametreler'
import { db } from '../depo/db'
import { Yukleniyor, VeriYok, VeriSeridi, DurumEtiketi, sayi } from '../bilesenler/ortak'

const sayiOku = (s: string) => Number(s.replace(/\./g, '').replace(',', '.'))
const sayiOkuOndalik = (s: string) => Number(s.replace(',', '.'))

export default function Emir() {
  const f = useVeri<Fiyatlar>('fiyatlar')
  const pf = usePortfoy(f.veri)
  const nav = useNavigate()
  const [sp] = useSearchParams()
  const [kod, setKod] = useState(sp.get('kod') ?? '')
  const [yon, setYon] = useState<'al' | 'sat'>((sp.get('yon') as 'al' | 'sat') ?? 'al')
  const [adetS, setAdet] = useState('')
  // karar formu (alım)
  const [neden, setNeden] = useState(''), [hedefS, setHedef] = useState(''), [zkS, setZk] = useState('')
  const [cikisPlani, setCikis] = useState(''), [vadeS, setVade] = useState('90'), [guven, setGuven] = useState(3)
  // satış
  const [cikisNedeni, setCN] = useState<CikisNedeni | ''>(''), [cikisAciklama, setCA] = useState('')
  const [hata, setHata] = useState<string | null>(null)

  const liste = useMemo(() => Object.entries(f.veri?.varliklar ?? {}).filter(([, v]) => v.tur !== 'endeks')
    .sort((a, b) => a[1].tur.localeCompare(b[1].tur) || a[0].localeCompare(b[0])), [f.veri])

  if (f.yukleniyor || !pf.hazir) return <Yukleniyor />
  if (!f.veri) return <VeriYok neden="Fiyat verisi yok; işlem yapılamaz (fiyat uydurulmaz)." />

  const v = kod ? f.veri.varliklar[kod] : undefined
  const tur = v?.tur as VarlikTuru | undefined
  const fiyat = v?.deger ?? null
  const adet = tur === 'hisse' ? Math.floor(sayiOku(adetS)) : sayiOkuOndalik(adetS)
  const tutar = fiyat && adet > 0 ? adet * fiyat : 0
  const maliyet = tur && tutar ? islemMaliyeti(tur, tutar, pf.p) : null
  const eskiGun = gunFarki(v?.tarih)
  const pz = kod ? pf.durum.pozisyonlar[kod] : undefined
  const acikKararlar = (pf.kararlar ?? []).filter(k => k.kod === kod && !k.kapanisTarih)

  const taslak: Karar | null = fiyat && tutar ? {
    tarih: new Date().toISOString(), kod, neden, hedefFiyat: sayiOkuOndalik(hedefS), zararKes: sayiOkuOndalik(zkS), cikisPlani,
    vadeGun: Number(vadeS), guven, girisFiyat: fiyat, pozisyonOrani: tutar / pf.deger.toplam, son5GunDegisim: degisim(v?.gecmis, 5),
  } : null
  const kontroller = taslak ? girisKontrolleri(taslak, pf.p.maxPozisyonOrani) : []
  const formTamam = !!taslak && neden.trim().length > 0 && taslak.hedefFiyat > 0 && taslak.zararKes > 0 && cikisPlani.trim().length > 0 && taslak.vadeGun > 0

  async function gonder() {
    setHata(null)
    if (!v || !tur || !fiyat) return
    const kaynak = `${v.kaynak} · ${v.tarih}`
    const r = emirHazirla({ kod, tur, yon, adet, fiyat, fiyatKaynak: kaynak, tarih: new Date().toISOString() }, pf.durum, pf.p)
    if (!r.ok) { setHata(r.hata); return }
    if (yon === 'al') {
      if (!formTamam || !taslak) { setHata('Karar günlüğü formunu doldurmadan alım yapılamaz.'); return }
      await db.transaction('rw', db.islemler, db.kararlar, async () => {
        const kararId = await db.kararlar.add(taslak)
        await db.islemler.add({ ...r.islem, kararId })
      })
    } else {
      const tamamen = pz && Math.abs(pz.adet - adet) < 1e-9
      if (tamamen && acikKararlar.length && !cikisNedeni) { setHata('Pozisyonu kapatırken çıkış nedenini seçin.'); return }
      await db.transaction('rw', db.islemler, db.kararlar, async () => {
        await db.islemler.add(r.islem)
        if (tamamen) for (const k of acikKararlar) {
          // Zarar kes ihlali VERİYLE belirlenir (beyana bırakılmaz): alımdan sonra, bugünden ÖNCEKİ bir günde
          // kapanış zarar kesin altına indiyse ve o gün satılmadıysa ihlaldir.
          const ihlal = (v.gecmis ?? []).slice(0, -1).some(([t, c]) => t > k.tarih.slice(0, 10) && c <= k.zararKes)
          await db.kararlar.update(k.id!, { kapanisTarih: new Date().toISOString(), cikisFiyat: fiyat, cikisNedeni: cikisNedeni || 'diger', cikisAciklama, zararKesIhlali: ihlal })
        }
      })
    }
    nav(yon === 'al' ? '/portfoy' : '/gunluk')
  }

  return (
    <>
      <h1>Al / Sat</h1>
      <p className="kucuk soluk">Sanal işlem. Fiyat, son veri dosyasındaki fiyattır (gecikmeli/gün sonu); değiştirilemez. Gerçek para hiçbir şekilde kullanılmaz.</p>
      <div className="sekme">{(['al', 'sat'] as const).map(y => <button key={y} className={yon === y ? 'secili' : ''} onClick={() => setYon(y)}>{y === 'al' ? 'Al' : 'Sat'}</button>)}</div>
      <label>Varlık</label>
      <select value={kod} onChange={e => setKod(e.target.value)}>
        <option value="">Seçin…</option>
        {(yon === 'sat' ? liste.filter(([k]) => pf.durum.pozisyonlar[k]) : liste).map(([k, x]) =>
          <option key={k} value={k} disabled={x.deger === null}>{x.tur.toUpperCase()} · {k}{x.tur === 'fon' ? ' · ' + x.ad.slice(0, 40) : ''}{x.deger === null ? ' (veri yok)' : ''}</option>)}
      </select>

      {v && <div className="kart">
        <div className="satir ara"><b>{kod}</b><DurumEtiketi k={v} /></div>
        <div className="buyuk">{fiyat === null ? 'Yeterli veri yok' : sayi(fiyat, 4) + ' TL'}</div>
        {eskiGun !== null && eskiGun > 4 && <div className="uyari-r kucuk">Fiyat {eskiGun} gün önceye ait. İşlem bu eski fiyattan kaydedilir.</div>}
        {pz && <div className="kucuk">Elinizde: {sayi(pz.adet, 4)} · ort. maliyet {sayi(pz.ortMaliyet, 4)}</div>}
        <VeriSeridi kaynak={v.kaynak} tarih={v.tarih} />
      </div>}

      {v && fiyat !== null && <>
        <label>{tur === 'hisse' ? 'Adet (tam sayı)' : tur === 'altin' ? 'Gram' : tur === 'doviz' ? 'Miktar (döviz)' : 'Pay adedi'}</label>
        <input inputMode="decimal" value={adetS} onChange={e => setAdet(e.target.value)} />
        {yon === 'sat' && pz && <button style={{ marginTop: '.4rem' }} onClick={() => setAdet(String(pz.adet).replace('.', ','))}>Tümü</button>}
        {maliyet && <div className="kart kucuk">
          Tutar {tl(tutar)} · Komisyon {tl(maliyet.komisyon)} · BSMV {tl(maliyet.bsmv)} · Makas {tl(maliyet.makas)} · <b>Maliyet {tl(maliyet.toplam)}</b> ({(maliyet.toplam / tutar * 100).toFixed(2)}%)
          {yon === 'al' && <div>Portföy payı: <b>{(tutar / pf.deger.toplam * 100).toFixed(1)}%</b> · Gidiş-dönüş maliyet ≈ {(2 * maliyet.toplam / tutar * 100).toFixed(2)}%: fiyat en az bu kadar yükselmeden kâra geçemezsiniz.</div>}
        </div>}
      </>}

      {v && fiyat !== null && yon === 'al' && <div className="kart vurgu">
        <h3 style={{ marginTop: 0 }}>Karar günlüğü (zorunlu)</h3>
        <p className="kucuk soluk">Profesyoneller pozisyona girmeden önce tezlerini ve çıkış planlarını yazar. Sonra kararınızı sonuçtan ayrı değerlendireceğiz.</p>
        <label>Neden alıyorum? (tez: neden bu varlık, neden şimdi, piyasa neyi gözden kaçırıyor)</label>
        <textarea value={neden} onChange={e => setNeden(e.target.value)} />
        <div className="kucuk soluk">{neden.trim().length} karakter</div>
        <div className="izgara">
          <div><label>Hedef fiyat</label><input inputMode="decimal" value={hedefS} onChange={e => setHedef(e.target.value)} /></div>
          <div><label>Zarar kes seviyesi</label><input inputMode="decimal" value={zkS} onChange={e => setZk(e.target.value)} /></div>
          <div><label>Beklenen süre (gün)</label><input inputMode="numeric" value={vadeS} onChange={e => setVade(e.target.value)} /></div>
          <div><label>Kendime güvenim (1-5): {guven}</label><input type="range" min={1} max={5} value={guven} onChange={e => setGuven(Number(e.target.value))} /></div>
        </div>
        <label>Çıkış planım (hangi durumda tezim yanlış çıkmış sayılır?)</label>
        <textarea value={cikisPlani} onChange={e => setCikis(e.target.value)} style={{ minHeight: 70 }} />
        {taslak && <div style={{ marginTop: '.8rem' }}>
          <b>Ön kontrol</b> <span className="soluk kucuk">({surecPuani(kontroller).puan}/{surecPuani(kontroller).azami} giriş puanı)</span>
          {kontroller.map(c => <div key={c.ad} className="kucuk">{c.gecti === null ? '○' : c.gecti ? <span className="iyi">✓</span> : <span className="kotu-r">✗</span>} <b>{c.ad}:</b> {c.aciklama}</div>)}
          <div className="kucuk soluk">Kontroller sizi engellemez, sadece kayda geçer. Kararınızı verin.</div>
        </div>}
      </div>}

      {v && yon === 'sat' && pz && acikKararlar.length > 0 && Math.abs(pz.adet - adet) < 1e-9 && <div className="kart vurgu">
        <h3 style={{ marginTop: 0 }}>Pozisyonu kapatıyorsunuz: neden?</h3>
        {acikKararlar.map(k => <div key={k.id} className="kucuk soluk">Planınız: hedef {k.hedefFiyat}, zarar kes {k.zararKes}. "{k.cikisPlani}"</div>)}
        <select value={cikisNedeni} onChange={e => setCN(e.target.value as CikisNedeni)}>
          <option value="">Seçin…</option>
          <option value="hedef">Hedefe ulaştı</option><option value="zarar_kes">Zarar kes seviyesi geldi</option>
          <option value="plan_degisti">Tezim değişti (aşağıda gerekçe)</option><option value="duygusal">Dürüst olayım: korku/açgözlülük</option>
          <option value="diger">Diğer</option>
        </select>
        <label>Açıklama</label><textarea value={cikisAciklama} onChange={e => setCA(e.target.value)} style={{ minHeight: 70 }} />
      </div>}
      {yon === 'sat' && pz && adet > 0 && adet < pz.adet && <p className="kucuk soluk">Kısmi satış: karar kaydı pozisyon tamamen kapanana kadar açık kalır.</p>}

      {hata && <div className="kart kotu">{hata}</div>}
      <button className="ana" style={{ width: '100%', marginTop: '1rem' }} disabled={!v || fiyat === null || !(adet > 0) || (yon === 'al' && !formTamam)} onClick={gonder}>
        {yon === 'al' ? 'Sanal alımı onayla' : 'Sanal satışı onayla'}
      </button>
    </>
  )
}
