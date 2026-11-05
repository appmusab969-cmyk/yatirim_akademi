import type { Seviye } from './tipler'

const BIST = { ad: 'Borsa İstanbul: Pay Piyasası işleyiş esasları', url: 'https://www.borsaistanbul.com' }
const MKK = { ad: 'MKK: Merkezi Kayıt Kuruluşu (yatırımcı ve yabancı payı istatistikleri)', url: 'https://www.mkk.com.tr' }
const SPK = { ad: 'SPK mevzuatı', url: 'https://www.spk.gov.tr' }

export const SEVIYE2: Seviye = {
  no: 2, ad: 'Piyasa', amac: 'Borsanın mekaniğini (emir, takas, endeks, likidite), tahvili ve makro göstergelerin piyasaya etkisini öğrenmek.',
  dersler: [
    {
      id: '2-01', seviye: 2, baslik: 'Borsa İstanbul nasıl çalışır?', beceri: 'piyasa', dakika: 7,
      bolumler: [
        { tip: 'metin', metin: `**Borsa İstanbul**, pay, borçlanma araçları, türev ve kıymetli maden piyasalarını işleten kurumdur. 2013'te İMKB, İstanbul Altın Borsası ve VOB'un birleşmesiyle kuruldu. Bir hisseyi aldığınızda karşınızda şirket değil, o hisseyi satmak isteyen başka bir yatırımcı vardır.

**Pazarlar:** Paylar şirketin büyüklüğüne ve serbest dolaşımdaki pay değerine göre Yıldız Pazar, Ana Pazar ve Alt Pazar'da işlem görür. Özel durumlardaki şirketler Yakın İzleme Pazarı'nda işlem görür.

**Seanslar:** Gün, emirlerin toplanıp tek fiyattan eşleştiği bir **açılış seansıyla** başlar. Ardından **sürekli işlem** gelir: emirler geldikçe fiyat-zaman önceliğiyle eşleşir. Gün yine tek fiyatlı bir **kapanış seansıyla** biter. Saatler zaman zaman değişebilir; güncel saatleri Borsa İstanbul'un sitesinden kontrol edin.

**Fiyat limitleri:** Paylar bir günde baz fiyata göre belirli bir yüzdeden fazla yükselip düşemez. Bu sınırlara **tavan** ve **taban** denir. Arşivinizdeki fiyatların ampirik incelemesi, 13.03.2020'den sonra bu marjın ±%10 olduğunu gösteriyor. Ayrıca aşırı oynaklıkta devreye giren **devre kesici** ve volatilite bazlı tedbir mekanizmaları da vardır.` },
        { tip: 'terim', terim: 'Emir defteri (derinlik)', tanim: 'Her fiyat kademesinde bekleyen alış ve satış emirlerinin listesi. En yüksek alış ile en düşük satış arasındaki fark **makas (spread)** olarak adlandırılır.' },
        { tip: 'terim', terim: 'Serbest dolaşım oranı (halka açıklık)', tanim: 'Payların, ana ortaklar dışında borsada fiilen alınıp satılabilen kısmı. Düşük halka açıklık, düşük likidite ve kolay manipülasyon riski demektir.' },
        { tip: 'uyari', metin: 'Tavan serisi yapan hisseler çoğu zaman düşük halka açıklıklı küçük şirketlerdir. SPK\'nın piyasa bozucu eylemler nedeniyle verdiği işlem yasakları ve tedbir kararları da genelde bu grupta yoğunlaşır. Tavan, tek başına bir "kalite" göstergesi değildir.' },
      ],
      quiz: [
        { soru: 'Bir hisseyi aldığınızda parayı kim alır?', secenekler: ['Şirket', 'Hisseyi satan yatırımcı', 'Borsa İstanbul', 'SPK'], dogru: 1, aciklama: 'İkincil piyasada işlem yatırımcılar arasındadır; şirkete para sadece halka arz ve bedelli artırımda gider.' },
        { soru: 'Makas (spread) neyi ölçer?', secenekler: ['Günlük değişimi', 'En iyi alış ile en iyi satış fiyatı arasındaki farkı', 'Komisyonu', 'Endeks ağırlığını'], dogru: 1, aciklama: 'Makas likiditenin bir göstergesidir; dar makas, likit hisse demektir.' },
        { soru: 'Açılış seansında fiyat nasıl belirlenir?', secenekler: ['İlk gelen emirle', 'Toplanan emirlerden en çok işlemi gerçekleştiren tek fiyatla', 'Önceki kapanışla', 'SPK belirler'], dogru: 1, aciklama: 'Tek fiyat yöntemiyle en yüksek işlem hacmini sağlayan fiyat bulunur.' },
        { soru: 'Düşük halka açıklığın riski nedir?', secenekler: ['Yüksek temettü', 'Düşük likidite ve manipülasyona açıklık', 'Daha az vergi', 'Risk yoktur'], dogru: 1, aciklama: 'Az pay serbestçe dolaşıyorsa küçük paralarla fiyat oynatılabilir.' },
      ],
      gorev: { baslik: 'Bir hissenin pazar ve halka açıklık bilgisini bulun', adimlar: ['Uygulamadaki listeden bir hisse seçin.', 'KAP\'ta şirket sayfasından hangi pazarda işlem gördüğünü ve fiili dolaşımdaki pay oranını bulun.', 'Aracı kurum uygulamanızda (varsa) emir defterine bakıp en iyi alış/satış fiyatını ve makası yüzde olarak hesaplayın.'] },
      kaynaklar: [BIST, SPK, { ad: 'KAP şirket sayfaları', url: 'https://www.kap.org.tr' }],
    },
    {
      id: '2-02', seviye: 2, baslik: 'Emir türleri ve süreleri', beceri: 'piyasa', dakika: 6,
      bolumler: [
        { tip: 'metin', metin: `Pay piyasasında kullanılan başlıca emir tipleri:

- **Limit emir:** "Bu fiyattan veya daha iyisinden al/sat." Fiyat garantisi vardır, gerçekleşme garantisi yoktur.
- **Piyasa emri:** Fiyat belirtilmez; karşı taraftaki emirlerle hemen eşleşir. Gerçekleşme hızlıdır ama fiyat garantisi yoktur. Sığ hisselerde birkaç kademe yukarıdan dolabilir.
- **Piyasadan limite emir:** Karşı taraftaki en iyi fiyattan gerçekleşir; kalan kısım o fiyattan limit emre dönüşür.

Süre koşulları:

- **Günlük (seans):** Gün sonunda gerçekleşmeyen kısım iptal olur.
- **Kalanı İptal Et (KİE):** Hemen gerçekleşebilen kısım gerçekleşir, kalanı iptal edilir.
- **Gerçekleşmezse İptal Et (GİE):** Emrin tamamı hemen gerçekleşmezse tamamı iptal edilir.
- **İptale kadar geçerli / tarihli:** Belirtilen süre boyunca bekler.

Aracı kurumlar ayrıca **şartlı emir** (fiyat X'e gelirse sat gibi, zarar kes için kullanılır) sunabilir. Bunlar borsa emri değildir, kurumun sistemi tetikler. Ani düşüşte ve boşluklu açılışta (gap) belirlediğiniz fiyatın çok altından gerçekleşebilir.` },
        { tip: 'ornek', baslik: 'Tabanda zarar kes', metin: 'Bir hisse olumsuz bir KAP bildirimiyle taban açarsa ve tabanda kilitlenirse, alıcı olmadığı için zarar kes emriniz gerçekleşmeyebilir. Ertesi gün tekrar taban açılabilir. Zarar kes bir "garanti" değildir; bu yüzden pozisyon büyüklüğü (Seviye 5) en az zarar kes kadar önemlidir.', kaynak: 'Pay piyasası işleyişi (fiyat limitleri)' },
      ],
      quiz: [
        { soru: 'Fiyat garantisi isteyen ama hemen gerçekleşmesi şart olmayan yatırımcı hangi emri kullanmalı?', secenekler: ['Piyasa emri', 'Limit emir', 'GİE piyasa emri', 'Hiçbiri'], dogru: 1, aciklama: 'Limit emir fiyatı garanti eder, gerçekleşmeyi etmez.' },
        { soru: 'Sığ bir hissede büyük piyasa emri vermenin riski nedir?', secenekler: ['Emir reddedilir', 'Birkaç kademe kötü fiyattan gerçekleşebilir (kayma)', 'Komisyon iki kat olur', 'Risk yoktur'], dogru: 1, aciklama: 'Derinlik yoksa emir defterini "yiyerek" ilerler.' },
        { soru: '1.000 lotluk GİE emrin sadece 600 lotu karşılanabiliyorsa ne olur?', secenekler: ['600 gerçekleşir', 'Hiçbiri gerçekleşmez, emir iptal olur', '600 gerçekleşir, 400 bekler', 'Emir ertesi güne kalır'], dogru: 1, aciklama: 'GİE: tamamı ya da hiç.' },
        { soru: 'Aracı kurumun şartlı zarar kes emri hangi durumda en kötü sonucu verir?', secenekler: ['Yavaş düşüşte', 'Boşluklu (gap) açılışta veya taban kilitlenmesinde', 'Yatay piyasada', 'Yükselişte'], dogru: 1, aciklama: 'Tetiklendiğinde karşıda alıcı yoksa ya da fiyat atlayarak açılırsa belirlediğiniz seviyeden gerçekleşmez.' },
      ],
      gorev: { baslik: 'Emir tiplerini kurumunuzda bulun', adimlar: ['Kullandığınız (veya kullanacağınız) aracı kurumun uygulamasında mevcut emir tiplerini ve sürelerini listeleyin.', 'Şartlı emir/zarar kes özelliği var mı, nasıl tetiklendiğini yazın.', 'Sanal portföyde limit emir yoktur (gün sonu fiyatı kullanılır). Bunun gerçek hayata göre hangi avantajı ve eksikliği var? Bir cümleyle yazın.'] },
      kaynaklar: [BIST, SPK],
    },
    {
      id: '2-03', seviye: 2, baslik: 'Takas, saklama, açığa satış ve kredili işlem', beceri: 'piyasa', dakika: 6,
      bolumler: [
        { tip: 'metin', metin: `Pay piyasasında işlem bugün yapılır, para ve pay transferi (takas) **iki iş günü sonra (T+2)** gerçekleşir. Takas Takasbank tarafından yapılır. Paylarınız ise **MKK** (Merkezi Kayıt Kuruluşu) nezdinde sizin adınıza kayıtlıdır. Aracı kurum battığında paylarınız MKK kaydında sizin adınıza durduğu için ayrıca korunur. Bu yüzden e-YATIRIMCI üzerinden varlıklarınızı kontrol etmek iyi bir alışkanlıktır.

**Kredili işlem:** Aracı kurumdan borç alarak (kaldıraçla) hisse almak. Kazancı da kaybı da büyütür. Teminat oranı düşerse kurum **marjin çağrısı** yapar ya da pozisyonunuzu zorla kapatır. Zorla kapatma genellikle en kötü anda olur.

**Açığa satış:** Sahip olmadığınız payı ödünç alıp satmak; fiyat düşünce geri alarak kazanmak. Teorik olarak kayıp sınırsızdır, çünkü fiyatın yükselmesinin sınırı yoktur. SPK zaman zaman açığa satışa kısıtlama getirebilir.` },
        { tip: 'formul', ad: 'Kaldıraçta kayıp', formul: 'Özkaynak getirisi ≈ Kaldıraç × varlık getirisi − borç maliyeti', aciklama: '2 kat kaldıraçla %25 düşüşte özkaynağınızın yaklaşık yarısı gider. %50 düşüşte ise tamamı.' },
        { tip: 'uyari', metin: 'Bu uygulamada kredili işlem ve açığa satış kapalıdır. Önce kaldıraçsız sistem kurmayı öğrenin.' },
      ],
      quiz: [
        { soru: 'Pazartesi aldığınız hissenin takası ne zaman tamamlanır (tatil yoksa)?', secenekler: ['Pazartesi', 'Salı', 'Çarşamba', 'Cuma'], dogru: 2, aciklama: 'T+2: iki iş günü sonra.' },
        { soru: 'Paylarınız yasal olarak nerede kayıtlıdır?', secenekler: ['Aracı kurumun kasasında', 'MKK nezdinde, sizin adınıza', 'SPK\'da', 'Şirkette'], dogru: 1, aciklama: 'MKK kayıt sistemi yatırımcıyı korur.' },
        { soru: '3 kat kaldıraçla alınan bir hisse %20 düşerse özkaynak yaklaşık ne kadar kaybeder?', secenekler: ['%20', '%40', '%60', '%6,7'], dogru: 2, aciklama: '`3 × 20% = 60%` (faiz maliyeti hariç).' },
        { soru: 'Açığa satışta teorik azami kayıp nedir?', secenekler: ['Yatırılan tutar', '%100', 'Sınırsız', '%10'], dogru: 2, aciklama: 'Fiyat sınırsız yükselebilir.' },
      ],
      gorev: { baslik: 'e-YATIRIMCI hesabınızı kontrol edin', adimlar: ['MKK e-YATIRIMCI (e-Devlet üzerinden) hizmetine girin.', 'Gerçek bir hesabınız varsa kayıtlı varlıklarınızı aracı kurum ekranıyla karşılaştırın (yoksa sadece ekranı inceleyin).', 'Kredili işlem sözleşmesi imzalayıp imzalamadığınızı kontrol edin.'] },
      kaynaklar: [MKK, { ad: 'Takasbank', url: 'https://www.takasbank.com.tr' }, SPK],
    },
    {
      id: '2-04', seviye: 2, baslik: 'Endeksler: XU100, XU030, sektör endeksleri, getiri endeksi', beceri: 'piyasa', dakika: 7,
      bolumler: [
        { tip: 'metin', metin: `**Endeks**, bir hisse grubunun toplam fiyat hareketini tek bir sayıyla gösterir. **BIST 100 (XU100)**, belirli kriterlere göre seçilen 100 payı içerir. Ağırlıklandırma, serbest dolaşımdaki piyasa değerine göre yapılır ve tek bir payın ağırlığına üst sınır uygulanır. Endeksin bileşimi dönemsel olarak gözden geçirilir.

- **XU030:** En büyük ve likit 30 pay.
- **Sektör endeksleri:** XBANK (bankalar), XUSIN (sınai), XHOLD (holdingler) gibi.
- **Fiyat endeksi ve getiri endeksi:** Fiyat endeksi temettüleri içermez. Getiri endeksi temettülerin yeniden yatırıldığını varsayar. Uzun dönemli performans karşılaştırmasında getiri endeksi kullanılmalıdır.

27 Temmuz 2020'de BIST endekslerinden iki sıfır atıldı (ör. 120.000 puan 1.200 puan oldu). Eski grafiklerde bu ölçek değişikliğine dikkat edin.` },
        { tip: 'terim', terim: 'Hayatta kalma yanlılığı (survivorship bias)', tanim: 'Bugün endekste olan şirketlere bakıp geçmişe dair sonuç çıkarmak. Endeksten çıkarılan ve batan şirketler görünmez olur, geçmiş getiri olduğundan iyi görünür. Arşivinizdeki S8 stratejisinin yıldızlı sonucu tam olarak bu yüzden kayboldu.' },
        { tip: 'ornek', baslik: 'Kendi verinizde endeks kusurları', metin: 'bist_veri arşivinizde XU100 getiri endeksi yok. Testlerde fiyat endeksine yıllık %3 temettü varsayımı eklenerek yaklaşık değer kullanıldı. Ayrıca XU100 üyelik geçmişi kusurlu: bazı dönemlerde 100 yerine 100-112 üye görünüyor. Profesyonel analizde verinin kusurunu bilmek, verinin kendisi kadar önemlidir.', kaynak: 'bist_veri/DEVAM_NOTLARI.md ve MANIFEST.md' },
      ],
      quiz: [
        { soru: 'Uzun vadeli hisse getirisini mevduatla karşılaştırırken hangi endeks kullanılmalı?', secenekler: ['Fiyat endeksi', 'Getiri endeksi', 'Sektör endeksi', 'Fark etmez'], dogru: 1, aciklama: 'Temettüler toplam getirinin önemli bir parçasıdır.' },
        { soru: 'XU100\'de payların ağırlığı neye göre belirlenir?', secenekler: ['Eşit ağırlık', 'Serbest dolaşımdaki piyasa değeri (üst sınırla)', 'İşlem hacmi', 'Temettü verimi'], dogru: 1, aciklama: 'Serbest dolaşım düzeltmeli piyasa değeri ağırlıklıdır.' },
        { soru: 'Bugünkü XU100 üyelerinin son 10 yıllık getirisini "endeks stratejisi" diye sunmak hangi hatayı içerir?', secenekler: ['Kur hatası', 'Hayatta kalma yanlılığı', 'Komisyon hatası', 'Hata yoktur'], dogru: 1, aciklama: 'Geçmişte endeksten çıkan kaybedenler hesaba katılmamış olur.' },
        { soru: '2020\'deki endeks değişikliği neydi?', secenekler: ['Endeks durduruldu', 'İki sıfır atıldı', 'Dolar bazlı oldu', 'Ağırlıklar eşitlendi'], dogru: 1, aciklama: '27.07.2020\'den itibaren endeks değerleri 100\'e bölündü.' },
      ],
      gorev: { baslik: 'Endeksleri karşılaştırın', adimlar: ['Özet\'teki XU100 ile (fiyatlar dosyasında olan) XU030, XBANK ve XUSIN\'in son 20 iş günü değişimini karşılaştırın.', 'Hangi sektör endeksi XU100\'den iyi/kötü gitti? Olası bir nedeni yazın (faiz, kur, haber).', 'Borsa İstanbul sitesinden XU100\'ün güncel bileşenlerinde en yüksek ağırlıklı 5 payı bulun.'] },
      kaynaklar: [{ ad: 'Borsa İstanbul: Pay endeksleri temel kuralları', url: 'https://www.borsaistanbul.com' }],
    },
    {
      id: '2-05', seviye: 2, baslik: 'Tahvil ve bono: vade, kupon, getiri, fiyat', beceri: 'piyasa', dakika: 9,
      bolumler: [
        { tip: 'metin', metin: `**Tahvil (vadesi 1 yıldan uzun) ve bono (vadesi kısa)**, borçlananın yatırımcıya belirli tarihlerde faiz (kupon) ve vadede anapara ödeme sözüdür. Devletin çıkardıklarına **DİBS** (Devlet İç Borçlanma Senetleri) denir.

- **İskontolu bono:** Kupon yoktur. Nominal değerinin altında satılır; vadede nominal ödenir.
- **Sabit kuponlu tahvil:** Her dönem aynı kupon ödenir.
- **TÜFE'ye endeksli tahvil:** Anapara enflasyonla büyür, üzerine reel kupon ödenir.
- **Değişken faizli tahvil:** Kupon bir referans faize bağlıdır.

**En önemli kural:** Faizler yükselince mevcut tahvilin fiyatı düşer; faizler düşünce yükselir. Nedeni basit: yeni çıkan tahviller daha yüksek kupon veriyorsa, düşük kuponlu eski tahvili ancak daha ucuza satabilirsiniz.` },
        { tip: 'formul', ad: 'İskontolu bono fiyatı', formul: 'Fiyat = Nominal ÷ (1 + y)^(gün/365)', aciklama: '`y` yıllık bileşik getiri. 100 TL nominal, 1 yıl vadeli bono %40 getiriyle `100 ÷ 1,40 ≈ 71,43 TL`ye satılır.' },
        { tip: 'terim', terim: 'Süre (duration)', tanim: 'Tahvil fiyatının faiz değişimine duyarlılığı (yaklaşık: faiz 1 puan artarsa fiyatın yüzde kaç düşeceği). Vade uzadıkça ve kupon küçüldükçe duration artar. Uzun vadeli tahvil, faiz riskinin en yoğun olduğu araçtır.' },
        { tip: 'terim', terim: 'Getiri eğrisi', tanim: 'Farklı vadelerdeki faizlerin grafiği. Normalde uzun vade daha yüksek faiz verir. Kısa faiz uzun faizden yüksekse eğri **ters (inverted)** demektir; piyasa ileride faiz indirimi bekliyor olabilir.' },
        { tip: 'ornek', baslik: 'Yüksek faiz döneminde uzun tahvil', metin: 'Türkiye\'de 2023-2024 sıkılaşma döneminde kısa vadeli faizler uzun vadelilerin üzerine çıktı ve getiri eğrisi ters döndü. Bu, piyasanın sıkılaşmanın geçici olduğunu ve ileride faiz indirimi beklediğini gösteriyordu. Faiz indirimi gerçekleşirse uzun vadeli tahvil sahipleri fiyat kazancı elde eder. Beklenti bozulursa bu kez zarar ederler.', kaynak: 'TCMB / Hazine ve Maliye Bakanlığı DİBS getiri verileri' },
      ],
      quiz: [
        { soru: 'Piyasa faizleri yükselirse elinizdeki sabit kuponlu tahvilin fiyatı ne olur?', secenekler: ['Artar', 'Düşer', 'Değişmez', 'Vadeye kadar sabittir'], dogru: 1, aciklama: 'Fiyat ve getiri ters yönde hareket eder.' },
        { soru: '100 TL nominal, 1 yıl vadeli bono %25 getiriyle kaçtan satılır?', secenekler: ['75', '80', '125', '100'], dogru: 1, aciklama: '`100 ÷ 1,25 = 80`.' },
        { soru: 'Faiz riskine en duyarlı tahvil hangisidir?', secenekler: ['3 aylık bono', 'Uzun vadeli, düşük kuponlu tahvil', 'Değişken faizli tahvil', 'Kısa vadeli yüksek kuponlu tahvil'], dogru: 1, aciklama: 'Uzun vade ve düşük kupon duration\'ı artırır.' },
        { soru: 'Ters getiri eğrisi genellikle neye işaret eder?', secenekler: ['İleride faiz artışı beklentisi', 'İleride faiz indirimi veya yavaşlama beklentisi', 'Enflasyonun kesin artacağı', 'Bir anlamı yoktur'], dogru: 1, aciklama: 'Kısa faizin uzundan yüksek olması, piyasanın ileride daha düşük faiz fiyatladığını gösterir.' },
        { soru: 'TÜFE\'ye endeksli tahvil yatırımcıyı neye karşı korur?', secenekler: ['Kur riskine', 'Enflasyon riskine', 'Temerrüt riskine', 'Likidite riskine'], dogru: 1, aciklama: 'Anapara enflasyonla büyür.' },
      ],
      gorev: { baslik: 'Bir DİBS ihale sonucunu okuyun', adimlar: ['Hazine ve Maliye Bakanlığı sitesinden son DİBS ihale sonuçlarını bulun.', 'Bir ihalenin vadesini, ortalama bileşik faizini ve türünü (sabit, TÜFE\'ye endeksli vb.) yazın.', 'Bu faizi politika faizi ve yıllık TÜFE ile karşılaştırın: piyasa ileride ne bekliyor olabilir?'] },
      kaynaklar: [{ ad: 'Hazine ve Maliye Bakanlığı: İç borçlanma ihale sonuçları', url: 'https://www.hmb.gov.tr' }, { ad: 'Fabozzi, F.: Bond Markets, Analysis and Strategies' }],
    },
    {
      id: '2-06', seviye: 2, baslik: 'Likidite, hacim ve piyasa derinliği', beceri: 'piyasa', dakika: 5,
      bolumler: [
        { tip: 'metin', metin: `**Likidite**, bir varlığı fiyatını fazla etkilemeden hızla nakde çevirebilme yeteneğidir. Ölçüleri:

- **Günlük işlem hacmi (TL):** Lot sayısı değil, TL tutarı önemlidir.
- **Makas:** Ne kadar dar, o kadar likit.
- **Derinlik:** Fiyat kademelerinde bekleyen emir miktarı.

Pratik kural: Pozisyonunuz hissenin ortalama günlük TL hacminin küçük bir kısmı olmalı. Aksi halde çıkmak istediğinizde fiyatı kendi aleyhinize itersiniz.` },
        { tip: 'ornek', baslik: 'Kendi testlerinizden: likidite tuzağı', metin: 'Arşivinizdeki S7 (düşük volatilite) stratejisi en tutarlı sonucu verdi. Ancak avantajın önemli bir kısmı likit olmayan hisselerden geliyordu. Kâğıt üzerindeki getiri, gerçekte o hacimde alınıp satılamayacak hisselerdeki fiyatlardan oluşuyordu. Likiditeyi hesaba katmayan bir test, gerçekte elde edilemeyecek getiriyi ölçer.', kaynak: 'Kendi backtest arşiviniz: bist_veri/bt (S7 sonuçları)' },
        { tip: 'uyari', metin: 'Kriz anlarında likidite tam ihtiyaç duyulduğunda kaybolur. Normal günde likit görünen hisse, panik günü tabanda alıcısız kalabilir.' },
      ],
      quiz: [
        { soru: 'Likiditeyi ölçmek için en anlamlı hacim ölçüsü hangisidir?', secenekler: ['Lot sayısı', 'TL cinsinden işlem hacmi', 'İşlem sayısı', 'Hisse fiyatı'], dogru: 1, aciklama: '10 kuruşluk hissede milyonlarca lot, az bir TL hacmi olabilir.' },
        { soru: 'Likit olmayan hisselerde backtest getirisinin yanıltıcı olmasının temel nedeni nedir?', secenekler: ['Vergi', 'Kâğıt üzerindeki fiyatlarla o hacimde gerçekten işlem yapılamaması', 'Temettü', 'Endeks değişimi'], dogru: 1, aciklama: 'Fiyat etkisi ve gerçekleşmeme riski testte görünmez.' },
        { soru: 'Likidite riskinin en çok hissedildiği an hangisidir?', secenekler: ['Yatay piyasa', 'Kriz/panik anları', 'Bilanço günleri dışında', 'Hafta sonu'], dogru: 1, aciklama: 'Herkes aynı anda satmak isteyince alıcı kalmaz.' },
      ],
      gorev: { baslik: 'Likidite karşılaştırması', adimlar: ['Bir XU030 payı ve bir küçük (XU100 dışı) pay seçin.', 'İkisinin son 20 günlük ortalama TL hacmini bir kaynaktan (aracı kurum, borsa sitesi) bulun.', '100.000 TL\'lik pozisyonun her birinde günlük hacmin yüzde kaçı olduğunu hesaplayın.'] },
      kaynaklar: [BIST, { ad: 'Harris, L.: Trading and Exchanges, Bölüm 19 (Likidite)' }],
    },
    {
      id: '2-07', seviye: 2, baslik: 'Sektörler ve döngüsellik', beceri: 'piyasa', dakika: 7,
      bolumler: [
        { tip: 'metin', metin: `Şirketler ekonomik döngüye farklı tepki verir:

- **Döngüsel sektörler** (otomotiv, demir-çelik, inşaat, kimya): Büyüme dönemlerinde kâr hızla artar, durgunlukta hızla düşer.
- **Defansif sektörler** (gıda perakende, temel tüketim, telekom, elektrik dağıtımı): Talep daha istikrarlıdır.
- **Bankalar:** Faiz ve kredi döngüsüne çok duyarlıdır. Faiz indirimi beklentisi genellikle banka hisselerini destekler. Ayrıca XU100'de ağırlıkları yüksektir.
- **İhracatçılar ve döviz gelirliler** (havacılık, rafineri, savunma, dayanıklı tüketim ihracatçıları): TL'nin değer kaybından genelde olumlu, reel değerlenmesinden olumsuz etkilenir.
- **Holdingler:** Birçok sektörü içerir. Genellikle iştiraklerinin toplam değerine göre iskontolu işlem görür (holding iskontosu).

Döngüsel bir şirketin en düşük F/K'sı çoğu zaman döngünün **zirvesinde** görülür: kâr en yüksektedir, piyasa ise düşüşü fiyatlamaya başlamıştır. Bu nedenle döngüsellerde düşük F/K tek başına "ucuz" anlamına gelmez.` },
        { tip: 'ornek', baslik: 'Demir-çelikte döngü: EREGL 2025', metin: 'Ereğli Demir Çelik\'in 2025 yıllık tablolarında hasılat yaklaşık 260 milyar TL, ana ortaklık net kârı ise sadece yaklaşık 0,6 milyar TL. Bu yüzden F/K 300\'ün üzerinde çıkıyor ve anlamsızlaşıyor. Döngünün dip dönemlerinde F/K yerine PD/DD, FD/FAVÖK ve normalleşmiş kâr kullanılır. Seviye 3\'te bu rakamları ayrıntılı inceleyeceğiz.', kaynak: 'İş Yatırım mali tablo verisi, EREGL 2025/12 (KAP ilk açıklama 2026-02-17)' },
      ],
      quiz: [
        { soru: 'Hangisi defansif sektöre örnektir?', secenekler: ['Otomotiv', 'Gıda perakende', 'Demir-çelik', 'İnşaat'], dogru: 1, aciklama: 'Temel ihtiyaç talebi döngüden az etkilenir.' },
        { soru: 'Döngüsel bir şirketin F/K\'sı neden zirvede en düşük görünebilir?', secenekler: ['Kâr döngü zirvesinde en yüksek olduğu için', 'Şirket hisse geri aldığı için', 'Vergi düştüğü için', 'Endeks değiştiği için'], dogru: 0, aciklama: 'Payda (kâr) şişmiş, piyasa ise geleceği iskonto ediyordur.' },
        { soru: 'TL\'nin sert değer kaybından genellikle olumlu etkilenen grup hangisidir?', secenekler: ['İthalata bağımlı, döviz borçlu yurt içi satıcılar', 'Döviz geliri olan ihracatçılar', 'Bankalar', 'Hepsi eşit'], dogru: 1, aciklama: 'Döviz cinsinden gelir TL karşılığında artar.' },
        { soru: 'Holding iskontosu nedir?', secenekler: ['Holdingin borcu', 'Holdingin piyasa değerinin iştiraklerinin toplam değerinden düşük olması', 'Temettü vergisi', 'Endeks dışı kalma'], dogru: 1, aciklama: 'Genellikle maliyet, şeffaflık ve kontrol primi nedenleriyle oluşur.' },
      ],
      gorev: { baslik: 'Takip listenizi sınıflandırın', adimlar: ['Uygulamadaki hisse listesinden 8 şirket seçin.', 'Her birini döngüsel, defansif, banka, ihracatçı veya holding olarak sınıflandırın ve gerekçesini tek cümleyle yazın.', 'Faizlerin 10 puan düştüğü bir senaryoda hangilerinin daha olumlu etkileneceğini tahmin edin.'] },
      kaynaklar: [{ ad: 'Borsa İstanbul sektör endeksleri', url: 'https://www.borsaistanbul.com' }, { ad: 'Damodaran, A.: The Little Book of Valuation (döngüsel şirketler bölümü)' }],
    },
    {
      id: '2-08', seviye: 2, baslik: 'Makro göstergeler ve piyasaya etkileri', beceri: 'makro', dakika: 8,
      bolumler: [
        { tip: 'metin', metin: `Takip edilmesi gereken başlıca makro göstergeler:

- **Enflasyon (TÜFE):** Faiz beklentisini belirler. Beklentinin üstünde gelen enflasyon, faiz indiriminin gecikmesi demektir.
- **Politika faizi ve TCMB iletişimi.**
- **CDS (kredi temerrüt takası):** Ülkenin borç ödememe riskine piyasanın verdiği fiyattır. CDS düşerse yabancının Türkiye varlıklarına ilgisi genellikle artar.
- **Cari işlemler dengesi:** Ülkenin dış dünyayla mal, hizmet ve gelir dengesi. Kronik cari açık dış finansman ihtiyacı ve kur kırılganlığı yaratır. Enerji ve altın ithalatı Türkiye'de cari açığın ana kalemleridir.
- **Büyüme (GSYH), işsizlik, sanayi üretimi, PMI:** Ekonominin hızını gösterir.
- **Bütçe dengesi:** Kamu harcamalarının finansmanı. Bütçe açığı enflasyonu ve borçlanmayı etkiler.
- **Rezervler.**

**En önemli ilke:** Piyasa rakamın kendisine değil, **beklentiye göre sürprize** tepki verir. Enflasyon %3 açıklandığında piyasa %3,5 bekliyorsa bu "iyi haber" sayılır.` },
        { tip: 'terim', terim: 'Konsensüs beklentisi', tanim: 'Analistlerin bir veri için ortalama tahmini. Haberlerde "beklenti" olarak geçer. Sürpriz = gerçekleşen − beklenti.' },
        { tip: 'ornek', baslik: 'Mart 2025: siyasi şok ve piyasa', metin: 'Mart 2025\'te İstanbul Büyükşehir Belediye Başkanı\'nın gözaltına alınmasının ardından TL\'de sert dalgalanma yaşandı ve BIST birkaç gün içinde çift haneli düştü. TCMB olağanüstü toplantıyla gecelik borç verme faizini yükseltti ve rezerv kullandı; ardından politika faizini de artırdı. Bu olay, makro göstergelerin yanında siyasi riskin de CDS, kur ve faiz üzerinden piyasayı nasıl etkilediğini gösteren yakın bir örnektir.', kaynak: 'TCMB basın duyuruları (Mart-Nisan 2025)' },
      ],
      quiz: [
        { soru: 'Enflasyon %2,5 açıklandı, beklenti %2,0 idi. Piyasa açısından bu ne demek?', secenekler: ['Olumlu sürpriz', 'Olumsuz sürpriz: faiz indirimi beklentisi gecikebilir', 'Nötr', 'Kurlar kesin düşer'], dogru: 1, aciklama: 'Beklentinin üstünde enflasyon, sıkı politikanın uzaması demektir.' },
        { soru: 'CDS primindeki düşüş genellikle ne anlama gelir?', secenekler: ['Ülke riskinin piyasa tarafından daha düşük algılandığı', 'Enflasyonun arttığı', 'Borsanın kapandığı', 'Faizin arttığı'], dogru: 0, aciklama: 'Temerrüde karşı sigorta ucuzluyor.' },
        { soru: 'Türkiye\'de cari açığın yapısal ana kalemlerinden biri hangisidir?', secenekler: ['Turizm gelirleri', 'Enerji ithalatı', 'Tarım ihracatı', 'Hizmet ihracatı'], dogru: 1, aciklama: 'Enerji ve altın ithalatı belirgin kalemlerdir.' },
        { soru: 'Piyasalar makro verilere esas olarak neye göre tepki verir?', secenekler: ['Rakamın mutlak büyüklüğüne', 'Beklentiye göre sürprize', 'Haber başlığına', 'Hiçbirine'], dogru: 1, aciklama: 'Beklenen zaten fiyatlıdır.' },
      ],
      gorev: { baslik: 'Bir veri gününü takip edin', adimlar: ['Bu ay açıklanacak bir veriyi (TÜFE, cari denge veya PPK) seçin.', 'Açıklamadan önce konsensüs beklentisini bir haber kaynağından bulup yazın.', 'Açıklandığı gün gerçekleşeni, sürprizi ve USD/TRY ile XU100\'ün gün içi tepkisini not edin.'] },
      kaynaklar: [{ ad: 'TCMB: Ödemeler dengesi istatistikleri', url: 'https://www.tcmb.gov.tr' }, { ad: 'TÜİK veri takvimi', url: 'https://data.tuik.gov.tr' }],
    },
    {
      id: '2-09', seviye: 2, baslik: 'Yabancı payı ve fon akımları', beceri: 'piyasa', dakika: 5,
      bolumler: [
        { tip: 'metin', metin: `**Yabancı payı**, BIST'te saklanan payların piyasa değerinin yabancı yatırımcılara ait olan kısmıdır. MKK ve Takasbank verileriyle izlenir. TCMB de haftalık menkul kıymet istatistiklerinde yabancıların hisse ve DİBS alım-satımlarını yayımlar.

Yabancı payının uzun yıllar boyunca belirgin biçimde azalması, yerli bireysel yatırımcının piyasadaki ağırlığının arttığını gösterir. Bu da oynaklığı ve "tema" hareketlerini artırabilir.

Fon akımlarını okurken dikkat:

- Haftalık veriler gürültülüdür; eğilime bakın.
- Yabancı alımı fiyatları yükseltir ama bunun tersi de olabilir: yükselen fiyat yabancıyı çeker.
- "Yabancı alıyor, ben de alayım" bir analiz değil, sürü davranışıdır (Seviye 6).` },
        { tip: 'terim', terim: 'Portföy yatırımı (sıcak para)', tanim: 'Hisse ve tahvil gibi kolayca çıkılabilen yatırımlar. Doğrudan yatırımlara (fabrika, şirket satın alma) göre çok daha hızlı girip çıkar.' },
      ],
      quiz: [
        { soru: 'Haftalık yabancı hisse alım verisini yorumlamanın doğru yolu hangisidir?', secenekler: ['Tek haftalık veriye göre karar vermek', 'Birkaç haftalık eğilime bakmak ve nedenselliği sorgulamak', 'Yok saymak', 'Tersini yapmak'], dogru: 1, aciklama: 'Kısa dönem veriler gürültülüdür.' },
        { soru: 'Portföy yatırımlarının doğrudan yatırımlardan temel farkı nedir?', secenekler: ['Daha yavaş hareket eder', 'Çok daha hızlı girip çıkabilir', 'Vergisizdir', 'Sadece devlet yapar'], dogru: 1, aciklama: 'Likit araçlar hızlı çıkışa izin verir.' },
        { soru: 'Yabancı payının düşük olması piyasa davranışını nasıl etkileyebilir?', secenekler: ['Oynaklık azalır', 'Yerli bireysel ağırlık artar, tema hareketleri ve oynaklık artabilir', 'Etkisi yoktur', 'Endeks durur'], dogru: 1, aciklama: 'Yatırımcı tabanının yapısı fiyat davranışını etkiler.' },
      ],
      gorev: { baslik: 'Yabancı akımlarını bulun', adimlar: ['TCMB\'nin son "Haftalık Menkul Kıymet İstatistikleri" duyurusunu bulun.', 'Yabancıların son hafta hisse ve DİBS\'te net alıcı mı satıcı mı olduğunu yazın.', 'Aynı hafta XU100 ve USD/TRY ne yaptı? Nedensellik kurmadan sadece eş zamanlılığı not edin.'] },
      kaynaklar: [MKK, { ad: 'TCMB: Haftalık menkul kıymet istatistikleri', url: 'https://www.tcmb.gov.tr' }],
    },
    {
      id: '2-10', seviye: 2, baslik: 'VİOP\'a giriş: vadeli işlem kavramı', beceri: 'risk', dakika: 6,
      bolumler: [
        { tip: 'metin', metin: `**VİOP** (Vadeli İşlem ve Opsiyon Piyasası), Borsa İstanbul'un türev piyasasıdır. **Vadeli işlem sözleşmesi**, bir varlığı ileri bir tarihte bugünden belirlenen fiyattan alma veya satma yükümlülüğüdür. Sözleşmenin tamamını değil, yalnızca **teminatı** yatırırsınız. Bu da kaldıraç demektir.

- **Günlük uzlaşma:** Kâr ve zarar her gün hesabınıza yansır. Teminat belirli bir seviyenin altına düşerse ek teminat istenir; yatırılmazsa pozisyon kapatılır.
- **Vadeli fiyat ile spot fiyat farkı:** Teorik olarak iki para biriminin faiz farkını yansıtır. Bu yüzden USD/TRY vadeli fiyatı, spot kurdan yüksektir. Bu fark bir "beklenti" değil, faiz farkıdır.
- **Kullanım alanları:** Korunma (hedge) ve spekülasyon.

Bu seviyede amaç VİOP'ta işlem yapmak değil, kavramları anlamaktır. Haberlerde "vadeli dolar" veya "endeks vadeli" geçtiğinde neyi ölçtüğünü bilmek yeterlidir.` },
        { tip: 'formul', ad: 'Teorik vadeli kur', formul: 'Vadeli = Spot × (1 + r_TL × t) ÷ (1 + r_USD × t)', aciklama: '`t` yıl cinsinden vade. TL faizi dolar faizinden yüksek olduğu sürece vadeli kur spot kurdan yüksek olur.' },
        { tip: 'uyari', metin: 'Bu uygulamada türev işlem yoktur. Kaldıraçlı ürünler, sistemi olmayan yatırımcıyı en hızlı sıfırlayan araçlardır.' },
      ],
      quiz: [
        { soru: 'USD/TRY vadeli fiyatının spot kurdan yüksek olmasının temel nedeni nedir?', secenekler: ['Piyasanın kurun yükseleceğini kesin bilmesi', 'TL ve USD arasındaki faiz farkı', 'Komisyon', 'Vergi'], dogru: 1, aciklama: 'Faiz paritesi: fark beklenti değil, faiz farkıdır.' },
        { soru: 'Vadeli işlemde "günlük uzlaşma" ne demektir?', secenekler: ['Pozisyon her gün kapatılır', 'Kâr/zarar her gün hesaba yansır', 'Komisyon her gün alınır', 'Fiyat her gün sabitlenir'], dogru: 1, aciklama: 'Teminat hesabı her gün piyasa fiyatına göre güncellenir.' },
        { soru: 'Spot 40, TL faizi %40, USD faizi %4, vade 1 yıl. Teorik vadeli kur yaklaşık kaçtır?', secenekler: ['40', '53,8', '56', '41,6'], dogru: 1, aciklama: '`40 × 1,40 ÷ 1,04 ≈ 53,85`.' },
      ],
      gorev: { baslik: 'Vadeli ve spot kuru karşılaştırın', adimlar: ['Bir kaynaktan en yakın vadeli USD/TRY kontratının fiyatını ve vadesini bulun.', 'Özet\'teki spot kurla farkını yüzde olarak hesaplayın.', 'Bu farkı yıllıklandırıp politika faiziyle karşılaştırın; tutarlı mı?'] },
      kaynaklar: [{ ad: 'Borsa İstanbul: VİOP', url: 'https://www.borsaistanbul.com' }, { ad: 'Hull, J.: Options, Futures and Other Derivatives, Bölüm 5' }],
    },
  ],
  sinavEk: [
    { soru: 'Faiz indirimi beklentisi güçlendi. Aşağıdakilerden hangisinin olumlu etkilenmesi en olasıdır?', secenekler: ['Mevcut uzun vadeli tahvil fiyatları ve banka hisseleri', 'Para piyasası fonu getirisi', 'Vadeli mevduat yeni faizleri', 'Hiçbiri'], dogru: 0, aciklama: 'Faiz düşerse tahvil fiyatı artar; bankalar fonlama maliyeti düşüşünden yararlanabilir.' },
    { soru: 'Sığ bir hissede tavan serisi görülüyor ve KAP\'ta yeni bir bilgi yok. En sağlıklı yaklaşım hangisidir?', secenekler: ['Hemen piyasa emriyle almak', 'Halka açıklık, hacim ve SPK tedbirlerini kontrol etmek; haberi olmayan hareketi şüpheyle karşılamak', 'Kredili alım yapmak', 'Açığa satmak'], dogru: 1, aciklama: 'Likidite ve manipülasyon riski önce gelir.' },
  ],
}
