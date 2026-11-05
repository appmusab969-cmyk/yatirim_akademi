// İşlem maliyeti ve vergi parametreleri. TÜM ORANLAR AYARLARDAN DEĞİŞTİRİLEBİLİR.
// Vergi oranları sık değişir: varsayılanlar "doğrulanmadı" işaretlidir; Resmî Gazete / GİB'den kontrol edin.
export type VarlikTuru = 'hisse' | 'altin' | 'doviz' | 'fon'

export interface Parametreler {
  hisseKomisyon: number      // aracı kurum komisyonu, işlem tutarına oran (0.002 = binde 2)
  bsmv: number               // komisyon üzerinden BSMV oranı
  dovizAltinMakas: number    // banka alış-satış makası, tek yön (0.01 = %1)
  fonKomisyon: number        // fon alım/satım komisyonu (çoğu TEFAS fonunda 0)
  stopajHisse: number        // BIST payları alım-satım kazancı stopajı (tam mükellef gerçek kişi)
  stopajFon: number          // fon kazancı stopajı: fon türüne/tarihe göre değişir
  stopajMevduat: number      // TL mevduat faizi stopajı: vadeye/tarihe göre değişir
  maxPozisyonOrani: number   // karar puanında tek pozisyon için üst sınır
  dogrulamaTarihi: string | null // vergi oranlarını en son ne zaman kontrol ettiniz
}

export const VARSAYILAN: Parametreler = {
  hisseKomisyon: 0.002,
  bsmv: 0.05,
  dovizAltinMakas: 0.01,
  fonKomisyon: 0,
  stopajHisse: 0,
  stopajFon: 0.175,
  stopajMevduat: 0.175,
  maxPozisyonOrani: 0.10,
  dogrulamaTarihi: null,
}

export type OranAnahtari = Exclude<keyof Parametreler, 'dogrulamaTarihi'>

export const PARAMETRE_ACIKLAMA: Record<OranAnahtari, [string, string]> = {
  hisseKomisyon: ['Hisse komisyonu', 'Aracı kurum komisyonu; kendi kurumunuzun oranını girin.'],
  bsmv: ['BSMV', 'Banka ve Sigorta Muameleleri Vergisi: komisyon tutarı üzerinden alınır.'],
  dovizAltinMakas: ['Döviz/altın makası (tek yön)', 'Bankanın alış ve satış fiyatı arasındaki farkın yarısı.'],
  fonKomisyon: ['Fon komisyonu', 'TEFAS üzerinden çoğu fonda alım-satım komisyonu yoktur; yönetim ücreti fiyata zaten yansır.'],
  stopajHisse: ['Hisse stopajı', 'BIST payları (yatırım ortaklıkları hariç), tam mükellef gerçek kişi: genelde %0. Doğrulayın.'],
  stopajFon: ['Fon stopajı', 'Fon türüne ve alım tarihine göre değişir. Mutlaka doğrulayın.'],
  stopajMevduat: ['Mevduat stopajı', 'Vadeye ve karar tarihine göre değişir. Mutlaka doğrulayın.'],
  maxPozisyonOrani: ['Tek pozisyon üst sınırı', 'Tek varlığa ayırmayı kabul ettiğiniz en yüksek portföy payı.'],
}
