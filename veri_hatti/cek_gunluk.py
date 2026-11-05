"""Günlük veri çekimi → public/data/*.json

İlkeler:
- Her değer {deger, tarih, kaynak, durum, not} taşır. durum: guncel | eski | yok.
- Çekim başarısızsa ESKİ DOSYADAKİ değer korunur, durum='eski' olur, tarih değişmez. Değer asla uydurulmaz.
- Makul aralık dışındaki değer reddedilir (ör. borsapy policy_rate hatası: 2010 değerini döndürüyor).
- EVDS anahtarı yalnızca ortam değişkeninden (EVDS_API_KEY) okunur; hiçbir çıktı dosyasına yazılmaz.

Çalıştırma: python veri_hatti/cek_gunluk.py   (.env varsa otomatik okunur)
"""
from __future__ import annotations
import datetime as dt, json, os, sys, time, traceback
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
CIKTI = KOK / 'public' / 'data'
EVREN = json.loads((Path(__file__).parent / 'evren.json').read_text(encoding='utf-8'))
TR = dt.timezone(dt.timedelta(hours=3))
SIMDI = dt.datetime.now(TR)
GECMIS_GUN = 60
RAPOR: list[str] = []


def env_yukle():
    f = KOK / '.env'
    if f.exists():
        for satir in f.read_text(encoding='utf-8').splitlines():
            if '=' in satir and not satir.strip().startswith('#'):
                k, v = satir.split('=', 1)
                os.environ.setdefault(k.strip(), v.strip())


def log(m: str):
    RAPOR.append(m); print(m, flush=True)


SIFRELI = {'fiyatlar', 'makro', 'haberler'}  # yayında yalnızca şifreli bulunur; meta.json düz (ham veri içermez)
SIF = None  # main() içinde kurulur


def eski(ad: str) -> dict:
    """Önceki çalıştırmanın çıktısı (çekim başarısız olursa 'eski' değer korumak için)."""
    try:
        if ad in SIFRELI:
            from sifrele import coz
            return coz(json.loads((CIKTI / f'{ad}.enc.json').read_text(encoding='utf-8')), os.environ['DATA_PAROLA'])
        return json.loads((CIKTI / f'{ad}.json').read_text(encoding='utf-8'))
    except FileNotFoundError: return {}
    except Exception as e:
        log(f'UYARI önceki {ad} okunamadı ({type(e).__name__}; parola değişmiş olabilir): eski değer koruması bu sefer yok')
        return {}


def deneme(f, n=3, bekle=3):
    for i in range(n):
        try: return f()
        except Exception as e:
            if i == n - 1: raise
            time.sleep(bekle * (i + 1))


def kalem(deger, tarih, kaynak, birim='', not_=''):
    return {'deger': deger, 'tarih': tarih, 'kaynak': kaynak, 'birim': birim, 'durum': 'guncel', 'not': not_}


def koru(onceki: dict | None, sebep: str):
    """Çekim başarısız: önceki değeri 'eski' olarak koru; yoksa 'yok'."""
    if onceki and onceki.get('deger') is not None:
        return {**onceki, 'durum': 'eski', 'not': f'Bugün güncellenemedi ({sebep}); son başarılı değer.'}
    return {'deger': None, 'tarih': None, 'kaynak': None, 'birim': '', 'durum': 'yok', 'not': f'Yeterli veri yok ({sebep}).'}


def aralikta(x, a, b) -> bool:
    try: return x is not None and a <= float(x) <= b
    except Exception: return False


def kapanis_etiketi(ts) -> str:
    """Bugünün mumu seans bitmeden (18:10 TSİ) alındıysa 'gün içi' etiketi."""
    d = ts.date() if hasattr(ts, 'date') else ts
    if d == SIMDI.date() and SIMDI.hour * 60 + SIMDI.minute < 18 * 60 + 15:
        return 'gün içi (seans sürüyor, kapanış değil)'
    return 'kapanış'


def gecmis_seri(df) -> list[list]:
    df = df.dropna(subset=['Close']).tail(GECMIS_GUN)
    return [[i.strftime('%Y-%m-%d'), round(float(c), 4)] for i, c in zip(df.index, df['Close'])]


