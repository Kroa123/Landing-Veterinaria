import { ArrowRight, CalendarDays, Clock } from 'lucide-react'
import Container from '../ui/Container.jsx'
import Icon from '../ui/Icon.jsx'
import Button from '../ui/Button.jsx'
import Reveal from '../motion/Reveal.jsx'
import SplitHeading from '../decor/SplitHeading.jsx'
import SectionBackdrop from '../decor/SectionBackdrop.jsx'
import SpotCard from '../decor/SpotCard.jsx'
import VetAvatar from '../decor/VetAvatar.jsx'
import { prefillBooking } from '../../lib/booking.js'
import { team } from '../../data/team.js'

// Equipo: tarjetas premium con retrato ilustrado, especialidades y turno.
// El CTA "Agendar con…" precarga el motivo en el formulario de Contacto.
export default function Team() {
  return (
    <section id="equipo" aria-labelledby="equipo-title" className="theme-night relative isolate overflow-hidden py-24 lg:py-32">
      <SectionBackdrop glows="e" pattern="dots" />
      <Container>
        <SplitHeading
          id="equipo-title"
          eyebrow="Equipo"
          title={
            <>
              Las personas que van a <span className="text-glow">cuidar a tu mascota</span>
            </>
          }
          lede="Tres veterinarios que se turnan durante la semana. Si quieres atenderte siempre con la misma persona, dínoslo al agendar."
        />

        <Reveal as="ul" stagger={0.1} className="mt-14 grid gap-4 md:grid-cols-3 lg:gap-5">
          {team.map((vet, i) => (
            <li key={vet.name} className="flex">
              <SpotCard tilt={4} className="vet-card flex w-full flex-col rounded-[28px] border border-night-line p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <VetAvatar initials={vet.initials} hue={i} size={96} />
                  {vet.years ? (
                    <span className="rounded-full border border-night-line px-3 py-1 font-mono text-[12px] text-on-night-soft">
                      {vet.years} años de oficio
                    </span>
                  ) : null}
                </div>

                <h3 className="mt-6 text-[22px] font-medium leading-tight tracking-[-0.01em] text-on-night">{vet.name}</h3>
                <p className="mt-1 text-[15px] leading-6 text-on-night-soft">{vet.role}</p>

                {vet.tags?.length ? (
                  <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Especialidades">
                    {vet.tags.map((tag) => (
                      <li key={tag} className="rounded-full bg-mint/10 px-2.5 py-1 text-[12px] font-medium text-mint">
                        {tag}
                      </li>
                    ))}
                  </ul>
                ) : null}

                <p className="mt-5 flex items-start gap-2 border-t border-night-line pt-4 font-mono text-[13px] leading-5 tabular-nums text-on-night-soft">
                  <Icon icon={Clock} size={16} className="mt-0.5 text-mint" />
                  {vet.schedule}
                </p>

                <div className="vet-cta mt-auto pt-5">
                  <Button
                    href="#contacto"
                    variant="night-secondary"
                    onClick={() => prefillBooking({ notes: `Me gustaría atenderme con ${vet.name}` })}
                    className="w-full"
                  >
                    <Icon icon={CalendarDays} />
                    Agendar con {vet.shortName || vet.name}
                    <Icon icon={ArrowRight} className="vet-cta-arrow" />
                  </Button>
                </div>
              </SpotCard>
            </li>
          ))}
        </Reveal>
      </Container>
    </section>
  )
}
