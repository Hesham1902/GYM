let ctx: AudioContext | null = null

/** Call from a user gesture (Start workout / Start routine) so iOS allows later playback. */
export function unlockAudio() {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return
    ctx ??= new AC()
    if (ctx.state === 'suspended') ctx.resume().catch(() => {})
    // play a silent blip to fully unlock on iOS
    const o = ctx.createOscillator(), g = ctx.createGain()
    g.gain.value = 0.0001; o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.02)
  } catch { /* ignore */ }
}

export function resumeAudio() { if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {}) }

function tone(freq: number, at: number, dur: number, vol = 0.25) {
  if (!ctx) return
  const o = ctx.createOscillator(), g = ctx.createGain()
  o.type = 'sine'; o.frequency.value = freq
  g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(vol, at + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, at + dur)
  o.connect(g).connect(ctx.destination); o.start(at); o.stop(at + dur + 0.05)
}

export function beep(kind: 'done' | 'tick' | 'switch' = 'done', sound = true, vibration = true) {
  if (sound && ctx) {
    resumeAudio()
    const t = ctx.currentTime
    if (kind === 'done') { tone(880, t, 0.15); tone(1175, t + 0.18, 0.25) }
    else if (kind === 'switch') { tone(660, t, 0.12); tone(660, t + 0.16, 0.12); tone(880, t + 0.32, 0.2) }
    else tone(1000, t, 0.06, 0.15)
  }
  if (vibration && 'vibrate' in navigator) { try { navigator.vibrate(kind === 'done' ? [120, 60, 160] : kind === 'switch' ? [80, 50, 80, 50, 120] : 30) } catch { /* ignore */ } }
}

export const supportsVibration = typeof navigator !== 'undefined' && 'vibrate' in navigator
