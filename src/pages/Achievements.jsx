import { useStore } from '../store/useStore'
import Header from '../components/layout/Header'
import {
  Trophy, Zap, Shield, Clock, Users, Flame, Star, Lock,
  TrendingUp, Target, GitMerge, MessageSquare, Search, Rocket,
  CheckCircle2, BarChart3,
} from 'lucide-react'

const BADGES = [
  {
    id: 'sprint_hero',
    name: 'Sprint Hero',
    description: 'Deliver 100% of committed sprint tasks on time.',
    icon: Trophy,
    color: 'from-yellow-500 to-orange-500',
    glow: 'shadow-yellow-900/40',
    border: 'border-yellow-700/50',
    xpReward: 500,
    scrumActivity: 'Sprint Execution',
    unlockCondition: 'Complete 100% of sprint tasks within the sprint window.',
    motivationalPurpose: 'Reinforces full commitment to sprint goals and accountability to the team.',
  },
  {
    id: 'bug_hunter',
    name: 'Bug Crusher',
    description: 'Find and fix 10+ defects in a single sprint.',
    icon: Shield,
    color: 'from-red-500 to-rose-600',
    glow: 'shadow-red-900/40',
    border: 'border-red-700/50',
    xpReward: 350,
    scrumActivity: 'Testing & Quality',
    unlockCondition: 'Fix 10 or more bugs in one sprint cycle.',
    motivationalPurpose: 'Makes debugging a celebrated activity, reducing the stigma of defect-fixing work.',
  },
  {
    id: 'deadline_master',
    name: 'Estimation Master',
    description: 'Achieve ≤15% variance between estimated and actual velocity for 2 sprints.',
    icon: Target,
    color: 'from-blue-500 to-cyan-500',
    glow: 'shadow-blue-900/40',
    border: 'border-blue-700/50',
    xpReward: 400,
    scrumActivity: 'Backlog Grooming & Sprint Planning',
    unlockCondition: 'Sprint actual velocity within 15% of estimate for 2 consecutive sprints.',
    motivationalPurpose: 'Encourages investment in estimation skill and team velocity calibration.',
  },
  {
    id: 'team_player',
    name: 'Team Player',
    description: 'Assist 3+ teammates with their tasks in a single sprint.',
    icon: Users,
    color: 'from-green-500 to-emerald-500',
    glow: 'shadow-green-900/40',
    border: 'border-green-700/50',
    xpReward: 300,
    scrumActivity: 'Daily Scrum & Collaboration',
    unlockCondition: 'Formally assist (pair, review, unblock) at least 3 teammates in one sprint.',
    motivationalPurpose: 'Counters individual competition by rewarding collaborative behaviour.',
  },
  {
    id: 'streak_champion',
    name: 'Daily Champion',
    description: 'Maintain 10 consecutive daily scrum attendances with meaningful updates.',
    icon: Flame,
    color: 'from-orange-500 to-amber-500',
    glow: 'shadow-orange-900/40',
    border: 'border-orange-700/50',
    xpReward: 450,
    scrumActivity: 'Daily Scrum',
    unlockCondition: '10 consecutive Daily Scrum attendances with substantive updates (no "nothing to report").',
    motivationalPurpose: 'Builds the habit of daily communication and transparency within the team.',
  },
  {
    id: 'productivity',
    name: 'Velocity Surge',
    description: 'Exceed sprint velocity target by 20%+ while maintaining quality standards.',
    icon: TrendingUp,
    color: 'from-purple-500 to-violet-600',
    glow: 'shadow-purple-900/40',
    border: 'border-purple-700/50',
    xpReward: 600,
    scrumActivity: 'Sprint Execution & Development',
    unlockCondition: 'Complete 120%+ of planned story points with zero critical defects found post-sprint.',
    motivationalPurpose: 'Rewards high-performance sprints while quality gate prevents gaming through rushed work.',
  },
  {
    id: 'review_champion',
    name: 'Review Champion',
    description: 'Complete 10+ meaningful peer code reviews in a single sprint.',
    icon: GitMerge,
    color: 'from-teal-500 to-cyan-600',
    glow: 'shadow-teal-900/40',
    border: 'border-teal-700/50',
    xpReward: 380,
    scrumActivity: 'Code Review & Development',
    unlockCondition: '10+ code reviews with substantive comments (at least 3 comments per review on average).',
    motivationalPurpose: 'Makes code review a valued, recognised contribution rather than an interruption.',
  },
  {
    id: 'retro_master',
    name: 'Retrospection Master',
    description: 'Lead retro actions that result in verified process improvements.',
    icon: MessageSquare,
    color: 'from-emerald-500 to-green-600',
    glow: 'shadow-emerald-900/40',
    border: 'border-emerald-700/50',
    xpReward: 420,
    scrumActivity: 'Sprint Retrospective',
    unlockCondition: 'Identify 3+ retrospective action items that are implemented and verified in the following sprint.',
    motivationalPurpose: 'Creates accountability for retro follow-through, turning reflection into measurable improvement.',
  },
  {
    id: 'backlog_guru',
    name: 'Backlog Guru',
    description: 'Groom and refine 20+ backlog items in a single sprint grooming session.',
    icon: Search,
    color: 'from-sky-500 to-blue-600',
    glow: 'shadow-sky-900/40',
    border: 'border-sky-700/50',
    xpReward: 280,
    scrumActivity: 'Backlog Preparation & Grooming',
    unlockCondition: '20+ backlog items refined with acceptance criteria, estimates, and priority in a single sprint cycle.',
    motivationalPurpose: 'Incentivises proactive backlog health rather than reactive last-minute grooming before planning.',
  },
  {
    id: 'deployment_champion',
    name: 'Deployment Champion',
    description: 'Execute a clean production deployment with zero rollbacks in 72 hours.',
    icon: Rocket,
    color: 'from-amber-500 to-yellow-600',
    glow: 'shadow-amber-900/40',
    border: 'border-amber-700/50',
    xpReward: 550,
    scrumActivity: 'Release & Deployment',
    unlockCondition: 'Production deployment with no rollbacks, hotfixes, or P1 incidents within 72 hours post-release.',
    motivationalPurpose: 'Makes deployment a celebrated team milestone, building a culture of confident, stable releases.',
  },
  {
    id: 'consistency_king',
    name: 'Consistency King',
    description: 'Maintain process improvement actions across 4 consecutive sprints.',
    icon: CheckCircle2,
    color: 'from-indigo-500 to-violet-600',
    glow: 'shadow-indigo-900/40',
    border: 'border-indigo-700/50',
    xpReward: 700,
    scrumActivity: 'Retrospective & Continuous Improvement',
    unlockCondition: 'Retro-identified improvements implemented and verified for 4 consecutive sprints.',
    motivationalPurpose: 'Rewards sustained cultural change over time rather than one-off process improvements.',
  },
  {
    id: 'analytics_ace',
    name: 'Data-Driven',
    description: 'Use sprint analytics to identify and act on a performance trend.',
    icon: BarChart3,
    color: 'from-fuchsia-500 to-pink-600',
    glow: 'shadow-fuchsia-900/40',
    border: 'border-fuchsia-700/50',
    xpReward: 320,
    scrumActivity: 'Agile Analytics & Continuous Improvement',
    unlockCondition: 'Present a data-driven sprint retrospective finding with an implemented improvement action.',
    motivationalPurpose: 'Encourages data literacy and evidence-based decision making within the Scrum team.',
  },
]

