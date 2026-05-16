import { useStore } from '../store/useStore'
import Header from '../components/layout/Header'
import { Trophy, Zap, Shield, Clock, Users, Flame, Star, Lock, TrendingUp } from 'lucide-react'

const BADGES = [
  {
    id: 'sprint_hero',
    name: 'Sprint Hero',
    description: 'Complete all assigned tasks in a sprint',
    icon: Trophy,
    color: 'from-yellow-500 to-orange-500',
    glow: 'shadow-yellow-900/40',
    border: 'border-yellow-700/50',
    xpReward: 500,
    requirement: 'Complete 100% of sprint tasks',
  },
  {
    id: 'bug_hunter',
    name: 'Bug Hunter',
    description: 'Find and fix 10+ bugs in a single sprint',
    icon: Shield,
    color: 'from-red-500 to-rose-600',
    glow: 'shadow-red-900/40',
    border: 'border-red-700/50',
    xpReward: 350,
    requirement: 'Fix 10 bugs in one sprint',
  },
  {
    id: 'deadline_master',
    name: 'Deadline Master',
    description: 'Deliver tasks on time for 3 consecutive sprints',
    icon: Clock,
    color: 'from-blue-500 to-cyan-500',
    glow: 'shadow-blue-900/40',
    border: 'border-blue-700/50',
    xpReward: 400,
    requirement: '3 sprints with 100% on-time delivery',
  },
  {
    id: 'team_player',
    name: 'Team Player',
    description: 'Help at least 3 teammates with their tasks',
    icon: Users,
    color: 'from-green-500 to-emerald-500',
    glow: 'shadow-green-900/40',
    border: 'border-green-700/50',
    xpReward: 300,
    requirement: 'Assist 3+ teammates in one sprint',
  },
  {
    id: 'streak_champion',
    name: 'Streak Champion',
    description: 'Maintain a 7-day activity streak',
    icon: Flame,
    color: 'from-orange-500 to-amber-500',
    glow: 'shadow-orange-900/40',
    border: 'border-orange-700/50',
    xpReward: 450,
    requirement: '7 days of consecutive activity',
  },
  {
    id: 'productivity',
    name: 'Productivity God',
    description: 'Complete 40+ tasks in a single sprint',
    icon: TrendingUp,
    color: 'from-purple-500 to-violet-600',
    glow: 'shadow-purple-900/40',
    border: 'border-purple-700/50',
    xpReward: 600,
    requirement: 'Complete 40 tasks in one sprint',
  },
]

const LEVELS = [
  { level: 1, title: 'Newcomer', minXP: 0, maxXP: 500, color: 'text-slate-400' },
  { level: 2, title: 'Apprentice', minXP: 500, maxXP: 1000, color: 'text-green-400' },
  { level: 3, title: 'Developer', minXP: 1000, maxXP: 2000, color: 'text-green-400' },
  { level: 4, title: 'Contributor', minXP: 2000, maxXP: 3000, color: 'text-blue-400' },
  { level: 5, title: 'Specialist', minXP: 3000, maxXP: 4000, color: 'text-blue-400' },
  { level: 6, title: 'Expert', minXP: 4000, maxXP: 5000, color: 'text-violet-400' },
  { level: 7, title: 'Senior', minXP: 5000, maxXP: 6500, color: 'text-violet-400' },
  { level: 8, title: 'Master', minXP: 6500, maxXP: 8000, color: 'text-yellow-400' },
  { level: 9, title: 'Grand Master', minXP: 8000, maxXP: 10000, color: 'text-yellow-400' },
  { level: 10, title: 'Legend', minXP: 10000, maxXP: Infinity, color: 'text-orange-400' },
]

