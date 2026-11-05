import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useVeri, type Fiyatlar } from '../veri/yukle'
import { usePortfoy } from '../veri/portfoyHook'
import { BASLANGIC_NAKIT, tl, vadeTarihi } from '../motor/portfoy'
import { mevduatGetirisi } from '../motor/maliyet'
import { db } from '../depo/db'
import { Yukleniyor, VeriSeridi, Degisim, sayi } from '../bilesenler/ortak'

export default function Portfoy() {
  const f = useVeri<Fiyatlar>('fiyatlar')
  const pf = usePortfoy(f.veri)
  if (!pf.hazir || f.yukleniyor) return <Yukleniyor />
  const { durum, deger, p } = pf
  const getiri = deger.toplam / BASLANGIC_NAKIT - 1
  const pozlar = Object.values(durum.pozisyonlar)

  return (
    <>
      <h1>Sanal Portföy</h1>
      <div className="kart vurgu">
        <div className="soluk kucuk">Toplam değer (sanal)</div>
        <div className="buyuk">{tl(deger.toplam)}</div>
        <div className="satir kucuk">Başlangıca göre: <Degisim x={getiri} /> · Nakit {tl(durum.nakit)}{durum.mevduatta > 0 && <> · Mevduatta {tl(durum.mevduatta)}</>}</div>
        <div className="kucuk soluk">Ödenen toplam komisyon/makas: {tl(durum.toplamMaliyet)} · stopaj: {tl(durum.toplamStopaj)} · gerçekleşen kâr/zarar: {tl(durum.gerceklesenKar)}</div>
        <div className="kucuk soluk">Nominal getiri. Enflasyona göre değerlendirmeyi unutmayın: yüksek enflasyonda pozitif nominal getiri reel kayıp olabilir.</div>
        {deger.eksik.length > 0 && <div className="kucuk uyari-r">Fiyatı bulunamayan pozisyon(lar) maliyetle değerlendi: {deger.eksik.join(', ')}</div>}
      </div>
      <div className="satir"><Link className="dugme ana" to="/emir">+ Al / Sat</Link><Link className="dugme" to="/gunluk">Karar günlüğü</Link></div>

      <h2>Pozisyonlar</h2>
      {pozlar.length === 0 ? <p className="soluk">Henüz pozisyon yok. İlk alımdan önce Seviye 1'deki "Risk ve getiri" dersini bitirmeniz önerilir.</p> :
        <div className="kart" style={{ overflowX: 'auto' }}><table>
          <thead><tr><th>Varlık</th><th className="s">Adet</th><th className="s">Ort. maliyet</th><th className="s">Son fiyat</th><th className="s">K/Z</th><th className="s">Pay</th></tr></thead>
          <tbody>{pozlar.map(pz => {
            const v = f.veri?.varliklar[pz.kod]; const son = v?.deger ?? null
            return <tr key={pz.kod}>
              <td><b>{pz.kod}</b><div className="soluk kucuk">{v?.tarih ?? 'fiyat yok'}</div></td>
              <td className="s">{sayi(pz.adet, 4)}</td><td className="s">{sayi(pz.ortMaliyet, 4)}</td>
              <td className="s">{son === null ? '—' : sayi(son, 4)}</td>
              <td className="s"><Degisim x={son === null ? null : son / pz.ortMaliyet - 1} /></td>
              <td className="s">{son === null ? '—' : ((pz.adet * son) / deger.toplam * 100).toFixed(1) + '%'}</td>
            </tr>
          })}</tbody></table>
          <VeriSeridi kaynak="fiyatlar.json (borsapy)" tarih={f.veri?.uretildi} ek="K/Z işlem maliyetleri dahil, satış stopajı hariç" />
        </div>}

      <Mevduat nakit={durum.nakit} />
      {pf.mevduatlar && pf.mevduatlar.length > 0 && <div className="kart"><table>
        <thead><tr><th>Açılış</th><th className="s">Anapara</th><th className="s">Oran</th><th>Vade</th><th className="s">Net faiz</th></tr></thead>
        <tbody>{pf.mevduatlar.map(m => <tr key={m.id}>
          <td>{m.acilis.slice(0, 10)}</td><td className="s">{tl(m.anapara)}</td><td className="s">%{sayi(m.yillikOran * 100, 2)}</td>
          <td>{vadeTarihi(m).toISOString().slice(0, 10)}{new Date() >= vadeTarihi(m) ? ' ✓' : ''}</td>
          <td className="s">{tl(mevduatGetirisi(m.anapara, m.yillikOran, m.gun, p).net)}</td></tr>)}</tbody></table>
        <div className="kucuk soluk">Oran kaynağı sizin girdiğiniz banka oranıdır. Stopaj %{(p.stopajMevduat * 100).toFixed(1)} (Ayarlar).</div></div>}
    </>
  )
}

function Mevduat({ nakit }: { nakit: number }) {
  const [ac, setAc] = useState(false)
  const [anapara, setA] = useState(''), [oran, setO] = useState(''), [gun, setG] = useState('32'), [kaynak, setK] = useState('')
  const a = Number(anapara.replace(',', '.')), o = Number(oran.replace(',', '.')) / 100, g = Number(gun)
  const gecerli = a > 0 && a <= nakit && o > 0 && o < 2 && g >= 1 && kaynak.trim().length >= 3
  if (!ac) return <button onClick={() => setAc(true)} style={{ marginTop: '1rem' }}>+ Sanal vadeli mevduat aç</button>
  return <div className="kart">
    <h3>Vadeli mevduat</h3>
    <p className="kucuk soluk">Uygulamada mevduat faizi verisi yok; bankanızın bugünkü ilan ettiği oranı girin ve nereden aldığınızı yazın.</p>
    <label>Anapara (TL)</label><input inputMode="decimal" value={anapara} onChange={e => setA(e.target.value)} />
    <label>Yıllık brüt faiz (%)</label><input inputMode="decimal" value={oran} onChange={e => setO(e.target.value)} />
    <label>Vade (gün)</label><input inputMode="numeric" value={gun} onChange={e => setG(e.target.value)} />
    <label>Oran kaynağı (banka, tarih)</label><input value={kaynak} onChange={e => setK(e.target.value)} />
    <div className="satir" style={{ marginTop: '.8rem' }}>
      <button className="ana" disabled={!gecerli} onClick={async () => {
        await db.mevduatlar.add({ acilis: new Date().toISOString(), anapara: a, yillikOran: o, gun: g, oranKaynak: kaynak.trim() }); setAc(false)
      }}>Aç</button><button onClick={() => setAc(false)}>Vazgeç</button>
    </div>
    {a > nakit && <div className="kotu-r kucuk">Nakit yetersiz.</div>}
  </div>
}
