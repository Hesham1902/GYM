import { NavLink } from 'react-router-dom'
import { Home, Dumbbell, PersonStanding, TrendingUp, BookOpen } from 'lucide-react'
import { useT } from '@/i18n'

const tabs = [
  { to: '/', key: 'nav.home', Icon: Home, end: true },
  { to: '/workout', key: 'nav.workout', Icon: Dumbbell },
  { to: '/posture', key: 'nav.posture', Icon: PersonStanding },
  { to: '/progress', key: 'nav.progress', Icon: TrendingUp },
  { to: '/library', key: 'nav.library', Icon: BookOpen },
] as const

export function TabBar() {
  const { t } = useT()
  return (
    <nav className="tabbar fixed bottom-0 inset-x-0 z-40 bg-bg/95 backdrop-blur border-t border-border flex">
      {tabs.map(({ to, key, Icon, ...rest }) => (
        <NavLink
          key={to}
          to={to}
          end={'end' in rest ? rest.end : false}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-0.5 text-[11px] tap ${isActive ? 'text-accent' : 'text-muted'}`
          }
        >
          <Icon size={24} strokeWidth={2} />
          <span>{t(key)}</span>
        </NavLink>
      ))}
    </nav>
  )
}
