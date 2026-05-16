import { useState } from 'react'
import { useStore } from '../store/useStore'
import Header from '../components/layout/Header'
import { Trophy, Medal, Star, Zap, CheckCircle2, Bug, Flame, TrendingUp } from 'lucide-react'

const SORT_OPTIONS = [
  { key: 'xp', label: 'Total XP', icon: Zap },
  { key: 'tasksCompleted', label: 'Tasks Done', icon: CheckCircle2 },
  { key: 'bugsFixed', label: 'Bugs Fixed', icon: Bug },
  { key: 'streak', label: 'Streak', icon: Flame },
]

const BADGE_ICONS = {
  sprint_hero: { icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-900/30' },
  bug_hunter: { icon: Bug, color: 'text-red-400', bg: 'bg-red-900/30' },
  deadline_master: { icon: Star, color: 'text-blue-400', bg: 'bg-blue-900/30' },
  team_player: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-900/30' },
  streak_champion: { icon: Flame, color: 'text-orange-400', bg: 'bg-orange-900/30' },
  productivity: { icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-900/30' },
}

const RANK_STYLES = [
  { bg: 'from-yellow-900/30 to-amber-900/10', border: 'border-yellow-700/40', badge: 'text-yellow-400', icon: <Trophy size={18} className="text-yellow-400 fill-yellow-400" /> },
  { bg: 'from-slate-700/30 to-slate-800/10', border: 'border-slate-600/40', badge: 'text-slate-300', icon: <Medal size={18} className="text-slate-300 fill-slate-300" /> },
  { bg: 'from-orange-900/20 to-amber-900/10', border: 'border-orange-800/40', badge: 'text-orange-400', icon: <Medal size={18} className="text-orange-400 fill-orange-400" /> },
]

function RankCard({ member, rank, sortKey, maxValue }) {
  const style = RANK_STYLES[rank - 1] || {}
  const isTop3 = rank <= 3
  const pct = Math.round((member[sortKey] / maxValue) * 100)

  return (
    <div className={`rounded-2xl border p-5 transition-all hover:scale-[1.01] ${
      isTop3
        ? `bg-gradient-to-r ${style.bg} ${style.border}`
        : 'bg-slate-800/50 border-slate-700/40'
    }`}>
      <div className="flex items-center gap-4">
        {/* Rank */}
        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
          isTop3 ? 'bg-slate-900/60' : 'bg-slate-700/40'
        }`}>
          {isTop3 ? style.icon : <span className="text-sm font-bold text-slate-400">#{rank}</span>}
        </div>

        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-base font-bold text-white ${isTop3 ? 'ring-2 ring-violet-500/40' : ''}`}>
            {member.avatar}
          </div>
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center border border-slate-700 ${isTop3 ? style.badge : 'text-slate-400'}`}>
            <span className="text-xs font-bold">{member.level}</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className={`text-sm font-bold ${isTop3 ? 'text-white' : 'text-slate-200'}`}>{member.name}</p>
            {member.streak >= 7 && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-orange-900/40 text-orange-400 flex items-center gap-0.5">
                <Flame size={10} />
                {member.streak}d
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">{member.role}</p>
          {/* Stat bar */}
          <div className="mt-2 h-1.5 rounded-full bg-slate-700/60 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-600 to-purple-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-3 flex-shrink-0">
          <div className="text-center">
            <p className={`text-lg font-bold ${isTop3 ? style.badge : 'text-violet-400'}`}>
              {sortKey === 'xp' ? member.xp.toLocaleString() : member[sortKey]}
            </p>
            <p className="text-xs text-slate-500 capitalize">{sortKey === 'xp' ? 'XP' : sortKey.replace(/([A-Z])/g, ' $1').trim()}</p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex gap-1 flex-shrink-0">
          {member.badges.slice(0, 3).map(b => {
            const cfg = BADGE_ICONS[b]
            if (!cfg) return null
            const Icon = cfg.icon
            return (
              <div key={b} title={b.replace(/_/g, ' ')} className={`w-7 h-7 rounded-lg ${cfg.bg} flex items-center justify-center`}>
                <Icon size={14} className={cfg.color} />
              </div>
            )
          })}
          {member.badges.length > 3 && (
            <div className="w-7 h-7 rounded-lg bg-slate-700/50 flex items-center justify-center text-xs text-slate-400">
              +{member.badges.length - 3}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Leaderboard() {
  const { teamMembers } = useStore()
  const [sortKey, setSortKey] = useState('xp')

  const sorted = [...teamMembers].sort((a, b) => b[sortKey] - a[sortKey])
  const maxValue = sorted[0]?.[sortKey] || 1

  const totals = {
    xp: teamMembers.reduce((s, m) => s + m.xp, 0),
    tasksCompleted: teamMembers.reduce((s, m) => s + m.tasksCompleted, 0),
    bugsFixed: teamMembers.reduce((s, m) => s + m.bugsFixed, 0),
    badges: teamMembers.reduce((s, m) => s + m.badges.length, 0),
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Team Leaderboard" subtitle="Ranked by performance and contributions" />

      <main className="flex-1 p-6 space-y-6">
        {/* Team Totals */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Team XP', value: totals.xp.toLocaleString(), icon: Zap, color: 'text-violet-400' },
            { label: 'Tasks Done', value: totals.tasksCompleted, icon: CheckCircle2, color: 'text-green-400' },
            { label: 'Bugs Fixed', value: totals.bugsFixed, icon: Bug, color: 'text-red-400' },
            { label: 'Badges Earned', value: totals.badges, icon: Trophy, color: 'text-yellow-400' },
          ].map(s => (
            <div key={s.label} className="bg-slate-800/60 border border-slate-700/40 rounded-2xl p-4 flex items-center gap-3">
              <s.icon size={20} className={s.color} />
              <div>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-slate-400">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Sort Tabs */}
        <div className="flex gap-2 flex-wrap">
          {SORT_OPTIONS.map(opt => {
            const Icon = opt.icon
            return (
              <button
                key={opt.key}
                onClick={() => setSortKey(opt.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  sortKey === opt.key
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40'
                    : 'bg-slate-800/60 text-slate-400 border border-slate-700/50 hover:text-slate-200 hover:border-slate-600'
                }`}
              >
                <Icon size={15} />
                {opt.label}
              </button>
            )
          })}
        </div>

        {/* Leaderboard */}
        <div className="space-y-3">
          {sorted.map((member, i) => (
            <RankCard key={member.id} member={member} rank={i + 1} sortKey={sortKey} maxValue={maxValue} />
          ))}
        </div>
      </main>
    </div>
  )
}