function BadgeCard({ badge, earned }) {
  const Icon = badge.icon
  return (
    <div className={`relative rounded-2xl border p-5 flex flex-col items-center text-center gap-3 transition-all ${
      earned
        ? `bg-slate-800/80 ${badge.border} hover:scale-105`
        : 'bg-slate-900/50 border-slate-800/50 opacity-50 grayscale'
    }`}>
      {earned && (
        <div className="absolute top-3 right-3">
          <Star size={14} className="text-yellow-400 fill-yellow-400" />
        </div>
      )}
      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${badge.color} flex items-center justify-center shadow-lg ${badge.glow} ${!earned ? 'opacity-30' : ''}`}>
        {earned ? <Icon size={30} className="text-white" /> : <Lock size={22} className="text-white" />}
      </div>
      <div>
        <h3 className={`text-sm font-bold ${earned ? 'text-white' : 'text-slate-500'}`}>{badge.name}</h3>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{badge.description}</p>
      </div>
      <div className={`text-xs px-3 py-1 rounded-full ${earned ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800/50' : 'bg-slate-800 text-slate-500'}`}>
        {earned ? `+${badge.xpReward} XP earned` : badge.requirement}
      </div>
    </div>
  )
}

function MemberXPCard({ member }) {
  const currentLevelData = LEVELS.find(l => l.level === member.level) || LEVELS[0]
  const nextLevelData = LEVELS.find(l => l.level === member.level + 1)
  const progressToNext = nextLevelData
    ? Math.round(((member.xp - currentLevelData.minXP) / (nextLevelData.minXP - currentLevelData.minXP)) * 100)
    : 100
  const xpToNext = nextLevelData ? nextLevelData.minXP - member.xp : 0

  return (
    <div className="bg-slate-800/60 border border-slate-700/40 rounded-2xl p-4 flex items-center gap-4">
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-base font-bold text-white">
          {member.avatar}
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
          <span className="text-xs font-bold text-violet-400">{member.level}</span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-sm font-semibold text-white">{member.name}</p>
            <p className={`text-xs font-medium ${currentLevelData.color}`}>{currentLevelData.title}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-violet-400">{member.xp.toLocaleString()} XP</p>
            {nextLevelData && <p className="text-xs text-slate-500">{xpToNext.toLocaleString()} to Lv.{member.level + 1}</p>}
          </div>
        </div>
        <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-600 to-purple-500 transition-all"
            style={{ width: `${progressToNext}%` }}
          />
        </div>
        <div className="flex gap-1 mt-2 flex-wrap">
          {member.badges.map(b => {
            const badge = BADGES.find(bd => bd.id === b)
            if (!badge) return null
            const Icon = badge.icon
            return (
              <div key={b} title={badge.name} className={`w-5 h-5 rounded bg-gradient-to-br ${badge.color} flex items-center justify-center`}>
                <Icon size={11} className="text-white" />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function Achievements() {
  const { teamMembers, currentUser } = useStore()
  const currentLevelData = LEVELS.find(l => l.level === currentUser.level) || LEVELS[0]
  const nextLevelData = LEVELS.find(l => l.level === currentUser.level + 1)
  const progressToNext = nextLevelData
    ? Math.round(((currentUser.xp - currentLevelData.minXP) / (nextLevelData.minXP - currentLevelData.minXP)) * 100)
    : 100

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Achievement Center" subtitle="XP, badges, and level progression" />

      <main className="flex-1 p-6 space-y-6">
        {/* Current User XP Card */}
        <div className="bg-gradient-to-r from-violet-900/40 to-purple-900/20 border border-violet-800/30 rounded-2xl p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-violet-900/40">
                {currentUser.avatar}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-slate-900 border-2 border-violet-600 flex items-center justify-center">
                <span className="text-xs font-bold text-violet-400">{currentUser.level}</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold text-white">{currentUser.name}</h2>
                <span className={`text-sm font-semibold ${currentLevelData.color}`}>{currentLevelData.title}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Progress to {nextLevelData?.title || 'Max Level'}</span>
                <span className="text-sm font-bold text-violet-400">{currentUser.xp.toLocaleString()} XP</span>
              </div>
              <div className="h-3 rounded-full bg-slate-700/80 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500 transition-all relative"
                  style={{ width: `${progressToNext}%` }}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/30 rounded-full" />
                </div>
              </div>
              {nextLevelData && (
                <p className="text-xs text-slate-400 mt-1.5">
                  {(nextLevelData.minXP - currentUser.xp).toLocaleString()} XP until Level {currentUser.level + 1}
                </p>
              )}
            </div>
            <div className="hidden md:grid grid-cols-3 gap-3">
              <div className="text-center bg-slate-800/60 rounded-xl p-3">
                <p className="text-xl font-bold text-yellow-400">{currentUser.badges.length}</p>
                <p className="text-xs text-slate-400">Badges</p>
              </div>
              <div className="text-center bg-slate-800/60 rounded-xl p-3">
                <p className="text-xl font-bold text-green-400">{currentUser.tasksCompleted}</p>
                <p className="text-xs text-slate-400">Tasks</p>
              </div>
              <div className="text-center bg-slate-800/60 rounded-xl p-3">
                <p className="text-xl font-bold text-orange-400">{currentUser.streak}</p>
                <p className="text-xs text-slate-400">Streak</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Badges Grid */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Trophy size={16} className="text-yellow-400" />
              Badges & Achievements
              <span className="text-xs text-slate-500">({currentUser.badges.length}/{BADGES.length} earned)</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {BADGES.map(badge => (
                <BadgeCard key={badge.id} badge={badge} earned={currentUser.badges.includes(badge.id)} />
              ))}
            </div>
          </div>

          {/* Team XP Progress */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Zap size={16} className="text-violet-400" />
              Team XP Progress
            </h3>
            <div className="space-y-3">
              {[...teamMembers].sort((a, b) => b.xp - a.xp).map(m => (
                <MemberXPCard key={m.id} member={m} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
