import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useStore } from '../../store/useStore'

export default function AppLayout() {
  const { sidebarOpen, setSidebarOpen } = useStore()

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar />

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen overflow-hidden">
        <Outlet />
      </div>
    </div>
  )
}
