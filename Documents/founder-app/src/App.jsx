import { useCountdown } from './hooks/useCountdown'
import { CountdownUnit } from './components/CountdownUnit'

const TARGET_DATE = new Date(import.meta.env.VITE_LAUNCH_DATE)
const PRODUCT_URL = import.meta.env.VITE_PRODUCT_URL

export default function App() {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(TARGET_DATE)

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center gap-12">

        <p className="text-neutral-600 text-xs tracking-widest uppercase">
          ShipTimer
        </p>

        {isExpired ? (
          <a
            href={PRODUCT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-thin text-4xl sm:text-5xl hover:text-neutral-300 transition-colors duration-300"
          >
            We&apos;re live →
          </a>
        ) : (
          <div className="flex items-end gap-4 sm:gap-8">
            <CountdownUnit value={days} label="days" />
            <span className="colon-blink text-neutral-700 text-6xl sm:text-7xl font-thin mb-7">:</span>
            <CountdownUnit value={hours} label="hours" />
            <span className="colon-blink text-neutral-700 text-6xl sm:text-7xl font-thin mb-7">:</span>
            <CountdownUnit value={minutes} label="minutes" />
            <span className="colon-blink text-neutral-700 text-6xl sm:text-7xl font-thin mb-7">:</span>
            <CountdownUnit value={seconds} label="seconds" />
          </div>
        )}

        <p className="text-neutral-700 text-xs tracking-widest">
          Launching Dec 31 · 11:59pm UTC
        </p>

      </div>
    </div>
  )
}
