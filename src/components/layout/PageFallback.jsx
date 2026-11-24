// Mientras carga el chunk de una página: bloque liviano que reserva alto (sin saltos)
// y avisa a lectores de pantalla. Solo se ve en la primera carga de cada página.
export default function PageFallback() {
  return (
    <div className="flex min-h-[70svh] items-center justify-center bg-page px-5" role="status">
      <span className="text-[15px] text-muted">Cargando…</span>
    </div>
  )
}
