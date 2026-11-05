import { islemMaliyeti, satisStopaji, mevduatGetirisi } from './maliyet'
import type { Parametreler, VarlikTuru } from './parametreler'

export interface Islem {
  id?: number
  tarih: string           // ISO
  kod: string             // THYAO, GRAM_ALTIN, USDTRY, fon kodu
  tur: VarlikTuru
  yon: 'al' | 'sat'
  adet: number
  fiyat: number
  maliyet: number         // komisyon + BSMV + makas
  stopaj: number
  fiyatKaynak: string     // "Yahoo Finance · 2026-11-03 kapanış"
  kararId?: number
}

export interface Mevduat {
  id?: number; acilis: string; anapara: number; yillikOran: number; gun: number; oranKaynak: string
}

/** ortMaliyet: işlem maliyeti dahil birim maliyet (ağırlıklı ortalama). */
export interface Pozisyon { kod: string; tur: VarlikTuru; adet: number; ortMaliyet: number }

export const BASLANGIC_NAKIT = 1_000_000

export interface Durum {
  nakit: number; pozisyonlar: Record<string, Pozisyon>; mevduatta: number
  gerceklesenKar: number; toplamMaliyet: number; toplamStopaj: number
}

export const vadeTarihi = (m: Mevduat) => { const v = new Date(m.acilis); v.setDate(v.getDate() + m.gun); return v }

/** İşlem listesini baştan oynatarak durumu hesaplar (tek doğruluk kaynağı: işlem kaydı). */
export function durumHesapla(islemler: Islem[], mevduatlar: Mevduat[], p: Parametreler, bugun = new Date()): Durum {
  const d: Durum = { nakit: BASLANGIC_NAKIT, pozisyonlar: {}, mevduatta: 0, gerceklesenKar: 0, toplamMaliyet: 0, toplamStopaj: 0 }
  const sirali = [...islemler].sort((a, b) => a.tarih.localeCompare(b.tarih) || (a.id ?? 0) - (b.id ?? 0))
  for (const i of sirali) {
    const tutar = i.adet * i.fiyat
    d.toplamMaliyet += i.maliyet; d.toplamStopaj += i.stopaj
    const pz = d.pozisyonlar[i.kod] ?? { kod: i.kod, tur: i.tur, adet: 0, ortMaliyet: 0 }
    if (i.yon === 'al') {
      d.nakit -= tutar + i.maliyet
      pz.ortMaliyet = (pz.adet * pz.ortMaliyet + tutar + i.maliyet) / (pz.adet + i.adet)
      pz.adet += i.adet
    } else {
      d.nakit += tutar - i.maliyet - i.stopaj
      d.gerceklesenKar += tutar - i.maliyet - i.stopaj - i.adet * pz.ortMaliyet
      pz.adet -= i.adet
    }
    if (pz.adet > 1e-9) d.pozisyonlar[i.kod] = pz; else delete d.pozisyonlar[i.kod]
  }
  for (const m of mevduatlar) {
    d.nakit -= m.anapara
    if (bugun >= vadeTarihi(m)) {
      const g = mevduatGetirisi(m.anapara, m.yillikOran, m.gun, p)
      d.nakit += m.anapara + g.net; d.gerceklesenKar += g.net; d.toplamStopaj += g.stopaj
    } else d.mevduatta += m.anapara
  }
  return d
}

export type EmirSonucu = { ok: true; islem: Islem } | { ok: false; hata: string }

export interface Emir { kod: string; tur: VarlikTuru; yon: 'al' | 'sat'; adet: number; fiyat: number; fiyatKaynak: string; tarih: string }

/** Emri doğrular ve maliyet/stopajı hesaplanmış işlem üretir. Kaydetmez. */
export function emirHazirla(e: Emir, durum: Durum, p: Parametreler): EmirSonucu {
  if (!(e.adet > 0) || !(e.fiyat > 0)) return { ok: false, hata: 'Adet ve fiyat sıfırdan büyük olmalı.' }
  if (e.tur === 'hisse' && !Number.isInteger(e.adet)) return { ok: false, hata: "Hisse adedi tam sayı olmalı (BIST'te kesirli pay yok)." }
  const tutar = e.adet * e.fiyat
  const m = islemMaliyeti(e.tur, tutar, p)
  if (e.yon === 'al') {
    if (tutar + m.toplam > durum.nakit + 1e-6) return { ok: false, hata: `Yetersiz nakit. Gereken ${tl(tutar + m.toplam)}, mevcut ${tl(durum.nakit)}.` }
    return { ok: true, islem: { ...e, maliyet: m.toplam, stopaj: 0 } }
  }
  const pz = durum.pozisyonlar[e.kod]
  if (!pz || pz.adet + 1e-9 < e.adet) return { ok: false, hata: 'Elinizdekinden fazla satamazsınız (açığa satış kapalı).' }
  const kazanc = tutar - m.toplam - e.adet * pz.ortMaliyet
  return { ok: true, islem: { ...e, maliyet: m.toplam, stopaj: satisStopaji(e.tur, kazanc, p) } }
}

/** Portföyün piyasa değeri. Fiyatı bilinmeyen pozisyon maliyetle değerlenir ve "eksik" listesine düşer. */
export function piyasaDegeri(d: Durum, fiyat: (kod: string) => number | undefined) {
  let toplam = d.nakit + d.mevduatta; const eksik: string[] = []
  for (const pz of Object.values(d.pozisyonlar)) {
    const f = fiyat(pz.kod)
    if (f === undefined) { eksik.push(pz.kod); toplam += pz.adet * pz.ortMaliyet } else toplam += pz.adet * f
  }
  return { toplam, eksik }
}

export const tl = (x: number) => x.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 2 })
export const yuzde = (x: number, h = 1) => '%' + (x * 100).toLocaleString('tr-TR', { maximumFractionDigits: h, minimumFractionDigits: h })
