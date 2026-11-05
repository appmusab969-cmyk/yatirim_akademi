export type Beceri = 'makro' | 'piyasa' | 'temel_analiz' | 'teknik_analiz' | 'risk' | 'psikoloji' | 'strateji'

export const BECERI_AD: Record<Beceri, string> = {
  makro: 'Makro', piyasa: 'Piyasa bilgisi', temel_analiz: 'Temel analiz', teknik_analiz: 'Teknik analiz',
  risk: 'Risk yönetimi', psikoloji: 'Psikoloji', strateji: 'Strateji',
}

/** Bölüm metni mini-markdown: paragraf = boş satır, "- " madde, **kalın**, `kod`. */
export type Bolum =
  | { tip: 'metin'; metin: string }
  | { tip: 'terim'; terim: string; tanim: string }
  | { tip: 'formul'; ad: string; formul: string; aciklama?: string }
  | { tip: 'ornek'; baslik: string; metin: string; kaynak: string }
  | { tip: 'uyari'; metin: string }

export interface Soru { soru: string; secenekler: string[]; dogru: number; aciklama: string }
export interface Kaynak { ad: string; url?: string }

export interface Ders {
  id: string            // "1-03"
  seviye: number
  baslik: string
  beceri: Beceri
  dakika: number
  bolumler: Bolum[]
  quiz: Soru[]
  gorev: { baslik: string; adimlar: string[] }
  kaynaklar: Kaynak[]
}

export interface Seviye {
  no: number
  ad: string
  amac: string
  dersler: Ders[]
  sinavEk: Soru[]       // yalnız sınavda çıkan, derslerdeki bilgiyi birleştiren sorular
}
