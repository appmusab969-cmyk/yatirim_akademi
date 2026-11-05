import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, parametreleriAl, parametreleriKaydet, type ElleGiris } from '../depo/db'
import { yedekIndir, yedekYukle } from '../depo/yedek'
import { PARAMETRE_ACIKLAMA, VARSAYILAN, type OranAnahtari, type Parametreler } from '../motor/parametreler'
import { useVeri, type Makro, type Meta } from '../veri/yukle'
import { VeriSeridi, sayi } from '../bilesenler/ortak'
import { ParolaFormu } from '../bilesenler/ParolaKapisi'
import { parolaAl, parolaSil } from '../veri/sifre'

const ELLE: [ElleGiris['anahtar'], string, string][] = [
  ['politika_faizi', 'Politika faizi (%)', 'TCMB PPK karar metni: tcmb.gov.tr › Basın Duyuruları'],
  ['tufe_yillik', 'TÜFE yıllık (%)', 'TÜİK Tüketici Fiyat Endeksi bülteni: data.tuik.gov.tr'],
  ['tufe_aylik', 'TÜFE aylık (%)', 'TÜİK Tüketici Fiyat Endeksi bülteni'],
]

function ElleSatir({ anahtar, ad, ipucu, mevcut }: { anahtar: ElleGiris['anahtar']; ad: string; ipucu: string; mevcut?: ElleGiris }) {
  const [d, setD] = useState(''), [t, setT] = useState(new Date().toISOString().slice(0, 10)), [k, setK] = useState('')
  const deger = Number(d.replace(',', '.'))
  const ok = d !== '' && Number.isFinite(deger) && deger > -10 && deger < 200 && t && k.trim().length >= 3
  return <div className="kart">
    <b>{ad}</b> {mevcut && <span className="etiket elle">mevcut: %{sayi(mevcut.deger)} · {mevcut.tarih} · {mevcut.kaynak}</span>}
    <div className="kucuk soluk">Nereden bakılır: {ipucu}</div>
    <div className="izgara">
      <div><label>Değer</label><input inputMode="decimal" value={d} onChange={e => setD(e.target.value)} /></div>
      <div><label>Geçerlilik tarihi</label><input type="date" value={t} onChange={e => setT(e.target.value)} /></div>
    </div>
    <label>Kaynak (zorunlu)</label><input value={k} onChange={e => setK(e.target.value)} placeholder="ör. TCMB PPK 23.10.2026 basın duyurusu" />
    <div className="satir" style={{ marginTop: '.6rem' }}>
      <button className="ana" disabled={!ok} onClick={() => db.elle.put({ anahtar, deger, tarih: t, kaynak: k.trim() }).then(() => { setD(''); setK('') })}>Kaydet</button>
      {mevcut && <button onClick={() => db.elle.delete(anahtar)}>Sil</button>}
    </div>
  </div>
}

