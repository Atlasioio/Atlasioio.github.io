import { useEffect, useState } from 'react'

function format(timeZone: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
  }).format(new Date())
}

/**
 * Live HH:MM clock for a given IANA timezone (default Stockholm), refreshed
 * each half-minute. A small "there's a real person here" touch for the outro.
 */
export function useLocalTime(timeZone = 'Europe/Stockholm'): string {
  const [time, setTime] = useState(() => format(timeZone))

  useEffect(() => {
    const id = window.setInterval(() => setTime(format(timeZone)), 30_000)
    return () => window.clearInterval(id)
  }, [timeZone])

  return time
}
