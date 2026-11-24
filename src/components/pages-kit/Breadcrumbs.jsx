import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import Icon from '../ui/Icon.jsx'

/**
 * Migas de pan (única implementación; la usan PageHero y ProductDetail).
 *
 * @param {object} props
 * @param {{label: string, to?: string}[]} props.items ruta. El último ítem es la página
 *   actual: sin enlace y con aria-current="page". Los enlaces usan <Link> de react-router.
 * @param {boolean} [props.center=false] centra la lista (PageHero con align="center").
 * @param {string}  [props.className] clases extra para el <nav>.
 */
export default function Breadcrumbs({ items, center = false, className = '' }) {
  if (!items?.length) return null
  return (
    <nav aria-label="Ruta de navegación" className={className}>
      <ol className={`flex flex-wrap items-center gap-1 text-[14px] leading-5 ${center ? 'justify-center' : ''}`}>
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li key={`${item.label}-${i}`} className="flex min-w-0 items-center gap-1">
              {last || !item.to ? (
                <span
                  aria-current={last ? 'page' : undefined}
                  className="inline-flex min-h-10 min-w-0 items-center px-1 text-ink-soft"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.to}
                  className="fx-link inline-flex min-h-10 items-center rounded-[6px] px-1 font-medium text-brand hover:text-brand-hover"
                >
                  {item.label}
                </Link>
              )}
              {!last ? <Icon icon={ChevronRight} size={14} className="shrink-0 text-muted" /> : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
