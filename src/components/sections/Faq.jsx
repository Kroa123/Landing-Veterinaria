import { useId, useState } from 'react'
import { MessageCircle, Phone, Plus } from 'lucide-react'
import Container from '../ui/Container.jsx'
import Reveal from '../motion/Reveal.jsx'
import Icon from '../ui/Icon.jsx'
import Button from '../ui/Button.jsx'
import SplitHeading from '../decor/SplitHeading.jsx'
import SectionBackdrop from '../decor/SectionBackdrop.jsx'
import { questionUrl } from '../../lib/booking.js'
import { site } from '../../config/site.js'
import { faq } from '../../data/faq.js'

function FaqItem({ item, open, onToggle }) {
  const id = useId()
  const buttonId = `${id}-boton`
  const panelId = `${id}-panel`

  return (
    <li className={`faq-item rounded-[20px] border transition-colors ${open ? 'is-open border-brand/30' : 'border-line'}`}>
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="group flex min-h-16 w-full items-center justify-between gap-6 px-5 py-4 text-left text-[17px] font-medium leading-6 text-ink transition-colors hover:text-brand-hover sm:px-6"
        >
          {item.q}
          <span
            className={`flex size-9 shrink-0 items-center justify-center rounded-full border transition-[background-color,border-color,color,rotate] duration-300 ${
              open
                ? 'rotate-45 border-brand bg-brand text-white'
                : 'border-line-strong bg-card text-ink-soft group-hover:border-brand group-hover:text-brand-hover'
            }`}
            aria-hidden="true"
          >
            <Icon icon={Plus} />
          </span>
        </button>
      </h3>
      {/* Apertura suave (grid-rows) en styles.css: .faq-panel. Cerrado queda con
          visibility hidden, fuera del árbol de accesibilidad como con hidden. */}
      <div id={panelId} role="region" aria-labelledby={buttonId} data-open={open} className="faq-panel">
        <div>
          <p className="max-w-[40rem] px-5 pb-6 text-[16px] leading-[1.65] text-ink-soft sm:px-6">{item.a}</p>
        </div>
      </div>
    </li>
  )
}

// Preguntas frecuentes: a la izquierda el título fijo (sticky) y una tarjeta CTA de
// WhatsApp; a la derecha el acordeón con indicador brand en la pregunta abierta.
// Props: id (ancla, "faq" en Nosotros: /nosotros#faq), items (lista a mostrar; por defecto todas),
// title (título alternativo), band (fondo de la sección, clase .band-*; page por defecto).
export default function Faq({ id = 'faq', items = faq, title, band = 'page' }) {
  const [openIndex, setOpenIndex] = useState(0)
  const titleId = `${id}-title`

  if (!items.length) return null

  return (
    <section id={id} aria-labelledby={titleId} className={`band-${band} relative isolate overflow-clip py-24 lg:py-32`}>
      <SectionBackdrop glows="b" pattern="none" />
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SplitHeading
            id={titleId}
            eyebrow="Preguntas frecuentes"
            size="md"
            title={
              title || (
                <>
                  Respuestas <span className="text-highlight">antes de venir</span>
                </>
              )
            }
          />
          <Reveal className="cta-card mt-8 rounded-[28px] border border-line p-6 sm:p-7">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-leaf text-ink" aria-hidden="true">
              <MessageCircle size={22} strokeWidth={1.75} />
            </span>
            <p className="mt-5 text-[22px] font-medium leading-tight tracking-[-0.01em] text-ink">¿Otra duda?</p>
            <p className="mt-2 text-[15px] leading-6 text-ink-soft">
              Escríbenos por WhatsApp y te responde una persona del equipo, no un bot.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button href={questionUrl} external variant="primary">
                <Icon icon={MessageCircle} />
                Escribir por WhatsApp
                <span className="sr-only"> (se abre en otra pestaña)</span>
              </Button>
              <Button href={site.phone.href} variant="secondary">
                <Icon icon={Phone} />
                Llamar
                <span className="sr-only">: {site.phone.display}</span>
              </Button>
            </div>
          </Reveal>
        </div>

        <Reveal as="ul" stagger={0.06} className="space-y-3">
          {items.map((item, i) => (
            <FaqItem
              key={item.q}
              item={item}
              open={openIndex === i}
              onToggle={() => setOpenIndex((cur) => (cur === i ? -1 : i))}
            />
          ))}
        </Reveal>
      </Container>
    </section>
  )
}
