import type { ReactNode } from 'react'
import { gunFarki, type Kalem } from '../veri/yukle'

const DURUM_ETIKET: Record<string, [string, string]> = {
  guncel: ['güncel', ''], eski: ['eski veri', 'eski'], yok: ['yeterli veri yok', 'yok'], elle: ['elle giriş', 'elle'],
}

export function DurumEtiketi({ k }: { k: Pick<Kalem, 'durum' | 'tarih'> }) {
  const g = gunFarki(k.tarih)
  let durum = k.durum
  if (durum === 'guncel' && g !== null && g > 4) durum = 'eski'
  const [metin, sinif] = DURUM_ETIKET[durum] ?? [durum, '']
  return <span className={`etiket ${sinif}`}>{metin}{g !== null && g > 0 ? ` · ${g} gün` : ''}</span>
}

/** Her ekranda zorunlu: verinin kaynağı ve tarihi. */
export function VeriSeridi({ kaynak, tarih, ek }: { kaynak: string | null | undefined; tarih: string | null | undefined; ek?: ReactNode }) {
  return <div className="serit">Kaynak: {kaynak ?? 'yok'} · Tarih: {tarih ? tarih.replace('T', ' ') : 'yok'}{ek ? <> · {ek}</> : null}</div>
}

export function Yukleniyor() { return <p className="soluk">Yükleniyor…</p> }

export function VeriYok({ neden }: { neden: string }) {
  return <div className="kart kotu"><b>Yeterli veri yok.</b><div className="soluk kucuk">{neden}</div></div>
}

export const sayi = (x: number | null | undefined, h = 2) =>
  x === null || x === undefined || !Number.isFinite(x) ? '—' : x.toLocaleString('tr-TR', { maximumFractionDigits: h, minimumFractionDigits: Math.min(h, 2) })

export function Degisim({ x }: { x: number | null }) {
  if (x === null) return <span className="soluk">—</span>
  return <span className={x > 0 ? 'iyi' : x < 0 ? 'kotu-r' : ''}>{x > 0 ? '+' : ''}{(x * 100).toLocaleString('tr-TR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}%</span>
}
