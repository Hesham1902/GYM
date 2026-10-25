import { useEffect, useState } from 'react'

/** Ticks while visible; recomputes immediately when the page becomes visible again. */
export function useNow(intervalMs = 250, active = true): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!active) return
    let id: number | undefined
    const start = () => { stop(); setNow(Date.now()); id = window.setInterval(() => setNow(Date.now()), intervalMs) }
    const stop = () => { if (id) { clearInterval(id); id = undefined } }
    const onVis = () => (document.visibilityState === 'visible' ? start() : stop())
    start()
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('pageshow', start)
    window.addEventListener('focus', start)
    return () => { stop(); document.removeEventListener('visibilitychange', onVis); window.removeEventListener('pageshow', start); window.removeEventListener('focus', start) }
  }, [intervalMs, active])
  return now
}
