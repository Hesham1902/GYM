import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { TabBar } from '@/components/TabBar'
import { Toasts } from '@/components/Toast'
import { useApplyLocale } from '@/i18n'
import { useUi } from '@/stores/uiStore'
import DashboardPage from '@/features/dashboard/DashboardPage'
import WorkoutPage from '@/features/workout/WorkoutPage'
import SummaryPage from '@/features/workout/SummaryPage'
import PosturePage from '@/features/posture/PosturePage'
import PlayerPage from '@/features/posture/PlayerPage'
import TipsPage from '@/features/posture/TipsPage'
import ProgressPage from '@/features/history/ProgressPage'
import SessionPage from '@/features/history/SessionPage'
import AnalyticsPage from '@/features/analytics/AnalyticsPage'
import BodyPage from '@/features/body/BodyPage'
import PhotosPage from '@/features/photos/PhotosPage'
import LibraryPage from '@/features/library/LibraryPage'
import ExercisePage from '@/features/library/ExercisePage'
import SettingsPage from '@/features/settings/SettingsPage'

const NO_TAB = ['/workout/live', '/posture/play']

export default function App() {
  useApplyLocale()
  const loc = useLocation()
  const setOnline = useUi((s) => s.setOnline)
  useEffect(() => {
    const on = () => setOnline(true), off = () => setOnline(false)
    window.addEventListener('online', on); window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [setOnline])
  useEffect(() => { window.scrollTo(0, 0) }, [loc.pathname])
  const hideTab = NO_TAB.some((p) => loc.pathname.startsWith(p))
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/workout" element={<WorkoutPage />} />
        <Route path="/workout/live" element={<WorkoutPage live />} />
        <Route path="/workout/summary/:id" element={<SummaryPage />} />
        <Route path="/posture" element={<PosturePage />} />
        <Route path="/posture/play/:routineId" element={<PlayerPage />} />
        <Route path="/posture/tips" element={<TipsPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/history/:id" element={<SessionPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/body" element={<BodyPage />} />
        <Route path="/photos" element={<PhotosPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/library/:exerciseId" element={<ExercisePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!hideTab && <TabBar />}
      <Toasts />
    </div>
  )
}
