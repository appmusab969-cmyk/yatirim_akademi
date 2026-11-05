import Dexie, { type Table } from 'dexie'
import type { Islem, Mevduat } from '../motor/portfoy'
import type { Karar } from '../motor/karar'
import { VARSAYILAN, type Parametreler } from '../motor/parametreler'

// Tüm kişisel veri YALNIZCA bu cihazın IndexedDB'sinde durur. Sunucuya hiçbir şey gönderilmez.
export interface QuizSonucu { id?: number; tarih: string; dersId: string; seviye: number; beceri: string; dogru: number; toplam: number }
export interface SinavSonucu { id?: number; tarih: string; seviye: number; dogru: number; toplam: number; gecti: boolean }
export interface GorevDurumu { dersId: string; tamam: boolean; not: string; tarih: string }
export interface ElleGiris { anahtar: 'politika_faizi' | 'tufe_yillik' | 'tufe_aylik'; deger: number; tarih: string; kaynak: string }
export interface Ayar { anahtar: string; deger: unknown }

class Db extends Dexie {
  islemler!: Table<Islem, number>
  mevduatlar!: Table<Mevduat, number>
  kararlar!: Table<Karar, number>
  quiz!: Table<QuizSonucu, number>
  sinav!: Table<SinavSonucu, number>
  gorev!: Table<GorevDurumu, string>
  elle!: Table<ElleGiris, string>
  ayar!: Table<Ayar, string>
  constructor() {
    super('yatirim_akademi')
    this.version(1).stores({
      islemler: '++id, tarih, kod, kararId', mevduatlar: '++id, acilis', kararlar: '++id, tarih, kod',
      quiz: '++id, dersId, seviye, beceri', sinav: '++id, seviye', gorev: 'dersId', elle: 'anahtar', ayar: 'anahtar',
    })
  }
}
export const db = new Db()

export const TABLOLAR = ['islemler', 'mevduatlar', 'kararlar', 'quiz', 'sinav', 'gorev', 'elle', 'ayar'] as const

export async function parametreleriAl(): Promise<Parametreler> {
  const a = await db.ayar.get('parametreler')
  return { ...VARSAYILAN, ...(a?.deger as Partial<Parametreler> | undefined) }
}
export const parametreleriKaydet = (p: Parametreler) => db.ayar.put({ anahtar: 'parametreler', deger: p })
