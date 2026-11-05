import { useLiveQuery } from 'dexie-react-hooks'
import { db, parametreleriAl } from '../depo/db'
import { durumHesapla, piyasaDegeri } from '../motor/portfoy'
import { VARSAYILAN } from '../motor/parametreler'
import type { Fiyatlar } from './yukle'

export function usePortfoy(f: Fiyatlar | null) {
  const veri = useLiveQuery(async () => ({
    islemler: await db.islemler.toArray(), mevduatlar: await db.mevduatlar.toArray(),
    kararlar: await db.kararlar.toArray(), p: await parametreleriAl(),
  }), [])
  const p = veri?.p ?? VARSAYILAN
  const durum = durumHesapla(veri?.islemler ?? [], veri?.mevduatlar ?? [], p)
  const fiyat = (kod: string) => f?.varliklar[kod]?.deger ?? undefined
  const deger = piyasaDegeri(durum, fiyat)
  return { hazir: !!veri, ...veri, p, durum, deger, fiyat }
}
