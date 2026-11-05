import { useState, type ReactNode } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { parolaAl, parolaDogrulaVeKaydet, ParolaHatasi } from '../veri/sifre'

export function ParolaFormu({ onBasari }: { onBasari?: () => void }) {
  const [p, setP] = useState(''), [hata, setHata] = useState<string | null>(null), [bekle, setBekle] = useState(false)
  return <form onSubmit={async e => {
    e.preventDefault(); setHata(null); setBekle(true)
    try { await parolaDogrulaVeKaydet(p.trim()); setP(''); onBasari?.() }
    catch (err) { setHata(err instanceof ParolaHatasi ? err.message : (err as Error).message) }
    finally { setBekle(false) }
  }}>
    <label htmlFor="parola">Veri parolası</label>
    <input id="parola" type="password" autoComplete="current-password" value={p} onChange={e => setP(e.target.value)} />
    {hata && <div className="kart kotu" role="alert"><b>{hata}</b></div>}
    <button className="ana" style={{ width: '100%', marginTop: '.8rem' }} disabled={!p.trim() || bekle}>{bekle ? 'Doğrulanıyor…' : 'Çöz ve kaydet'}</button>
  </form>
}

/** Parola yoksa ilk açılışta bir kez sorar. Dersler parolasız da kullanılabilir ("şimdilik atla"). */
export function ParolaKapisi({ children }: { children: ReactNode }) {
  const parola = useLiveQuery(parolaAl, [], null)
  const [atlandi, setAtlandi] = useState(() => sessionStorage.getItem('parolaAtla') === '1')
  if (parola === null) return null
  if (parola || atlandi) return <>{children}</>
  return <main className="sayfa">
    <h1>Hoş geldiniz</h1>
    <div className="kart">
      <p>Piyasa verileri (fiyatlar, makro, haberler) GitHub Pages'te <b>şifreli</b> durur ve yalnızca bu cihazda çözülür. Parolayı bir kez girin; cihazda saklanır.</p>
      <p className="kucuk soluk">Parola, GitHub Secrets'taki <code>DATA_PAROLA</code> ile aynıdır (yerelde <code>.env</code> dosyanızda).</p>
      <ParolaFormu />
    </div>
    <button style={{ width: '100%' }} onClick={() => { sessionStorage.setItem('parolaAtla', '1'); setAtlandi(true) }}>Şimdilik atla (sadece dersler)</button>
  </main>
}
