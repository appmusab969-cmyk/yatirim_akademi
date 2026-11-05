"""Seviye 3 derslerinin gerçek şirket örneklerini üretir → src/icerik/ornekler.json (statik, bir kez).

Kaynak: İş Yatırım mali tabloları (bist_veri/temel/temel_uzun.parquet), fiyat: borsapy kapanışı.
Sadece AYNI bildirim içindeki kalemler kullanılır (arşivde 2022/2025 civarında dönemler arası taban kırılması var).
Kullanım: python veri_hatti/ornek_sirketler.py [--arsiv C:/Users/Lenovo/bist_veri]
"""
import json, sys, datetime as dt
from pathlib import Path
import pandas as pd

ARSIV = Path(sys.argv[sys.argv.index('--arsiv') + 1]) if '--arsiv' in sys.argv else Path('C:/Users/Lenovo/bist_veri')
CIKTI = Path(__file__).resolve().parent.parent / 'src' / 'icerik' / 'ornekler.json'
SIRKETLER = ['THYAO', 'BIMAS', 'EREGL', 'ASELS', 'TUPRS']
YIL, AY = 2025, 12
FIYAT_TARIHI = '2026-10-30'  # sabit fiyat tarihi: ders tekrarlanabilir olsun


def main():
    import borsapy as bp
    d = pd.read_parquet(ARSIV / 'temel' / 'temel_uzun.parquet')
    out = {'uretildi': dt.date.today().isoformat(), 'donem': f'{YIL}/{AY}', 'fiyat_tarihi': FIYAT_TARIHI,
           'kaynak': 'İş Yatırım mali tablo verisi (KAP finansal raporlarından derlenmiş); çarpanlar borsapy kapanış fiyatıyla hesaplandı (ham fiyat yayımlanmaz)',
           'tanimlar': {
               'FAVOK': 'Brüt kâr − pazarlama − genel yönetim − Ar-Ge giderleri + amortisman (esas faaliyet; "diğer faaliyet gelir/giderleri" hariç)',
               'NET_BORC': 'Kısa + uzun vadeli finansal borçlar − nakit ve nakit benzerleri − kısa vadeli finansal yatırımlar',
               'ROE': 'Ana ortaklık net kârı ÷ dönem sonu ana ortaklık özkaynağı (basitleştirme: ortalama özkaynak daha doğrudur)',
               'PIYASA_DEGERI': 'Kapanış fiyatı × pay sayısı (pay sayısı = ödenmiş sermaye / 1 TL nominal)',
               'FD': 'Piyasa değeri + net borç + azınlık payları',
           }, 'sirketler': {}}
    for kod in SIRKETLER:
        x = d[(d.kod == kod) & (d.yil == YIL) & (d.donem_ay == AY)]
        if x.empty: print('YOK', kod); continue
        k = dict(zip(x.kalem_kodu, x.deger_try))
        g = lambda c: float(k.get(c, 0) or 0)
        fiyatlar = bp.Ticker(kod).history(start='2026-10-20', end='2026-11-01')['Close']
        fiyatlar.index = fiyatlar.index.strftime('%Y-%m-%d')
        if FIYAT_TARIHI not in fiyatlar.index: print('fiyat yok', kod); continue
        fiyat = float(fiyatlar[FIYAT_TARIHI])
        pay = g('2OA')
        hasilat, brut = g('3C'), g('3D')
        esas = brut + g('3DA') + g('3DB') + g('3DC')
        amort = g('4B'); favok = esas + amort
        net_kar = g('3Z'); ozk = g('2O')
        fin_borc = g('2AA') + g('2BA'); nakit = g('1AA'); kv_fy = g('1AB')
        net_borc = fin_borc - nakit - kv_fy
        pd_ = fiyat * pay
        fd = pd_ + net_borc + g('2ODA')
        r = lambda a, b: round(a / b, 2) if b else None
        out['sirketler'][kod] = {
            'pay_sayisi_mn': round(pay / 1e6, 1), 'ilk_aciklama': str(x.ilk_aciklama_tarihi.iloc[0])[:10],
            'mn_tl': {k2: round(v / 1e6) for k2, v in {
                'hasilat': hasilat, 'brut_kar': brut, 'esas_faaliyet_kari': esas, 'amortisman': amort, 'favok': favok,
                'net_kar_ana': net_kar, 'toplam_varlik': g('1BL'), 'ozkaynak_ana': ozk, 'finansal_borc': fin_borc,
                'nakit': nakit, 'kv_finansal_yatirim': kv_fy, 'net_borc': net_borc, 'isletme_nakit': g('4C'),
                'yatirim_harcamasi': g('4CAI'), 'serbest_nakit': g('4CB'), 'net_ypp': g('4BEB'),
                'piyasa_degeri': pd_, 'firma_degeri': fd}.items()},
            'oran': {'FK': r(pd_, net_kar), 'PDDD': r(pd_, ozk), 'FD_FAVOK': r(fd, favok), 'ROE': r(net_kar, ozk),
                     'brut_marj': r(brut, hasilat), 'favok_marj': r(favok, hasilat), 'net_marj': r(net_kar, hasilat),
                     'net_borc_favok': r(net_borc, favok), 'ozk_varlik': r(ozk, g('1BL'))},
        }
        print(kod, out['sirketler'][kod]['oran'])
    CIKTI.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding='utf-8')


if __name__ == '__main__':
    main()