const LEVELS = [
  { level: 1,  title: 'Newcomer',    minXP: 0,     maxXP: 500,   color: 'text-slate-400'  },
  { level: 2,  title: 'Apprentice',  minXP: 500,   maxXP: 1000,  color: 'text-green-400'  },
  { level: 3,  title: 'Developer',   minXP: 1000,  maxXP: 2000,  color: 'text-green-400'  },
  { level: 4,  title: 'Contributor', minXP: 2000,  maxXP: 3000,  color: 'text-blue-400'   },
  { level: 5,  title: 'Specialist',  minXP: 3000,  maxXP: 4000,  color: 'text-blue-400'   },
  { level: 6,  title: 'Expert',      minXP: 4000,  maxXP: 5000,  color: 'text-violet-400' },
  { level: 7,  title: 'Senior',      minXP: 5000,  maxXP: 6500,  color: 'text-violet-400' },
  { level: 8,  title: 'Master',      minXP: 6500,  maxXP: 8000,  color: 'text-yellow-400' },
  { level: 9,  title: 'Grand Master',minXP: 8000,  maxXP: 10000, color: 'text-yellow-400' },
  { level: 10, title: 'Legend',      minXP: 10000, maxXP: Infinity, color: 'text-orange-400' },
]

const SCRUM_PHASES = [
  { label: 'Backlog',    color: 'bg-blue-900/40 text-blue-300 border-blue-800/50' },
  { label: 'Planning',   color: 'bg-violet-900/40 text-violet-300 border-violet-800/50' },
  { label: 'Daily Scrum',color: 'bg-yellow-900/40 text-yellow-300 border-yellow-800/50' },
  { label: 'Development',color: 'bg-cyan-900/40 text-cyan-300 border-cyan-800/50' },
  { label: 'Testing',    color: 'bg-pink-900/40 text-pink-300 border-pink-800/50' },
  { label: 'Review',     color: 'bg-indigo-900/40 text-indigo-300 border-indigo-800/50' },
  { label: 'Retrospective', color: 'bg-emerald-900/40 text-emerald-300 border-emerald-800/50' },
  { label: 'Release',    color: 'bg-amber-900/40 text-amber-300 border-amber-800/50' },
]

