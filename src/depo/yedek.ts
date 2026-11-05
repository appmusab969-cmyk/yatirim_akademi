import { db, TABLOLAR } from './db'

export const YEDEK_SURUM = 1

export async function yedekOlustur() {
  const veri: Record<string, unknown[]> = {}
  for (const t of TABLOLAR) veri[t] = await db.table(t).toArray()
  return { uygulama: 'yatirim_akademi', surum: YEDEK_SURUM, olusturuldu: new Date().toISOString(), veri }
}

/** Yedeği doğrular ve MEVCUT VERİNİN YERİNE yazar (tek işlemde; hata olursa hiçbir şey değişmez). */
export async function yedekYukle(json: unknown): Promise<{ tablo: string; kayit: number }[]> {
  const y = json as { uygulama?: string; surum?: number; veri?: Record<string, unknown[]> }
  if (y?.uygulama !== 'yatirim_akademi' || typeof y.surum !== 'number' || !y.veri) throw new Error('Bu dosya bir Yatırım Akademisi yedeği değil.')
  if (y.surum > YEDEK_SURUM) throw new Error(`Yedek daha yeni bir sürümden (v${y.surum}); uygulamayı güncelleyin.`)
  for (const t of TABLOLAR) if (y.veri[t] !== undefined && !Array.isArray(y.veri[t])) throw new Error(`"${t}" tablosu bozuk.`)
  const ozet: { tablo: string; kayit: number }[] = []
  await db.transaction('rw', TABLOLAR.map(t => db.table(t)), async () => {
    for (const t of TABLOLAR) {
      const kayitlar = y.veri![t] ?? []
      await db.table(t).clear(); await db.table(t).bulkAdd(kayitlar)
      ozet.push({ tablo: t, kayit: kayitlar.length })
    }
  })
  return ozet
}

export async function yedekIndir() {
  const y = await yedekOlustur()
  const blob = new Blob([JSON.stringify(y, null, 1)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob); a.download = `akademi_yedek_${y.olusturuldu.slice(0, 10)}.json`; a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 2000)
  await db.ayar.put({ anahtar: 'sonYedek', deger: y.olusturuldu })
}
