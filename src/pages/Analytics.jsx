import { useStore } from '../store/useStore'
import Header from '../components/layout/Header'
import { BarChart3, TrendingUp, Bug, CheckCircle2, Zap } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, PieChart, Pie, Cell
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs shadow-xl">
        <p className="text-slate-300 font-semibold mb-1.5">{label}</p>
        {payload.map(p => (
          <p key={p.name} className="flex items-center gap-2 mt-0.5" style={{ color: p.color }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            {p.name}: <span className="font-bold ml-1">{p.value}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

const completionTrend = [
  { week: 'Wk 1', rate: 68 }, { week: 'Wk 2', rate: 74 }, { week: 'Wk 3', rate: 71 },
  { week: 'Wk 4', rate: 80 }, { week: 'Wk 5', rate: 78 }, { week: 'Wk 6', rate: 85 },
  { week: 'Wk 7', rate: 82 }, { week: 'Wk 8', rate: 89 },
]

const bugTrend = [
  { sprint: 'S1', reported: 8, fixed: 4 }, { sprint: 'S2', reported: 6, fixed: 5 },
  { sprint: 'S3', reported: 9, fixed: 7 }, { sprint: 'S4', reported: 11, fixed: 9 },
  { sprint: 'S5', reported: 5, fixed: 3 },
]

const taskTypeData = [
  { name: 'Feature', value: 45, color: '#3b82f6' },
  { name: 'Bug Fix', value: 20, color: '#ef4444' },
  { name: 'Chore', value: 18, color: '#64748b' },
  { name: 'Design', value: 10, color: '#ec4899' },
  { name: 'Testing', value: 7, color: '#eab308' },
]

const radarData = [
  { subject: 'Velocity', Omar: 92, Alex: 85, Sara: 78 },
  { subject: 'Quality', Omar: 80, Alex: 88, Sara: 95 },
  { subject: 'Collaboration', Omar: 95, Alex: 82, Sara: 85 },
  { subject: 'Bugs Fixed', Omar: 70, Alex: 88, Sara: 90 },
  { subject: 'On-Time', Omar: 98, Alex: 92, Sara: 88 },
  { subject: 'Reviews', Omar: 85, Alex: 78, Sara: 80 },
]

function ChartCard({ title, subtitle, icon: Icon, children, className = '' }) {
  return (
    <div className={`bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 ${className}`}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {Icon && <Icon size={18} className="text-violet-400" />}
      </div>
      {children}
    </div>
  )
}

export default function Analytics() {
  const { sprintHistory, teamMembers } = useStore()

  const avgVelocity = Math.round(sprintHistory.reduce((s, sp) => s + sp.completed, 0) / sprintHistory.length)
  const avgCompletion = Math.round(sprintHistory.reduce((s, sp) => s + (sp.completed / sp.planned) * 100, 0) / sprintHistory.length)
  const totalBugs = sprintHistory.reduce((s, sp) => s + sp.bugs, 0)

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Analytics" subtitle="Sprint performance, trends, and team insights" />

      <main className="flex-1 p-6 space-y-5">
        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Avg Velocity', value: avgVelocity, unit: 'SP/sprint', icon: TrendingUp, color: 'text-violet-400', bg: 'bg-violet-600' },
            { label: 'Avg Completion', value: `${avgCompletion}%`, unit: 'of planned', icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-600' },
            { label: 'Total Bugs', value: totalBugs, unit: 'across sprints', icon: Bug, color: 'text-red-400', bg: 'bg-red-600' },
            { label: 'Team Efficiency', value: '87%', unit: 'above target', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-600' },
          ].map(k => (
            <div key={k.label} className="bg-slate-800/60 border border-slate-700/40 rounded-2xl p-4">
              <div className={`w-8 h-8 rounded-lg ${k.bg} flex items-center justify-center mb-3`}>
                <k.icon size={16} className="text-white" />
              </div>
              <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{k.label}</p>
              <p className="text-xs text-slate-600">{k.unit}</p>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title="Sprint Velocity Trend" subtitle="Story points planned vs completed" icon={BarChart3}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={sprintHistory} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="sprint" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                <Bar dataKey="planned" name="Planned" fill="#312e81" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" name="Completed" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Task Completion Rate" subtitle="Weekly completion percentage trend" icon={TrendingUp}>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={completionTrend}>
                <defs>
                  <linearGradient id="completionGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[60, 100]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="rate" name="Completion %" stroke="#7c3aed" strokeWidth={2} fill="url(#completionGrad)" dot={{ fill: '#7c3aed', r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <ChartCard title="Bug Tracking" subtitle="Reported vs resolved per sprint" icon={Bug}>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={bugTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="sprint" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                <Line type="monotone" dataKey="reported" name="Reported" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="fixed" name="Fixed" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Task Distribution" subtitle="By task type">
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={120} height={160}>
                <PieChart>
                  <Pie data={taskTypeData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" paddingAngle={3}>
                    {taskTypeData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {taskTypeData.map(t => (
                  <div key={t.name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: t.color }} />
                    <span className="text-xs text-slate-400 flex-1">{t.name}</span>
                    <span className="text-xs font-medium text-slate-300">{t.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>

          <ChartCard title="Team Radar" subtitle="Top 3 performers comparison">
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                <Radar name="Omar" dataKey="Omar" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.15} strokeWidth={1.5} />
                <Radar name="Alex" dataKey="Alex" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={1.5} />
                <Radar name="Sara" dataKey="Sara" stroke="#22c55e" fill="#22c55e" fillOpacity={0.1} strokeWidth={1.5} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Performance Heatmap */}
        <ChartCard title="Performance Heat Map" subtitle="Daily task activity — last 12 weeks" icon={BarChart3}>
          <HeatMap />
        </ChartCard>
      </main>
    </div>
  )
}

function HeatMap() {
  const weeks = 12
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  const data = Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: 5 }, (_, d) => {
      const val = Math.floor(Math.random() * 10)
      return { week: w, day: d, value: val }
    })
  )

  const getColor = (val) => {
    if (val === 0) return 'bg-slate-800 border-slate-700/50'
    if (val <= 2) return 'bg-violet-900/50 border-violet-800/30'
    if (val <= 4) return 'bg-violet-800/60 border-violet-700/40'
    if (val <= 6) return 'bg-violet-700/70 border-violet-600/50'
    if (val <= 8) return 'bg-violet-600 border-violet-500/60'
    return 'bg-violet-500 border-violet-400/60'
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-1 pt-6 mr-1">
          {days.map(d => (
            <div key={d} className="h-7 flex items-center text-xs text-slate-500 w-7 justify-end pr-1">{d}</div>
          ))}
        </div>
        {/* Grid */}
        <div className="flex-1">
          <div className="flex gap-1 mb-1">
            {Array.from({ length: weeks }, (_, w) => (
              <div key={w} className="flex-1 text-center text-xs text-slate-600 truncate">
                {w === 0 ? 'W1' : w === weeks - 1 ? 'Now' : w % 3 === 0 ? `W${w + 1}` : ''}
              </div>
            ))}
          </div>
          <div className="flex gap-1">
            {data.map((week, w) => (
              <div key={w} className="flex-1 flex flex-col gap-1">
                {week.map((cell, d) => (
                  <div
                    key={d}
                    title={`${cell.value} tasks`}
                    className={`h-7 rounded border cursor-pointer hover:ring-1 hover:ring-violet-400 transition-all ${getColor(cell.value)}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 justify-end">
        <span className="text-xs text-slate-500">Less</span>
        {[0, 2, 4, 6, 8, 10].map(v => (
          <div key={v} className={`w-4 h-4 rounded border ${getColor(v)}`} />
        ))}
        <span className="text-xs text-slate-500">More</span>
      </div>
    </div>
  )
}
