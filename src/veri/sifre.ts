// İstemci tarafı çözme: AES-256-GCM, anahtar PBKDF2-SHA256 (Web Crypto). Biçim: veri_hatti/sifrele.py
import { db } from '../depo/db'

export interface Zarf { v: number; alg: 'AES-GCM'; kdf: 'PBKDF2-SHA256'; iter: number; salt: string; iv: string; ad: string; ct: string }

export class ParolaHatasi extends Error {
  tur: 'yok' | 'yanlis'
  constructor(tur: 'yok' | 'yanlis') {
    super(tur === 'yok' ? 'Veri parolası girilmedi.' : 'Parola yanlış: veri çözülemedi. Parolayı kontrol edin (büyük/küçük harf duyarlı) veya Actions parolası değiştiyse yenisini girin.')
    this.tur = tur
  }
}

const b64 = (s: string) => Uint8Array.from(atob(s), c => c.charCodeAt(0))
const anahtarBellek = new Map<string, Promise<CryptoKey>>() // parola+salt → anahtar (PBKDF2 pahalı; bir kez türet)

function anahtarTuret(parola: string, salt: string, iter: number) {
  const k = `${iter}:${salt}:${parola}`
  if (!anahtarBellek.has(k)) anahtarBellek.set(k, (async () => {
    const ham = await crypto.subtle.importKey('raw', new TextEncoder().encode(parola), 'PBKDF2', false, ['deriveKey'])
    return crypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt: b64(salt), iterations: iter }, ham, { name: 'AES-GCM', length: 256 }, false, ['decrypt'])
  })())
  return anahtarBellek.get(k)!
}

export async function zarfCoz<T>(z: Zarf, parola: string): Promise<T> {
  if (z.v !== 1 || z.alg !== 'AES-GCM' || z.kdf !== 'PBKDF2-SHA256') throw new Error('Bilinmeyen şifreleme biçimi')
  const anahtar = await anahtarTuret(parola, z.salt, z.iter)
  try {
    const duz = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(z.iv), additionalData: new TextEncoder().encode(z.ad) }, anahtar, b64(z.ct))
    return JSON.parse(new TextDecoder().decode(duz)) as T
  } catch { throw new ParolaHatasi('yanlis') }
}

const ANAHTAR = 'veriParolasi'
/** Saklı parola; yoksa '' (undefined değil: canlı sorgu "henüz yüklenmedi" ile karışmasın). */
export const parolaAl = async () => ((await db.ayar.get(ANAHTAR))?.deger as string | undefined) ?? ''
export const parolaSil = () => db.ayar.delete(ANAHTAR)

/** Parolayı sunucudaki gerçek dosyayla doğrular; doğruysa cihazda saklar. */
export async function parolaDogrulaVeKaydet(parola: string): Promise<void> {
  const r = await fetch('./data/fiyatlar.enc.json', { cache: 'no-cache' })
  if (!r.ok) throw new Error(`Şifreli veri dosyası alınamadı (HTTP ${r.status}). İnternet bağlantınızı kontrol edin.`)
  await zarfCoz(await r.json(), parola) // yanlışsa ParolaHatasi fırlatır
  await db.ayar.put({ anahtar: ANAHTAR, deger: parola })
}
