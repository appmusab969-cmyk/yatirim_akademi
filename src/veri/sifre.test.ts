import { describe, it, expect } from 'vitest'
import { zarfCoz, ParolaHatasi, type Zarf } from './sifre'
import z from './__fixture__/ornek.enc.json'

// Python (veri_hatti/sifrele.py) ile şifrelenen dosyayı Web Crypto ile çözebilmeliyiz.
describe('şifre (Python ↔ Web Crypto uyumu)', () => {
  it('doğru parola çözer, Türkçe karakter korunur', async () => {
    expect(await zarfCoz(z as Zarf, 'test-parolasi-123456')).toEqual({ merhaba: 'dünya', sayi: 42.5 })
  })
  it('yanlış parola ParolaHatasi(yanlis) fırlatır', async () => {
    await expect(zarfCoz(z as Zarf, 'yanlis-parola')).rejects.toBeInstanceOf(ParolaHatasi)
  })
  it('dosya adı (AAD) değiştirilirse reddeder', async () => {
    await expect(zarfCoz({ ...(z as Zarf), ad: 'makro' }, 'test-parolasi-123456')).rejects.toBeInstanceOf(ParolaHatasi)
  })
})
