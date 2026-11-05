import { describe, it, expect } from 'vitest'
import { db } from './db'
import { yedekOlustur, yedekYukle } from './yedek'

describe('yedek', () => {
  it('dışa aktar → sil → içe aktar aynı veriyi geri getirir', async () => {
    await db.islemler.add({ tarih: '2026-11-03', kod: 'THYAO', tur: 'hisse', yon: 'al', adet: 10, fiyat: 300, maliyet: 6.3, stopaj: 0, fiyatKaynak: 'test' })
    await db.kararlar.add({ tarih: '2026-11-03', kod: 'THYAO', neden: 'x', hedefFiyat: 350, zararKes: 270, cikisPlani: 'y', vadeGun: 90, guven: 3, girisFiyat: 300, pozisyonOrani: 0.003, son5GunDegisim: null })
    const y = JSON.parse(JSON.stringify(await yedekOlustur()))
    await db.islemler.clear(); await db.kararlar.clear()
    await yedekYukle(y)
    expect(await db.islemler.count()).toBe(1)
    expect((await db.kararlar.toArray())[0].hedefFiyat).toBe(350)
  })
  it('yabancı dosyayı reddeder ve veriye dokunmaz', async () => {
    const once = await db.islemler.count()
    await expect(yedekYukle({ foo: 1 })).rejects.toThrow()
    await expect(yedekYukle({ uygulama: 'yatirim_akademi', surum: 1, veri: { islemler: 'bozuk' } })).rejects.toThrow()
    expect(await db.islemler.count()).toBe(once)
  })
})
