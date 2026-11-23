import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Fuentes alojadas en el propio sitio (sin Google Fonts): CSP estricta y sin terceros
import '@fontsource/figtree/400.css'
import '@fontsource/figtree/500.css'
import '@fontsource/figtree/600.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import App from './App.jsx'
import './styles.css'
import 'lenis/dist/lenis.css'
// Utilidades de motion v2 (fondo noche, Lenis, vuelo al carrito); va después de styles.css
import './components/motion/motion.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
