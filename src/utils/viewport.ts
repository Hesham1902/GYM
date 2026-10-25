/**
 * iOS 26.5+/27 home-screen apps can get a web view that stops short of the screen bottom
 * (WebKit bug 301994): the system paints that strip itself and the home indicator sits in it.
 * Padding the tab bar for the home indicator on top of that strip doubles the black band,
 * so when the web view is shorter than the screen while still drawing under the status bar,
 * the bottom inset is dropped.
 */
export function watchStandaloneViewport() {
  const nav = navigator as Navigator & { standalone?: boolean }
  const standalone = window.matchMedia('(display-mode: standalone)').matches || nav.standalone === true
  if (!standalone || screen.width >= 600) return
  const probe = document.createElement('div')
  probe.style.cssText = 'position:fixed;visibility:hidden;pointer-events:none;padding-top:env(safe-area-inset-top,0px)'
  document.body.appendChild(probe)
  const apply = () => {
    const portrait = window.innerHeight > window.innerWidth
    const gap = portrait ? Math.max(screen.width, screen.height) - window.innerHeight : 0
    const sat = parseFloat(getComputedStyle(probe).paddingTop) || 0
    document.documentElement.classList.toggle('short-viewport', gap > 20 && sat > 0)
  }
  apply()
  window.addEventListener('resize', apply)
  window.addEventListener('orientationchange', apply)
}
