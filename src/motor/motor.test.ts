import { describe, it, expect } from 'vitest'
import { VARSAYILAN as P } from './parametreler'
import { islemMaliyeti, mevduatGetirisi, reelGetiri, satisStopaji } from './maliyet'
import { durumHesapla, emirHazirla, BASLANGIC_NAKIT, piyasaDegeri, type Islem } from './portfoy'
import { girisKontrolleri, cikisKontrolleri, surecPuani, ceyrek, type Karar } from './karar'

const T = '2026-11-03T10:00:00Z'

describe('maliyet', () => {
  it('hisse komisyonu + BSMV', () => {
    const m = islemMaliyeti('hisse', 100_000, P)
    expect(m.komisyon).toBeCloseTo(200); expect(m.bsmv).toBeCloseTo(10); expect(m.toplam).toBeCloseTo(210)
  })
  it('altın/döviz makas, komisyon yok', () => {
    const m = islemMaliyeti('altin', 50_000, P); expect(m.makas).toBeCloseTo(500); expect(m.komisyon).toBe(0)
  })
  it('zararda stopaj yok', () => { expect(satisStopaji('fon', -100, P)).toBe(0); expect(satisStopaji('fon', 1000, P)).toBeCloseTo(175) })
  it('mevduat basit faiz', () => {
    const g = mevduatGetirisi(100_000, 0.40, 365, P); expect(g.brut).toBeCloseTo(40_000); expect(g.net).toBeCloseTo(33_000)
  })
  it('reel getiri Fisher', () => { expect(reelGetiri(0.5, 0.5)).toBeCloseTo(0); expect(reelGetiri(0.1, 0.2)).toBeCloseTo(-0.0833, 3) })
})

describe('portföy', () => {
  it('al-sat döngüsü nakdi ve kârı doğru hesaplar', () => {
    let d = durumHesapla([], [], P)
    const al = emirHazirla({ kod: 'X', tur: 'hisse', yon: 'al', adet: 100, fiyat: 100, fiyatKaynak: 't', tarih: T }, d, P)
    expect(al.ok).toBe(true); if (!al.ok) return
    const islemler: Islem[] = [{ ...al.islem, id: 1 }]
    d = durumHesapla(islemler, [], P)
    expect(d.nakit).toBeCloseTo(BASLANGIC_NAKIT - 10_000 - 21)
    expect(d.pozisyonlar.X.ortMaliyet).toBeCloseTo(100.21)
    const sat = emirHazirla({ kod: 'X', tur: 'hisse', yon: 'sat', adet: 100, fiyat: 110, fiyatKaynak: 't', tarih: '2026-11-04T10:00:00Z' }, d, P)
    expect(sat.ok).toBe(true); if (!sat.ok) return
    islemler.push({ ...sat.islem, id: 2 })
    d = durumHesapla(islemler, [], P)
    expect(d.pozisyonlar.X).toBeUndefined()
    expect(d.gerceklesenKar).toBeCloseTo(11_000 - 23.1 - 10_021)
    expect(d.toplamMaliyet).toBeCloseTo(44.1)
  })
  it('yetersiz nakit, fazla satış ve kesirli hisse reddedilir', () => {
    const d = durumHesapla([], [], P)
    expect(emirHazirla({ kod: 'X', tur: 'hisse', yon: 'al', adet: 1e6, fiyat: 100, fiyatKaynak: '', tarih: T }, d, P).ok).toBe(false)
    expect(emirHazirla({ kod: 'X', tur: 'hisse', yon: 'sat', adet: 1, fiyat: 100, fiyatKaynak: '', tarih: T }, d, P).ok).toBe(false)
    expect(emirHazirla({ kod: 'X', tur: 'hisse', yon: 'al', adet: 1.5, fiyat: 100, fiyatKaynak: '', tarih: T }, d, P).ok).toBe(false)
    expect(emirHazirla({ kod: 'G', tur: 'altin', yon: 'al', adet: 1.5, fiyat: 100, fiyatKaynak: '', tarih: T }, d, P).ok).toBe(true)
  })
  it('mevduat vadede nakde döner, öncesinde kilitli', () => {
    const m = [{ acilis: '2026-01-01', anapara: 100_000, yillikOran: 0.365, gun: 32, oranKaynak: '' }]
    const once = durumHesapla([], m, P, new Date('2026-01-10'))
    expect(once.mevduatta).toBe(100_000); expect(once.nakit).toBe(BASLANGIC_NAKIT - 100_000)
    const sonra = durumHesapla([], m, P, new Date('2026-03-01'))
    expect(sonra.nakit).toBeCloseTo(BASLANGIC_NAKIT + 3200 * 0.825)
  })
  it('fiyatı bilinmeyen pozisyon eksik olarak raporlanır', () => {
    const d = durumHesapla([{ tarih: T, kod: 'Y', tur: 'hisse', yon: 'al', adet: 10, fiyat: 10, maliyet: 0, stopaj: 0, fiyatKaynak: '' }], [], P)
    expect(piyasaDegeri(d, () => undefined).eksik).toEqual(['Y'])
  })
})

describe('karar kalitesi', () => {
  const k: Karar = { tarih: T, kod: 'X', neden: 'a'.repeat(100), hedefFiyat: 130, zararKes: 90, cikisPlani: 'hedef', vadeGun: 90, guven: 3, girisFiyat: 100, pozisyonOrani: 0.05, son5GunDegisim: 0.02 }
  it('iyi giriş tam puan', () => { const s = surecPuani(girisKontrolleri(k, 0.1)); expect(s.puan).toBe(60); expect(s.azami).toBe(60) })
  it('veri yoksa FOMO puanlanmaz', () => { expect(surecPuani(girisKontrolleri({ ...k, son5GunDegisim: null }, 0.1)).azami).toBe(50) })
  it('kötü giriş: kısa gerekçe, ters zarar kes, büyük pozisyon, FOMO', () => {
    const s = surecPuani(girisKontrolleri({ ...k, neden: 'yükselir', zararKes: 110, pozisyonOrani: 0.4, son5GunDegisim: 0.25 }, 0.1))
    expect(s.puan).toBe(0)
  })
  it('duygusal çıkış ve zarar kes ihlali', () => {
    expect(surecPuani(cikisKontrolleri({ ...k, cikisFiyat: 80, cikisNedeni: 'duygusal', zararKesIhlali: true })).puan).toBe(0)
  })
  it('çeyrekler', () => {
    expect(ceyrek(0.4, 0.1)).toBe('sansli'); expect(ceyrek(0.9, -0.1)).toBe('sanssiz')
    expect(ceyrek(0.9, 0.1)).toBe('hak_edilmis_basari'); expect(ceyrek(0.2, -0.1)).toBe('hak_edilmis_hata')
  })
})
