import type { ReactNode } from 'react'

function satirIci(s: string): ReactNode[] {
  // **kalın** ve `kod`; HTML enjeksiyonu yok (dangerouslySetInnerHTML kullanılmaz)
  return s.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean).map((p, i) =>
    p.startsWith('**') ? <b key={i}>{p.slice(2, -2)}</b> : p.startsWith('`') ? <code key={i}>{p.slice(1, -1)}</code> : p)
}

export function Metin({ m }: { m: string }) {
  return <div className="ders-metin">{m.trim().split(/\n\s*\n/).map((par, i) => {
    const satirlar = par.split('\n').map(x => x.trim())
    if (satirlar.every(x => x.startsWith('- '))) return <ul key={i}>{satirlar.map((x, j) => <li key={j}>{satirIci(x.slice(2))}</li>)}</ul>
    return <p key={i}>{satirIci(satirlar.join(' '))}</p>
  })}</div>
}
