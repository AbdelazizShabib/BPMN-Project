import { useStore } from '../store/useStore'
import Header from '../components/layout/Header'
import { BarChart3, TrendingUp, Bug, CheckCircle2, Zap, AlertTriangle, Users, Target, Info } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, PieChart, Pie, Cell, ReferenceLine,
} from 'recharts'
import { Link } from 'react-router-dom'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs shadow-xl">
        <p className="text-slate-300 font-semibold mb-1.5">{label}</p>
        {payload.map(p => (
          <p key={p.name} className="flex items-center gap-2 mt-0.5" style={{ color: p.color }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            {p.name}: <span className="font-bold ml-1">{p.value}{p.unit || ''}</span>
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
  { name: 'Feature',  value: 45, color: '#3b82f6' },
  { name: 'Bug Fix',  value: 20, color: '#ef4444' },
  { name: 'Chore',    value: 18, color: '#64748b' },
  { name: 'Design',   value: 10, color: '#ec4899' },
  { name: 'Testing',  value: 7,  color: '#eab308' },
]

const radarData = [
  { subject: 'Velocity',      Omar: 92, Alex: 85, Sara: 78 },
  { subject: 'Quality',       Omar: 80, Alex: 88, Sara: 95 },
  { subject: 'Collaboration', Omar: 95, Alex: 82, Sara: 85 },
  { subject: 'Bugs Fixed',    Omar: 70, Alex: 88, Sara: 90 },
  { subject: 'On-Time',       Omar: 98, Alex: 92, Sara: 88 },
  { subject: 'Reviews',       Omar: 85, Alex: 78, Sara: 80 },
]

// Gamification-specific data sets
const engagementTrend = [
  { sprint: 'S1', withGamification: 55, withoutGamification: 52, xpAwarded: 1200 },
  { sprint: 'S2', withGamification: 63, withoutGamification: 51, xpAwarded: 1850 },
  { sprint: 'S3', withGamification: 71, withoutGamification: 50, xpAwarded: 2100 },
  { sprint: 'S4', withGamification: 78, withoutGamification: 49, xpAwarded: 2650 },
  { sprint: 'S5', withGamification: 82, withoutGamification: 48, xpAwarded: 3100 },
]

const xpVsVelocity = [
  { sprint: 'S1', velocity: 22, xp: 1200, engagement: 55 },
  { sprint: 'S2', velocity: 27, xp: 1850, engagement: 63 },
  { sprint: 'S3', velocity: 30, xp: 2100, engagement: 71 },
  { sprint: 'S4', velocity: 32, xp: 2650, engagement: 78 },
  { sprint: 'S5', velocity: 13, xp: 3100, engagement: 82 },
]

const rewardEffectiveness = [
  { activity: 'Daily Scrum', xpGiven: 480, qualityImpact: 72, engagementDelta: 18 },
  { activity: 'Code Review', xpGiven: 950, qualityImpact: 88, engagementDelta: 22 },
  { activity: 'Bug Fixing',  xpGiven: 1200, qualityImpact: 91, engagementDelta: 15 },
  { activity: 'Sprint Plan', xpGiven: 620, qualityImpact: 80, engagementDelta: 20 },
  { activity: 'Retro',       xpGiven: 380, qualityImpact: 65, engagementDelta: 12 },
]

const burnoutIndicators = [
  { name: 'Alex Chen',   role: 'Frontend Dev',  streakDays: 7,  avgHoursOvertime: 1.2, taskPressure: 68, riskLevel: 'low',    riskScore: 28 },
  { name: 'Sara Kim',    role: 'Backend Dev',   streakDays: 5,  avgHoursOvertime: 0.8, taskPressure: 72, riskLevel: 'low',    riskScore: 22 },
  { name: 'Omar Hassan', role: 'Full Stack Dev', streakDays: 12, avgHoursOvertime: 2.5, taskPressure: 91, riskLevel: 'medium', riskScore: 61 },
  { name: 'Lena Müller', role: 'QA Engineer',   streakDays: 3,  avgHoursOvertime: 0.5, taskPressure: 55, riskLevel: 'low',    riskScore: 18 },
  { name: 'James Park',  role: 'DevOps',        streakDays: 2,  avgHoursOvertime: 3.2, taskPressure: 88, riskLevel: 'high',   riskScore: 79 },
]

const RISK_COLORS = {
  low:    { label: 'Low Risk',    bar: 'bg-green-500',  text: 'text-green-400',  border: 'border-green-800/40',  bg: 'bg-green-900/20' },
  medium: { label: 'Medium Risk', bar: 'bg-yellow-500', text: 'text-yellow-400', border: 'border-yellow-800/40', bg: 'bg-yellow-900/20' },
  high:   { label: 'High Risk',   bar: 'bg-red-500',    text: 'text-red-400',    border: 'border-red-800/40',    bg: 'bg-red-900/20'   },
}

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

  const avgVelocity   = Math.round(sprintHistory.reduce((s, sp) => s + sp.completed, 0) / sprintHistory.length)
  const avgCompletion = Math.round(sprintHistory.reduce((s, sp) => s + (sp.completed / sp.planned) * 100, 0) / sprintHistory.length)
  const totalBugs     = sprintHistory.reduce((s, sp) => s + sp.bugs, 0)
  const totalXP       = teamMembers.reduce((s, m) => s + m.xp, 0)

  const engagementLift = Math.round(
    ((engagementTrend[engagementTrend.length - 1].withGamification -
      engagementTrend[0].withGamification) /
      engagementTrend[0].withGamification) * 100
  )

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Analytics" subtitle="Sprint performance · Gamification impact · Team health indicators" />

      <main className="flex-1 p-6 space-y-6">

        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Avg Velocity',    value: avgVelocity, unit: 'SP/sprint',    icon: TrendingUp,  color: 'text-violet-400', bg: 'bg-violet-600' },
            { label: 'Avg Completion',  value: `${avgCompletion}%`, unit: 'of planned', icon: CheckCircle2, color: 'text-green-400',  bg: 'bg-green-600'  },
            { label: 'Total Bugs',      value: totalBugs,   unit: 'across sprints', icon: Bug,        color: 'text-red-400',    bg: 'bg-red-600'    },
            { label: 'Team Efficiency', value: '87%',       unit: 'above target', icon: Zap,         color: 'text-yellow-400', bg: 'bg-yellow-600' },
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

        {/* Sprint velocity + completion trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title="Sprint Velocity Trend" subtitle="Story points planned vs completed" icon={BarChart3}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={sprintHistory} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="sprint" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                <Bar dataKey="planned"   name="Planned"   fill="#312e81" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" name="Completed" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Task Completion Rate" subtitle="Weekly completion percentage trend" icon={TrendingUp}>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={completionTrend}>
                <defs>
                  <linearGradient id="completionGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}   />
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

        {/* Bug tracking + task distribution + radar */}
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
                <Line type="monotone" dataKey="fixed"    name="Fixed"    stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Task Distribution" subtitle="By task type this sprint">
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={120} height={160}>
                <PieChart>
                  <Pie data={taskTypeData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" paddingAngle={3}>
                    {taskTypeData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
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

          <ChartCard title="Team Radar" subtitle="Top 3 performers across 6 Agile metrics">
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                <Radar name="Omar" dataKey="Omar" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.15} strokeWidth={1.5} />
                <Radar name="Alex" dataKey="Alex" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1}  strokeWidth={1.5} />
                <Radar name="Sara" dataKey="Sara" stroke="#22c55e" fill="#22c55e" fillOpacity={0.1}  strokeWidth={1.5} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* ── GAMIFICATION IMPACT ANALYSIS ──────────────────────────────────────────── */}
        <div className="flex items-center gap-2 pt-2">
          <Zap size={16} className="text-violet-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Gamification Impact Analysis</h2>
          <div className="flex-1 h-px bg-slate-700/50" />
          <span className="text-xs text-slate-500">Research-backed metrics</span>
        </div>

        {/* Gamification KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Team XP Earned',       value: totalXP.toLocaleString(), icon: Zap,          color: 'text-violet-400', desc: 'Total XP across all members'        },
            { label: 'Engagement Lift',      value: `+${engagementLift}%`,    icon: TrendingUp,   color: 'text-green-400',  desc: 'vs pre-gamification baseline'       },
            { label: 'Avg Collaboration',    value: '79%',                    icon: Users,        color: 'text-blue-400',   desc: 'Team collaboration score'            },
            { label: 'Reward Effectiveness', value: '84%',                    icon: Target,       color: 'text-yellow-400', desc: 'XP-to-quality conversion rate'      },
          ].map(k => (
            <div key={k.label} className="bg-slate-800/60 border border-violet-900/30 rounded-2xl p-4">
              <k.icon size={18} className={`${k.color} mb-2`} />
              <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{k.label}</p>
              <p className="text-xs text-slate-600 mt-0.5">{k.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Engagement: gamification vs baseline */}
          <ChartCard
            title="Team Engagement Over Sprints"
            subtitle="Gamified Scrum vs estimated baseline without gamification"
            icon={TrendingUp}
          >
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={engagementTrend}>
                <defs>
                  <linearGradient id="engagGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="sprint" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[40, 90]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                <Line type="monotone" dataKey="withGamification"    name="With Gamification"    stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 4, fill: '#7c3aed' }} />
                <Line type="monotone" dataKey="withoutGamification" name="Without Gamification" stroke="#64748b" strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 3, fill: '#64748b' }} />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-xs text-slate-500 mt-2">
              Gamification shows a consistent engagement advantage (+{engagementLift}% over 5 sprints) compared to the estimated non-gamified baseline.
            </p>
          </ChartCard>

          {/* XP Reward effectiveness per Scrum activity */}
          <ChartCard
            title="Reward Effectiveness by Scrum Activity"
            subtitle="XP awarded vs quality impact score (0–100)"
            icon={BarChart3}
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={rewardEffectiveness} layout="vertical" barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="activity" type="category" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} width={60} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                <Bar dataKey="qualityImpact" name="Quality Impact"    fill="#7c3aed" radius={[0, 4, 4, 0]} />
                <Bar dataKey="engagementDelta" name="Engagement Δ"   fill="#22c55e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-slate-500 mt-2">
              Code Review and Bug Fixing show the highest quality impact per XP reward — confirming quality-weighted scoring is more effective than volume-based XP.
            </p>
          </ChartCard>
        </div>

        {/* ── BURNOUT RISK INDICATORS ───────────────────────────────────────────── */}
        <div className="flex items-center gap-2 pt-2">
          <AlertTriangle size={16} className="text-amber-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Team Health & Burnout Risk</h2>
          <div className="flex-1 h-px bg-slate-700/50" />
          <Link to="/risks" className="text-xs text-amber-400 hover:text-amber-300 transition-colors">View Risk Framework →</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {burnoutIndicators.map(member => {
            const risk = RISK_COLORS[member.riskLevel]
            return (
              <div key={member.name} className={`rounded-2xl border p-4 ${risk.bg} ${risk.border}`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{member.name}</p>
                    <p className="text-xs text-slate-400">{member.role}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${risk.border} ${risk.text} bg-slate-900/40`}>
                    {risk.label}
                  </span>
                </div>

                {/* Risk score bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Burnout Risk Score</span>
                    <span className={risk.text}>{member.riskScore}/100</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-700/60 overflow-hidden">
                    <div className={`h-full rounded-full ${risk.bar} transition-all`} style={{ width: `${member.riskScore}%` }} />
                  </div>
                </div>

                {/* Indicators */}
                <div className="space-y-1.5">
                  {[
                    { label: 'Streak Days',        value: `${member.streakDays}d`,          warn: member.streakDays > 10 },
                    { label: 'Overtime Avg',       value: `+${member.avgHoursOvertime}h/d`, warn: member.avgHoursOvertime > 2 },
                    { label: 'Task Pressure',      value: `${member.taskPressure}%`,        warn: member.taskPressure > 85 },
                  ].map(ind => (
                    <div key={ind.label} className="flex justify-between text-xs">
                      <span className="text-slate-500">{ind.label}</span>
                      <span className={ind.warn ? 'text-amber-400 font-medium' : 'text-slate-300'}>{ind.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="bg-slate-800/40 border border-amber-800/20 rounded-2xl p-4">
          <div className="flex items-start gap-2">
            <Info size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-400 leading-relaxed">
              Burnout risk is calculated from streak length, overtime patterns, and task pressure.
              <span className="text-amber-300"> High-risk members</span> should be discussed in the next Sprint Retrospective.
              Gamification systems can amplify burnout when streak mechanics create always-on pressure.
              Consider implementing streak cooldown periods and team-level (not individual) streak rewards.
              <Link to="/risks" className="text-amber-400 hover:text-amber-300 ml-1 underline underline-offset-2">Learn more about gamification risks →</Link>
            </p>
          </div>
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
    Array.from({ length: 5 }, (_, d) => ({ week: w, day: d, value: Math.floor(Math.random() * 10) }))
  )
  const getColor = v => {
    if (v === 0) return 'bg-slate-800 border-slate-700/50'
    if (v <= 2)  return 'bg-violet-900/50 border-violet-800/30'
    if (v <= 4)  return 'bg-violet-800/60 border-violet-700/40'
    if (v <= 6)  return 'bg-violet-700/70 border-violet-600/50'
    if (v <= 8)  return 'bg-violet-600 border-violet-500/60'
    return 'bg-violet-500 border-violet-400/60'
  }
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1">
        <div className="flex flex-col gap-1 pt-6 mr-1">
          {days.map(d => <div key={d} className="h-7 flex items-center text-xs text-slate-500 w-7 justify-end pr-1">{d}</div>)}
        </div>
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
                  <div key={d} title={`${cell.value} tasks`}
                    className={`h-7 rounded border cursor-pointer hover:ring-1 hover:ring-violet-400 transition-all ${getColor(cell.value)}`} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3 justify-end">
        <span className="text-xs text-slate-500">Less</span>
        {[0, 2, 4, 6, 8, 10].map(v => <div key={v} className={`w-4 h-4 rounded border ${getColor(v)}`} />)}
        <span className="text-xs text-slate-500">More</span>
      </div>
    </div>
  )
}
