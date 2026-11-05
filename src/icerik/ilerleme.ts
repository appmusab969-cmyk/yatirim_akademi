import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../depo/db'
import { SEVIYELER } from './index'
import type { Beceri } from './tipler'

export const SINAV_ESIK = 0.8
export const SINAV_SORU = 15

export function useIlerleme() {
  return useLiveQuery(async () => {
    const quiz = await db.quiz.toArray(), sinav = await db.sinav.toArray(), gorev = await db.gorev.toArray()
    const enIyiQuiz: Record<string, number> = {}
    for (const q of quiz) enIyiQuiz[q.dersId] = Math.max(enIyiQuiz[q.dersId] ?? 0, q.dogru / q.toplam)
    const gecilen = new Set(sinav.filter(s => s.gecti).map(s => s.seviye))
    const gorevTamam = new Set(gorev.filter(g => g.tamam).map(g => g.dersId))
    const acik = (no: number) => no === 1 || gecilen.has(no - 1)
    const sinavAcik = (no: number) => acik(no) && (SEVIYELER.find(s => s.no === no)?.dersler.every(d => d.id in enIyiQuiz) ?? false)
    // beceri puanı: o beceriye ait tüm quiz denemelerinin doğru oranı (son 3 deneme ağırlıklı değil, basit ortalama)
    const b: Partial<Record<Beceri, { d: number; t: number }>> = {}
    for (const q of quiz) { const x = (b[q.beceri as Beceri] ??= { d: 0, t: 0 }); x.d += q.dogru; x.t += q.toplam }
    return { enIyiQuiz, gecilen, gorevTamam, acik, sinavAcik, beceri: b, sinavlar: sinav }
  }, [])
}

/** Deterministik olmayan karıştırma (Fisher–Yates). */
export function karistir<T>(a: T[]): T[] {
  const b = [...a]
  for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]] }
  return b
}