function getPhaseStyle(activity) {
  for (const phase of SCRUM_PHASES) {
    if (activity.toLowerCase().includes(phase.label.toLowerCase())) return phase.color
  }
  return 'bg-slate-700/40 text-slate-300 border-slate-600/50'
}

function BadgeCard({ badge, earned }) {
  const Icon = badge.icon
  return (
    <div className={`relative rounded-2xl border p-4 flex flex-col gap-3 transition-all cursor-default group ${
      earned
        ? `bg-slate-800/80 ${badge.border} hover:scale-[1.02] hover:shadow-lg`
        : 'bg-slate-900/50 border-slate-800/50 opacity-50 grayscale'
    }`}>
      {earned && (
        <div className="absolute top-3 right-3">
          <Star size={13} className="text-yellow-400 fill-yellow-400" />
        </div>
      )}

      {/* Icon */}
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${badge.color} flex items-center justify-center shadow-lg ${badge.glow} ${!earned ? 'opacity-30' : ''} flex-shrink-0`}>
        {earned ? <Icon size={26} className="text-white" /> : <Lock size={20} className="text-white" />}
      </div>

      {/* Name + description */}
      <div className="flex-1">
        <h3 className={`text-sm font-bold leading-tight ${earned ? 'text-white' : 'text-slate-500'}`}>{badge.name}</h3>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{badge.description}</p>
      </div>

      {/* Scrum activity tag */}
      <span className={`text-xs px-2 py-0.5 rounded-md border self-start ${getPhaseStyle(badge.scrumActivity)}`}>
        {badge.scrumActivity}
      </span>

      {/* Unlock condition / XP earned */}
      <div className={`text-xs px-2.5 py-1.5 rounded-xl leading-relaxed ${
        earned
          ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800/50'
          : 'bg-slate-800 text-slate-500'
      }`}>
        {earned
          ? `+${badge.xpReward} XP earned`
          : badge.unlockCondition
        }
      </div>

      {/* Motivational purpose — shown on hover when earned */}
      {earned && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 bg-slate-900/90 rounded-2xl p-4 flex flex-col justify-center gap-2">
          <p className="text-xs font-semibold text-violet-300">Why this badge matters</p>
          <p className="text-xs text-slate-300 leading-relaxed">{badge.motivationalPurpose}</p>
          <div className={`text-xs px-2 py-1 rounded-lg border self-start ${getPhaseStyle(badge.scrumActivity)}`}>
            {badge.scrumActivity}
          </div>
        </div>
      )}
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
          <div className="h-full rounded-full bg-gradient-to-r from-violet-600 to-purple-500 transition-all" style={{ width: `${progressToNext}%` }} />
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

  const earnedBadges = BADGES.filter(b => currentUser.badges.includes(b.id))
  const totalXPFromBadges = earnedBadges.reduce((s, b) => s + b.xpReward, 0)

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Achievement Center" subtitle="Scrum-tied badges, XP levels, and progression system" />

      <main className="flex-1 p-6 space-y-6">
        {/* Current User XP Card */}
        <div className="bg-gradient-to-r from-violet-900/40 to-purple-900/20 border border-violet-800/30 rounded-2xl p-6">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-violet-900/40">
                {currentUser.avatar}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-slate-900 border-2 border-violet-600 flex items-center justify-center">
                <span className="text-xs font-bold text-violet-400">{currentUser.level}</span>
              </div>
            </div>
            <div className="flex-1 min-w-48">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold text-white">{currentUser.name}</h2>
                <span className={`text-sm font-semibold ${currentLevelData.color}`}>{currentLevelData.title}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Progress to {nextLevelData?.title || 'Max Level'}</span>
                <span className="text-sm font-bold text-violet-400">{currentUser.xp.toLocaleString()} XP</span>
              </div>
              <div className="h-3 rounded-full bg-slate-700/80 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500 transition-all relative" style={{ width: `${progressToNext}%` }}>
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/30 rounded-full" />
                </div>
              </div>
              {nextLevelData && (
                <p className="text-xs text-slate-400 mt-1.5">
                  {(nextLevelData.minXP - currentUser.xp).toLocaleString()} XP until Level {currentUser.level + 1}
                </p>
              )}
            </div>
            <div className="hidden md:grid grid-cols-4 gap-3">
              {[
                { label: 'Badges', value: currentUser.badges.length, color: 'text-yellow-400' },
                { label: 'Tasks', value: currentUser.tasksCompleted, color: 'text-green-400' },
                { label: 'Streak', value: `${currentUser.streak}d`, color: 'text-orange-400' },
                { label: 'Badge XP', value: `+${totalXPFromBadges}`, color: 'text-violet-400' },
              ].map(s => (
                <div key={s.label} className="text-center bg-slate-800/60 rounded-xl p-3">
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-slate-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gamification system note */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-xs text-emerald-300">
          <Zap size={14} className="flex-shrink-0 mt-0.5 text-emerald-400" />
          <p>
            All badges are directly tied to Scrum activities and require verified completion. <span className="text-white font-medium">Hover earned badges</span> to see
            their motivational purpose. Badges enforce quality gates — XP is only awarded when work meets the Definition of Done.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Badges Grid */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Trophy size={16} className="text-yellow-400" />
              Scrum Achievement Badges
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

            {/* Level ladder */}
            <div className="mt-4 bg-slate-800/40 border border-slate-700/40 rounded-2xl p-4">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Level Ladder</h4>
              <div className="space-y-1.5">
                {LEVELS.map(l => (
                  <div key={l.level} className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-600 w-4">{l.level}</span>
                    <span className={`text-xs font-medium ${l.color} flex-1`}>{l.title}</span>
                    <span className="text-xs text-slate-600 font-mono">
                      {l.minXP.toLocaleString()} XP
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
