import { describe, it, expect } from 'vitest'
import { SEVIYELER } from './index'

// İçerik bütünlüğü: her dersin yapısı tam, cevap anahtarları geçerli, kimlikler tekil, şablonlarda boş/NaN yok.
describe('içerik', () => {
  const dersler = SEVIYELER.flatMap(s => s.dersler)
  it('MVP: seviye 1-3, 32 ders', () => { expect(SEVIYELER.map(s => s.dersler.length)).toEqual([10, 10, 12]) })
  it('ders kimlikleri tekil ve seviyeyle uyumlu', () => {
    expect(new Set(dersler.map(d => d.id)).size).toBe(dersler.length)
    for (const d of dersler) expect(d.id.startsWith(`${d.seviye}-`)).toBe(true)
  })
  it('her dersin anlatımı, en az 3 quiz sorusu, görevi ve kaynağı var', () => {
    for (const d of dersler) {
      expect(d.bolumler.length, d.id).toBeGreaterThan(0)
      expect(d.quiz.length, d.id).toBeGreaterThanOrEqual(3)
      expect(d.gorev.adimlar.length, d.id).toBeGreaterThan(0)
      expect(d.kaynaklar.length, d.id).toBeGreaterThan(0)
    }
  })
  it('cevap anahtarları geçerli, şıklar tekil', () => {
    for (const s of [...dersler.flatMap(d => d.quiz), ...SEVIYELER.flatMap(s => s.sinavEk)]) {
      expect(s.dogru, s.soru).toBeGreaterThanOrEqual(0)
      expect(s.dogru, s.soru).toBeLessThan(s.secenekler.length)
      expect(new Set(s.secenekler).size, s.soru).toBe(s.secenekler.length)
    }
  })
  it('veri şablonlarından NaN/undefined sızmadı', () => {
    const metin = JSON.stringify(SEVIYELER)
    expect(metin).not.toMatch(/NaN|undefined|hesaplanamaz/)
  })
  it('her seviyenin sınav havuzu 15 soruyu karşılıyor', () => {
    for (const s of SEVIYELER) expect(s.dersler.reduce((n, d) => n + d.quiz.length, 0) + s.sinavEk.length).toBeGreaterThanOrEqual(15)
  })
})