# ---------------------------------------------------------------- fiyatlar
def fiyatlar(bp) -> dict:
    o = eski('fiyatlar').get('varliklar', {})
    v: dict = {}

    def hisse_endeks(kod, tur, nesne):
        try:
            df = deneme(lambda: nesne.history(period='3mo'))
            if df is None or df.empty: raise ValueError('boş veri')
            son = df.dropna(subset=['Close']).iloc[-1]; ts = df.dropna(subset=['Close']).index[-1]
            if not aralikta(son['Close'], 0.01, 1e7): raise ValueError(f'aralık dışı {son["Close"]}')
            v[kod] = {'ad': kod, 'tur': tur, **kalem(round(float(son['Close']), 4), ts.strftime('%Y-%m-%d'),
                      f'borsapy (Borsa İstanbul verisi, gecikmeli) · {kapanis_etiketi(ts)}', 'TL' if tur == 'hisse' else 'puan'),
                      'gecmis': gecmis_seri(df)}
        except Exception as e:
            v[kod] = {'ad': kod, 'tur': tur, **koru(o.get(kod), type(e).__name__), 'gecmis': (o.get(kod) or {}).get('gecmis', [])}
            log(f'UYARI {kod}: {e}')

    for k in EVREN['hisseler']: hisse_endeks(k, 'hisse', bp.Ticker(k))
    for k in EVREN['endeksler']: hisse_endeks(k, 'endeks', bp.Index(k))

    # döviz ve gram altın (serbest piyasa)
    for kod, sembol, ad in [*[(d + 'TRY', d, f'{d}/TRY') for d in EVREN['doviz']], ('GRAM_ALTIN', 'gram-altin', 'Gram altın')]:
        try:
            fx = bp.FX(sembol)
            c = deneme(lambda: fx.current)
            lo, hi = (1, 1000) if kod != 'GRAM_ALTIN' else (100, 1e6)
            if not aralikta(c.get('last'), lo, hi): raise ValueError(f'aralık dışı {c.get("last")}')
            try: gec = gecmis_seri(deneme(lambda: fx.history(period='3mo')))
            except Exception: gec = (o.get(kod) or {}).get('gecmis', [])
            v[kod] = {'ad': ad, 'tur': 'altin' if kod == 'GRAM_ALTIN' else 'doviz',
                      **kalem(round(float(c['last']), 4), str(c.get('update_time', ''))[:10] or SIMDI.strftime('%Y-%m-%d'),
                              'borsapy (serbest piyasa, gecikmeli)', 'TL'), 'gecmis': gec}
        except Exception as e:
            v[kod] = {'ad': ad, 'tur': 'altin' if kod == 'GRAM_ALTIN' else 'doviz', **koru(o.get(kod), type(e).__name__), 'gecmis': (o.get(kod) or {}).get('gecmis', [])}
            log(f'UYARI {kod}: {e}')

    # fonlar (TEFAS)
    for k in EVREN['fonlar']:
        try:
            i = deneme(lambda: bp.Fund(k).info)
            if not aralikta(i.get('price'), 1e-6, 1e6): raise ValueError('fiyat yok')
            v[k] = {'ad': i.get('name', k), 'tur': 'fon', 'kategori': i.get('category'), 'risk': i.get('risk_value'),
                    **kalem(float(i['price']), i.get('date') or SIMDI.strftime('%Y-%m-%d'), 'borsapy (TEFAS)', 'TL',
                            'Fon fiyatı bir önceki iş günü sonu itibarıyla hesaplanır.'),
                    'getiri_1y': i.get('return_1y'), 'gecmis': []}
        except Exception as e:
            v[k] = {'ad': (o.get(k) or {}).get('ad', k), 'tur': 'fon', **koru(o.get(k), type(e).__name__), 'gecmis': []}
            log(f'UYARI fon {k}: {e}')
    return {'uretildi': SIMDI.isoformat(timespec='minutes'), 'varliklar': v}


# ---------------------------------------------------------------- makro
EVDS_SERI = {'politika_faizi': 'TP.PF.FAIZ1'}  # anahtar gelince doğrulanacak (bkz. README)


