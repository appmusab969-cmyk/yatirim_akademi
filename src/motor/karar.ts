// Karar kalitesi: SÜREÇ (kurallarla, yapay zekâsız) ve SONUÇ (getiri) ayrı ölçülür.
export type CikisNedeni = 'hedef' | 'zarar_kes' | 'plan_degisti' | 'duygusal' | 'diger'

export interface Karar {
  id?: number
  tarih: string
  kod: string
  neden: string            // neden alıyorum (tez)
  hedefFiyat: number
  zararKes: number
  cikisPlani: string       // hangi durumda çıkacağım
  vadeGun: number          // tezin gerçekleşmesi için beklenen süre
  guven: number            // 1-5 öz güven
  girisFiyat: number
  pozisyonOrani: number    // alım tutarı / portföy değeri (alım anında)
  son5GunDegisim: number | null // alım anında son 5 işlem günü fiyat değişimi; veri yoksa null
  // kapanış
  kapanisTarih?: string
  cikisFiyat?: number
  cikisNedeni?: CikisNedeni
  cikisAciklama?: string
  zararKesIhlali?: boolean // zarar kes seviyesi görüldü ama satılmadı
}

export interface Kontrol { ad: string; gecti: boolean | null; puan: number; aciklama: string }

/** Giriş anında ölçülebilen süreç kontrolleri (toplam 60 puan). */
export function girisKontrolleri(k: Karar, maxPozisyon: number): Kontrol[] {
  const risk = k.girisFiyat - k.zararKes, odul = k.hedefFiyat - k.girisFiyat
  const ro = risk > 0 ? odul / risk : NaN
  return [
    { ad: 'Gerekçe yazıldı', gecti: k.neden.trim().length >= 80, puan: 15,
      aciklama: k.neden.trim().length >= 80 ? 'Tez yeterince açık yazılmış.' : 'Gerekçe 80 karakterden kısa; "neden şimdi, neden bu varlık" sorusu cevapsız kalmış olabilir.' },
    { ad: 'Zarar kes mantıklı', gecti: k.zararKes > 0 && k.zararKes < k.girisFiyat, puan: 15,
      aciklama: k.zararKes > 0 && k.zararKes < k.girisFiyat ? `Risk birim başına ${(risk / k.girisFiyat * 100).toFixed(1)}%.` : 'Zarar kes seviyesi giriş fiyatının altında olmalı.' },
    { ad: 'Risk/ödül ≥ 1,5', gecti: Number.isFinite(ro) && ro >= 1.5, puan: 10,
      aciklama: Number.isFinite(ro) ? `Risk/ödül oranı ${ro.toFixed(2)}.` + (ro < 1.5 ? ' Kaybettiğinizde kaybedeceğiniz, kazandığınızda kazanacağınıza çok yakın.' : '') : 'Hesaplanamadı.' },
    { ad: 'Pozisyon büyüklüğü', gecti: k.pozisyonOrani <= maxPozisyon + 1e-9, puan: 10,
      aciklama: `Portföyün ${(k.pozisyonOrani * 100).toFixed(1)}%'i (sınırınız ${(maxPozisyon * 100).toFixed(0)}%).` },
    { ad: 'FOMO kontrolü', gecti: k.son5GunDegisim === null ? null : k.son5GunDegisim < 0.15, puan: 10,
      aciklama: k.son5GunDegisim === null ? 'Yeterli veri yok (son 5 günlük fiyat yok); bu kontrol puanlanmadı.'
        : k.son5GunDegisim >= 0.15 ? `Alımdan önceki 5 günde fiyat ${(k.son5GunDegisim * 100).toFixed(0)}% yükselmişti; yükselişin peşinden koşuyor olabilirsiniz.` : 'Ani yükselişin peşinden alım yapılmamış.' },
  ]
}