export default function Ayarlar() {
  const [p, setP] = useState<Parametreler | null>(null)
  const [mesaj, setMesaj] = useState<string | null>(null)
  const elle = useLiveQuery(() => db.elle.toArray(), [], [])
  const sonYedek = useLiveQuery(() => db.ayar.get('sonYedek'), [])
  const m = useVeri<Makro>('makro'), meta = useVeri<Meta>('meta')
  const parolaVar = useLiveQuery(parolaAl, [], '')
  useEffect(() => { parametreleriAl().then(setP) }, [])
  if (!p) return null
  const sY = sonYedek?.deger as string | undefined
  const yedekGun = sY ? Math.floor((Date.now() - +new Date(sY)) / 86_400_000) : null

  return (
    <>
      <h1>Ayarlar</h1>

      <h2>Yedek</h2>
      <div className={`kart ${yedekGun === null || yedekGun > 7 ? 'uyari' : ''}`}>
        <p className="kucuk">Portföy, karar günlüğü ve ders ilerlemeniz <b>yalnızca bu cihazda</b> (IndexedDB) durur. Tarayıcı verisini silerseniz kaybolur. Haftada bir yedek alın; telefon ve PC arasında taşımak için de bunu kullanın.</p>
        <div className="kucuk">Son yedek: {sY ? `${sY.slice(0, 10)} (${yedekGun} gün önce)` : 'hiç alınmadı'}</div>
        <div className="satir" style={{ marginTop: '.6rem' }}>
          <button className="ana" onClick={yedekIndir}>JSON olarak dışa aktar</button>
          <label className="dugme" style={{ margin: 0, color: 'var(--metin)' }}>İçe aktar…
            <input type="file" accept="application/json,.json" style={{ display: 'none' }} onChange={async e => {
              const dosya = e.target.files?.[0]; e.target.value = ''
              if (!dosya) return
              if (!confirm('İçe aktarma, bu cihazdaki TÜM mevcut verinin yerine geçer. Devam edilsin mi?')) return
              try { const o = await yedekYukle(JSON.parse(await dosya.text())); setMesaj('Yüklendi: ' + o.map(x => `${x.tablo} ${x.kayit}`).join(', ')); parametreleriAl().then(setP) }
              catch (err) { setMesaj('Yüklenemedi: ' + (err as Error).message) }
            }} />
          </label>
        </div>
        {mesaj && <div className="kucuk" style={{ marginTop: '.5rem' }}>{mesaj}</div>}
      </div>

      <h2>Veri parolası</h2>
      <div className={`kart ${parolaVar ? '' : 'uyari'}`}>
        <div className="kucuk">{parolaVar ? 'Bu cihazda kayıtlı. Piyasa verisi cihazda çözülüyor.' : 'Kayıtlı parola yok: fiyat, makro ve haber verisi gösterilemez.'}</div>
        {m.hata && parolaVar && <div className="kotu-r kucuk" role="alert">{m.hata}</div>}
        <ParolaFormu onBasari={() => setMesaj('Parola doğrulandı ve kaydedildi.')} />
        {parolaVar && <button style={{ marginTop: '.5rem' }} onClick={() => confirm('Parola bu cihazdan silinsin mi?') && parolaSil()}>Parolayı bu cihazdan sil</button>}
      </div>

      <h2>Elle giriş: faiz ve enflasyon</h2>
      <p className="kucuk soluk">EVDS anahtarı gelene kadar ya da otomatik veri reddedildiğinde kullanılır. Otomatik veri daha yeni tarihli olursa onun yerine geçer.</p>
      {ELLE.map(([a, ad, ip]) => <ElleSatir key={a} anahtar={a} ad={ad} ipucu={ip} mevcut={elle.find(e => e.anahtar === a)} />)}

      <h2>İşlem maliyeti ve vergi</h2>
      <div className={`kart ${p.dogrulamaTarihi ? '' : 'uyari'}`}>
        {!p.dogrulamaTarihi && <p className="uyari-r kucuk">Vergi oranları varsayılan değerlerdir ve sizin tarafınızdan doğrulanmadı. Güncel oranı Resmî Gazete / GİB'den kontrol edip "Doğruladım" deyin.</p>}
        {(Object.keys(PARAMETRE_ACIKLAMA) as OranAnahtari[]).map(k => (
          <div key={k}>
            <label>{PARAMETRE_ACIKLAMA[k][0]} (%)</label>
            <input inputMode="decimal" defaultValue={String(+(p[k] * 100).toFixed(4)).replace('.', ',')}
              onBlur={e => { const x = Number(e.target.value.replace(',', '.')) / 100; if (Number.isFinite(x) && x >= 0 && x < 1) setP({ ...p, [k]: x }) }} />
            <div className="kucuk soluk">{PARAMETRE_ACIKLAMA[k][1]}</div>
          </div>))}
        {m.veri?.stopaj_fon && <div className="kart" style={{ marginTop: '1rem' }}>
          <b>Referans: fon stopaj tablosu ({m.veri.stopaj_fon.donem})</b>
          <table><tbody>{m.veri.stopaj_fon.satirlar.map(([a, o]) => <tr key={a}><td>{a}</td><td className="s">%{sayi(o, 1)}</td></tr>)}</tbody></table>
          <div className="kucuk soluk">Bu tablo tek bir oran değil; fon türüne göre değişir. Ayardaki "fon stopajı" tek bir varsayımdır.</div>
          <VeriSeridi kaynak={m.veri.stopaj_fon.kaynak} tarih={m.veri.stopaj_fon.tarih} />
        </div>}
        <div className="satir" style={{ marginTop: '.8rem' }}>
          <button className="ana" onClick={() => parametreleriKaydet(p).then(() => setMesaj('Parametreler kaydedildi.'))}>Kaydet</button>
          <button onClick={() => { const y = { ...p, dogrulamaTarihi: new Date().toISOString().slice(0, 10) }; setP(y); parametreleriKaydet(y) }}>Oranları bugün doğruladım</button>
          <button onClick={() => { setP(VARSAYILAN); parametreleriKaydet(VARSAYILAN) }}>Varsayılana dön</button>
        </div>
        {p.dogrulamaTarihi && <div className="kucuk soluk">Son doğrulama: {p.dogrulamaTarihi}</div>}
        <div className="kucuk soluk">Not: oran değişikliği geçmiş işlemlerin kayıtlı maliyetini değiştirmez; sadece yeni işlemlere uygulanır.</div>
      </div>

      <h2>Veri durumu</h2>
      <div className="kart kucuk">
        {meta.veri ? <>
          <div>Son çekim: {meta.veri.uretildi} · {Object.entries(meta.veri.sonuc).map(([k, v]) => `${k}: ${v}`).join(' · ')}</div>
          {meta.veri.rapor.filter(r => !r.startsWith('BİLGİ')).length === 0 ? <div className="iyi">Uyarı yok.</div> :
            meta.veri.rapor.map((r, i) => <div key={i} className={r.startsWith('RED') || r.startsWith('HATA') ? 'kotu-r' : 'soluk'}>{r}</div>)}
        </> : <div>meta.json yok.</div>}
      </div>

      <h2>Sıfırla</h2>
      <button onClick={async () => {
        if (!confirm('Sanal portföy, işlemler, mevduat ve karar günlüğü silinecek (ders ilerlemesi kalır). Önce yedek almanız önerilir. Emin misiniz?')) return
        await db.transaction('rw', db.islemler, db.mevduatlar, db.kararlar, async () => { await db.islemler.clear(); await db.mevduatlar.clear(); await db.kararlar.clear() })
        setMesaj('Portföy sıfırlandı.')
      }}>Sanal portföyü sıfırla</button>
    </>
  )
}
