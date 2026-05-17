import { useState } from 'react'
import { useStore } from '../store/useStore'
import Header from '../components/layout/Header'
import {
  Trophy, Medal, Star, Zap, CheckCircle2, Bug, Flame, TrendingUp,
  Users, GitMerge, Target, AlertTriangle, Info,
} from 'lucide-react'
import { Link } from 'react-router-dom'

// Supplementary Agile metrics not stored in Zustand (sprint-level analytics)
const AGILE_METRICS = {
  1: { collaborationScore: 78, codeReviews: 14, sprintCompletion: 92 },
  2: { collaborationScore: 85, codeReviews: 8,  sprintCompletion: 88 },
  3: { collaborationScore: 95, codeReviews: 11, sprintCompletion: 96 },
  4: { collaborationScore: 72, codeReviews: 19, sprintCompletion: 85 },
  5: { collaborationScore: 68, codeReviews: 6,  sprintCompletion: 78 },
}

const SORT_OPTIONS = [
  { key: 'xp',               label: 'Total XP',           icon: Zap,           unit: 'XP',      desc: 'Cumulative experience points across all Scrum activities' },
  { key: 'tasksCompleted',   label: 'Story Points',        icon: CheckCircle2,  unit: 'tasks',   desc: 'Total sprint tasks completed this cycle' },
  { key: 'bugsFixed',        label: 'Bugs Fixed',          icon: Bug,           unit: 'bugs',    desc: 'Defects resolved — includes both sprint and post-release issues' },
  { key: 'collaborationScore',label: 'Collaboration',      icon: Users,         unit: 'score',   desc: 'Composite score: pair-programming, unblocking teammates, knowledge sharing' },
  { key: 'codeReviews',      label: 'Code Reviews',        icon: GitMerge,      unit: 'reviews', desc: 'Meaningful code reviews with substantive feedback submitted' },
  { key: 'sprintCompletion', label: 'Sprint Completion',   icon: Target,        unit: '%',       desc: 'Percentage of committed sprint tasks delivered on time' },
  { key: 'streak',           label: 'Daily Streak',        icon: Flame,         unit: 'days',    desc: 'Consecutive days of active Daily Scrum participation' },
]

const BADGE_ICONS = {
  sprint_hero:          { icon: Trophy,       color: 'text-yellow-400',  bg: 'bg-yellow-900/30'  },
  bug_hunter:           { icon: Bug,          color: 'text-red-400',     bg: 'bg-red-900/30'     },
  deadline_master:      { icon: Target,       color: 'text-blue-400',    bg: 'bg-blue-900/30'    },
  team_player:          { icon: CheckCircle2, color: 'text-green-400',   bg: 'bg-green-900/30'   },
  streak_champion:      { icon: Flame,        color: 'text-orange-400',  bg: 'bg-orange-900/30'  },
  productivity:         { icon: TrendingUp,   color: 'text-purple-400',  bg: 'bg-purple-900/30'  },
  review_champion:      { icon: GitMerge,     color: 'text-teal-400',    bg: 'bg-teal-900/30'    },
  retro_master:         { icon: Star,         color: 'text-emerald-400', bg: 'bg-emerald-900/30' },
  backlog_guru:         { icon: Zap,          color: 'text-sky-400',     bg: 'bg-sky-900/30'     },
  deployment_champion:  { icon: Trophy,       color: 'text-amber-400',   bg: 'bg-amber-900/30'   },
  consistency_king:     { icon: CheckCircle2, color: 'text-indigo-400',  bg: 'bg-indigo-900/30'  },
  analytics_ace:        { icon: TrendingUp,   color: 'text-fuchsia-400', bg: 'bg-fuchsia-900/30' },
}