/** Çıkışta ölçülen kontroller (toplam 40 puan). */
export function cikisKontrolleri(k: Karar): Kontrol[] {
  if (k.cikisFiyat === undefined) return []
  const planli = k.cikisNedeni === 'hedef' || k.cikisNedeni === 'zarar_kes' || (k.cikisNedeni === 'plan_degisti' && (k.cikisAciklama ?? '').trim().length >= 40)
  return [
    { ad: 'Plana uyuldu', gecti: planli, puan: 25,
      aciklama: planli ? 'Çıkış, önceden yazdığınız plana ya da gerekçeli bir tez değişikliğine dayanıyor.'
        : k.cikisNedeni === 'duygusal' ? 'Çıkışın duygusal olduğunu kendiniz belirttiniz (korku ya da açgözlülük).' : 'Çıkışın gerekçesi yazılmamış ya da çok kısa.' },
    { ad: 'Zarar kese saygı', gecti: !k.zararKesIhlali, puan: 15,
      aciklama: k.zararKesIhlali ? 'Fiyat zarar kes seviyenizin altına indiği halde pozisyonu tuttunuz.' : 'Zarar kes kuralı ihlal edilmedi.' },
  ]
}

export function surecPuani(kontroller: Kontrol[]): { puan: number; azami: number } {
  let puan = 0, azami = 0
  for (const c of kontroller) { if (c.gecti === null) continue; azami += c.puan; if (c.gecti) puan += c.puan }
  return { puan, azami }
}

export type Ceyrek = 'hak_edilmis_basari' | 'sansli' | 'sanssiz' | 'hak_edilmis_hata'

export const CEYREK_METNI: Record<Ceyrek, [string, string]> = {
  hak_edilmis_basari: ['İyi süreç, iyi sonuç', 'Hak edilmiş. Ama tek işlem bir şey kanıtlamaz; bu süreci tekrar edin.'],
  sansli: ['Kötü süreç, iyi sonuç: ŞANSLIYDINIZ', 'Para kazandınız ama süreç zayıftı. Bu en tehlikeli çeyrek: şans, beceri gibi hissettirir ve kötü alışkanlığı ödüllendirir.'],
  sanssiz: ['İyi süreç, kötü sonuç', 'Kararınız iyiydi, sonuç kötü geldi. Bu oyunun doğası. Süreci değiştirmeyin; sadece tezinizde gözden kaçan bir şey var mı diye bakın.'],
  hak_edilmis_hata: ['Kötü süreç, kötü sonuç', 'Kayıp sürecin zayıflığından. Hangi kontrolün başarısız olduğuna bakın; bir dahakine onu düzeltin.'],
}

/** Süreç oranı ≥ %70 ise "iyi süreç". Sonuç: net getiri > 0. */
export function ceyrek(surecOrani: number, getiri: number): Ceyrek {
  const iyi = surecOrani >= 0.7
  if (getiri > 0) return iyi ? 'hak_edilmis_basari' : 'sansli'
  return iyi ? 'sanssiz' : 'hak_edilmis_hata'
}

/** Açık karar için: güncel fiyat zarar kesin altındaysa uyar. */
export function zararKesUyarisi(k: Karar, guncel: number | undefined): string | null {
  if (guncel === undefined || k.kapanisTarih) return null
  return guncel <= k.zararKes ? `${k.kod} zarar kes seviyenizin (${k.zararKes}) altında: ${guncel}. Planınız satmaktı.` : null
}

/** Karar istatistikleri (ilerleme ekranı ve günlük). */
export function istatistik(kapali: { getiri: number; surecOrani: number }[]) {
  const n = kapali.length
  if (n === 0) return null
  const kaz = kapali.filter(x => x.getiri > 0), kay = kapali.filter(x => x.getiri <= 0)
  // Örnek yoksa null döner (0 göstermek "ortalama kazanç sıfır" gibi yanlış bir bilgi olur)
  const ort = (a: number[]) => a.length ? a.reduce((s, x) => s + x, 0) / a.length : null
  return {
    n, isabet: kaz.length / n,
    ortKazanc: ort(kaz.map(x => x.getiri)), ortKayip: ort(kay.map(x => x.getiri)),
    ortSurec: ort(kapali.map(x => x.surecOrani)) ?? 0,
    sansliSayisi: kapali.filter(x => ceyrek(x.surecOrani, x.getiri) === 'sansli').length,
  }
}
