import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Kanban, Trophy, BarChart3,
  GitBranch, Users, Bell, Zap, ChevronRight, Star, X,
} from 'lucide-react'
import { useStore } from '../../store/useStore'

const navItems = [
  { to: '/',            icon: LayoutDashboard, label: 'Dashboard'   },
  { to: '/board',       icon: Kanban,          label: 'Scrum Board' },
  { to: '/achievements',icon: Trophy,          label: 'Achievements'},
  { to: '/leaderboard', icon: Users,           label: 'Leaderboard' },
  { to: '/analytics',   icon: BarChart3,       label: 'Analytics'   },
  { to: '/bpmn',        icon: GitBranch,       label: 'BPMN Process'},
]

export default function Sidebar() {
  const { currentUser, notifications, sidebarOpen, setSidebarOpen } = useStore()
  const location = useLocation()
  const unread = notifications.filter(n => !n.read).length

  // Close sidebar on navigation (mobile)
  const handleNavClick = () => setSidebarOpen(false)

  const getLevelColor = level => {
    if (level >= 9) return 'text-yellow-400'
    if (level >= 7) return 'text-purple-400'
    if (level >= 5) return 'text-blue-400'
    return 'text-green-400'
  }

  return (
    <aside
      className={`w-64 min-h-screen bg-slate-900 border-r border-slate-700/50 flex flex-col fixed left-0 top-0 bottom-0 z-40 transition-transform duration-200 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}
    >
      {/* Logo + mobile close button */}
      <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-900/40">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide">ScrumQuest</h1>
            <p className="text-xs text-slate-400">Gamified BPMN</p>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Current Sprint Badge */}
      <div className="px-4 py-3 mx-4 mt-4 rounded-xl bg-violet-950/50 border border-violet-800/40">
        <p className="text-xs text-violet-400 font-medium uppercase tracking-wider">Active Sprint</p>
        <p className="text-sm font-semibold text-white mt-0.5">Sprint 5</p>
        <div className="mt-2 h-1.5 rounded-full bg-slate-700">
          <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500 w-[40%]" />
        </div>
        <p className="text-xs text-slate-400 mt-1">10 days remaining</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-700/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-violet-400' : 'text-slate-500 group-hover:text-slate-300'} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={14} className="text-violet-500" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/60 cursor-pointer transition-colors">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
              {currentUser.avatar}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-slate-900" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{currentUser.name}</p>
            <div className="flex items-center gap-1">
              <Star size={11} className={getLevelColor(currentUser.level)} />
              <p className="text-xs text-slate-400">Level {currentUser.level} · {currentUser.xp.toLocaleString()} XP</p>
            </div>
          </div>
          {unread > 0 && (
            <div className="relative">
              <Bell size={16} className="text-slate-400" />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                {unread}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
