import type { Seviye } from './tipler'
import ornekler from './ornekler.json'

// Tüm şirket rakamları ornekler.json'dan gelir (veri_hatti/ornek_sirketler.py ile üretildi). Metne elle rakam yazılmaz.
type S = { pay_sayisi_mn: number; ilk_aciklama: string; mn_tl: Record<string, number>; oran: Record<string, number | null> }
const O = ornekler.sirketler as unknown as Record<string, S>
const mlr = (kod: string, k: string) => (O[kod].mn_tl[k] / 1000).toLocaleString('tr-TR', { maximumFractionDigits: 1 }) + ' milyar TL'
const x = (kod: string, k: string, h = 2) => { const v = O[kod].oran[k]; return v === null ? 'hesaplanamaz' : v.toLocaleString('tr-TR', { maximumFractionDigits: h }) }
const yz = (kod: string, k: string) => { const v = O[kod].oran[k]; return v === null ? '—' : '%' + Math.round(v * 100) }
const KAYNAK = (kod: string) => `İş Yatırım mali tablo verisi, ${kod} ${ornekler.donem} (KAP ilk açıklama ${O[kod].ilk_aciklama}); çarpanlar ${ornekler.fiyat_tarihi} kapanış fiyatıyla (borsapy). Tutarlar TMS 29 enflasyon düzeltmeli. Hesaplama: veri_hatti/ornek_sirketler.py`
const KAP = { ad: 'KAP: Finansal raporlar ve bildirimler', url: 'https://www.kap.org.tr' }
const KGK = { ad: 'KGK: TFRS/TMS standartları (TMS 1, TMS 7, TMS 29, TFRS 16)', url: 'https://www.kgk.gov.tr' }
const DAMO = { ad: 'Damodaran, A.: Investment Valuation (3. baskı)' }

