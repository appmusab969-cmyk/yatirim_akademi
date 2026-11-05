# Yatırım Akademisi (kişisel)

Türkiye piyasalarına odaklı kişisel yatırım eğitimi ve pratik PWA'sı. Gerçek para işlemi yok, otomatik alım-satım yok.

## Klasörler
```
src/motor/      maliyet, portföy, karar kalitesi (saf fonksiyonlar + testler)
src/depo/       IndexedDB (Dexie) ve JSON yedek
src/veri/       data/*.json okuyucu, elle giriş birleştirme
src/icerik/     dersler (seviye1-3.ts), ornekler.json (gerçek şirket oranları)
src/ekranlar/   Özet, Öğren, Ders, Sınav, Portföy, Emir, Günlük, Ayarlar
veri_hatti/     cek_gunluk.py (günlük), ornek_sirketler.py (bir kez), evren.json
public/data/    üretilen veri (Actions tarafından günde bir commit'lenir)
```

## Yerelde çalıştırma
```bash
npm install
npx vitest run                         # motor + yedek + içerik testleri
python veri_hatti/cek_gunluk.py        # veriyi çek (.env'deki EVDS_API_KEY okunur)
npm run dev                            # http://localhost:5173
npm run build && npx vite preview      # PWA/çevrimdışı davranışı için (service worker sadece build'de)
```
Telefondan aynı Wi-Fi üzerinden denemek için: `npx vite preview --host`, sonra telefonda `http://<PC-IP>:4173`.
(Ana ekrana ekleme ve çevrimdışı çalışma HTTPS ister; bunu GitHub Pages sağlar.)

## EVDS anahtarı
- Yerel: `.env.example` → `.env` kopyala, `EVDS_API_KEY=...` yaz. `.env` git'e girmez.
- GitHub: Settings → Secrets and variables → Actions → New repository secret → `EVDS_API_KEY`.
- Anahtar yalnızca Python veri hattında kullanılır. `VITE_` önekli değişken kullanmayın (tarayıcı koduna gömülür).
- Veri hattı, çıktı dosyalarında anahtarı görürse yazmayı durdurur.
- **Doğrulanmadı:** EVDS politika faizi seri kodu `TP.PF.FAIZ1`, anahtar gelince ilk çalıştırmada `public/data/meta.json` raporundan kontrol edin.

## Veri şifreleme
- `fiyatlar`, `makro`, `haberler` yalnızca `*.enc.json` olarak yazılır (AES-256-GCM, PBKDF2-SHA256 600.000 tur, dosya adı AAD). Düz kopya repoya/yayına girmez; Actions'taki koruma adımı bunu denetler.
- Parola: yerelde `.env` → `DATA_PAROLA=`, GitHub'da Secret `DATA_PAROLA`. Parola tanımlı değilse veri hattı hiçbir şey yazmaz.
- Uygulama ilk açılışta parolayı sorar, sunucudaki dosyayla doğrular, cihazda (IndexedDB) saklar. Ayarlar → Veri parolası'ndan değiştirilir/silinir.
- Parolayı değiştirirseniz: Secret'ı güncelleyin, Actions'ı çalıştırın, cihazlarda yeni parolayı girin.
- Şifresiz kalanlar: dersler, `src/icerik/ornekler.json` (mali tablo kalemleri ve türetilmiş oranlar; ham fiyat yok), `meta.json` (çekim raporu).

## GitHub Pages kurulumu
1. GitHub'da yeni repo oluşturun, bu klasörü push edin (`main` dalı).
2. Settings → Pages → Source: **GitHub Actions**.
3. Settings → Actions → General → Workflow permissions: **Read and write**.
4. Actions → "Günlük veri + yayın" → Run workflow (ilk çalıştırma). Sonra hafta içi 18:30 TSİ'de kendiliğinden çalışır.
5. Telefonda siteyi açın → Paylaş / menü → **Ana ekrana ekle**.

## Veri kuralları
- Her değer `{deger, tarih, kaynak, durum}` taşır; çekim başarısızsa eski değer `eski` etiketiyle korunur, yoksa `yok` ("yeterli veri yok").
- borsapy `policy_rate` hatalı (2010 değerini döndürüyor) → gecelik koridor kontrolüyle reddediliyor; politika faizi EVDS veya elle girişten gelir.
- Gün içinde çekilen hisse fiyatı "gün içi (kapanış değil)" etiketi alır.
- Vergi oranları varsayılan ve doğrulanmamış işaretli; Ayarlar'dan doğrulayın.

## Yedek
Ayarlar → JSON olarak dışa aktar. PC ↔ telefon taşıma da bununla yapılır (içe aktarma mevcut verinin yerine geçer).