const RANK_STYLES = [
  { bg: 'from-yellow-900/30 to-amber-900/10',   border: 'border-yellow-700/40',  badge: 'text-yellow-400',  icon: <Trophy size={18} className="text-yellow-400 fill-yellow-400" /> },
  { bg: 'from-slate-700/30 to-slate-800/10',    border: 'border-slate-600/40',   badge: 'text-slate-300',   icon: <Medal  size={18} className="text-slate-300 fill-slate-300"   /> },
  { bg: 'from-orange-900/20 to-amber-900/10',   border: 'border-orange-800/40',  badge: 'text-orange-400',  icon: <Medal  size={18} className="text-orange-400 fill-orange-400"  /> },
]

function RankCard({ member, rank, sortKey, maxValue }) {
  const style = RANK_STYLES[rank - 1] || {}
  const isTop3 = rank <= 3
  const val = member[sortKey] ?? 0
  const pct = Math.round((val / maxValue) * 100)
  const opt = SORT_OPTIONS.find(o => o.key === sortKey)

  const displayVal = sortKey === 'xp' ? val.toLocaleString()
    : sortKey === 'sprintCompletion' ? `${val}%`
    : val

  return (
    <div className={`rounded-2xl border p-5 transition-all hover:scale-[1.01] ${
      isTop3
        ? `bg-gradient-to-r ${style.bg} ${style.border}`
        : 'bg-slate-800/50 border-slate-700/40'
    }`}>
      <div className="flex items-center gap-4">
        {/* Rank */}
        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${isTop3 ? 'bg-slate-900/60' : 'bg-slate-700/40'}`}>
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
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <p className={`text-sm font-bold ${isTop3 ? 'text-white' : 'text-slate-200'}`}>{member.name}</p>
            {member.streak >= 7 && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-orange-900/40 text-orange-400 flex items-center gap-0.5">
                <Flame size={10} />{member.streak}d
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">{member.role}</p>
          {opt && <p className="text-xs text-slate-600 mt-0.5">{opt.desc}</p>}
          {/* Stat bar */}
          <div className="mt-2 h-1.5 rounded-full bg-slate-700/60 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-violet-600 to-purple-500" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Primary stat */}
        <div className="text-center flex-shrink-0">
          <p className={`text-xl font-bold ${isTop3 ? style.badge : 'text-violet-400'}`}>{displayVal}</p>
          <p className="text-xs text-slate-500">{opt?.unit || ''}</p>
        </div>

        {/* Badges */}
        <div className="flex gap-1 flex-shrink-0 flex-wrap max-w-[72px]">
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
  const [showRiskNote, setShowRiskNote] = useState(true)

  // Merge Agile metrics into team members
  const enrichedMembers = teamMembers.map(m => ({
    ...m,
    ...(AGILE_METRICS[m.id] || {}),
  }))

  const sorted = [...enrichedMembers].sort((a, b) => (b[sortKey] ?? 0) - (a[sortKey] ?? 0))
  const maxValue = sorted[0]?.[sortKey] || 1

  const totals = {
    xp:               enrichedMembers.reduce((s, m) => s + m.xp, 0),
    tasksCompleted:   enrichedMembers.reduce((s, m) => s + m.tasksCompleted, 0),
    bugsFixed:        enrichedMembers.reduce((s, m) => s + m.bugsFixed, 0),
    badges:           enrichedMembers.reduce((s, m) => s + m.badges.length, 0),
    codeReviews:      enrichedMembers.reduce((s, m) => s + (m.codeReviews || 0), 0),
    avgCollaboration: Math.round(enrichedMembers.reduce((s, m) => s + (m.collaborationScore || 0), 0) / enrichedMembers.length),
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Team Leaderboard" subtitle="Agile performance metrics — individual rankings and team contributions" />

      <main className="flex-1 p-6 space-y-6">

        {/* Gamification balance warning */}
        {showRiskNote && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-950/20 border border-amber-800/30 text-xs text-amber-300">
            <AlertTriangle size={14} className="flex-shrink-0 mt-0.5 text-amber-400" />
            <div className="flex-1">
              <p className="font-semibold text-amber-200 mb-1">Gamification Balance Notice</p>
              <p className="text-amber-400/80 leading-relaxed">
                Individual rankings motivate high performance but can create <span className="text-amber-300">toxic competition</span> if over-emphasised.
                This leaderboard includes <span className="text-white">collaboration metrics</span> to reward teamwork alongside individual output.
                Always balance competitive rankings with team-based goals.
              </p>
              <Link to="/risks" className="inline-flex items-center gap-1 mt-1.5 text-amber-300 hover:text-amber-200 underline underline-offset-2">
                View Gamification Risks →
              </Link>
            </div>
            <button onClick={() => setShowRiskNote(false)} className="text-amber-600 hover:text-amber-400 flex-shrink-0">✕</button>
          </div>
        )}

        {/* Team Totals */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Team XP',     value: totals.xp.toLocaleString(),     icon: Zap,          color: 'text-violet-400' },
            { label: 'Tasks Done',  value: totals.tasksCompleted,          icon: CheckCircle2, color: 'text-green-400'  },
            { label: 'Bugs Fixed',  value: totals.bugsFixed,               icon: Bug,          color: 'text-red-400'    },
            { label: 'Badges',      value: totals.badges,                  icon: Trophy,       color: 'text-yellow-400' },
            { label: 'Code Reviews',value: totals.codeReviews,             icon: GitMerge,     color: 'text-teal-400'   },
            { label: 'Avg Collab',  value: `${totals.avgCollaboration}%`,  icon: Users,        color: 'text-blue-400'   },
          ].map(s => (
            <div key={s.label} className="bg-slate-800/60 border border-slate-700/40 rounded-2xl p-4 flex items-center gap-3">
              <s.icon size={18} className={s.color} />
              <div>
                <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-slate-400">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Sort Tabs */}
        <div>
          <p className="text-xs text-slate-500 mb-2 flex items-center gap-1.5">
            <Info size={12} />
            Sort by metric — Collaboration and Code Reviews reward team-oriented behaviours
          </p>
          <div className="flex gap-2 flex-wrap">
            {SORT_OPTIONS.map(opt => {
              const Icon = opt.icon
              return (
                <button
                  key={opt.key}
                  onClick={() => setSortKey(opt.key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    sortKey === opt.key
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40'
                      : 'bg-slate-800/60 text-slate-400 border border-slate-700/50 hover:text-slate-200 hover:border-slate-600'
                  }`}
                >
                  <Icon size={13} />
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Current metric explanation */}
        {(() => {
          const current = SORT_OPTIONS.find(o => o.key === sortKey)
          return current ? (
            <p className="text-xs text-slate-500 bg-slate-800/40 border border-slate-700/30 rounded-lg px-3 py-2">
              <span className="text-slate-300 font-medium">{current.label}:</span> {current.desc}
            </p>
          ) : null
        })()}

        {/* Leaderboard */}
        <div className="space-y-3">
          {sorted.map((member, i) => (
            <RankCard key={member.id} member={member} rank={i + 1} sortKey={sortKey} maxValue={maxValue} />
          ))}
        </div>

        {/* Academic note */}
        <div className="bg-slate-800/40 border border-slate-700/30 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
            <TrendingUp size={15} className="text-violet-400" />
            Gamification Design Principle
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            This leaderboard implements <span className="text-slate-300">balanced metric tracking</span> — ranking individuals on both individual output
            (XP, tasks, bugs) and collaborative contribution (code reviews, collaboration score). Research by Hamari et al. (2014) shows that
            purely competitive leaderboards increase short-term productivity but decrease long-term intrinsic motivation and collaborative behaviour.
            The inclusion of collaboration metrics mitigates this by rewarding team-oriented performance alongside individual achievement.
          </p>
          <Link to="/risks" className="inline-flex items-center gap-1.5 mt-3 text-xs text-violet-400 hover:text-violet-300 transition-colors">
            <AlertTriangle size={12} />
            Explore all gamification risks and mitigations →
          </Link>
        </div>
      </main>
    </div>
  )
}