export const SEVIYE3: Seviye = {
  no: 3, ad: 'Temel analiz', amac: 'Mali tabloları okumak, oranları doğru hesaplayıp yorumlamak, bir şirketi kabaca değerlemek ve KAP bildirimlerini anlamak.',
  dersler: [
    {
      id: '3-01', seviye: 3, baslik: 'Bilanço: varlıklar, borçlar, özkaynak', beceri: 'temel_analiz', dakika: 9,
      bolumler: [
        { tip: 'metin', metin: `**Bilanço (finansal durum tablosu)**, şirketin belirli bir gündeki fotoğrafıdır: neye sahip (varlıklar) ve bunu nasıl finanse etmiş (borçlar + özkaynak).` },
        { tip: 'formul', ad: 'Bilanço eşitliği', formul: 'Varlıklar = Yükümlülükler + Özkaynaklar', aciklama: 'Her zaman eşittir. Özkaynak, varlıklardan borçlar düşüldükten sonra ortaklara kalan haktır.' },
        { tip: 'metin', metin: `**Dönen varlıklar** bir yıl içinde nakde dönmesi beklenenlerdir: nakit, ticari alacaklar, stoklar. **Duran varlıklar** uzun ömürlüdür: maddi duran varlıklar (fabrika, uçak), maddi olmayanlar, kullanım hakkı varlıkları.

Yükümlülükler de kısa ve uzun vadeli olarak ayrılır. En kritik kalem **finansal borçlardır** (banka kredisi, tahvil, kiralama yükümlülüğü). Ticari borçlar (tedarikçilere borç) ise faizsiz bir finansman kaynağıdır.

Bilançoyu okurken üç soru sorun:
- Varlıkların ne kadarı gerçekten nakit üretiyor?
- Borçlar ne kadar, vadesi ne zaman ve hangi para biriminden?
- Özkaynağın varlıklara oranı ne kadar? Bu oran şirketin şoklara dayanıklılığını gösterir.` },
        { tip: 'ornek', baslik: 'THYAO bilançosu', metin: `Türk Hava Yolları'nın toplam varlıkları **${mlr('THYAO', 'toplam_varlik')}**, ana ortaklık özkaynağı **${mlr('THYAO', 'ozkaynak_ana')}**. Özkaynak/varlık oranı **${yz('THYAO', 'ozk_varlik')}**. Finansal borçlar **${mlr('THYAO', 'finansal_borc')}** ve bunun büyük kısmı uçak kiralamalarından gelir. TFRS 16 uyarınca kiralanan uçaklar "kullanım hakkı varlığı" olarak aktifte, kira yükümlülükleri ise finansal borç olarak pasifte gösterilir. Yani havayolu şirketinde "borç" büyük ölçüde filonun kendisidir. Bunu bilmeden borç rakamına bakmak yanıltır.`, kaynak: KAYNAK('THYAO') },
        { tip: 'terim', terim: 'TFRS 16 (kiralamalar)', tanim: 'Kiralanan varlıkların bilançoya varlık ve borç olarak yazılmasını gerektiren standart. Perakende (mağaza kiraları) ve havacılıkta borçluluğu ve FAVÖK\'ü belirgin şekilde etkiler.' },
      ],
      quiz: [
        { soru: 'Varlıklar 500, yükümlülükler 300 ise özkaynak kaçtır?', secenekler: ['800', '200', '300', '500'], dogru: 1, aciklama: '`500 − 300 = 200`.' },
        { soru: 'THYAO\'nun finansal borçlarının büyük kısmının kaynağı nedir?', secenekler: ['Temettü borcu', 'Uçak kiralama yükümlülükleri (TFRS 16) ve filo finansmanı', 'Vergi borcu', 'Ticari borçlar'], dogru: 1, aciklama: 'Kullanım hakkı varlıklarının karşılığı kira yükümlülükleridir.' },
        { soru: 'Ticari borçların finansal borçlardan farkı nedir?', secenekler: ['Daha pahalıdır', 'Genelde faizsiz tedarikçi finansmanıdır', 'Uzun vadelidir', 'Fark yoktur'], dogru: 1, aciklama: 'Tedarikçiye vadeli ödeme, faiz taşımaz.' },
        { soru: 'Özkaynak/varlık oranı yüksek bir şirket için genel yorum ne olur?', secenekler: ['Daha kırılgan', 'Şoklara karşı daha dayanıklı (daha az borçlu)', 'Daha kârlı', 'Daha ucuz'], dogru: 1, aciklama: 'Borç yükü düşüktür; kârlılık ve ucuzluk ayrı sorulardır.' },
      ],
      gorev: { baslik: 'Bir bilanço okuyun', adimlar: ['KAP\'ta BIMAS veya ASELS\'in son finansal raporunu açın.', 'Toplam varlık, özkaynak, kısa ve uzun vadeli finansal borç ve nakit rakamlarını yazın.', 'Özkaynak/varlık oranını hesaplayın ve THYAO ile karşılaştırın. Farkın sektörle ilgisini tek cümleyle açıklayın.'] },
      kaynaklar: [KAP, KGK, { ad: 'TMS 1: Finansal tabloların sunuluşu' }],
    },
    {
      id: '3-02', seviye: 3, baslik: 'Gelir tablosu: hasılattan net kâra', beceri: 'temel_analiz', dakika: 9,
      bolumler: [
        { tip: 'metin', metin: `**Gelir tablosu**, bir dönem boyunca (çeyrek veya yıl) şirketin ne kazandığını gösteren filmdir. Kalemler yukarıdan aşağı akar:

- **Hasılat (satış gelirleri)**
- − Satışların maliyeti = **Brüt kâr**
- − Pazarlama, genel yönetim, Ar-Ge giderleri = **Esas faaliyet kârı**
- ± Diğer faaliyet gelir/giderleri, yatırım faaliyetleri, finansman gelir/giderleri, (TMS 29 ile) net parasal pozisyon kazanç/kaybı
- = Vergi öncesi kâr, − vergi = **Net dönem kârı**
- Bunun **ana ortaklık payları** kısmı, hisse sahibine düşen kârdır.

Analistin ilk işi, kârın **ne kadarının esas faaliyetten**, ne kadarının tekrar etmeyecek kalemlerden geldiğini ayırmaktır.` },
        { tip: 'ornek', baslik: 'THYAO: net kâr esas faaliyet kârından büyük', metin: `THYAO'nun hasılatı **${mlr('THYAO', 'hasilat')}**, brüt kârı **${mlr('THYAO', 'brut_kar')}** (brüt marj ${yz('THYAO', 'brut_marj')}), esas faaliyet kârı **${mlr('THYAO', 'esas_faaliyet_kari')}**. Buna karşın ana ortaklık net kârı **${mlr('THYAO', 'net_kar_ana')}**. Yani net kâr esas faaliyet kârından büyük. Aradaki fark esas faaliyet dışından geliyor: tabloda diğer faaliyet gelirleri (net) yaklaşık 31 milyar TL, yatırım faaliyetlerinden net gelir yaklaşık 64 milyar TL görünüyor. Bu kalemlerin her yıl tekrar edip etmeyeceğini sormadan net kâr üzerinden F/K hesaplamak, şirketi olduğundan ucuz gösterebilir.`, kaynak: KAYNAK('THYAO') },
        { tip: 'terim', terim: 'Tek seferlik kalemler', tanim: 'Varlık satış kârı, değer düşüklüğü, dava tazminatı gibi tekrar etmesi beklenmeyen gelir ve giderler. "Normalleştirilmiş kâr" hesaplanırken çıkarılır.' },
        { tip: 'uyari', metin: 'Çeyreklik raporlarda tablolar genellikle kümülatif verilir (ör. 9 aylık). Tek çeyreği bulmak için önceki dönemi çıkarmanız gerekir. Ancak TMS 29 nedeniyle her rapor kendi tarihinin satın alma gücüne göre yeniden ifade edilir. Bu yüzden basit çıkarma küçük hatalar üretir.' },
      ],
      quiz: [
        { soru: 'Hasılat 1.000, satış maliyeti 700, faaliyet giderleri 150. Esas faaliyet kârı nedir?', secenekler: ['300', '150', '850', '450'], dogru: 1, aciklama: 'Brüt kâr 300; `300 − 150 = 150`.' },
        { soru: 'Hisse sahibine düşen kâr hangi satırdır?', secenekler: ['Brüt kâr', 'Esas faaliyet kârı', 'Ana ortaklık payına düşen net kâr', 'Hasılat'], dogru: 2, aciklama: 'Azınlık payları çıkarıldıktan sonraki net kâr.' },
        { soru: 'Net kârın esas faaliyet kârından çok büyük olması ilk olarak neyi sorgulatmalı?', secenekler: ['Şirketin çok verimli olduğunu', 'Kârın tekrar etmeyecek veya faaliyet dışı kalemlerden gelip gelmediğini', 'Vergi oranının yüksek olduğunu', 'Hiçbir şeyi'], dogru: 1, aciklama: 'Kârın kalitesi ve sürdürülebilirliği sorgulanmalı.' },
        { soru: 'Brüt marj neyi ölçer?', secenekler: ['Satışlardan üretim/alış maliyeti düşüldükten sonra kalan payı', 'Net kârı', 'Borçluluğu', 'Temettüyü'], dogru: 0, aciklama: '`Brüt kâr ÷ Hasılat`. Fiyatlama gücünün ilk göstergesidir.' },
      ],
      gorev: { baslik: 'Kârın kaynağını ayrıştırın', adimlar: ['KAP\'ta seçtiğiniz bir şirketin son yıllık gelir tablosunu açın.', 'Brüt kâr, esas faaliyet kârı, faaliyet dışı kalemler (toplam) ve net kârı bir tabloya yazın.', 'Net kârın yüzde kaçı esas faaliyetten geliyor? Kalan kısmın ne olduğunu dipnotlardan bulmaya çalışın.'] },
      kaynaklar: [KAP, KGK, { ad: 'Penman, S.: Financial Statement Analysis and Security Valuation' }],
    },
    {
      id: '3-03', seviye: 3, baslik: 'Nakit akış tablosu ve kârın kalitesi', beceri: 'temel_analiz', dakika: 8,
      bolumler: [
        { tip: 'metin', metin: `"Kâr bir görüştür, nakit bir gerçektir." Gelir tablosu tahakkuk esasına dayanır: satış faturası kesilince gelir yazılır, para gelmese bile. **Nakit akış tablosu** (TMS 7) ise kasaya fiilen ne girip çıktığını üç bölümde gösterir:

- **İşletme faaliyetlerinden nakit:** Asıl işin ürettiği nakit.
- **Yatırım faaliyetlerinden nakit:** Makine, tesis ve uçak alımları (yatırım harcaması, capex), iştirak alım ve satışları.
- **Finansman faaliyetlerinden nakit:** Borç alma/ödeme, temettü, sermaye artırımı.` },
        { tip: 'formul', ad: 'Serbest nakit akışı (basit)', formul: 'SNA = İşletme faaliyetlerinden nakit − Yatırım harcamaları', aciklama: 'Şirketin büyümesini sürdürdükten sonra ortaklara ve borç ödemeye kalan nakit. Değerlemenin özü budur. (İş Yatırım\'ın verdiği "serbest nakit akım" tanımı bundan biraz farklı olabilir.)' },
        { tip: 'ornek', baslik: 'Dört şirkette kâr ve nakit', metin: `İşletme faaliyetlerinden gelen nakdi net kârla karşılaştıralım:

- **THYAO:** İşletme nakdi ${mlr('THYAO', 'isletme_nakit')}, net kâr ${mlr('THYAO', 'net_kar_ana')}. Yüksek amortisman (${mlr('THYAO', 'amortisman')}) nakdi kârın üzerine çıkarıyor. Ancak yatırım harcaması da ${mlr('THYAO', 'yatirim_harcamasi').replace('-', '')}.
- **EREGL:** Net kâr sadece ${mlr('EREGL', 'net_kar_ana')} ama işletme nakdi ${mlr('EREGL', 'isletme_nakit')}. Muhasebe kârı zayıf, nakit üretimi sürüyor.
- **ASELS:** İşletme nakdi ${mlr('ASELS', 'isletme_nakit')}, ama yatırım harcaması ${mlr('ASELS', 'yatirim_harcamasi').replace('-', '')}. Büyüme nakdin çoğunu tüketiyor.
- **BIMAS:** İşletme nakdi ${mlr('BIMAS', 'isletme_nakit')}, net kâr ${mlr('BIMAS', 'net_kar_ana')}.

Kalıcı olarak işletme nakdi net kârın çok altında kalan şirketlerde alacak ve stok şişmesine, yani kârın kalitesine dikkat edin.`, kaynak: KAYNAK('ASELS') },
      ],
      quiz: [
        { soru: 'İşletme nakdi 100, yatırım harcaması 70. Basit SNA kaçtır?', secenekler: ['170', '30', '70', '100'], dogru: 1, aciklama: '`100 − 70 = 30`.' },
        { soru: 'Net kâr sürekli artarken işletme nakdi negatif kalıyorsa ilk şüphe ne olmalı?', secenekler: ['Şirket çok başarılı', 'Alacaklar ve/veya stoklar şişiyor; kârın kalitesi zayıf olabilir', 'Vergi iadesi', 'Temettü ödemesi'], dogru: 1, aciklama: 'Kâr kâğıt üzerinde, nakit gelmiyor.' },
        { soru: 'Temettü ödemesi nakit akış tablosunun hangi bölümündedir?', secenekler: ['İşletme', 'Yatırım', 'Finansman', 'Hiçbiri'], dogru: 2, aciklama: 'Ortaklara yapılan ödemeler finansman faaliyetidir.' },
        { soru: 'Amortisman nakit çıkışı mıdır?', secenekler: ['Evet', 'Hayır, nakit dışı giderdir; asıl nakit çıkışı varlık alındığında olmuştur', 'Sadece bankalarda', 'Yılda bir kez'], dogru: 1, aciklama: 'Bu yüzden nakit akışında kâra geri eklenir.' },
      ],
      gorev: { baslik: 'Nakit kalitesi testi', adimlar: ['Seçtiğiniz şirketin son yıllık nakit akış tablosundan işletme nakdi, yatırım harcaması ve temettü ödemesini bulun.', 'SNA\'yı hesaplayın ve net kârla oranını (SNA ÷ net kâr) yazın.', 'Temettü SNA\'dan büyük mü? Büyükse temettü neyle finanse edilmiş (borç, nakit)?'] },
      kaynaklar: [KAP, { ad: 'TMS 7: Nakit akış tabloları' }, DAMO],
    },
    {
      id: '3-04', seviye: 3, baslik: 'Üç tablonun bağlantısı ve enflasyon muhasebesi (TMS 29)', beceri: 'temel_analiz', dakika: 8,
      bolumler: [
        { tip: 'metin', metin: `Üç tablo birbirine bağlıdır:

- Gelir tablosundaki **net kâr**, bilançodaki özkaynağa (geçmiş yıl kârları) eklenir. Temettü ise özkaynaktan düşer.
- Nakit akış tablosu net kârla başlar, nakit dışı kalemleri ve işletme sermayesi değişimini düzeltir ve bilançodaki **nakit değişimini** açıklar.
- Yatırım harcaması bilançoda duran varlıkları artırır. Amortisman ise gelir tablosunda gider, bilançoda varlık azalışıdır.

**TMS 29 (Yüksek enflasyonlu ekonomilerde finansal raporlama):** Türkiye'de 31.12.2023 tarihli tablolardan itibaren, KGK'nın duyurusuyla, şirketler tablolarını enflasyon düzeltmesiyle yayımlamaya başladı (bankalar ve bazı sektörler için düzenleyiciler ayrı kararlar aldı). Bunun sonuçları:

- Tüm tutarlar raporlama tarihinin satın alma gücüne çevrilir. Geçmiş dönem rakamları da yeni rapordaki karşılaştırmalı sütunda yeniden ifade edilir.
- **Net parasal pozisyon kazancı/kaybı** satırı ortaya çıkar. Parasal yükümlülüğü (borcu) fazla olan şirket enflasyonda "kazanç" yazar, nakdi fazla olan "kayıp" yazar.
- Duran varlıklar endekslenir; amortisman artar.` },
        { tip: 'uyari', metin: 'Farklı tarihlerde açıklanmış raporlardaki rakamları doğrudan karşılaştırmayın: her rapor kendi tarihinin TL\'si ile yazılmıştır. Arşivinizde 2022 ve 2025 civarında bu yüzden taban kırılması tespit edilmişti. Bu nedenle dönemler arası büyüme hesabı güvenilmez; aynı bildirim içindeki karşılaştırmalı sütunları kullanın.' },
        { tip: 'ornek', baslik: 'Bu derslerdeki oranlar neden tek rapordan?', metin: `Seviye 3 örneklerindeki tüm oranlar (F/K, PD/DD, FD/FAVÖK vb.) yalnızca **${ornekler.donem}** yıllık raporun kendi kalemlerinden hesaplandı. Hiçbir oran farklı tarihli raporların birleştirilmesiyle üretilmedi. Bu bilinçli bir seçim: arşivdeki taban kırılmalarını oranlara taşımamak için.`, kaynak: 'veri_hatti/ornek_sirketler.py; bist_veri tur 4 notları' },
      ],
      quiz: [
        { soru: 'Net kâr bilançoda nereye gider?', secenekler: ['Nakde', 'Özkaynak (geçmiş yıl kârları/dönem kârı)', 'Borçlara', 'Stoklara'], dogru: 1, aciklama: 'Dağıtılmayan kâr özkaynağı büyütür.' },
        { soru: 'TMS 29 altında net parasal yükümlülüğü yüksek bir şirket genellikle ne raporlar?', secenekler: ['Net parasal pozisyon kaybı', 'Net parasal pozisyon kazancı', 'Hiçbir şey', 'Kur farkı kaybı'], dogru: 1, aciklama: 'Enflasyon borcun reel değerini eritir.' },
        { soru: 'İki farklı yılın raporlarından hasılatları alıp büyüme hesaplamak neden yanıltıcı olabilir?', secenekler: ['Raporlar farklı para birimi kullanır', 'Her rapor kendi tarihinin satın alma gücüyle ifade edildiği için taban farklıdır', 'Hasılat gizlidir', 'Yanıltıcı değildir'], dogru: 1, aciklama: 'Aynı raporun karşılaştırmalı sütununu kullanın.' },
        { soru: 'Amortisman bilançoyu nasıl etkiler?', secenekler: ['Nakdi azaltır', 'Duran varlıkların net değerini azaltır', 'Borcu artırır', 'Etkilemez'], dogru: 1, aciklama: 'Birikmiş amortisman varlığın defter değerini düşürür.' },
      ],
      gorev: { baslik: 'Parasal kazanç/kayıp satırını bulun', adimlar: ['Seçtiğiniz şirketin son yıllık raporunda "net parasal pozisyon kazançları/kayıpları" satırını bulun.', 'Tutarı ve vergi öncesi kâra oranını yazın.', 'Şirketin borçlu mu nakit zengini mi olduğuyla bu satırın işaretini ilişkilendirin.'] },
      kaynaklar: [{ ad: 'TMS 29: Yüksek Enflasyonlu Ekonomilerde Finansal Raporlama' }, KGK, KAP],
    },
    {
      id: '3-05', seviye: 3, baslik: 'F/K (fiyat/kazanç) oranı', beceri: 'temel_analiz', dakika: 8,
      bolumler: [
        { tip: 'formul', ad: 'F/K', formul: 'F/K = Piyasa değeri ÷ Net kâr (ana ortaklık)  =  Fiyat ÷ Hisse başına kâr', aciklama: 'Şirketin bugünkü kârıyla kendini kaç yılda "geri ödediğinin" kaba ölçüsü. Tersi (K/F) kazanç verimidir; faizle kabaca karşılaştırılabilir.' },
        { tip: 'metin', metin: `F/K'yı tek başına "düşükse ucuz" diye okumak en yaygın hatadır. F/K düşük olabilir çünkü:

- Kâr tek seferlik kalemlerle şişmiştir.
- Şirket döngünün zirvesindedir.
- Piyasa kârın düşeceğini fiyatlıyordur.
- Yönetim, kur riski veya borç gibi gerçek bir risk vardır.

F/K yüksek olabilir çünkü kâr geçici olarak çökmüştür ya da piyasa yüksek büyüme bekliyordur. Doğru kullanım şudur: **benzer şirketlerle**, **şirketin kendi geçmişiyle** ve **büyüme ile birlikte** karşılaştırmak. Ayrıca son 12 aylık (TTM) kâr veya beklenen kâr kullanmak gerekir.` },
        { tip: 'ornek', baslik: 'Beş şirkette F/K', metin: `${ornekler.fiyat_tarihi} fiyatları ve ${ornekler.donem} yıllık kârla:

- THYAO **${x('THYAO', 'FK', 1)}**
- BIMAS **${x('BIMAS', 'FK', 1)}**
- TUPRS **${x('TUPRS', 'FK', 1)}**
- ASELS **${x('ASELS', 'FK', 1)}**
- EREGL **${x('EREGL', 'FK', 0)}**

EREGL'in F/K'sı anlamsız: kâr sıfıra yakın (${mlr('EREGL', 'net_kar_ana')}). THYAO'nun çok düşük F/K'sı kısmen esas faaliyet dışı kârdan (ders 3-02) ve havacılığın döngüsel, borçlu yapısından kaynaklanıyor. ASELS'in yüksek F/K'sı ise piyasanın savunma sanayiinde güçlü büyüme beklediğini gösteriyor.

Dikkat: fiyat Ekim 2026'dan, kâr 2025 yılından. Arada açıklanan 2026 çeyrek sonuçları kullanılmadığı için bu bir öğretim örneğidir, güncel değerleme değildir.`, kaynak: KAYNAK('THYAO') },
      ],
      quiz: [
        { soru: 'Piyasa değeri 200 milyar, net kâr 20 milyar. F/K ve kazanç verimi kaçtır?', secenekler: ['10 ve %10', '20 ve %5', '0,1 ve %10', '10 ve %20'], dogru: 0, aciklama: '`200 ÷ 20 = 10`; `1 ÷ 10 = %10`.' },
        { soru: 'Kârı neredeyse sıfır olan bir şirkette F/K için doğru yorum hangisidir?', secenekler: ['Çok pahalı', 'Oran anlamsızlaşır; PD/DD, FD/FAVÖK veya normalleşmiş kâr kullanılmalı', 'Çok ucuz', 'Temettü yüksek'], dogru: 1, aciklama: 'Payda sıfıra yaklaşınca oran sonsuza gider.' },
        { soru: 'Döngüsel bir şirketin F/K\'sı tarihi dibinde. En dikkatli yorum hangisidir?', secenekler: ['Kesin ucuz, almak gerekir', 'Döngü zirvesinde olabiliriz; kârın sürdürülebilirliğini sorgula', 'Şirket batıyor', 'Yorum yapılamaz'], dogru: 1, aciklama: 'Zirve kârı üzerinden hesaplanan F/K yanıltır.' },
        { soru: 'F/K hesaplamada en doğru kâr hangisidir?', secenekler: ['En yüksek çeyreğin 4 katı', 'Son 12 aylık (TTM) veya normalleşmiş ana ortaklık kârı', 'Brüt kâr', 'Hasılat'], dogru: 1, aciklama: 'Mevsimsellik ve tek seferlik kalemlerden arındırılmış bir kâr kullanılmalı.' },
      ],
      gorev: { baslik: 'Güncel F/K hesaplayın', adimlar: ['Uygulamadaki güncel fiyatla THYAO veya BIMAS için piyasa değerini hesaplayın (pay sayısı: THYAO 1.380 mn, BIMAS 600 mn).', 'KAP\'tan son 4 çeyreğin ana ortaklık net kârını bulup TTM kâr hesaplayın (TMS 29 tabanı nedeniyle yaklaşık olduğunu not edin).', 'Bulduğunuz F/K\'yı bu dersteki rakamla karşılaştırın ve farkın nedenini yazın.'] },
      kaynaklar: [DAMO, { ad: 'Graham & Dodd: Security Analysis (kazanç gücü)' }, KAP],
    },
    {
      id: '3-06', seviye: 3, baslik: 'PD/DD ve ROE', beceri: 'temel_analiz', dakika: 8,
      bolumler: [
        { tip: 'formul', ad: 'PD/DD ve ROE', formul: 'PD/DD = Piyasa değeri ÷ Ana ortaklık özkaynağı\nROE = Net kâr ÷ Özkaynak', aciklama: 'ROE için ideali ortalama özkaynaktır; burada dönem sonu özkaynak kullanıldı.' },
        { tip: 'metin', metin: `**PD/DD**, piyasanın şirketin muhasebe değerine kaç kat değer biçtiğini gösterir. PD/DD'yi **ROE** olmadan yorumlamak yanlıştır. Özkaynağı üzerinde yüksek getiri (ROE) üreten şirket, defter değerinin çok üstünde fiyatlanmayı hak eder.

Basit sezgi: ROE, yatırımcının istediği getirinin (özkaynak maliyeti) üstündeyse PD/DD 1'den büyük olmalıdır. Altındaysa 1'den küçük olabilir. Yani "PD/DD < 1 ise ucuzdur" kuralı, ROE düşükse geçerli değildir.

Yüksek enflasyonda bir uyarı daha: nominal ROE'yi enflasyonla karşılaştırın. %30 enflasyonda %13 ROE, reel olarak özkaynağın eridiğini gösterebilir. TMS 29 düzeltmeli tablolar bunu kısmen yansıtır.` },
        { tip: 'ornek', baslik: 'PD/DD - ROE eşleştirmesi', metin: `- **ASELS:** PD/DD ${x('ASELS', 'PDDD')}, ROE ${yz('ASELS', 'ROE')}
- **TUPRS:** PD/DD ${x('TUPRS', 'PDDD')}, ROE ${yz('TUPRS', 'ROE')}
- **BIMAS:** PD/DD ${x('BIMAS', 'PDDD')}, ROE ${yz('BIMAS', 'ROE')}
- **EREGL:** PD/DD ${x('EREGL', 'PDDD')}, ROE ${yz('EREGL', 'ROE')}
- **THYAO:** PD/DD ${x('THYAO', 'PDDD')}, ROE ${yz('THYAO', 'ROE')}

ASELS'in ROE'si THYAO'dan yüksek değil, ama PD/DD'si kat kat yüksek. Demek ki piyasa ASELS'te bugünkü ROE'yi değil, gelecekteki büyümeyi fiyatlıyor. THYAO'nun 0,3'lük PD/DD'si ise ya çok büyük bir fırsata ya da piyasanın havacılık riskine, borçluluğa ve kârın sürdürülebilirliğine şüpheyle bakmasına işaret ediyor. Hangisi olduğunu bulmak analistin işi.`, kaynak: KAYNAK('ASELS') },
      ],
      quiz: [
        { soru: 'Piyasa değeri 150, özkaynak 100, net kâr 20. PD/DD ve ROE kaçtır?', secenekler: ['1,5 ve %20', '0,67 ve %20', '1,5 ve %13', '7,5 ve %20'], dogru: 0, aciklama: '`150 ÷ 100 = 1,5`; `20 ÷ 100 = %20`.' },
        { soru: 'PD/DD 0,5 olan bir şirket hangi durumda "ucuz" olmayabilir?', secenekler: ['ROE özkaynak maliyetinin çok altındaysa', 'ROE çok yüksekse', 'Temettü yüksekse', 'Hiçbir zaman'], dogru: 0, aciklama: 'Düşük getirili özkaynak, defter değerinin altında fiyatlanmayı açıklayabilir.' },
        { soru: 'Yıllık enflasyon %30, şirketin ROE\'si %13. Bu ne düşündürmeli?', secenekler: ['Mükemmel kârlılık', 'Reel olarak özkaynak getirisi negatif olabilir', 'Vergi avantajı', 'Hiçbir şey'], dogru: 1, aciklama: 'Nominal getiri enflasyonun altında.' },
        { soru: 'ROE\'si benzer iki şirketten birinin PD/DD\'si çok daha yüksekse en olası açıklama nedir?', secenekler: ['Muhasebe hatası', 'Piyasanın o şirkette daha yüksek büyüme veya daha düşük risk fiyatlaması', 'Daha çok borç', 'Temettü'], dogru: 1, aciklama: 'Fark beklentilerdedir.' },
      ],
      gorev: { baslik: 'PD/DD-ROE haritası', adimlar: ['Uygulamadaki listeden 5 sanayi şirketi seçin ve KAP\'tan son yıllık özkaynak ve net kârlarını bulun.', 'Güncel fiyatla PD/DD ve ROE hesaplayın.', 'Bir tabloya yazıp "yüksek ROE / düşük PD/DD" çeyreğindeki şirketi bulun ve neden ucuz olabileceğine dair 3 olası gerekçe yazın.'] },
      kaynaklar: [DAMO, KAP],
    },
    {
      id: '3-07', seviye: 3, baslik: 'FD/FAVÖK ve firma değeri', beceri: 'temel_analiz', dakika: 8,
      bolumler: [
        { tip: 'formul', ad: 'Firma değeri ve FAVÖK', formul: `FD = Piyasa değeri + Net borç + Azınlık payları\nFAVÖK = ${ornekler.tanimlar.FAVOK}`, aciklama: '`Net borç = Finansal borçlar − Nakit − Kısa vadeli finansal yatırımlar`. Net borç negatifse (net nakit) FD piyasa değerinden küçüktür.' },
        { tip: 'metin', metin: `**FD/FAVÖK**, şirketin borcuyla birlikte tamamının, faaliyetten ürettiği nakde yakın kâra oranıdır. F/K'ya göre üstünlükleri şunlardır:

- Borçluluk farkını hesaba kattığı için farklı sermaye yapısındaki şirketleri karşılaştırmaya daha uygundur.
- Amortisman ve finansman giderinden etkilenmez.

Zayıf yanları:
- FAVÖK yatırım harcamasını yok sayar. Ağır yatırım isteyen sektörlerde (havacılık, çelik) FAVÖK nakdi abartır.
- Tanımlar kurumdan kuruma değişir: "diğer faaliyet gelirleri" dahil mi? TFRS 16 kira gideri FAVÖK'ü şişirir mi? (Kiralamalar FAVÖK'e yazılmaz, amortisman ve faize gider. Bu yüzden TFRS 16 FAVÖK'ü yükseltir, net borcu da artırır.)

**Mutlaka kendi tanımınızı yazın ve her şirkette aynısını uygulayın.**` },
        { tip: 'ornek', baslik: 'Net nakit ve net borç', metin: `- **TUPRS:** Net borç **${mlr('TUPRS', 'net_borc')}**, yani net nakit pozisyonunda. FD (${mlr('TUPRS', 'firma_degeri')}) piyasa değerinden (${mlr('TUPRS', 'piyasa_degeri')}) düşük; FD/FAVÖK **${x('TUPRS', 'FD_FAVOK', 1)}**.
- **THYAO:** Net borç **${mlr('THYAO', 'net_borc')}**, piyasa değerinin (${mlr('THYAO', 'piyasa_degeri')}) üzerinde. F/K ${x('THYAO', 'FK', 1)} iken FD/FAVÖK **${x('THYAO', 'FD_FAVOK', 1)}**.

Borç hesaba katılınca THYAO o kadar "ucuz" görünmüyor. Bu iki şirketin F/K'sını karşılaştırmak, FD/FAVÖK'ünü karşılaştırmaktan çok daha yanıltıcıdır. ASELS'in FD/FAVÖK'ü **${x('ASELS', 'FD_FAVOK', 1)}**: piyasa yüksek büyüme fiyatlıyor.`, kaynak: KAYNAK('TUPRS') },
      ],
      quiz: [
        { soru: 'Piyasa değeri 100, finansal borç 60, nakit 20. FD kaçtır (azınlık yok)?', secenekler: ['180', '140', '120', '80'], dogru: 1, aciklama: '`100 + (60 − 20) = 140`.' },
        { soru: 'Net nakdi olan bir şirkette FD ile piyasa değeri arasındaki ilişki nedir?', secenekler: ['FD > PD', 'FD < PD', 'Eşit', 'İlişki yok'], dogru: 1, aciklama: 'Negatif net borç FD\'yi küçültür.' },
        { soru: 'FAVÖK\'ün en büyük zayıflığı hangisidir?', secenekler: ['Borcu hesaba katması', 'Yatırım harcamalarını yok sayması', 'Vergiyi içermesi', 'Hasılatı içermemesi'], dogru: 1, aciklama: 'Ağır yatırım gerektiren sektörlerde nakdi abartır.' },
        { soru: 'TFRS 16 uygulaması FAVÖK\'ü nasıl etkiler?', secenekler: ['Düşürür', 'Yükseltir (kira gideri amortisman+faize dönüşür)', 'Etkilemez', 'Sıfırlar'], dogru: 1, aciklama: 'Kira gideri faaliyet giderlerinden çıkar; net borç da artar.' },
      ],
      gorev: { baslik: 'FD/FAVÖK hesaplayın', adimlar: ['Seçtiğiniz bir şirket için finansal borçları (KV+UV), nakit ve KV finansal yatırımları KAP\'tan bulun.', 'Güncel fiyatla FD\'yi, son yıllık tablodan FAVÖK\'ü (bu dersteki tanımla) hesaplayın.', 'Sonucu aynı sektörden bir başka şirketle karşılaştırın ve tanım farkı olup olmadığını kontrol edin.'] },
      kaynaklar: [DAMO, { ad: 'TFRS 16: Kiralamalar' }, KAP],
    },
    {
      id: '3-08', seviye: 3, baslik: 'Borçluluk, likidite ve kur riski', beceri: 'temel_analiz', dakika: 8,
      bolumler: [
        { tip: 'formul', ad: 'Temel borçluluk oranları', formul: 'Net borç / FAVÖK\nCari oran = Dönen varlıklar ÷ Kısa vadeli yükümlülükler\nFaiz karşılama = Esas faaliyet kârı ÷ Finansman giderleri', aciklama: 'Net borç/FAVÖK ~3\'ün üzerine çıktığında, sektöre göre değişmekle birlikte, borç yükü dikkat gerektirir.' },
        { tip: 'metin', metin: `Türkiye'de borçluluğun en kritik boyutu **para birimidir**. Mali tablo dipnotlarındaki **net yabancı para pozisyonu (net YPP)**, şirketin döviz varlıkları ile döviz yükümlülükleri arasındaki farktır.

- **Negatif net YPP (açık pozisyon):** TL değer kaybettikçe borç TL bazında büyür ve kur farkı gideri doğar. Ama şirketin döviz cinsinden geliri varsa (ihracatçı, havayolu) doğal bir korunma vardır.
- **Pozitif net YPP:** TL değer kaybından kazanç sağlar.

Analist "döviz borcu var mı" sorusunun yanında "döviz geliri var mı ve borçla eşleşiyor mu" diye de sormalıdır.` },
        { tip: 'ornek', baslik: 'Net YPP karşılaştırması', metin: `Hedge dahil net YPP:
- THYAO: **${mlr('THYAO', 'net_ypp')}**
- TUPRS: **${mlr('TUPRS', 'net_ypp')}**
- ASELS: **${mlr('ASELS', 'net_ypp')}**
- BIMAS: **${mlr('BIMAS', 'net_ypp')}**

THYAO'nun büyük açık pozisyonu ilk bakışta korkutucu görünür. Ancak gelirlerinin çok büyük kısmı döviz cinsindendir (yurt dışı satışlar), yani doğal korunması vardır. BIMAS ise neredeyse tamamen TL ile çalışan, kur riski düşük bir perakendeci. Net borç/FAVÖK: THYAO **${x('THYAO', 'net_borc_favok', 1)}**, EREGL **${x('EREGL', 'net_borc_favok', 1)}**, BIMAS **${x('BIMAS', 'net_borc_favok', 1)}**, TUPRS **${x('TUPRS', 'net_borc_favok', 1)}** (negatif: net nakit).`, kaynak: KAYNAK('THYAO') },
      ],
      quiz: [
        { soru: 'Net borç 300, FAVÖK 100. Net borç/FAVÖK kaçtır ve ne anlama gelir?', secenekler: ['3: borç, yaklaşık 3 yıllık FAVÖK\'e eşit', '0,33: düşük', '300: çok yüksek', 'Hesaplanamaz'], dogru: 0, aciklama: '`300 ÷ 100 = 3`. Kabaca, faaliyet nakdiyle borcu kapatma süresi.' },
        { soru: 'Net YPP\'si büyük ölçüde negatif ama gelirlerinin çoğu döviz olan bir şirket için doğru yorum hangisidir?', secenekler: ['Kesin çok riskli', 'Doğal korunma olabilir; gelir-borç eşleşmesine bakılmalı', 'Hiç risk yok', 'Kur kazancı garanti'], dogru: 1, aciklama: 'Döviz geliri döviz borcunu dengeleyebilir.' },
        { soru: 'Cari oranın 1\'in altında olması neye işaret edebilir?', secenekler: ['Kısa vadeli borçların dönen varlıklardan fazla olduğuna; likidite baskısı olabilir', 'Şirketin çok kârlı olduğuna', 'Borcun olmadığına', 'Hiçbir şeye'], dogru: 0, aciklama: 'Ancak perakende gibi sektörlerde negatif işletme sermayesi normal olabilir.' },
        { soru: 'Faiz karşılama oranı 1\'in altındaysa ne anlama gelir?', secenekler: ['Esas faaliyet kârı faiz giderini karşılamıyor', 'Çok sağlıklı', 'Borç yok', 'Temettü yüksek'], dogru: 0, aciklama: 'Faiz ödemek için yeni borç veya varlık satışı gerekebilir.' },
      ],
      gorev: { baslik: 'Kur riski dipnotunu okuyun', adimlar: ['Seçtiğiniz şirketin finansal raporunda "kur riski" veya "yabancı para pozisyonu" dipnotunu bulun.', 'Net YPP\'yi ve %10 kur artışının vergi öncesi kâra etkisini (duyarlılık tablosu) yazın.', 'Şirketin döviz geliri oranını faaliyet raporundan bulup bu riskle karşılaştırın.'] },
      kaynaklar: [KAP, { ad: 'TFRS 7: Finansal araçlar: açıklamalar (kur riski duyarlılığı)' }],
    },
    {
      id: '3-09', seviye: 3, baslik: 'Marjlar ve sektörel karşılaştırma', beceri: 'temel_analiz', dakika: 6,
      bolumler: [
        { tip: 'metin', metin: `Marjlar şirketin her 100 TL satıştan ne kadar kâr çıkardığını gösterir: **brüt marj**, **FAVÖK marjı**, **net marj**. Marjı farklı sektörler arasında karşılaştırmak anlamsızdır. Perakendeci düşük marj ve yüksek devir hızıyla çalışır, savunma şirketi yüksek marj ve uzun projelerle.

Doğru soru şudur: Bu şirket **kendi sektöründe** ve **kendi geçmişinde** marjını koruyabiliyor mu, artırabiliyor mu? Marj istikrarı **fiyatlama gücünün** (rekabet avantajı, "hendek") en iyi göstergelerinden biridir.` },
        { tip: 'ornek', baslik: 'Beş şirkette marjlar', metin: `Brüt / FAVÖK / net marj:
- **ASELS:** ${yz('ASELS', 'brut_marj')} / ${yz('ASELS', 'favok_marj')} / ${yz('ASELS', 'net_marj')}
- **THYAO:** ${yz('THYAO', 'brut_marj')} / ${yz('THYAO', 'favok_marj')} / ${yz('THYAO', 'net_marj')}
- **BIMAS:** ${yz('BIMAS', 'brut_marj')} / ${yz('BIMAS', 'favok_marj')} / ${yz('BIMAS', 'net_marj')}
- **TUPRS:** ${yz('TUPRS', 'brut_marj')} / ${yz('TUPRS', 'favok_marj')} / ${yz('TUPRS', 'net_marj')}
- **EREGL:** ${yz('EREGL', 'brut_marj')} / ${yz('EREGL', 'favok_marj')} / ${yz('EREGL', 'net_marj')}

BIMAS'ın %3'lük net marjı perakende için normaldir, kötü değildir. Değer, düşük marjın çok büyük hacimle çarpılmasından gelir. THYAO'da FAVÖK marjının brüt marjdan yüksek olması TFRS 16 ve yüksek amortismandan kaynaklanır: amortisman satış maliyetinin içindedir ve FAVÖK hesaplanırken geri eklenir.`, kaynak: KAYNAK('BIMAS') },
      ],
      quiz: [
        { soru: 'Perakendecinin %3 net marjı ile savunma şirketinin %17 net marjını karşılaştırıp "savunma daha iyi şirket" demek neden hatalıdır?', secenekler: ['Marjlar sektörün iş modeline bağlıdır; devir hızı ve sermaye ihtiyacı farklıdır', 'Marjlar yanlış hesaplanmıştır', 'Perakende vergisizdir', 'Hata değildir'], dogru: 0, aciklama: 'Marj × devir hızı = varlık getirisi (DuPont).' },
        { soru: 'Rekabet avantajının en iyi finansal göstergelerinden biri hangisidir?', secenekler: ['Yüksek borç', 'Yıllar içinde istikrarlı ve yüksek kalan marjlar', 'Yüksek hisse fiyatı', 'Çok sayıda bedelsiz'], dogru: 1, aciklama: 'Rakiplere rağmen marjı koruyabilmek fiyatlama gücünü gösterir.' },
        { soru: 'FAVÖK marjının brüt marjdan yüksek olması nasıl mümkün olur?', secenekler: ['Mümkün değildir', 'Satış maliyetindeki amortisman FAVÖK hesaplanırken geri eklendiği için', 'Vergi iadesiyle', 'Hata'], dogru: 1, aciklama: 'Amortisman ağırlıklı maliyet yapısında görülür.' },
      ],
      gorev: { baslik: 'Sektör içi karşılaştırma', adimlar: ['Aynı sektörden iki şirket seçin (ör. iki gıda perakendecisi veya iki otomotiv şirketi).', 'Son yıllık tablolardan brüt, FAVÖK ve net marjlarını hesaplayın.', 'Farkın nedeni hakkında faaliyet raporundan bir ipucu bulun (ürün karışımı, ölçek, ihracat, maliyet).'] },
      kaynaklar: [{ ad: 'Greenwald, B. ve ark.: Value Investing: From Graham to Buffett and Beyond (rekabet avantajı)' }, KAP],
    },
    {
      id: '3-10', seviye: 3, baslik: 'Bankalar neden farklı okunur?', beceri: 'temel_analiz', dakika: 8,
      bolumler: [
        { tip: 'metin', metin: `Bankada borç hammaddedir: mevduat toplar, kredi verir. Bu yüzden FAVÖK, FD/FAVÖK ve net borç/FAVÖK bankalarda anlamsızdır. Bankalar BDDK düzenlemelerine göre ayrı formatta tablolar yayımlar. Bankalar için TMS 29 uygulaması konusunda da BDDK ayrı kararlar almıştır; güncel durumu raporun dipnotundan kontrol edin.

Bankalarda bakılacak başlıca göstergeler:

- **Net faiz marjı (NIM):** Kredi faiz geliri ile mevduat faiz gideri arasındaki farkın aktiflere oranı. Faiz döngüsüne çok duyarlıdır: faizler hızla yükselince mevduat maliyeti kredilerden hızlı yeniden fiyatlandığı için NIM daralır.
- **Takipteki krediler (NPL) oranı ve karşılık oranı:** Aktif kalitesi.
- **Sermaye yeterlilik oranı (SYR):** Bankanın riskli varlıklarına karşı tuttuğu sermaye. Yasal sınırın ne kadar üzerinde olduğu önemlidir.
- **Ücret ve komisyon gelirleri:** Faizden bağımsız, daha istikrarlı gelir.
- **ROE ve PD/DD:** Banka değerlemesinin ana çifti.
- **Menkul kıymet portföyü:** TÜFE'ye endeksli tahvillerin getirisi, yüksek enflasyonda kârı geçici olarak şişirebilir.` },
        { tip: 'uyari', metin: 'Bu MVP\'nin örnek veri setinde banka tabloları yok (İş Yatırım banka formatı farklı). Banka örneklerini kendiniz KAP\'tan çalışacaksınız. Uygulama bu konuda size rakam uydurmaz.' },
      ],
      quiz: [
        { soru: 'Bankaların değerlemesinde neden FD/FAVÖK kullanılmaz?', secenekler: ['Bankalar FAVÖK açıklamaz ve borç (mevduat) onların hammaddesidir', 'Yasaktır', 'Bankalar kâr etmez', 'Kullanılır'], dogru: 0, aciklama: 'Borç bankada faaliyetin kendisidir.' },
        { soru: 'Faizlerin hızla yükseldiği bir dönemde bankaların net faiz marjı genellikle ne yapar?', secenekler: ['Mevduat daha hızlı yeniden fiyatlandığı için daralır', 'Hemen genişler', 'Değişmez', 'Sıfırlanır'], dogru: 0, aciklama: 'Kısa vadeli mevduat, uzun vadeli kredilerden önce yeniden fiyatlanır.' },
        { soru: 'Sermaye yeterlilik oranı neyi ölçer?', secenekler: ['Bankanın riskli varlıklarına karşı sermaye tamponunu', 'Mevduat miktarını', 'Şube sayısını', 'Temettüyü'], dogru: 0, aciklama: 'Kayıpları emme kapasitesini gösterir.' },
        { soru: 'Banka değerlemesinin ana oran çifti hangisidir?', secenekler: ['F/K ve FD/FAVÖK', 'ROE ve PD/DD', 'Cari oran ve stok devri', 'Brüt marj ve FAVÖK'], dogru: 1, aciklama: 'Özkaynak getirisi ile defter değeri çarpanı birlikte okunur.' },
      ],
      gorev: { baslik: 'Bir banka raporunu okuyun', adimlar: ['XBANK\'tan bir bankanın (ör. AKBNK, GARAN, YKBNK) son çeyrek "yatırımcı sunumunu" bankanın sitesinden indirin.', 'NIM, NPL oranı, SYR ve ROE\'yi bulun.', 'Bankanın PD/DD\'sini güncel fiyatla hesaplayıp ROE ile birlikte yorumlayın.'] },
      kaynaklar: [{ ad: 'BDDK: Bankacılık sektörü verileri', url: 'https://www.bddk.org.tr' }, { ad: 'Türkiye Bankalar Birliği istatistikleri', url: 'https://www.tbb.org.tr' }, KAP],
    },
    {
      id: '3-11', seviye: 3, baslik: 'Değerleme: çarpanlar ve basit indirgenmiş nakit akışı', beceri: 'temel_analiz', dakika: 10,
      bolumler: [
        { tip: 'metin', metin: `İki ana yaklaşım vardır:

**1. Göreceli değerleme (çarpanlar):** Benzer şirketlerin F/K, FD/FAVÖK ve PD/DD oranları alınır ve şirkete uygulanır. Hızlıdır, ama bütün sektör pahalıysa siz de pahalı bir rakam bulursunuz.

**2. Mutlak değerleme (İNA, indirgenmiş nakit akışı):** Şirketin gelecekteki serbest nakit akışları tahmin edilir ve bugüne indirgenir (ders 1-01). Teorik olarak doğrudur ama varsayımlara aşırı duyarlıdır.` },
        { tip: 'formul', ad: 'Sabit büyümeli değer (Gordon)', formul: 'Değer = SNA₁ ÷ (r − g)', aciklama: '`SNA₁` gelecek yılın serbest nakit akışı, `r` iskonto oranı (istenen getiri), `g` sonsuza kadar sabit büyüme. `g`, `r`\'ye yaklaştıkça değer patlar. Bu formülün en tehlikeli yanı budur.' },
        { tip: 'ornek', baslik: 'Varsayıma duyarlılık (öğretici sayılarla)', metin: 'Reel bazda çalışalım: SNA₁ = 10 milyar TL, reel iskonto oranı %10.\n\n- g = %2 ise değer `10 ÷ 0,08 = 125` milyar TL.\n- g = %4 ise `10 ÷ 0,06 ≈ 167` milyar TL.\n- r = %12, g = %2 ise `10 ÷ 0,10 = 100` milyar TL.\n\nBüyüme varsayımındaki 2 puanlık fark değeri üçte bir artırıyor. Profesyoneller tek bir rakam değil, bir **aralık** ve **senaryolar** üretir. Yüksek enflasyonlu ekonomide nominal ve reel karıştırılmamalıdır: ya her şey reel, ya her şey nominal.', kaynak: 'Öğretici hesaplama (gerçek şirket değil)' },
        { tip: 'terim', terim: 'Güvenlik marjı', tanim: 'Graham\'ın kavramı: tahmin ettiğiniz değer ile ödediğiniz fiyat arasındaki pay. Tahminleriniz kesin yanlış çıkacağı için, ancak belirgin bir iskontoyla almak hatalara karşı tampon sağlar.' },
        { tip: 'uyari', metin: 'Kendi testleriniz ders veriyor: arşivinizdeki tur 4 ve tur 6\'da değerleme faktörlerinden (FD/FAVÖK ve ROIC) kurulan sistematik stratejiler doğrulama döneminde altını ve eşit ağırlıklı evreni geçemedi. "Ucuz hisse al" kuralı tek başına bir sistem değildir.' },
      ],
      quiz: [
        { soru: 'SNA₁ = 5, r = %12, g = %2. Gordon değeri kaçtır?', secenekler: ['50', '41,7', '62,5', '500'], dogru: 0, aciklama: '`5 ÷ (0,12 − 0,02) = 50`.' },
        { soru: 'Gordon modelinde g, r\'ye yaklaştıkça ne olur?', secenekler: ['Değer sıfıra gider', 'Değer aşırı büyür; model güvenilmez hale gelir', 'Değişmez', 'Negatif olur'], dogru: 1, aciklama: 'Payda sıfıra yaklaşır.' },
        { soru: 'Göreceli değerlemenin temel riski nedir?', secenekler: ['Çok yavaş olması', 'Bütün sektör pahalıysa "göreceli ucuz" şirketin de pahalı olabilmesi', 'Formül hatası', 'Risk yoktur'], dogru: 1, aciklama: 'Kıyas grubunun kendisi yanlış fiyatlanmış olabilir.' },
        { soru: 'Yüksek enflasyonda İNA yaparken en kritik tutarlılık kuralı hangisidir?', secenekler: ['Nakit akışları ve iskonto oranı aynı bazda (ikisi nominal veya ikisi reel) olmalı', 'Her zaman nominal kullanılmalı', 'Enflasyon yok sayılmalı', 'Büyüme sıfır alınmalı'], dogru: 0, aciklama: 'Nominal nakit akışını reel oranla iskonto etmek değeri şişirir.' },
      ],
      gorev: { baslik: 'Üç senaryolu basit değerleme', adimlar: ['Seçtiğiniz bir sanayi şirketinin son yıllık SNA\'sını (ders 3-03) reel baz olarak alın.', 'Kötü, baz ve iyi senaryo için reel g ve r belirleyin; Gordon ile 3 değer hesaplayın.', 'Pay sayısına bölüp hisse başı değer aralığını bulun ve güncel fiyatla karşılaştırın. Hangi varsayım sonucu en çok değiştiriyor?'] },
      kaynaklar: [DAMO, { ad: 'Graham, B.: The Intelligent Investor, Bölüm 20 (Güvenlik marjı)' }, { ad: 'McKinsey: Valuation: Measuring and Managing the Value of Companies' }],
    },
    {
      id: '3-12', seviye: 3, baslik: 'KAP bildirimleri nasıl okunur?', beceri: 'temel_analiz', dakika: 8,
      bolumler: [
        { tip: 'metin', metin: `**KAP (Kamuyu Aydınlatma Platformu)**, borsa şirketlerinin yasal bildirimlerini yaptığı resmî kanaldır. Haber sitelerinden önce ve bütün yatırımcılara eşit olarak açıklanır. En sık karşılaşacağınız bildirim türleri:

- **Finansal rapor:** Çeyreklik ve yıllık tablolar ile dipnotlar. Asıl bilgi dipnotlardadır.
- **Özel durum açıklaması:** Yatırım kararını etkileyebilecek her gelişme: yeni sözleşme, ihale, dava, yatırım, ortaklık değişikliği.
- **Kâr payı dağıtımı, sermaye artırımı (bedelli/bedelsiz).**
- **Pay geri alım işlemleri:** Şirketin kendi payını alması.
- **İçeriden öğrenen (yönetici, ortak) pay alım-satımları.**
- **Faaliyet raporu ve yatırımcı sunumu.**

Bildirim okuma kontrol listesi:
- **Büyüklük:** Sözleşme tutarı şirketin yıllık hasılatının yüzde kaçı? "Rekor sözleşme" başlığı, hasılatın %1'i olabilir.
- **Süre:** Tutar kaç yıla yayılıyor?
- **Kesinlik:** Niyet mektubu mu, imzalı sözleşme mi?
- **Para birimi ve marj:** Kârlılığa etkisi belirtilmiş mi?
- **Zaman:** Bildirim seans içinde mi geldi, kapanıştan sonra mı?` },
        { tip: 'formul', ad: 'Bildirimin önemi', formul: 'Önem ≈ Sözleşme tutarı ÷ (Yıllık hasılat × süre)', aciklama: 'Örnek: 3 yıla yayılan 9 milyar TL\'lik iş, yıllık hasılatı 300 milyar olan şirkette yılda 3 milyar eder; yani hasılatın yaklaşık %1\'i.' },
        { tip: 'ornek', baslik: 'Açıklama tarihleri ve gecikme', metin: `Bu derslerdeki 2025 yıllık raporlar KAP'ta şu tarihlerde açıklandı: TUPRS ${O.TUPRS.ilk_aciklama}, EREGL ${O.EREGL.ilk_aciklama}, ASELS ${O.ASELS.ilk_aciklama}, THYAO ${O.THYAO.ilk_aciklama}, BIMAS ${O.BIMAS.ilk_aciklama}. Bir backtest'te bu tarihten önce o rakamı kullanmak **ileriye bakma (look-ahead) yanlılığıdır**: gerçekte o gün bilinmeyen bir bilgiyle işlem yapmış olursunuz. Arşivinizde ilk açıklanma tarihlerinin ayrıca tutulmasının nedeni budur.`, kaynak: 'bist_veri/temel (KAP ilk açıklama tarihleri)' },
      ],
      quiz: [
        { soru: 'Yıllık hasılatı 200 milyar TL olan şirket, 5 yıla yayılan 10 milyar TL\'lik sözleşme duyurdu. Yıllık hasılata etkisi yaklaşık nedir?', secenekler: ['%5', '%1', '%10', '%50'], dogru: 1, aciklama: '`10 ÷ 5 = 2` milyar/yıl; `2 ÷ 200 = %1`.' },
        { soru: 'Finansal raporlarda asıl önemli ayrıntılar genellikle nerededir?', secenekler: ['Kapak sayfasında', 'Dipnotlarda', 'Logoda', 'Basın bülteninde'], dogru: 1, aciklama: 'Kur riski, borç vadesi, ilişkili taraf işlemleri vb. dipnotlardadır.' },
        { soru: 'Bir bilanço rakamını backtest\'te KAP açıklama tarihinden önce kullanmak hangi hatadır?', secenekler: ['Hayatta kalma yanlılığı', 'İleriye bakma (look-ahead) yanlılığı', 'Aşırı güven', 'Likidite hatası'], dogru: 1, aciklama: 'O tarihte bilinmeyen bilgiyle işlem yapılmış olur.' },
        { soru: '"Niyet mektubu imzalandı" bildirimi ile "kesin sözleşme imzalandı" bildirimi arasındaki fark nedir?', secenekler: ['Fark yoktur', 'Niyet mektubu bağlayıcı değildir, gerçekleşmeyebilir', 'Niyet mektubu daha büyüktür', 'Sözleşme vergilidir'], dogru: 1, aciklama: 'Kesinlik derecesi bildirimin önemini belirler.' },
      ],
      gorev: { baslik: 'Bir haftanın KAP bildirimlerini puanlayın', adimlar: ['Takip ettiğiniz 3 şirketin son 2 haftadaki KAP bildirimlerini listeleyin.', 'Her özel durum açıklaması için büyüklük (hasılata oran), süre, kesinlik ve para birimini yazın.', 'Bildirim sonrası ilk gün fiyat tepkisini not edin: tepki bildirimin önemiyle orantılı mıydı?'] },
      kaynaklar: [KAP, { ad: 'SPK II-15.1 Özel Durumlar Tebliği', url: 'https://www.spk.gov.tr' }],
    },
  ],
  sinavEk: [
    { soru: `Şirket A: F/K 4, FD/FAVÖK 9, net borç piyasa değerinin 2 katı. Şirket B: F/K 12, FD/FAVÖK 6, net nakit. Hangi yorum daha doğrudur?`, secenekler: ['A kesin daha ucuz', 'Borç hesaba katılınca B daha ucuz olabilir; A\'nın düşük F/K\'sı borç riskini ve kârın kalitesini sorgulatmalı', 'B kesin pahalı', 'Karşılaştırılamaz'], dogru: 1, aciklama: 'FD/FAVÖK sermaye yapısını hesaba katar.' },
    { soru: 'Net kâr artıyor, işletme nakdi düşüyor, ticari alacaklar hasılattan çok daha hızlı büyüyor. İlk sonuç ne olmalı?', secenekler: ['Mükemmel büyüme', 'Kârın kalitesi sorgulanmalı; tahsilat sorunu veya agresif gelir yazımı olabilir', 'Temettü artacak', 'Bilgi yetersiz'], dogru: 1, aciklama: 'Tahakkuk ile nakit ayrışıyor.' },
    { soru: 'Seçim, sözleşme ve kur haberlerine rağmen şirket değerlemesinde en uzun vadeli belirleyici hangisidir?', secenekler: ['Günlük işlem hacmi', 'Şirketin sürdürülebilir serbest nakit akışı üretme gücü', 'Bedelsiz oranı', 'Hisse fiyatının seviyesi'], dogru: 1, aciklama: 'Uzun vadede değer, nakit üretim gücünden gelir.' },
  ],
}
