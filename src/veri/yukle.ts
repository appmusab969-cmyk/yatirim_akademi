import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type ElleGiris } from '../depo/db'
import { zarfCoz, parolaAl, ParolaHatasi, type Zarf } from './sifre'

export interface Kalem { deger: number | null; tarih: string | null; kaynak: string | null; birim: string; durum: 'guncel' | 'eski' | 'yok' | 'elle'; not: string }
export interface Varlik extends Kalem { ad: string; tur: 'hisse' | 'endeks' | 'doviz' | 'altin' | 'fon'; kategori?: string; risk?: number; getiri_1y?: number; gecmis: [string, number][] }
export interface Fiyatlar { uretildi: string; varliklar: Record<string, Varlik> }
export interface Makro { uretildi: string; kalemler: Record<string, Kalem>; stopaj_fon: { kaynak: string; donem: string; tarih: string; satirlar: [string, number][] } | null }
export interface Haber { baslik: string; link: string; kaynak: string; tarih: string | null; ozet: string }
export interface Haberler { uretildi: string; durum: string; haberler: Haber[]; not: string }
export interface Meta { uretildi: string; sonuc: Record<string, string>; rapor: string[] }

type Durum<T> = { veri: T | null; hata: string | null; yukleniyor: boolean }

const bellek = new Map<string, Promise<unknown>>()
const SIFRELI = new Set(['fiyatlar', 'makro', 'haberler'])

function getir<T>(ad: string, parola: string | undefined): Promise<T> {
  const sifreli = SIFRELI.has(ad)
  const anahtar = sifreli ? `${ad}|${parola ?? ''}` : ad
  if (!bellek.has(anahtar)) bellek.set(anahtar, (async () => {
    if (sifreli && !parola) throw new ParolaHatasi('yok')
    const dosya = sifreli ? `${ad}.enc.json` : `${ad}.json`
    const r = await fetch(`./data/${dosya}`, { cache: 'no-cache' })
    if (!r.ok) throw new Error(`${dosya} bulunamadı (HTTP ${r.status})`)
    const j = await r.json()
    return sifreli ? zarfCoz<T>(j as Zarf, parola!) : j
  })().catch(e => { bellek.delete(anahtar); throw e }))
  return bellek.get(anahtar) as Promise<T>
}

/** Veri dosyasını okur ve (gerekiyorsa) cihazda çözer. Çevrimdışıyken service worker en son cache'i verir. */
export function useVeri<T>(ad: 'fiyatlar' | 'makro' | 'haberler' | 'meta'): Durum<T> {
  const [d, setD] = useState<Durum<T>>({ veri: null, hata: null, yukleniyor: true })
  const parola = useLiveQuery(parolaAl, [], null) // null = henüz okunmadı
  useEffect(() => {
    if (parola === null) return
    let iptal = false
    getir<T>(ad, parola).then(v => !iptal && setD({ veri: v, hata: null, yukleniyor: false }),
      e => !iptal && setD({ veri: null, hata: String(e.message ?? e), yukleniyor: false }))
    return () => { iptal = true }
  }, [ad, parola])
  return d
}

/** Kaç gün önceki veri? */
export function gunFarki(tarih: string | null | undefined, bugun = new Date()): number | null {
  if (!tarih) return null
  const t = new Date(tarih.length <= 10 ? tarih + 'T00:00:00' : tarih)
  if (isNaN(+t)) return null
  return Math.floor((+bugun - +t) / 86_400_000)
}

/**
 * Makro değerin son hali: otomatik veri güncel ve elle girişten yeni/eşitse otomatik;
 * otomatik yoksa veya elle giriş daha yeniyse elle giriş (kaynağı "elle giriş" olarak işaretli).
 */
export function makroSec(otomatik: Kalem | undefined, elle: ElleGiris | undefined): Kalem {
  const bos: Kalem = { deger: null, tarih: null, kaynak: null, birim: '%', durum: 'yok', not: 'Yeterli veri yok. Ayarlar > Elle giriş bölümünden girebilirsiniz.' }
  const oto = otomatik && otomatik.deger !== null ? otomatik : null
  const el: Kalem | null = elle ? { deger: elle.deger, tarih: elle.tarih, kaynak: `Elle giriş: ${elle.kaynak}`, birim: '%', durum: 'elle', not: '' } : null
  if (oto && el) return (el.tarih ?? '') > (oto.tarih ?? '') ? el : oto
  return oto ?? el ?? bos
}

export function useElle() {
  return useLiveQuery(async () => Object.fromEntries((await db.elle.toArray()).map(e => [e.anahtar, e])) as Record<string, ElleGiris>, [], {} as Record<string, ElleGiris>)
}

/** n işlem günü önceye göre değişim; yeterli geçmiş yoksa null. */
export function degisim(gecmis: [string, number][] | undefined, n: number): number | null {
  if (!gecmis || gecmis.length <= n) return null
  const son = gecmis[gecmis.length - 1][1], once = gecmis[gecmis.length - 1 - n][1]
  return once > 0 ? son / once - 1 : null
}
