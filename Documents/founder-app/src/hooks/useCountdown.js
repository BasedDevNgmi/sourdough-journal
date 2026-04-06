import { useState, useEffect } from 'react'

function computeTimeLeft(targetDate) {
  const diff = targetDate.getTime() - Date.now()
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true }
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isExpired: false,
  }
}

export function useCountdown(targetDate) {
  if (isNaN(targetDate.getTime())) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true }
  }

  const [timeLeft, setTimeLeft] = useState(() => computeTimeLeft(targetDate))

  useEffect(() => {
    const recompute = () => setTimeLeft(computeTimeLeft(targetDate))

    const id = setInterval(recompute, 1000)
    document.addEventListener('visibilitychange', recompute)

    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', recompute)
    }
  }, [targetDate.getTime()])

  return timeLeft
}
