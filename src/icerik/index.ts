import { SEVIYE1 } from './seviye1'
import { SEVIYE2 } from './seviye2'
import { SEVIYE3 } from './seviye3'
import type { Ders, Seviye } from './tipler'

export const SEVIYELER: Seviye[] = [SEVIYE1, SEVIYE2, SEVIYE3]

export const DERS_HARITA: Record<string, Ders> = Object.fromEntries(SEVIYELER.flatMap(s => s.dersler.map(d => [d.id, d])))

export const PLANLANAN = [
  { no: 4, ad: 'Teknik analiz', konular: 'trend, destek-direnç, ortalamalar, RSI, MACD, hacim, ne işe yarıyor/yaramıyor' },
  { no: 5, ad: 'Portföy ve risk', konular: 'çeşitlendirme, pozisyon büyüklüğü, zarar kes, drawdown, vergi/komisyon' },
  { no: 6, ad: 'Psikoloji', konular: 'panik satış, FOMO, sürü, aşırı güven, zirvede alma' },
  { no: 7, ad: 'Strateji', konular: 'yatırım planı, geri test, strateji değerlendirme' },
]
