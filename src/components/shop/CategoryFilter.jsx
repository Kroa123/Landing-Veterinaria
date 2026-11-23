// Filtro de categorías como grupo de botones con aria-pressed.
export default function CategoryFilter({ options, value, onChange }) {
  return (
    <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0" >
      <div role="group" aria-label="Filtrar productos por categoría" className="flex w-max gap-2">
        {options.map((opt) => {
          const active = opt.id === value
          return (
            <button
              key={opt.id}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(opt.id)}
              className={`inline-flex min-h-11 items-center gap-2 rounded-control border px-4 text-[15px] transition-colors ${
                active
                  ? 'border-pine bg-pine-soft font-medium text-pine'
                  : 'border-line-strong bg-card text-ink-soft hover:bg-raised hover:text-ink'
              }`}
            >
              {opt.label}
              <span className={`font-mono text-[12px] tabular-nums ${active ? 'text-pine' : 'text-muted'}`}>
                {opt.count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
