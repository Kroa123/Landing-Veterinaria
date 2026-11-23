import { CheckCheck } from 'lucide-react'
import { LogoMark } from '../ui/Logo.jsx'
import { site } from '../../config/site.js'

// Teléfono con una conversación de WhatsApp de ejemplo (todo en código, sin imágenes).
// Cada burbuja lleva data-step (0, 1, 2) para que HowToBook la anime con el scroll.
// Es ilustrativo: se expone como una imagen con descripción para lectores de pantalla.

// muestra: conversación ilustrativa (nombres, horas y mascota de ejemplo)
const chat = [
  { step: 0, from: 'me', text: '¡Hola! Quiero agendar consulta para Luna 🐶 ¿Tienen el jueves?', time: '10:02' },
  { step: 1, from: 'typing' },
  { step: 1, from: 'vet', text: '¡Hola! Sí, el jueves a las 11:30 con la Dra. Rojas. ¿Te la reservo?', time: '10:04' },
  { step: 1, from: 'me', text: 'Perfecto, sí 🙌', time: '10:04' },
  { step: 2, from: 'vet', text: `Listo ✅ Jueves 11:30. Trae su carnet de vacunas. ${site.address.street}.`, time: '10:05' },
  { step: 2, from: 'card' },
]

function Bubble({ msg }) {
  if (msg.from === 'typing') {
    return (
      <div data-step={msg.step} className="chat-bubble chat-typing" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    )
  }
  if (msg.from === 'card') {
    return (
      <div data-step={msg.step} className="chat-bubble chat-card">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-mint">Hora confirmada</p>
        <p className="mt-1 text-[15px] font-semibold leading-5 text-on-night">Jueves · 11:30</p>
        <p className="text-[12px] leading-4 text-on-night-soft">Consulta general · Luna</p>
      </div>
    )
  }
  const mine = msg.from === 'me'
  return (
    <div data-step={msg.step} className={`chat-bubble ${mine ? 'chat-me' : 'chat-vet'}`}>
      <p>{msg.text}</p>
      <span className="chat-meta">
        {msg.time}
        {mine ? <CheckCheck size={13} strokeWidth={2} className="text-[#53BDEB]" aria-hidden="true" /> : null}
      </span>
    </div>
  )
}

export default function PhoneChat({ className = '' }) {
  return (
    <div
      role="img"
      aria-label="Ejemplo de conversación por WhatsApp: pides hora para tu mascota, te ofrecemos un horario y te confirmamos la reserva."
      className={`phone ${className}`}
    >
      <div className="phone-screen">
        <div className="phone-notch" />
        <div className="phone-header">
          <span className="flex size-9 items-center justify-center rounded-full bg-[#0f2a1f]">
            <LogoMark size={26} />
          </span>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold leading-4 text-on-night">{site.name}</p>
            <p className="text-[11px] leading-4 text-mint">en línea</p>
          </div>
        </div>
        <div className="phone-chat">
          <p className="chat-day">Hoy</p>
          {chat.map((msg, i) => (
            <Bubble key={i} msg={msg} />
          ))}
        </div>
        <div className="phone-input">
          <span className="flex-1 truncate">Escribe un mensaje</span>
          <span className="flex size-8 items-center justify-center rounded-full bg-mint" />
        </div>
      </div>
    </div>
  )
}
