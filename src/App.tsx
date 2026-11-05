import { HashRouter, NavLink, Route, Routes } from 'react-router-dom'
import Ozet from './ekranlar/Ozet'
import Ogren from './ekranlar/Ogren'
import Ders from './ekranlar/Ders'
import Sinav from './ekranlar/Sinav'
import Portfoy from './ekranlar/Portfoy'
import Emir from './ekranlar/Emir'
import Gunluk from './ekranlar/Gunluk'
import Ayarlar from './ekranlar/Ayarlar'
import { ParolaKapisi } from './bilesenler/ParolaKapisi'

const MENU = [['/', '◎', 'Özet'], ['/ogren', '◈', 'Öğren'], ['/portfoy', '▤', 'Portföy'], ['/gunluk', '✎', 'Günlük'], ['/ayarlar', '⚙', 'Ayarlar']] as const

export default function App() {
  return (
    <ParolaKapisi>
    <HashRouter>
      <main className="sayfa">
        <Routes>
          <Route path="/" element={<Ozet />} />
          <Route path="/ogren" element={<Ogren />} />
          <Route path="/ders/:id" element={<Ders />} />
          <Route path="/sinav/:seviye" element={<Sinav />} />
          <Route path="/portfoy" element={<Portfoy />} />
          <Route path="/emir" element={<Emir />} />
          <Route path="/gunluk" element={<Gunluk />} />
          <Route path="/ayarlar" element={<Ayarlar />} />
        </Routes>
      </main>
      <nav className="alt-menu">
        {MENU.map(([yol, ik, ad]) => (
          <NavLink key={yol} to={yol} end={yol === '/'}><span className="ik">{ik}</span>{ad}</NavLink>
        ))}
      </nav>
    </HashRouter>
    </ParolaKapisi>
  )
}
