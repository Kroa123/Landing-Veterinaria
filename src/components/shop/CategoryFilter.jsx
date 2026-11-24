import { Chip } from '../decor/Badge.jsx'

// Filtro de categorías como grupo de chips (botones con aria-pressed).
// Activo: brand con texto blanco (5.4:1); inactivo: blanco con hairline. En móvil se desplaza
// en horizontal sin cortar el foco (padding lateral para el anillo).
export default function CategoryFilter({ options, value, onChange }) {
  return (
    <div className="-mx-5 overflow-x-auto px-5 py-1 sm:mx-0 sm:px-0">
      <div role="group" aria-label="Filtrar productos por categoría" className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
        {options.map((opt) => (
          <Chip key={opt.id} selected={opt.id === value} count={opt.count} onClick={() => onChange(opt.id)}>
            {opt.label}
          </Chip>
        ))}
      </div>
    </div>
  )
}
