import type { Parametreler, VarlikTuru } from './parametreler'

export interface IslemMaliyeti { komisyon: number; bsmv: number; makas: number; toplam: number }

/** Bir alım ya da satımın işlem maliyeti (vergi hariç). tutar = adet × fiyat. */
export function islemMaliyeti(tur: VarlikTuru, tutar: number, p: Parametreler): IslemMaliyeti {
  if (tutar < 0) throw new Error('tutar negatif olamaz')
  let komisyon = 0, makas = 0
  if (tur === 'hisse') komisyon = tutar * p.hisseKomisyon
  else if (tur === 'fon') komisyon = tutar * p.fonKomisyon
  else makas = tutar * p.dovizAltinMakas
  const bsmv = komisyon * p.bsmv
  return { komisyon, bsmv, makas, toplam: komisyon + bsmv + makas }
}

/** Satış kazancı üzerinden stopaj. Zarar varsa vergi yok. */
export function satisStopaji(tur: VarlikTuru, kazanc: number, p: Parametreler): number {
  if (kazanc <= 0) return 0
  const oran = tur === 'hisse' ? p.stopajHisse : tur === 'fon' ? p.stopajFon : 0
  return kazanc * oran
}

/** Basit faizli vadeli mevduat: brüt faiz = anapara × yıllık oran × gün / 365. */
export function mevduatGetirisi(anapara: number, yillikOran: number, gun: number, p: Parametreler) {
  const brut = anapara * yillikOran * gun / 365
  const stopaj = brut * p.stopajMevduat
  return { brut, stopaj, net: brut - stopaj }
}

/** Reel getiri (Fisher): (1+nominal)/(1+enflasyon) − 1. */
export const reelGetiri = (nominal: number, enflasyon: number) => (1 + nominal) / (1 + enflasyon) - 1