def evds_son(kod: str, key: str):
    import requests
    bas = (SIMDI - dt.timedelta(days=400)).strftime('%d-%m-%Y'); bit = SIMDI.strftime('%d-%m-%Y')
    for url in [f'https://evds3.tcmb.gov.tr/igmevdsms-dis/series={kod}&startDate={bas}&endDate={bit}&type=json',
                f'https://evds2.tcmb.gov.tr/service/evds/series={kod}&startDate={bas}&endDate={bit}&type=json']:
        try:
            r = requests.get(url, headers={'key': key, 'User-Agent': 'Mozilla/5.0'}, timeout=30)
            items = r.json().get('items', [])
            alan = kod.replace('.', '_')
            dolu = [x for x in items if x.get(alan) not in (None, '')]
            if dolu: return float(dolu[-1][alan]), dolu[-1]['Tarih']
        except Exception: continue
    raise ValueError('EVDS yanıtı boş')


def makro(bp) -> dict:
    o = eski('makro').get('kalemler', {})
    m: dict = {}
    # gecelik koridor: politika faizinin makullük kontrolü için
    koridor = None
    try:
        t = bp.TCMB(); on = deneme(lambda: t.overnight)
        if aralikta(on.get('borrowing'), 0, 200) and aralikta(on.get('lending'), 0, 200):
            koridor = (float(on['borrowing']), float(on['lending']))
            m['gecelik_borc_alma'] = kalem(koridor[0], SIMDI.strftime('%Y-%m-%d'), 'TCMB (borsapy)', '%')
            m['gecelik_borc_verme'] = kalem(koridor[1], SIMDI.strftime('%Y-%m-%d'), 'TCMB (borsapy)', '%')
    except Exception as e: log(f'UYARI koridor: {e}')
    for k in ('gecelik_borc_alma', 'gecelik_borc_verme'):
        m.setdefault(k, koru(o.get(k), 'çekilemedi'))

    # politika faizi: önce EVDS, sonra borsapy, ikisi de koridor kontrolünden geçmeli
    pf = None
    key = os.environ.get('EVDS_API_KEY', '').strip()
    adaylar = []
    if key:
        try: d, tarih = evds_son(EVDS_SERI['politika_faizi'], key); adaylar.append((d, tarih, 'TCMB EVDS (TP.PF.FAIZ1)'))
        except Exception as e: log(f'UYARI EVDS politika faizi: {e}')
    else: log('BİLGİ EVDS_API_KEY yok: politika faizi için elle giriş kullanılacak.')
    try: adaylar.append((float(bp.TCMB().policy_rate), SIMDI.strftime('%Y-%m-%d'), 'TCMB (borsapy)'))
    except Exception: pass
    for d, tarih, kaynak in adaylar:
        if koridor and koridor[0] - 1e-9 <= d <= koridor[1] + 1e-9:
            pf = kalem(d, tarih, kaynak, '%'); break
        log(f'RED politika faizi {d} ({kaynak}): gecelik koridor {koridor} dışında, kullanılmadı.')
    m['politika_faizi'] = pf or koru(o.get('politika_faizi') if (o.get('politika_faizi') or {}).get('kaynak') else None,
                                     'doğrulanmış kaynak yok; Ayarlar > Elle giriş')

    # enflasyon (TÜİK, borsapy üzerinden)
    try:
        i = deneme(lambda: bp.Inflation().latest())
        y, a = float(i['yearly_inflation']), float(i['monthly_inflation'])
        if not (aralikta(y, -10, 200) and aralikta(a, -10, 30)): raise ValueError('aralık dışı')
        donem = i.get('year_month', '')
        m['tufe_yillik'] = kalem(y, i['date'], 'TÜİK TÜFE (borsapy)', '%', f'Dönem: {donem}')
        m['tufe_aylik'] = kalem(a, i['date'], 'TÜİK TÜFE (borsapy)', '%', f'Dönem: {donem}')
    except Exception as e:
        log(f'UYARI enflasyon: {e}')
        for k in ('tufe_yillik', 'tufe_aylik'): m[k] = koru(o.get(k), type(e).__name__)

    # stopaj tablosu (referans; uygulama ayarlarıyla karşılaştırır)
    stopaj = eski('makro').get('stopaj_fon')
    try:
        tb = deneme(lambda: bp.withholding_tax_table())
        son_kolon = tb.columns[-1]
        stopaj = {'kaynak': 'borsapy withholding_tax_table (GİB/Resmî Gazete derlemesi)', 'donem': str(son_kolon),
                  'tarih': SIMDI.strftime('%Y-%m-%d'),
                  'satirlar': [[str(r['tax_category']), float(r[son_kolon])] for _, r in tb.iterrows()]}
    except Exception as e: log(f'UYARI stopaj tablosu: {e}')
    return {'uretildi': SIMDI.isoformat(timespec='minutes'), 'kalemler': m, 'stopaj_fon': stopaj}


