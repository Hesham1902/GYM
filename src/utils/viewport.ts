/**
 * Bottom inset for the tab bar, measured instead of trusted.
 * iOS reports env(safe-area-inset-bottom) = 34px for the home indicator. Some iOS builds (WebKit bug
 * 301994) also stop the web view short of the screen bottom, so padding 34px again doubles the band.
 * We measure the real inset with a probe, subtract whatever the system already reserved
 * (screen height − viewport height, portrait only) and write the result to --sab.
 */
export function watchStandaloneViewport() {
  const probe = document.createElement('div')
  probe.style.cssText = 'position:fixed;left:0;bottom:0;width:1px;visibility:hidden;pointer-events:none;height:env(safe-area-inset-bottom,0px)'
  document.body.appendChild(probe)
  const apply = () => {
    const inset = probe.getBoundingClientRect().height || 0
    const portrait = window.innerHeight >= window.innerWidth
    const nav = navigator as Navigator & { standalone?: boolean }
    const standalone = window.matchMedia('(display-mode: standalone)').matches || nav.standalone === true
    const reserved = standalone && portrait ? Math.max(0, Math.max(screen.width, screen.height) - window.innerHeight) : 0
    const sab = Math.max(0, Math.min(inset, 34) - (reserved > 20 ? reserved : 0))
    document.documentElement.style.setProperty('--sab', `${Math.round(sab)}px`)
  }
  apply()
  window.addEventListener('resize', apply)
  window.addEventListener('orientationchange', apply)
  window.visualViewport?.addEventListener('resize', apply)
}
