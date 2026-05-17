import { useState, useRef, useEffect } from 'react'
import { Search, Bell, Settings, X, CheckCircle2, AlertCircle, Info, Menu } from 'lucide-react'
import { useStore } from '../../store/useStore'

const PRIORITY_COLORS = {
  high: 'text-red-400',
  medium: 'text-yellow-400',
  low: 'text-green-400',
}

export default function Header({ title, subtitle }) {
  const { notifications, markNotificationRead, sprint, backlog, setSidebarOpen } = useStore()
  const [showNotifications, setShowNotifications] = useState(false)
  const [search, setSearch] = useState('')
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef(null)
  const unread = notifications.filter(n => !n.read).length

  const allSprintTasks = sprint
    ? Object.values(sprint.columns).flatMap(col =>
        col.tasks.map(t => ({ ...t, columnTitle: col.title }))
      )
    : []

  const searchResults =
    search.trim().length >= 2
      ? [
          ...allSprintTasks.filter(
            t =>
              t.title.toLowerCase().includes(search.toLowerCase()) ||
              t.description?.toLowerCase().includes(search.toLowerCase())
          ),
          ...(backlog || [])
            .filter(
              t =>
                t.title.toLowerCase().includes(search.toLowerCase()) ||
                t.description?.toLowerCase().includes(search.toLowerCase())
            )
            .map(t => ({ ...t, columnTitle: 'Backlog' })),
        ]
      : []

  useEffect(() => {
    const handler = e => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const typeIcon = {
    info: <Info size={14} className="text-blue-400" />,
    achievement: <CheckCircle2 size={14} className="text-yellow-400" />,
    bug: <AlertCircle size={14} className="text-red-400" />,
  }

  return (
    <header className="h-14 lg:h-16 bg-slate-900/80 backdrop-blur border-b border-slate-700/50 flex items-center px-4 lg:px-6 gap-3 sticky top-0 z-30">
      {/* Mobile hamburger */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors flex-shrink-0"
      >
        <Menu size={18} />
      </button>

      <div className="flex-1 min-w-0">
        <h2 className="text-base lg:text-lg font-semibold text-white truncate">{title}</h2>
        {subtitle && (
          <p className="text-xs text-slate-400 hidden sm:block truncate">{subtitle}</p>
        )}
      </div>

      {/* Search */}
      <div className="relative" ref={searchRef}>
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
        />
        <input
          value={search}
          onChange={e => {
            setSearch(e.target.value)
            setShowResults(true)
          }}
          onFocus={() => setShowResults(true)}
          placeholder="Search tasks…"
          className="w-36 sm:w-52 pl-9 pr-8 py-1.5 text-sm bg-slate-800 border border-slate-700 rounded-lg text-slate-300 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-colors"
        />
        {search && (
          <button
            onClick={() => {
              setSearch('')
              setShowResults(false)
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
          >
            <X size={13} />
          </button>
        )}

        {/* Results dropdown */}
        {showResults && search.trim().length >= 2 && (
          <div className="absolute right-0 top-full mt-1 w-72 sm:w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
            {searchResults.length === 0 ? (
              <p className="text-sm text-slate-500 px-4 py-3 text-center">No tasks found</p>
            ) : (
              <div className="max-h-64 overflow-y-auto">
                {searchResults.map(task => (
                  <div
                    key={task.id}
                    onClick={() => setShowResults(false)}
                    className="px-3 py-2.5 hover:bg-slate-700/60 transition-colors border-b border-slate-700/40 last:border-0 cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm text-white font-medium truncate">{task.title}</p>
                      <span className="text-xs text-slate-400 flex-shrink-0">{task.storyPoints} SP</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-500">{task.columnTitle}</span>
                      <span className={`text-xs ${PRIORITY_COLORS[task.priority] || 'text-slate-400'}`}>
                        {task.priority}
                      </span>
                      <span className="text-xs text-slate-600">{task.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className="relative flex-shrink-0">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <Bell size={18} />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
              {unread}
            </span>
          )}
        </button>

        {showNotifications && (
          <div className="absolute right-0 top-12 w-72 sm:w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-xl shadow-black/40 z-50 overflow-hidden">
            <div className="p-3 border-b border-slate-700 flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Notifications</span>
              {unread > 0 && <span className="text-xs text-violet-400">{unread} unread</span>}
            </div>
            <div className="max-h-72 overflow-y-auto">
              {notifications.map(n => (
                <button
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-slate-700/50 transition-colors border-b border-slate-700/50 last:border-0 ${
                    !n.read ? 'bg-slate-700/20' : ''
                  }`}
                >
                  <span className="mt-0.5 flex-shrink-0">{typeIcon[n.type]}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-snug ${n.read ? 'text-slate-400' : 'text-slate-200'}`}>
                      {n.message}
                    </p>
                  </div>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-violet-500 mt-1.5 flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <button className="hidden sm:flex p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors flex-shrink-0">
        <Settings size={18} />
      </button>
    </header>
  )
}
