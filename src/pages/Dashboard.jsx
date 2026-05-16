import { useStore } from '../store/useStore'
import Header from '../components/layout/Header'
import {
  CheckCircle2, Bug, Zap, TrendingUp, Clock, Users,
  Activity, Star, ArrowUp, ArrowDown, Minus, Target
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts'

function StatCard({ icon: Icon, label, value, sub, color, trend }) {
  const trendIcon = trend > 0 ? <ArrowUp size={12} className="text-green-400" /> : trend < 0 ? <ArrowDown size={12} className="text-red-400" /> : <Minus size={12} className="text-slate-400" />
  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 flex flex-col gap-3 hover:border-slate-600/60 transition-colors">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
        {trend !== undefined && (
          <div className="flex items-center gap-1 text-xs text-slate-400">
            {trendIcon}
            <span>{Math.abs(trend)}% vs last sprint</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-3xl font-bold text-white">{value}</p>
        <p className="text-sm text-slate-400 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
      </div>
    </div>
  )
}

function ActivityItem({ item }) {
  const typeColors = {
    task: 'bg-blue-500/20 text-blue-400',
    badge: 'bg-yellow-500/20 text-yellow-400',
    bug: 'bg-red-500/20 text-red-400',
    sprint: 'bg-green-500/20 text-green-400',
  }
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-700/40 last:border-0">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${typeColors[item.type]}`}>
        {item.user.split(' ').map(w => w[0]).join('').slice(0, 2)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-300">
          <span className="font-medium text-white">{item.user}</span>{' '}
          <span className="text-slate-400">{item.action}</span>{' '}
          <span className="text-violet-400">{item.target}</span>
        </p>
        <p className="text-xs text-slate-500 mt-0.5">{item.time}</p>
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs">
        <p className="text-slate-300 font-medium mb-1">{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color }}>{p.name}: <span className="font-bold">{p.value}</span></p>
        ))}
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const { sprint, teamMembers, activityFeed, sprintHistory } = useStore()

  const allTasks = Object.values(sprint.columns).flatMap(c => c.tasks)
  const doneTasks = sprint.columns.done.tasks.length
  const inProgressTasks = sprint.columns.inprogress.tasks.length
  const totalTasks = allTasks.length
  const bugs = allTasks.filter(t => t.type === 'bug').length
  const totalXP = teamMembers.reduce((s, m) => s + m.xp, 0)
  const completionRate = Math.round((doneTasks / totalTasks) * 100)

  const sprintEndDate = new Date(sprint.endDate)
  const today = new Date()
  const daysLeft = Math.max(0, Math.ceil((sprintEndDate - today) / (1000 * 60 * 60 * 24)))

  const topMember = [...teamMembers].sort((a, b) => b.xp - a.xp)[0]

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="Dashboard"
        subtitle={`${sprint.name} · ${sprint.goal}`}
      />

      <main className="flex-1 p-6 space-y-6">
        {/* Sprint Countdown Banner */}
        <div className="bg-gradient-to-r from-violet-900/40 via-purple-900/30 to-slate-900/0 border border-violet-800/30 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-600/30 border border-violet-600/40 flex items-center justify-center">
              <Clock size={22} className="text-violet-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Sprint ends in</p>
              <p className="text-2xl font-bold text-white">{daysLeft} days</p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-sm text-slate-400">Sprint Goal</p>
            <p className="text-sm text-white font-medium max-w-xs">{sprint.goal}</p>
          </div>
          <div className="hidden md:flex items-center gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-green-400">{doneTasks}</p>
              <p className="text-xs text-slate-400">Done</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-400">{inProgressTasks}</p>
              <p className="text-xs text-slate-400">In Progress</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-violet-400">{completionRate}%</p>
              <p className="text-xs text-slate-400">Complete</p>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={CheckCircle2} label="Tasks Completed" value={doneTasks} sub={`of ${totalTasks} total`} color="bg-green-600" trend={18} />
          <StatCard icon={Bug} label="Bugs Reported" value={bugs} sub="this sprint" color="bg-red-600" trend={-5} />
          <StatCard icon={Zap} label="Team XP Earned" value={totalXP.toLocaleString()} sub="total across team" color="bg-violet-600" trend={12} />
          <StatCard icon={Target} label="Velocity" value={sprint.velocity} sub="story points/sprint" color="bg-blue-600" trend={6} />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Velocity Chart */}
          <div className="lg:col-span-2 bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Sprint Velocity</h3>
                <p className="text-xs text-slate-400">Planned vs Completed story points</p>
              </div>
              <TrendingUp size={18} className="text-violet-400" />
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={sprintHistory} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="sprint" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                <Bar dataKey="planned" name="Planned" fill="#4c1d95" radius={[3, 3, 0, 0]} />
                <Bar dataKey="completed" name="Completed" fill="#7c3aed" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Team Efficiency */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Team Efficiency</h3>
                <p className="text-xs text-slate-400">Top performers</p>
              </div>
              <Users size={18} className="text-violet-400" />
            </div>
            <div className="space-y-3">
              {[...teamMembers].sort((a, b) => b.tasksCompleted - a.tasksCompleted).slice(0, 4).map((m, i) => {
                const pct = Math.round((m.tasksCompleted / 50) * 100)
                return (
                  <div key={m.id}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 w-4">{i + 1}</span>
                        <div className="w-6 h-6 rounded-full bg-violet-600/30 flex items-center justify-center text-xs font-bold text-violet-300">{m.avatar}</div>
                        <span className="text-xs text-slate-300 font-medium">{m.name.split(' ')[0]}</span>
                      </div>
                      <span className="text-xs text-slate-400">{m.tasksCompleted} tasks</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-700">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-600 to-purple-500 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Activity Feed */}
          <div className="lg:col-span-2 bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Activity size={16} className="text-violet-400" />
                Live Activity Feed
              </h3>
              <span className="flex items-center gap-1.5 text-xs text-green-400">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Live
              </span>
            </div>
            <div>
              {activityFeed.map(item => <ActivityItem key={item.id} item={item} />)}
            </div>
          </div>

          {/* Top Player */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 flex flex-col">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Star size={16} className="text-yellow-400" />
              Top Performer
            </h3>
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-violet-900/40">
                  {topMember.avatar}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
                  <Star size={14} className="text-yellow-900 fill-yellow-900" />
                </div>
              </div>
              <div>
                <p className="text-lg font-bold text-white">{topMember.name}</p>
                <p className="text-sm text-slate-400">{topMember.role}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 w-full">
                <div className="bg-slate-700/50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-violet-400">{topMember.xp.toLocaleString()}</p>
                  <p className="text-xs text-slate-400">Total XP</p>
                </div>
                <div className="bg-slate-700/50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-green-400">Lv.{topMember.level}</p>
                  <p className="text-xs text-slate-400">Level</p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                {topMember.badges.slice(0, 3).map(b => (
                  <span key={b} className="text-xs px-2 py-0.5 rounded-full bg-violet-900/50 border border-violet-700/50 text-violet-300">
                    {b.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
