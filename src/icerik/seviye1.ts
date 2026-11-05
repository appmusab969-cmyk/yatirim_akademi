import type { Seviye } from './tipler'

const TCMB = { ad: 'TCMB: Para politikası ve PPK kararları', url: 'https://www.tcmb.gov.tr' }
const TUIK = { ad: 'TÜİK: Tüketici Fiyat Endeksi bültenleri', url: 'https://data.tuik.gov.tr' }
const SPK = { ad: 'SPK: Yatırımcı bilgilendirme', url: 'https://www.spk.gov.tr' }

export const SEVIYE1: Seviye = {
  no: 1, ad: 'Temel', amac: 'Para, enflasyon, faiz ve kurun nasıl çalıştığını; temel yatırım araçlarını ve risk-getiri ilişkisini öğrenmek.',
  dersler: [
    {
      id: '1-01', seviye: 1, baslik: 'Para ve paranın zaman değeri', beceri: 'makro', dakika: 7,
      bolumler: [
        { tip: 'metin', metin: `Para üç iş görür: **değişim aracı** (alışveriş), **hesap birimi** (fiyatları ölçmek) ve **değer saklama** (bugünün emeğini yarına taşımak). Yatırımcıyı en çok üçüncüsü ilgilendirir. Türkiye'de TL'nin değer saklama işlevi uzun yıllar zayıf kaldı; bu yüzden insanlar altına, dövize ve gayrimenkule yöneldi.

Bugünkü 100 TL, bir yıl sonraki 100 TL'den daha değerlidir. Bunun iki nedeni vardır. Birincisi, bugün elinizdeki parayı faize yatırıp büyütebilirsiniz. İkincisi, fiyatlar artarsa (enflasyon) yarınki 100 TL daha az şey alır. Buna **paranın zaman değeri** denir. Tüm değerleme yöntemleri bu fikre dayanır.` },
        { tip: 'formul', ad: 'Bileşik faiz (gelecek değer)', formul: 'GD = BD × (1 + r)^n', aciklama: '`BD` bugünkü değer, `r` dönem faizi, `n` dönem sayısı. Faizin faizi de kazanılır.' },
        { tip: 'formul', ad: 'Bugünkü değer (iskonto)', formul: 'BD = GD ÷ (1 + r)^n', aciklama: 'Gelecekteki bir parayı bugüne çevirmek için faizle "indirim" yapılır. Faiz yükseldikçe gelecekteki paranın bugünkü değeri düşer. Faiz artışında hisse ve tahvil fiyatlarının düşmesinin temel nedeni budur.' },
        { tip: 'terim', terim: 'Basit ve bileşik faiz', tanim: 'Basit faizde faiz yalnız anaparaya işler. Bileşikte her dönem kazanılan faiz anaparaya eklenir ve sonraki dönem o da faiz kazanır. Vadeli mevduatı her ay yenilemek pratikte bileşik faizdir.' },
        { tip: 'ornek', baslik: 'Bileşik faizin gücü', metin: '100.000 TL, yıllık %40 bileşik getiriyle 5 yılda `100.000 × 1,4^5 ≈ 537.824 TL` olur. Basit faizle ise `100.000 + 5 × 40.000 = 300.000 TL` olurdu. Aradaki fark sadece faizin faizinden geliyor. Ama dikkat: enflasyon da bileşik işler.', kaynak: 'Hesaplama (formül uygulaması)' },
      ],
      quiz: [
        { soru: 'Yıllık %50 bileşik getiriyle 2 yılda 10.000 TL kaç TL olur?', secenekler: ['20.000', '22.500', '25.000', '15.000'], dogru: 1, aciklama: '`10.000 × 1,5 × 1,5 = 22.500`. 20.000 basit faiz cevabıdır.' },
        { soru: 'Faizler yükseldiğinde gelecekte elde edilecek nakit akışlarının bugünkü değeri ne olur?', secenekler: ['Artar', 'Değişmez', 'Azalır', 'Enflasyona bağlıdır, faizle ilgisi yoktur'], dogru: 2, aciklama: 'İskonto oranı (paydadaki `1+r`) büyüyünce bugünkü değer küçülür.' },
        { soru: 'Paranın hangi işlevi yatırımcıyı en çok ilgilendirir?', secenekler: ['Değişim aracı', 'Hesap birimi', 'Değer saklama', 'Hiçbiri'], dogru: 2, aciklama: 'Yatırım, bugünkü alım gücünü geleceğe taşıma işidir.' },
        { soru: 'Bir yıl sonra alacağınız 140 TL, faiz %40 iken bugün kaç TL eder?', secenekler: ['100', '140', '84', '196'], dogru: 0, aciklama: '`140 ÷ 1,40 = 100`.' },
      ],
      gorev: { baslik: 'Kendi bileşik faiz tablonuzu çıkarın', adimlar: ['Bir kâğıda (veya not alanına) 100.000 TL için yıllık %30, %45 ve %60 bileşik getiriyle 1, 3 ve 5 yıl sonraki değerleri hesaplayın.', 'Aynı hesabı basit faizle yapın ve farkı yazın.', 'Özet ekranındaki güncel yıllık enflasyonla aynı hesabı yapın: 5 yıl sonra bugünkü 100.000 TL\'nin alım gücüne eşdeğer tutar ne olur?'] },
      kaynaklar: [{ ad: 'Brealey, Myers, Allen: Principles of Corporate Finance, Bölüm 2 (Bugünkü değer)' }, SPK],
    },
    {
      id: '1-02', seviye: 1, baslik: 'Enflasyon: TÜFE, ÜFE, çekirdek; nominal ve reel getiri', beceri: 'makro', dakika: 8,
      bolumler: [
        { tip: 'metin', metin: `**Enflasyon**, fiyatlar genel düzeyinin sürekli artmasıdır. Türkiye'de resmî ölçüm TÜİK'in **Tüketici Fiyat Endeksi (TÜFE)** ile yapılır. TÜFE, temsili bir hanehalkının harcama sepetinin fiyatını izler. **Yıllık enflasyon** son 12 aydaki değişimi, **aylık enflasyon** bir önceki aya göre değişimi verir.

**ÜFE (Yurt İçi Üretici Fiyat Endeksi)** üreticilerin satış fiyatlarını izler. ÜFE'nin TÜFE'den hızlı arttığı dönemler, maliyet artışının ileride tüketiciye yansıyabileceğine işaret eder. **Çekirdek enflasyon** (ör. enerji, gıda, alkol-tütün ve altın hariç göstergeler) oynak kalemleri dışarıda bırakarak eğilimi görmeye yarar. TCMB çekirdek göstergeleri yakından izler.` },
        { tip: 'formul', ad: 'Reel getiri (Fisher denklemi)', formul: 'Reel = (1 + nominal) ÷ (1 + enflasyon) − 1', aciklama: 'Basitçe "nominal eksi enflasyon" demek yüksek enflasyonda ciddi hata yapar: %60 getiri, %50 enflasyonda reel %10 değil, `1,6 ÷ 1,5 − 1 ≈ %6,7`dir.' },
        { tip: 'terim', terim: 'Baz etkisi', tanim: 'Yıllık enflasyon, 12 ay önceki aylık artışın büyüklüğünden etkilenir. Geçen yılın aynı ayında yüksek artış olduysa, bu yıl aynı ay "düşük" görünebilir. Aylık rakamlara da bakmak bu yüzden önemlidir.' },
        { tip: 'ornek', baslik: 'Ekim 2022: %85,5', metin: 'TÜİK verisine göre yıllık TÜFE Ekim 2022\'de %85,51 ile zirve yaptı. Aynı dönemde politika faizi %10,5 civarındaydı; yani reel politika faizi derin negatifti. Bu ortamda TL mevduat reel olarak hızla eriyordu. Yatırımcılar hisse senedi, döviz, altın ve gayrimenkule kaçtı. BIST\'in 2022\'deki güçlü nominal yükselişinin önemli bir kısmı bu kaçışın sonucudur.', kaynak: 'TÜİK TÜFE bülteni (Ekim 2022), TCMB PPK kararları' },
        { tip: 'uyari', metin: '"Portföyüm %40 kazandı" cümlesi, aynı dönemin enflasyonu söylenmeden hiçbir şey ifade etmez. Bu uygulamada her getiriyi enflasyonla birlikte düşünmeye alışın.' },
      ],
      quiz: [
        { soru: 'Nominal getiri %30, enflasyon %40. Reel getiri yaklaşık kaçtır?', secenekler: ['%−10', '%−7,1', '%10', '%0'], dogru: 1, aciklama: '`1,30 ÷ 1,40 − 1 ≈ −0,071`. Basit çıkarma (−10) yaklaşık ama yanlış.' },
        { soru: 'Çekirdek enflasyonun amacı nedir?', secenekler: ['Daha düşük bir enflasyon rakamı açıklamak', 'Oynak kalemleri dışlayarak eğilimi görmek', 'Sadece gıda fiyatlarını izlemek', 'Üretici fiyatlarını ölçmek'], dogru: 1, aciklama: 'Enerji ve gıda gibi şoklara açık kalemler dışlanınca altta yatan eğilim daha net görünür.' },
        { soru: 'ÜFE, TÜFE\'den belirgin şekilde hızlı artıyorsa bu neye işaret edebilir?', secenekler: ['Enflasyonun kesin düşeceğine', 'Maliyet baskısının ileride tüketici fiyatlarına yansıyabileceğine', 'Kurların düşeceğine', 'Hiçbir şeye'], dogru: 1, aciklama: 'Üretici maliyetleri genelde gecikmeyle tüketiciye aktarılır (kesin değil, olasılık).' },
        { soru: 'Aylık enflasyon %3 ve bu hız 12 ay sürerse yıllık enflasyon yaklaşık kaç olur?', secenekler: ['%36', '%42,6', '%30', '%3'], dogru: 1, aciklama: '`1,03^12 − 1 ≈ 0,426`. Aylıkların toplamı değil çarpımı alınır.' },
      ],
      gorev: { baslik: 'Son TÜFE bültenini okuyun', adimlar: ['TÜİK\'in son TÜFE bültenini açın (data.tuik.gov.tr).', 'Yıllık, aylık ve en az bir çekirdek göstergeyi not edin.', 'En çok artan 3 ana harcama grubunu yazın.', 'Özet ekranındaki politika faiziyle reel faizi Fisher denklemiyle hesaplayın.'] },
      kaynaklar: [TUIK, TCMB, { ad: 'Fisher, I. (1930): The Theory of Interest' }],
    },
    {
      id: '1-03', seviye: 1, baslik: 'Faiz: politika faizi, piyasa faizi, mevduat faizi', beceri: 'makro', dakika: 7,
      bolumler: [
        { tip: 'metin', metin: `**Faiz**, paranın kiralama bedelidir. Türkiye'de birkaç farklı faiz vardır ve hepsi birbirine bağlıdır:

- **Politika faizi:** TCMB'nin bir hafta vadeli repo ihale faizi. Bankaların TCMB'den borçlanma maliyetinin çapasıdır.
- **Gecelik faiz koridoru:** TCMB'nin gecelik borç alma ve borç verme faizleri. Politika faizi genellikle bu koridorun içinde durur.
- **TLREF:** Borsa İstanbul'da gerçekleşen gecelik repo işlemlerinden hesaplanan Türk lirası gecelik referans faiz.
- **Mevduat ve kredi faizleri:** Bankaların politika faizine kendi risk ve marjlarını ekleyerek belirlediği faizler.
- **Tahvil faizleri (getiri):** Devletin ve şirketlerin borçlanma maliyeti; piyasada alınıp satılırken belirlenir.

Faiz yükselince tasarruf cazipleşir ve krediler pahalanır. Talep yavaşlar; bu, zamanla enflasyonu düşürmeye çalışan mekanizmadır. Hisse senetleri tarafında yüksek faiz iki yoldan baskı yapar: gelecekteki kârların bugünkü değeri düşer, ayrıca yatırımcının "risksiz" alternatifi (mevduat, bono) cazip hale gelir.` },
        { tip: 'terim', terim: 'Repo', tanim: 'Geri alım vaadiyle menkul kıymet satışı. Ekonomik olarak teminatlı kısa vadeli borçlanmadır.' },
        { tip: 'ornek', baslik: '2023 parasal sıkılaşma', metin: 'Haziran 2023\'te politika faizi %8,5\'ten %15\'e yükseltildi. Ardından gelen artışlarla Mart 2024\'te %50\'ye ulaştı. Bu dönemde mevduat faizleri hızla yükseldi ve TL mevduata dönüş başladı. Sıkılaşmanın enflasyona etkisi gecikmeli geldi: yıllık TÜFE 2024 ortasına kadar yükselmeye devam etti, sonra gerilemeye başladı. Para politikasının etkisinin aylar sonra görülmesine **gecikme (lag)** denir.', kaynak: 'TCMB PPK basın duyuruları (2023-2024)' },
        { tip: 'uyari', metin: 'Politika faizini haber başlığından değil, TCMB\'nin kendi PPK karar metninden okuyun. Kararın yanında metindeki "yönlendirme" (ileriye dönük ifade) çoğu zaman rakamın kendisinden daha çok piyasayı etkiler.' },
      ],
      quiz: [
        { soru: 'TCMB\'nin ana politika aracı olan faiz hangisidir?', secenekler: ['Kredi kartı faizi', 'Bir hafta vadeli repo ihale faizi', '10 yıllık tahvil faizi', 'TLREF'], dogru: 1, aciklama: 'Türkiye\'de politika faizi 1 hafta vadeli repo ihale faizidir.' },
        { soru: 'Faiz artışı hisse değerlemelerini hangi mekanizmayla baskılar?', secenekler: ['Şirketlerin satışlarını anında artırarak', 'Gelecek kârların iskonto oranını yükselterek ve alternatif getiriyi cazipleştirerek', 'Kurları her zaman düşürerek', 'Hiç etkilemez'], dogru: 1, aciklama: 'Hem iskonto etkisi hem fırsat maliyeti etkisi var.' },
        { soru: 'Para politikası kararlarının enflasyona etkisi genellikle ne zaman görülür?', secenekler: ['Aynı gün', 'Aylar sonra (gecikmeli)', 'Hiçbir zaman', 'Sadece seçim dönemlerinde'], dogru: 1, aciklama: 'Kredi, talep ve beklenti kanalları zaman alır.' },
        { soru: 'TLREF nedir?', secenekler: ['TCMB\'nin politika faizi', 'BIST\'teki gecelik repo işlemlerinden hesaplanan referans faiz', 'Mevduat faizi ortalaması', 'Kredi kartı azami faizi'], dogru: 1, aciklama: 'TLREF, Borsa İstanbul tarafından hesaplanan gecelik referans faizdir.' },
      ],
      gorev: { baslik: 'Son PPK kararını okuyun', adimlar: ['TCMB sitesinden son PPK basın duyurusunu açın.', 'Kararı (artış, indirim, sabit) ve gerekçe paragrafındaki 2 anahtar ifadeyi yazın.', 'Ayarlar > Elle giriş bölümüne politika faizini kaynağıyla girin (EVDS bağlanana kadar).', 'Bankanızın 32 günlük mevduat faizini öğrenip politika faiziyle farkını yazın.'] },
      kaynaklar: [TCMB, { ad: 'Borsa İstanbul: TLREF metodolojisi', url: 'https://www.borsaistanbul.com' }],
    },
    {
      id: '1-04', seviye: 1, baslik: 'TCMB: görevi, PPK ve araçları', beceri: 'makro', dakika: 7,
      bolumler: [
        { tip: 'metin', metin: `TCMB'nin kanunla tanımlanmış **temel amacı fiyat istikrarıdır** (1211 sayılı TCMB Kanunu, madde 4). Finansal istikrarı da gözetir ama fiyat istikrarıyla çelişen bir politika izleyemez.

Kararları **Para Politikası Kurulu (PPK)** alır. Toplantı takvimi yıl başında ilan edilir. Başlıca araçlar şunlardır:

- **Politika faizi** ve gecelik faiz koridoru.
- **Açık piyasa işlemleri:** piyasaya likidite vermek veya çekmek.
- **Zorunlu karşılıklar:** bankaların mevduatın bir kısmını TCMB'de tutması. Kredi büyümesini ve likiditeyi etkiler.
- **Döviz müdahaleleri ve rezerv yönetimi.**
- **Makro ihtiyati tedbirler:** kredi büyümesi sınırları, menkul kıymet tesisi gibi seçici araçlar.
- **İletişim:** karar metinleri, Enflasyon Raporu ve yönlendirme.

**Rezervler:** TCMB'nin döviz ve altın varlıkları. **Brüt rezerv** toplam varlıktır. **Net rezerv** ise yükümlülükler düşüldükten sonra kalan kısımdır; analistler ayrıca swap işlemleri hariç net rezerve de bakar. Rezervler kur şoklarına karşı tampon görevi görür.` },
        { tip: 'terim', terim: 'Yönlendirme (forward guidance)', tanim: 'Merkez bankasının ileride ne yapacağına dair ipucu vermesi. "Sıkı duruş enflasyon görünümünde kalıcı iyileşme sağlanana kadar sürdürülecektir" gibi ifadeler piyasa fiyatlamasını etkiler.' },
        { tip: 'ornek', baslik: 'Eylül 2018: kur şokuna faizle yanıt', metin: 'Ağustos 2018\'de USD/TRY birkaç hafta içinde 5 TL\'nin altından 7 TL\'nin üzerine (gün içi) sıçradı. TCMB 13 Eylül 2018\'de politika faizini %17,75\'ten %24\'e yükseltti. Kur sonraki aylarda geriledi. Bu, kur şokuna ortodoks faiz yanıtının ders kitabı örneğidir. Ama sıkılaşmanın bedeli 2018 sonu-2019 başındaki ekonomik daralma oldu.', kaynak: 'TCMB PPK basın duyurusu 13.09.2018; kur: TCMB' },
      ],
      quiz: [
        { soru: 'TCMB\'nin kanuni temel amacı nedir?', secenekler: ['Büyümeyi en üst düzeye çıkarmak', 'Fiyat istikrarı', 'Kuru sabit tutmak', 'Borsayı desteklemek'], dogru: 1, aciklama: '1211 sayılı Kanun, madde 4.' },
        { soru: 'Zorunlu karşılık oranının artırılması ilk etapta neye yol açar?', secenekler: ['Bankaların kredi verebileceği fonun azalmasına', 'Kredilerin ucuzlamasına', 'Enflasyonun anında yükselmesine', 'Rezervlerin azalmasına'], dogru: 0, aciklama: 'Bankalar mevduatın daha büyük kısmını TCMB\'de tutmak zorunda kalır.' },
        { soru: 'Net rezerv neden brüt rezervden daha bilgilendiricidir?', secenekler: ['Daha büyük bir rakam olduğu için', 'Yükümlülükler düşüldüğünden gerçek tampon gücünü daha iyi gösterdiği için', 'Altını içermediği için', 'Fark yoktur'], dogru: 1, aciklama: 'Borçla finanse edilen rezerv, gerçek savunma gücünü abartır.' },
        { soru: 'Eylül 2018\'de TCMB kur şokuna nasıl yanıt verdi?', secenekler: ['Faizi indirdi', 'Faizi %24\'e yükseltti', 'Döviz satışını yasakladı', 'Hiçbir şey yapmadı'], dogru: 1, aciklama: 'Politika faizi 13.09.2018\'de %17,75\'ten %24\'e çıkarıldı.' },
      ],
      gorev: { baslik: 'PPK takvimini ve rezervi takip edin', adimlar: ['TCMB sitesinden bu yılın PPK toplantı takvimini bulun ve bir sonraki tarihi not edin.', 'TCMB\'nin haftalık analitik bilançosu veya rezerv verisi duyurusundan son brüt rezerv rakamını bulun.', 'Bir sonraki PPK\'da beklentinizi ve nedenini yazın. Toplantıdan sonra tutup tutmadığına bakın.'] },
      kaynaklar: [{ ad: '1211 sayılı Türkiye Cumhuriyet Merkez Bankası Kanunu', url: 'https://www.mevzuat.gov.tr' }, TCMB],
    },
    {
      id: '1-05', seviye: 1, baslik: 'Döviz kuru: USD/TRY, reel kur, carry trade', beceri: 'makro', dakika: 8,
      bolumler: [
        { tip: 'metin', metin: `**Döviz kuru**, bir para biriminin diğeri cinsinden fiyatıdır. USD/TRY = 40, 1 doların 40 TL ettiği anlamına gelir. Kurun yükselmesi TL'nin değer kaybetmesi demektir.

Kuru uzun vadede belirleyen ana etken iki ülke arasındaki **enflasyon farkıdır** (satın alma gücü paritesi fikri). Kısa vadede ise faiz farkı, sermaye akımları, risk algısı (CDS), cari açık ve TCMB'nin müdahaleleri belirleyicidir.

**Reel efektif döviz kuru (REDK):** TL'nin, enflasyon farkları dikkate alınarak bir ülke sepetine göre değeri. TCMB yayımlar (TÜFE bazlı). REDK yükseliyorsa TL **reel olarak değerleniyor** demektir. Nominal kur artsa bile, artış enflasyon farkından azsa TL reel olarak kazanır. Bu durumda ihracatçının rekabet gücü azalır, dolar tutan Türk yatırımcı ise TL bazında alım gücü kaybeder.` },
        { tip: 'terim', terim: 'Carry trade', tanim: 'Düşük faizli bir para biriminde borçlanıp yüksek faizli bir para biriminde (ör. TL) yatırım yapmak. Kur sabit kaldıkça kazandırır; ani kur şokunda kazancın tamamı hatta fazlası tek günde gidebilir.' },
        { tip: 'formul', ad: 'Dolar bazlı getiri', formul: 'USD getiri = (1 + TL getiri) ÷ (1 + kurdaki değişim) − 1', aciklama: 'BIST %50 yükselip dolar %40 artmışsa dolar bazlı getiri `1,5 ÷ 1,4 − 1 ≈ %7,1`dir.' },
        { tip: 'ornek', baslik: 'Eylül-Aralık 2021: faiz indirimi ve kur', metin: 'Yıllık enflasyon yüksekken TCMB, Eylül 2021\'den itibaren politika faizini %19\'dan Aralık\'ta %14\'e indirdi. USD/TRY Eylül başında yaklaşık 8,3 iken 20 Aralık 2021\'de gün içinde 18\'in üzerini gördü. Aynı akşam **Kur Korumalı Mevduat (KKM)** açıklandı ve kur hızla geri döndü. Ders: reel faiz derin negatife çekildiğinde kur, enflasyon beklentilerinin sigortası haline gelir.', kaynak: 'TCMB PPK kararları (Eyl-Ara 2021); kur: TCMB/piyasa verisi' },
      ],
      quiz: [
        { soru: 'USD/TRY 35\'ten 42\'ye çıktı. TL dolar karşısında ne oldu?', secenekler: ['Değer kazandı', 'Değer kaybetti', 'Değişmedi', 'Belirlenemez'], dogru: 1, aciklama: '1 dolar için daha fazla TL gerekiyor.' },
        { soru: 'Yıl içinde dolar %20, TÜFE %35 arttı (ABD enflasyonu düşük). TL reel olarak ne yaptı?', secenekler: ['Reel değer kaybetti', 'Reel değer kazandı', 'Nötr', 'Belirlenemez'], dogru: 1, aciklama: 'Kur, enflasyon farkından az arttı; TL reel olarak değerlendi.' },
        { soru: 'BIST TL bazında %30 yükseldi, USD/TRY %30 arttı. Dolar bazlı getiri nedir?', secenekler: ['%30', '%0', '%60', '%−30'], dogru: 1, aciklama: '`1,3 ÷ 1,3 − 1 = 0`.' },
        { soru: 'Carry trade yatırımcısı için en büyük risk nedir?', secenekler: ['Faizlerin yükselmesi', 'Ani ve sert kur şoku', 'Enflasyonun düşmesi', 'Borsanın yükselmesi'], dogru: 1, aciklama: 'Faiz kazancı yavaş birikir, kur kaybı tek günde gelir.' },
      ],
      gorev: { baslik: 'Kurun reel hikâyesini çıkarın', adimlar: ['Özet ekranından USD/TRY\'nin 20 iş günlük değişimini ve son aylık TÜFE\'yi not edin.', 'Bu ay TL reel olarak değerlendi mi, değer mi kaybetti? Kaba bir karşılaştırma yapın.', 'TCMB sitesinde reel efektif döviz kuru verisini bulun ve son değeri yazın.', 'Sanal portföyde dolar almayı düşünüyorsanız, bunu tezinizle birlikte karar günlüğüne yazın.'] },
      kaynaklar: [TCMB, { ad: 'Krugman, Obstfeld, Melitz: International Economics, Bölüm 15-16' }],
    },
    {
      id: '1-06', seviye: 1, baslik: 'Mevduat: vadeli/vadesiz, güvence, KKM', beceri: 'makro', dakika: 6,
      bolumler: [
        { tip: 'metin', metin: `**Vadesiz mevduat** istediğiniz an çekilebilir ve genelde faiz getirmez. **Vadeli mevduat** belirli bir süre (ör. 32 gün) kilitlenir ve faiz kazanır. Vadeden önce bozarsanız faizi kaybedersiniz.

Türkiye'de TL mevduat faizinden **stopaj** (kaynakta vergi) kesilir. Oran vadeye göre değişir ve sık sık değiştirilmiştir. Bu yüzden uygulamadaki oranı Ayarlar'dan doğrulamanız gerekir. Mevduat getirisini değerlendirirken üç şeye bakın: **net faiz** (stopaj sonrası), **enflasyon** ve **vade riski**.

Gerçek kişilerin mevduatı **TMSF** güvencesi altındadır. Ancak güvence bir üst limite kadardır ve bu limit her yıl güncellenir. Güncel tutarı TMSF'nin sitesinden kontrol edin.

**KKM (Kur Korumalı Mevduat)** Aralık 2021'de başlatıldı: TL mevduatın getirisi, kur artışının gerisinde kalırsa fark kamu tarafından tamamlanıyordu. Kur riskini yatırımcıdan kamuya taşıyan bu araç bütçeye ve TCMB'ye ciddi maliyet getirdi. 2023 sonrasındaki normalleşme sürecinde kademeli olarak azaltılması hedeflendi.` },
        { tip: 'formul', ad: 'Vadeli mevduat net getirisi', formul: 'Net faiz = Anapara × yıllık faiz × gün ÷ 365 × (1 − stopaj)', aciklama: 'Uygulamadaki sanal mevduat bu formülle çalışır. Her vade sonunda yeniden yatırırsanız fiilen bileşik getiri elde edersiniz.' },
        { tip: 'ornek', baslik: '2022: negatif reel faizde mevduat', metin: '2022 boyunca politika faizi %14\'ten %9\'a indirildi, yıllık TÜFE ise %85\'e ulaştı. Brüt %15-20 mevduat faizi, %70-85 enflasyon karşısında yıllık bazda alım gücünün yaklaşık üçte birinin kaybı demekti. Bu da "mevduat güvenlidir" cümlesinin nominal güvenlik anlamına geldiğini, reel güvenlik anlamına gelmediğini gösterir.', kaynak: 'TCMB PPK kararları 2022; TÜİK TÜFE 2022' },
      ],
      quiz: [
        { soru: '100.000 TL, %40 yıllık faiz, 32 gün, %15 stopaj. Net faiz yaklaşık kaçtır?', secenekler: ['3.507 TL', '2.981 TL', '3.200 TL', '4.000 TL'], dogru: 1, aciklama: 'Brüt `100.000 × 0,40 × 32/365 ≈ 3.507`; net `3.507 × 0,85 ≈ 2.981`.' },
        { soru: 'TMSF güvencesi hakkında hangisi doğrudur?', secenekler: ['Sınırsızdır', 'Belirli bir limite kadardır ve limit güncellenir', 'Sadece döviz mevduatını kapsar', 'Fonları da kapsar'], dogru: 1, aciklama: 'Limit dahilinde koruma vardır; fonlar mevduat değildir.' },
        { soru: 'KKM\'nin temel ekonomik özelliği neydi?', secenekler: ['Faiz riskini bankalara aktarması', 'Kur riskini yatırımcıdan kamuya aktarması', 'Enflasyona endeksli olması', 'Vergiden muaf olmaması'], dogru: 1, aciklama: 'Kur farkı kamu tarafından karşılanıyordu.' },
        { soru: 'Vadeli mevduatı vadeden önce bozarsanız genellikle ne olur?', secenekler: ['Faizin iki katını alırsınız', 'O dönemin faizini kaybedersiniz', 'Anaparanız yarıya iner', 'Hiçbir şey'], dogru: 1, aciklama: 'Bankaların çoğu vade bozumunda faiz ödemez.' },
      ],
      gorev: { baslik: 'Sanal mevduat açın ve gerçek oranla karşılaştırın', adimlar: ['Bankanızın (veya iki bankanın) 32 günlük TL mevduat faizini öğrenin.', 'Portföy ekranından bu oranla 100.000 TL sanal mevduat açın ve oranın kaynağını yazın.', 'Net yıllık getiriyi hesaplayın ve son yıllık TÜFE\'yle reel getiriyi bulun.', 'TMSF sitesinden güncel güvence limitini bulup not edin.'] },
      kaynaklar: [{ ad: 'TMSF: Mevduat sigortası', url: 'https://www.tmsf.org.tr' }, { ad: 'GİB: Gelir Vergisi Kanunu Geçici 67. madde ve ilgili Cumhurbaşkanı Kararları (stopaj oranları)', url: 'https://www.gib.gov.tr' }, TCMB],
    },
    {
      id: '1-07', seviye: 1, baslik: 'Altın: gram/ons, fiziki, banka, fon', beceri: 'makro', dakika: 7,
      bolumler: [
        { tip: 'metin', metin: `Altın dünyada **ons** (troy ons = 31,1035 gram) cinsinden dolarla fiyatlanır. Türkiye'de ise en yaygın ölçü **gram altındır**.` },
        { tip: 'formul', ad: 'Gram altın', formul: 'Gram altın (TL) ≈ Ons altın (USD) × USD/TRY ÷ 31,1035', aciklama: 'Gram altının TL fiyatı iki etkene bağlıdır: dünya altın fiyatı ve kur. TL\'nin değer kaybettiği dönemlerde ons düz gitse bile gram altın yükselir.' },
        { tip: 'metin', metin: `Altına erişim yolları ve gizli maliyetleri şöyledir:

- **Fiziki altın (çeyrek, gram, külçe):** Alış-satış makası yüksek olabilir. İşçilik farkı ve saklama riski vardır.
- **Banka altın hesabı:** Makas fiziki altından genelde düşüktür. Mevduat güvencesi kapsamında değildir, bunu bankanıza sorun.
- **Altın fonları ve ETF'ler:** Yönetim ücreti vardır. Kolay alınıp satılır.

Altın **faiz veya temettü getirmez**. Getirisi yalnızca fiyat artışıdır. Bu yüzden reel faizler yükseldiğinde altın tutmanın fırsat maliyeti artar. Yine de jeopolitik risk, merkez bankası alımları ve kur riski altını destekleyebilir.` },
        { tip: 'ornek', baslik: 'Kendi arşivinizden: gram altın 2010-2026', metin: 'bist_veri arşivinizdeki varlık dağılımı testlerinde gram altın al-tut, incelenen dönemde en yüksek getiriyi veren basit seçenek oldu (CAGR yaklaşık %48, reel yaklaşık %16). Ancak bu sonuç, döneme özgü iki etkenin birleşiminden geliyor: TL\'nin sürekli değer kaybı ve onsun yükselişi. Geçmişteki bu performans gelecek için bir garanti değildir. Ayrıca arşivdeki gram altın verisi doğrudan ölçülmedi; ons × kur formülüyle türetildi.', kaynak: 'Kendi backtest arşiviniz: bist_veri/bt (tur 3), türetilmiş gram altın serisi' },
        { tip: 'uyari', metin: 'Yoğun talep dönemlerinde Kapalıçarşı fiyatı ile uluslararası fiyattan türetilen gram altın fiyatı arasında belirgin fark oluşabilir. Kullandığınız fiyatın neyi ölçtüğünü bilin.' },
      ],
      quiz: [
        { soru: 'Ons 3.000 USD, USD/TRY 40. Gram altın yaklaşık kaç TL?', secenekler: ['3.858', '120.000', '1.200', '2.400'], dogru: 0, aciklama: '`3.000 × 40 ÷ 31,1035 ≈ 3.858`.' },
        { soru: 'Ons değişmedi, USD/TRY %10 arttı. Gram altın ne olur?', secenekler: ['Değişmez', 'Yaklaşık %10 artar', '%10 düşer', 'Belirsiz'], dogru: 1, aciklama: 'Gram altın, ons ile kurun çarpımına bağlıdır.' },
        { soru: 'Reel faizlerin yükselmesi altın için neden olumsuz kabul edilir?', secenekler: ['Altın faiz getirmediği için tutmanın fırsat maliyeti artar', 'Altın üretimi artar', 'Altın vergilendirilir', 'Altın faizle hiç ilişkili değildir'], dogru: 0, aciklama: 'Getirisiz bir varlığı tutmanın maliyeti, alternatif getiri kadardır.' },
        { soru: 'Fiziki çeyrek altının en belirgin gizli maliyeti nedir?', secenekler: ['Stopaj', 'Yüksek alış-satış makası ve işçilik', 'Yönetim ücreti', 'Komisyon yoktur'], dogru: 1, aciklama: 'Alıp hemen satsanız bile makas kadar kaybedersiniz.' },
      ],
      gorev: { baslik: 'Gram altını kendiniz hesaplayın', adimlar: ['Bugünkü ons fiyatını (USD) bir kaynaktan bulun ve Özet\'teki USD/TRY ile gram altını hesaplayın.', 'Özet\'teki gram altın fiyatıyla karşılaştırın ve farkı yazın.', 'Bankanızın altın alış-satış fiyatını öğrenip makası yüzde olarak hesaplayın; bulduğunuz değeri Ayarlar\'daki makas parametresiyle karşılaştırın.'] },
      kaynaklar: [{ ad: 'World Gold Council: Gold market primer', url: 'https://www.gold.org' }, { ad: 'Borsa İstanbul: Kıymetli Madenler Piyasası', url: 'https://www.borsaistanbul.com' }],
    },
    {
      id: '1-08', seviye: 1, baslik: 'Hisse senedi: ortaklık, temettü, sermaye artırımı', beceri: 'piyasa', dakika: 8,
      bolumler: [
        { tip: 'metin', metin: `**Hisse senedi (pay)**, bir şirketin ortaklık payıdır. Pay sahibi şirketin kârına (temettü yoluyla) ve değerine ortak olur. Genel kurulda oy hakkı da vardır. Hisse sahibi, şirketin borçlarından sonra gelir: şirket batarsa önce alacaklılar ödenir.

Hisse senedinin değerini uzun vadede şirketin **kazanç gücü** belirler. Kısa vadede ise duygular, faiz, kur ve fon akımları belirler. Graham'ın ünlü sözüyle: piyasa kısa vadede bir oylama makinesi, uzun vadede bir tartı makinesidir.` },
        { tip: 'terim', terim: 'Temettü (kâr payı)', tanim: 'Şirketin kârının bir kısmını nakit olarak ortaklara dağıtması. Dağıtım günü hisse fiyatından temettü tutarı kadar düşülerek işlem başlar. Yani temettü "bedava para" değildir; değer şirketten cebinize geçer.' },
        { tip: 'terim', terim: 'Bedelsiz sermaye artırımı', tanim: 'İç kaynaklardan (yedekler, sermaye düzeltmesi) yeni pay verilmesi. Pay sayısı artar, fiyat aynı oranda düzeltilir. **Şirketin değeri değişmez.** Türkiye\'de bedelsiz haberlerine aşırı tepki verilmesi tipik bir davranış hatasıdır.' },
        { tip: 'terim', terim: 'Bedelli sermaye artırımı', tanim: 'Ortaklardan yeni para toplanması. Yeni pay alma hakkı (rüçhan) kullanılmazsa payınız sulanır. Paranın nereye kullanılacağı (borç kapatma mı, yatırım mı) kritik sorudur.' },
        { tip: 'formul', ad: 'Bedelsiz sonrası düzeltilmiş fiyat', formul: 'Yeni fiyat = Eski fiyat ÷ (1 + bedelsiz oranı)', aciklama: '%100 bedelsizde 200 TL\'lik hisse 100 TL\'ye düşer; payınız iki katına çıkar. Toplam değer aynı kalır.' },
        { tip: 'ornek', baslik: 'Grafik okurken bedelsiz tuzağı', metin: 'Fiyat geçmişi düzeltilmemiş bir grafikte %100 bedelsiz, %50\'lik bir "çöküş" gibi görünür. Arşivinizdeki fiyat verileri İş Yatırım ve Yahoo kaynaklıdır; düzeltme yöntemleri farklıdır. Bir hisseyi analiz ederken önce geçmişin düzeltilmiş olup olmadığını kontrol edin.', kaynak: 'bist_veri/hisseler (İş Yatırım + Yahoo Finance birleşimi)' },
      ],
      quiz: [
        { soru: '%200 bedelsiz sermaye artırımında 300 TL\'lik hissenin düzeltilmiş fiyatı nedir?', secenekler: ['100 TL', '150 TL', '300 TL', '900 TL'], dogru: 0, aciklama: '`300 ÷ (1 + 2) = 100`.' },
        { soru: 'Bedelsiz sermaye artırımı şirketin değerini nasıl etkiler?', secenekler: ['Artırır', 'Azaltır', 'Doğrudan değiştirmez', 'İkiye katlar'], dogru: 2, aciklama: 'Pastanın dilim sayısı artar, pastanın büyüklüğü aynı kalır.' },
        { soru: 'Temettü dağıtım günü hisse fiyatına ne olur?', secenekler: ['Temettü kadar artar', 'Temettü kadar düşülerek açılır', 'Değişmez', 'İşleme kapanır'], dogru: 1, aciklama: 'Nakit şirketten çıktığı için şirket o kadar daha az değerlidir.' },
        { soru: 'Şirket iflas ederse pay sahibi alacak sırasında nerededir?', secenekler: ['İlk sırada', 'Alacaklılardan sonra, en sonda', 'Devletten önce', 'Bankalarla eşit'], dogru: 1, aciklama: 'Özkaynak, borçlardan sonra gelen artık haktır.' },
        { soru: 'Bedelli sermaye artırımında en kritik soru hangisidir?', secenekler: ['Fiyat kaç TL olacak', 'Toplanan para ne için kullanılacak', 'Kaç gün sürecek', 'Hangi aracı kurum'], dogru: 1, aciklama: 'Borç kapatmak için toplanan para ile kârlı yatırım için toplanan para çok farklı sinyallerdir.' },
      ],
      gorev: { baslik: 'Bir şirketin temettü geçmişine bakın', adimlar: ['KAP\'ta (kap.org.tr) takip ettiğiniz bir BIST şirketini açın.', '"Kâr Payı Dağıtım İşlemlerine İlişkin Bildirim" türünde son bildirimi bulun.', 'Pay başına brüt temettüyü, hak kullanım tarihini ve o günkü fiyatı not edin; temettü verimini hesaplayın.', 'Varsa son bedelsiz sermaye artırımının oranını ve tarihini yazın.'] },
      kaynaklar: [{ ad: 'KAP: Kamuyu Aydınlatma Platformu', url: 'https://www.kap.org.tr' }, { ad: '6102 sayılı Türk Ticaret Kanunu (pay sahipliği hakları)' }, { ad: 'Graham, B.: The Intelligent Investor, Bölüm 8' }],
    },
    {
      id: '1-09', seviye: 1, baslik: 'Yatırım fonları: TEFAS, türler, maliyet, vergi', beceri: 'piyasa', dakika: 7,
      bolumler: [
        { tip: 'metin', metin: `**Yatırım fonu**, birçok yatırımcının parasının bir portföy yönetim şirketi tarafından belirli bir strateji ile yönetilmesidir. Fon varlıkları yönetim şirketinden ayrı tutulur ve saklayıcıda korunur; bu, yönetim şirketi batsa bile fon varlıklarının korunması demektir. SPK denetler.

**TEFAS** (Türkiye Elektronik Fon Alım Satım Platformu) farklı kurumların fonlarına tek bir hesaptan erişim sağlar. Fon türlerine örnekler:

- **Para piyasası fonu:** Kısa vadeli, düşük riskli. Mevduata alternatif.
- **Borçlanma araçları fonu:** Tahvil ve bono. Faiz değişimine duyarlı.
- **Hisse senedi (yoğun) fonu:** En az %80 hisse.
- **Değişken / karma fon:** Yönetici dağılımı serbestçe değiştirebilir.
- **Kıymetli madenler fonu:** Altın vb.
- **Fon sepeti fonu:** Başka fonlara yatırım yapar.

Her fonun bir **risk değeri** (1-7) vardır. Bu değer, fonun geçmiş oynaklığına göre belirlenir.` },
        { tip: 'terim', terim: 'Yönetim ücreti', tanim: 'Fonun yıllık olarak varlıklarından aldığı ücret. Fiyata zaten yansımış olarak gelir; ayrıca ödemezsiniz ama getiriden her gün düşer. Uzun vadede yönetim ücreti getiriyi ciddi şekilde törpüler.' },
        { tip: 'uyari', metin: 'Fon stopajı fon türüne ve alım tarihine göre farklıdır; hisse senedi yoğun fonlarda genelde farklı (daha düşük) bir oran uygulanır. Ayarlar ekranında, veri hattının çektiği stopaj tablosunu referans olarak görebilirsiniz.' },
        { tip: 'ornek', baslik: 'Geçmiş getiri tuzağı', metin: 'Bir fonun "son 1 yılda %150" getirisi, çoğu zaman o yılın en çok yükselen temasının (ör. teknoloji, halka arz) sonucudur. Araştırmalar, geçmiş yılın en iyi fonlarının sonraki yıllarda bu başarıyı tutarlı biçimde sürdüremediğini gösterir. ABD\'de bu, S&P\'nin düzenli yayımladığı SPIVA "persistence" raporlarıyla belgelenir.', kaynak: 'S&P Dow Jones Indices: SPIVA Persistence Scorecard' },
      ],
      quiz: [
        { soru: 'Fonun yönetim ücretini yatırımcı nasıl öder?', secenekler: ['Her ay ayrı fatura ile', 'Fon fiyatına yansımış olarak, sürekli', 'Sadece satarken', 'Ödemez'], dogru: 1, aciklama: 'Ücret fon varlıklarından günlük tahakkuk eder.' },
        { soru: 'Portföy yönetim şirketi batarsa fon varlıklarına ne olur?', secenekler: ['Kaybolur', 'Saklayıcıda ayrı tutulduğu için korunur', 'Devlete geçer', 'Yarıya iner'], dogru: 1, aciklama: 'Fon varlıkları yönetim şirketinin mal varlığından ayrıdır.' },
        { soru: 'Mevduata en yakın risk profiline sahip fon türü hangisidir?', secenekler: ['Hisse senedi fonu', 'Para piyasası fonu', 'Değişken fon', 'Serbest fon'], dogru: 1, aciklama: 'Çok kısa vadeli araçlara yatırım yapar.' },
        { soru: 'Geçen yılın en yüksek getirili fonunu almak neden riskli bir yöntemdir?', secenekler: ['Fonlar yasal olarak bunu yasaklar', 'Geçmiş getiri, gelecek getiriyi tutarlı şekilde öngörmez ve genelde tek bir temanın yansımasıdır', 'Vergi daha yüksektir', 'Komisyon daha yüksektir'], dogru: 1, aciklama: 'Performans sürekliliği zayıftır.' },
      ],
      gorev: { baslik: 'İki fonu karşılaştırın', adimlar: ['TEFAS\'ta aynı kategoriden iki fon seçin (uygulamadaki fon listesinden de seçebilirsiniz).', 'Her birinin risk değerini, yıllık yönetim ücretini, fon büyüklüğünü ve 1/3 yıllık getirisini yazın.', 'Fon izahnamesinden/yatırımcı bilgi formundan stratejiyi tek cümleyle özetleyin.', 'Hangisini neden tercih ederdiniz? Geçmiş getiri dışında bir gerekçe yazın.'] },
      kaynaklar: [{ ad: 'TEFAS', url: 'https://www.tefas.gov.tr' }, SPK, { ad: 'SPIVA Persistence Scorecard', url: 'https://www.spglobal.com/spdji/en/research-insights/spiva/' }],
    },
    {
      id: '1-10', seviye: 1, baslik: 'Risk ve getiri', beceri: 'risk', dakika: 8,
      bolumler: [
        { tip: 'metin', metin: `Finansın en temel ilişkisi şudur: **beklenen getiri, üstlenilen riskin karşılığıdır.** Risksiz yüksek getiri vaat eden her şey ya yanlış anlaşılmıştır ya da gizli bir risk taşır ya da dolandırıcılıktır.

**Risk** finansta genellikle **oynaklık (volatilite)** ile ölçülür: getirilerin ortalamadan ne kadar saptığı (standart sapma). Ama yatırımcı için asıl risk **kalıcı sermaye kaybı** ve **ihtiyaç anında düşük fiyattan satmak zorunda kalmaktır.**

Riskin türleri:

- **Piyasa riski:** Bütün piyasanın düşmesi. Çeşitlendirmeyle giderilemez.
- **Şirkete özgü risk:** Tek bir şirketin batması. Çeşitlendirmeyle azaltılabilir.
- **Kur riski, faiz riski, enflasyon riski.**
- **Likidite riski:** İstediğiniz anda makul fiyattan satamamak.` },
        { tip: 'formul', ad: 'Düşüşten geri dönüş', formul: 'Gereken getiri = 1 ÷ (1 − kayıp) − 1', aciklama: '%50 kaybı telafi etmek için %100 kazanç gerekir; %80 kayıptan dönmek için %400. Büyük kayıplardan kaçınmak, büyük kazanç kovalamaktan daha önemlidir.' },
        { tip: 'terim', terim: 'Korelasyon', tanim: 'İki varlığın birlikte hareket etme derecesi (−1 ile +1 arası). Düşük korelasyonlu varlıkları birleştirmek, getiriden aynı oranda vazgeçmeden riski azaltabilir. Ama kriz anlarında korelasyonlar genellikle artar.' },
        { tip: 'ornek', baslik: 'Kendi testlerinizden: getiri tek başına yetmez', metin: 'Arşivinizdeki Tur 4 hisse stratejisi adayı doğrulama döneminde %−41,7 düşüş (max drawdown) yaşadı ve altını geçemedi. Yüksek getiri vaat eden stratejiyi değerlendirirken ilk bakılacak şey, kötü dönemde ne kadar kaybettirdiği ve bu kayba dayanıp dayanamayacağınızdır.', kaynak: 'Kendi backtest arşiviniz: bist_veri/bt/on_kayit_4.md' },
      ],
      quiz: [
        { soru: '%60 düşen bir hissenin eski seviyesine dönmesi için kaç kazanç gerekir?', secenekler: ['%60', '%120', '%150', '%40'], dogru: 2, aciklama: '`1 ÷ 0,4 − 1 = 1,5`.' },
        { soru: 'Hangi risk çeşitlendirmeyle azaltılamaz?', secenekler: ['Şirkete özgü risk', 'Piyasa (sistematik) riski', 'Tek şirketin iflası', 'Yönetim hatası'], dogru: 1, aciklama: 'Tüm piyasayı etkileyen şoklar çeşitlendirmeyle giderilemez.' },
        { soru: '"Aylık %10 garanti getiri, risk yok" teklifi için en doğru yaklaşım hangisidir?', secenekler: ['Hemen yatırım yapmak', 'Garanti olduğu için az yatırmak', 'Gizli risk veya dolandırıcılık varsaymak ve uzak durmak', 'Arkadaşlara önermek'], dogru: 2, aciklama: 'Risksiz getiri, risksiz faiz civarındadır; çok üstü bir vaat kırmızı bayraktır.' },
        { soru: 'Kriz dönemlerinde varlıklar arası korelasyonlar genellikle nasıl davranır?', secenekler: ['Azalır', 'Artar', 'Sıfırlanır', 'Değişmez'], dogru: 1, aciklama: 'Panikte "her şey birlikte düşer"; çeşitlendirmenin faydası tam ihtiyaç anında azalabilir.' },
      ],
      gorev: { baslik: 'Kendi risk toleransınızı yazın', adimlar: ['Portföyünüz bir yılda %20, %35 ve %50 düşse her durumda ne yapacağınızı dürüstçe yazın.', 'Bu paraya ne zaman ihtiyacınız olacağını yazın (vade).', 'Sanal portföyde ilk alımı yapmadan önce tek bir pozisyonda kabul edeceğiniz en büyük kaybı belirleyin; Ayarlar\'daki pozisyon üst sınırını buna göre ayarlayın.'] },
      kaynaklar: [{ ad: 'Bodie, Kane, Marcus: Investments, Bölüm 5-6' }, SPK],
    },
  ],
  sinavEk: [
    { soru: 'Politika faizi %38, yıllık TÜFE %33. Reel politika faizi yaklaşık nedir?', secenekler: ['%5', '%3,8', '%71', '%−5'], dogru: 1, aciklama: '`1,38 ÷ 1,33 − 1 ≈ 0,0376`.' },
    { soru: 'Ons sabitken TL değer kaybederse gram altın ve dolar bazlı BIST endeksi (hisse fiyatları sabitken) ne yapar?', secenekler: ['İkisi de artar', 'Gram altın artar, dolar bazlı BIST düşer', 'İkisi de düşer', 'Gram altın düşer, BIST artar'], dogru: 1, aciklama: 'Gram altın kurla artar; TL fiyatı sabit hisse dolar bazında değer kaybeder.' },
    { soru: 'Bir yatırımcı yıl boyunca %45 nominal kazandı, TÜFE %45. Doğru yorum hangisi?', secenekler: ['Çok başarılı bir yıl', 'Alım gücü korundu, reel kazanç yok', 'Reel kayıp %45', 'Reel kazanç %45'], dogru: 1, aciklama: 'Reel getiri sıfır.' },
  ],
}
