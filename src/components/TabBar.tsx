import { NavLink } from 'react-router-dom'
import { Home, Dumbbell, PersonStanding, TrendingUp, BookOpen } from 'lucide-react'
import { useT } from '@/i18n'

const tabs = [
  { to: '/', key: 'nav.home', Icon: Home, end: true },
  { to: '/workout', key: 'nav.workout', Icon: Dumbbell, end: false },
  { to: '/posture', key: 'nav.posture', Icon: PersonStanding, end: false },
  { to: '/progress', key: 'nav.progress', Icon: TrendingUp, end: false },
  { to: '/library', key: 'nav.library', Icon: BookOpen, end: false },
] as const

export function TabBar() {
  const { t } = useT()
  return (
    <nav className="tabbar fixed bottom-0 inset-x-0 z-40 bg-bg/92 backdrop-blur-md border-t border-border flex" aria-label="Main">
      {tabs.map(({ to, key, Icon, end }) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex-1 flex flex-col items-center justify-center gap-1 text-[11px] font-medium ${isActive ? 'text-accent' : 'text-muted'}`}>
          {({ isActive }) => (<>
            <span className={`h-7 w-12 rounded-full flex items-center justify-center transition ${isActive ? 'bg-accent/15' : ''}`}><Icon size={22} strokeWidth={2.2} /></span>
            <span>{t(key)}</span>
          </>)}
        </NavLink>
      ))}
    </nav>
  )
}
