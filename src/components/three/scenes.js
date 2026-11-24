// Punto de entrada único del chunk 3D: three.js, R3F, drei y las tres escenas viven aquí.
// Todos los visores lo cargan con el mismo import dinámico (import('./scenes.js')),
// así el navegador descarga el 3D una sola vez y lo reutiliza entre páginas.
export { default as HeroScene } from './HeroScene.jsx'
export { default as ProductViewerScene } from './ProductViewerScene.jsx'
export { default as ChapitaMiniScene } from './ChapitaMiniScene.jsx'
