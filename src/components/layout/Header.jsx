import { useState } from 'react'
import { Search, Bell, Settings, X, CheckCircle2, AlertCircle, Info } from 'lucide-react'
import { useStore } from '../../store/useStore'

export default function Header({ title, subtitle }) {
  const { notifications, markNotificationRead } = useStore()
  const [showNotifications, setShowNotifications] = useState(false)
  const [search, setSearch] = useState('')
  const unread = notifications.filter(n => !n.read).length

  const typeIcon = {
    info: <Info size={14} className="text-blue-400" />,
    achievement: <CheckCircle2 size={14} className="text-yellow-400" />,
    bug: <AlertCircle size={14} className="text-red-400" />,
  }

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur border-b border-slate-700/50 flex items-center px-6 gap-4 sticky top-0 z-30">
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search tasks, members..."
          className="w-56 pl-9 pr-4 py-2 text-sm bg-slate-800 border border-slate-700 rounded-lg text-slate-300 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-colors"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Notifications */}
      <div className="relative">
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
          <div className="absolute right-0 top-12 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-xl shadow-black/40 z-50 overflow-hidden">
            <div className="p-3 border-b border-slate-700 flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Notifications</span>
              {unread > 0 && <span className="text-xs text-violet-400">{unread} unread</span>}
            </div>
            <div className="max-h-72 overflow-y-auto">
              {notifications.map(n => (
                <button
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-slate-700/50 transition-colors border-b border-slate-700/50 last:border-0 ${!n.read ? 'bg-slate-700/20' : ''}`}
                >
                  <span className="mt-0.5 flex-shrink-0">{typeIcon[n.type]}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-snug ${n.read ? 'text-slate-400' : 'text-slate-200'}`}>{n.message}</p>
                  </div>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-violet-500 mt-1.5 flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <button className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors">
        <Settings size={18} />
      </button>
    </header>
  )
}
