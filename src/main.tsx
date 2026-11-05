import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.tsx'

registerSW({ immediate: true })
// Tarayıcının depolamayı kendiliğinden silmemesi için kalıcı depolama iste (özellikle iOS/Safari).
navigator.storage?.persist?.()

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