# ---------------------------------------------------------------- haberler
def haberler() -> dict:
    import feedparser, html, re
    liste = []
    for ad, url in EVREN['rss']:
        try:
            f = feedparser.parse(url)
            for e in f.entries[:15]:
                t = e.get('published_parsed') or e.get('updated_parsed')
                liste.append({'baslik': html.unescape(e.get('title', '')).strip(), 'link': e.get('link'), 'kaynak': ad,
                              'tarih': time.strftime('%Y-%m-%dT%H:%M', t) if t else None,
                              'ozet': re.sub('<[^>]+>', '', html.unescape(e.get('summary', '')))[:240].strip()})
        except Exception as e: log(f'UYARI rss {ad}: {e}')
    liste.sort(key=lambda x: x['tarih'] or '', reverse=True)
    if not liste: return {**eski('haberler'), 'durum': 'eski'}
    return {'uretildi': SIMDI.isoformat(timespec='minutes'), 'durum': 'guncel', 'haberler': liste[:40],
            'not': 'Yalnızca başlık ve kısa özet; tam metin için kaynağa gidin (telif).'}


def yaz(ad: str, veri: dict):
    CIKTI.mkdir(parents=True, exist_ok=True)
    if ad in SIFRELI:
        (CIKTI / f'{ad}.json').unlink(missing_ok=True)  # düz kopya asla kalmasın
        veri, ad = SIF.sifrele(veri, ad), f'{ad}.enc'
    s = json.dumps(veri, ensure_ascii=False, indent=1)
    for gizli in (os.environ.get('DATA_PAROLA', ''),):
        if len(gizli) >= 6 and gizli in s: raise RuntimeError('parola sızıntısı engellendi')
    anahtar = os.environ.get('EVDS_API_KEY', '').strip()
    if len(anahtar) >= 6 and anahtar in s: raise RuntimeError('anahtar sızıntısı engellendi; dosya yazılmadı')
    tmp = CIKTI / f'{ad}.json.tmp'; tmp.write_text(s, encoding='utf-8'); tmp.replace(CIKTI / f'{ad}.json')


def main():
    env_yukle()
    global SIF
    sys.path.insert(0, str(Path(__file__).parent))
    from sifrele import Sifreleyici
    if not os.environ.get('DATA_PAROLA'):
        print("HATA: DATA_PAROLA tanımlı değil. Ham veri düz metin yazılmaz; .env veya GitHub Secrets'a ekleyin."); return 2
    SIF = Sifreleyici(os.environ['DATA_PAROLA'])
    import borsapy as bp
    sonuc = {}
    for ad, f in [('fiyatlar', lambda: fiyatlar(bp)), ('makro', lambda: makro(bp)), ('haberler', haberler)]:
        try: yaz(ad, f()); sonuc[ad] = 'ok'
        except Exception:
            log(f'HATA {ad}:\n{traceback.format_exc()}'); sonuc[ad] = 'hata'
    yaz('meta', {'uretildi': SIMDI.isoformat(timespec='minutes'), 'sonuc': sonuc, 'rapor': RAPOR[-80:]})
    return 0 if all(v == 'ok' for v in sonuc.values()) else 1


if __name__ == '__main__':
    sys.exit(main())
