import { useState } from 'react'
import Header from '../components/layout/Header'
import {
  AlertTriangle, Users, Flame, Bug, Brain, Scale, Zap,
  Shield, TrendingDown, CheckCircle2, ArrowRight, Info, BarChart3,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const RISKS = [
  {
    id: 1,
    title: 'Toxic Competition',
    category: 'Social Dynamics',
    categoryIcon: Users,
    impact: 'High',
    likelihood: 'High',
    icon: Users,
    description:
      'Public leaderboards and competitive scoring can transform collaborative teammates into rivals. When individual ranking determines social standing within the team, knowledge-hoarding, credit-stealing, and blame-shifting behaviours emerge. Psychological safety deteriorates and team members stop asking for help to avoid appearing lower on the ranking.',
    affectedActivities: ['Sprint Leaderboard', 'Daily Scrum', 'Code Review', 'Sprint Review'],
    symptoms: [
      'Team members refuse to pair-program or share knowledge',
      'Credit for shared work is disputed in retrospectives',
      'High performers disengage when they fall in rankings',
      'Reduced voluntary help and mentoring across seniority levels',
    ],
    mitigations: [
      'Implement team-based XP pools alongside individual rankings',
      'Include collaboration score as a primary ranking metric',
      'Use relative improvement leaderboards (vs personal best, not others)',
      'Rotate leaderboard visibility — not always public',
      'Introduce peer-recognition systems (kudos) separate from XP',
    ],
    borderColor: 'border-red-700/40',
    bgColor: 'bg-red-950/10',
    tagColor: 'bg-red-900/40 text-red-300 border-red-800/50',
    impactColor: 'text-red-400',
  },
  {
    id: 2,
    title: 'Burnout & Streak Pressure',
    category: 'Team Wellbeing',
    categoryIcon: Flame,
    impact: 'High',
    likelihood: 'Medium',
    icon: Flame,
    description:
      'Daily streak mechanics create an always-on expectation that contradicts healthy work-life balance. Team members feel obligated to maintain streaks during illness, personal emergencies, or vacation — treating rest as a punishment. Continuous XP pressure amplifies sprint anxiety and can lead to chronic stress, reduced creativity, and eventual disengagement.',
    affectedActivities: ['Daily Scrum Attendance', 'Sprint Velocity', 'Retrospective Participation'],
    symptoms: [
      'Team members joining standups while unwell to protect streaks',
      'Increased absenteeism after streak-breaking events',
      'Anxiety expressed during retrospectives about XP losses',
      'Declining quality of contributions despite high activity count',
    ],
    mitigations: [
      'Implement streak cooldown periods (e.g. 2 grace days per sprint)',
      'Replace individual streaks with team-level attendance streaks',
      'Award streak bonuses at sprint boundaries, not daily',
      'Define XP-free sprint periods for recovery and experimentation',
      'Monitor burnout indicators in the Analytics dashboard',
    ],
    borderColor: 'border-orange-700/40',
    bgColor: 'bg-orange-950/10',
    tagColor: 'bg-orange-900/40 text-orange-300 border-orange-800/50',
    impactColor: 'text-orange-400',
  },
  {
    id: 3,
    title: 'Point Farming (Gaming the System)',
    category: 'Quality & Integrity',
    categoryIcon: Bug,
    impact: 'High',
    likelihood: 'High',
    icon: Bug,
    description:
      'When XP is tied to activity volume rather than outcome quality, rational actors exploit the system. Developers decompose stories into artificially granular tasks, submit minimal-effort code to inflate review counts, write tests solely for coverage metrics, and close backlog items without meeting acceptance criteria. The game-theoretic pressure to maximise XP overrides professional standards.',
    affectedActivities: ['Development & Story Estimation', 'Backlog Grooming', 'Testing', 'Code Review'],
    symptoms: [
      'Sudden explosion in task count without meaningful scope increase',
      'Test coverage at exactly the threshold required for XP, no more',
      'Story points consistently matching estimates with zero variance',
      'Pull requests merged with minimal or template-copy review comments',
    ],
    mitigations: [
      'XP only awarded after Definition of Done verified by Scrum Master',
      'Quality-weighted scoring: multiply XP by peer-rated quality factor',
      'Require at least one independent reviewer to approve XP claims',
      'Introduce negative XP (XP decay) for rework caused by low quality',
      'Cap XP from any single activity type per sprint to prevent farming',
    ],
    borderColor: 'border-yellow-700/40',
    bgColor: 'bg-yellow-950/10',
    tagColor: 'bg-yellow-900/40 text-yellow-300 border-yellow-800/50',
    impactColor: 'text-yellow-400',
  },
  {
    id: 4,
    title: 'Reward Addiction',
    category: 'Behavioural Psychology',
    categoryIcon: Brain,
    impact: 'Medium',
    likelihood: 'Medium',
    icon: Brain,
    description:
      'Prolonged gamification systems can create dependency on external rewards, making XP the primary motivator for all work. Team members begin refusing to contribute to unscored tasks, treating rewards as entitlements rather than incentives. This is an instance of the over-justification effect (Deci, 1971): extrinsic rewards crowd out intrinsic motivation, leaving teams disengaged when reward systems are changed or removed.',
    affectedActivities: ['All Scrum Activities', 'Informal Knowledge Sharing', 'Mentoring'],
    symptoms: [
      'Explicit requests for XP before beginning tasks not on the scoring list',
      'Resistance to process improvements not linked to XP rewards',
      'Drop in contribution quality when XP categories are adjusted',
      'Informal mentoring and knowledge-sharing activities cease',
    ],
    mitigations: [
      'Use variable reward schedules rather than guaranteed XP per task',
      'Run XP-free sprints periodically to rebuild intrinsic motivation',
      'Combine extrinsic XP with narrative recognition (team storytelling)',
      'Recognise non-scored contributions publicly in retrospectives',
      'Position XP as a feedback mechanism, not a performance score',
    ],
    borderColor: 'border-purple-700/40',
    bgColor: 'bg-purple-950/10',
    tagColor: 'bg-purple-900/40 text-purple-300 border-purple-800/50',
    impactColor: 'text-purple-400',
  },
  {
    id: 5,
    title: 'Reduced Intrinsic Motivation',
    category: 'Behavioural Psychology',
    categoryIcon: TrendingDown,
    impact: 'Medium',
    likelihood: 'High',
    icon: TrendingDown,
    description:
      'Activities previously driven by professional pride — code review, peer mentoring, retrospective honesty — become transactional when attached to XP rewards. Deci & Ryan\'s Self-Determination Theory (1985) predicts that external rewards undermine autonomous motivation when they signal external control. Over time, team members perform gamified activities for the reward, not for mastery or shared purpose.',
    affectedActivities: ['Retrospective', 'Peer Code Review', 'Knowledge Sharing', 'Volunteer Process Improvement'],
    symptoms: [
      'Code reviews become formulaic ("LGTM") rather than analytical',
      'Retrospective honesty decreases as feedback becomes XP-optimised',
      'Innovation and voluntary improvement proposals decline',
      'Team energy and creativity reduce despite XP metrics rising',
    ],
    mitigations: [
      'Preserve XP-free spaces for voluntary, intrinsically-motivated work',
      'Frame gamification as recognition, not measurement of worth',
      'Rotate what activities are scored to prevent transactional mindsets',
      'Add purpose-driven framing to each activity alongside XP rewards',
      'Regularly discuss the "why" behind activities in retrospectives',
    ],
    borderColor: 'border-slate-600/40',
    bgColor: 'bg-slate-800/20',
    tagColor: 'bg-slate-700/40 text-slate-300 border-slate-600/50',
    impactColor: 'text-slate-400',
  },
  {
    id: 6,
    title: 'Unfair Rankings',
    category: 'Fairness & Equity',
    categoryIcon: Scale,
    impact: 'Medium',
    likelihood: 'High',
    icon: Scale,
    description:
      'A uniform XP system applied to a diverse team introduces systematic bias. Developers working on high-story-point features earn more XP than DevOps engineers managing infrastructure. Senior engineers earn review XP more easily than juniors. Scrum Masters earn limited XP despite carrying the highest facilitation burden. Without role-sensitive calibration, the leaderboard reflects role type and seniority more than actual contribution.',
    affectedActivities: ['Sprint Leaderboard', 'Sprint Review', 'Code Review', 'DevOps/Infrastructure Work'],
    symptoms: [
      'The same roles or seniority levels consistently dominate leaderboards',
      'Infrastructure and support work deprioritised to chase XP categories',
      'Junior developers disengage due to perceived unfairness',
      'Scrum Masters and Product Owners express leaderboard exclusion',
    ],
    mitigations: [
      'Implement role-normalised scoring (XP relative to role baseline)',
      'Apply difficulty multipliers based on story point complexity',
      'Create role-specific achievement categories (e.g. DevOps Excellence)',
      'Conduct quarterly fairness reviews of XP distribution with the team',
      'Allow team to vote on XP weights for different activity categories',
    ],
    borderColor: 'border-blue-700/40',
    bgColor: 'bg-blue-950/10',
    tagColor: 'bg-blue-900/40 text-blue-300 border-blue-800/50',
    impactColor: 'text-blue-400',
  },
  {
    id: 7,
    title: 'Low-Quality Rapid Completion',
    category: 'Quality & Integrity',
    categoryIcon: Zap,
    impact: 'High',
    likelihood: 'High',
    icon: Zap,
    description:
      'When XP rewards the speed of task closure rather than the quality of delivery, team members optimise for throughput over craftsmanship. Features are shipped with known defects, technical debt is silently accumulated, and edge cases are skipped. Short-term velocity increases mask long-term velocity collapse as accumulated poor quality forces expensive rework, increasing bug-fixing load in future sprints.',
    affectedActivities: ['Development', 'Testing', 'Sprint Review', 'Definition of Done Enforcement'],
    symptoms: [
      'Sprint velocity increases while post-sprint bug rates also increase',
      'Definition of Done criteria frequently waived for "almost done" tasks',
      'Technical debt accumulates faster than it is resolved',
      'Stakeholder satisfaction decreases despite high story point delivery',
    ],
    mitigations: [
      'Gate XP on Definition of Done sign-off, not task status change',
      'Introduce bug penalty: XP deducted from creator when bugs are found',
      'Track and visualise quality metrics alongside velocity metrics',
      'Award bonus XP for zero-defect sprints (team-level incentive)',
      'Make technical debt visible on the board and assign XP for addressing it',
    ],
    borderColor: 'border-red-700/40',
    bgColor: 'bg-red-950/10',
    tagColor: 'bg-red-900/40 text-red-300 border-red-800/50',
    impactColor: 'text-red-400',
  },
]

const MITIGATION_PRINCIPLES = [
  {
    title: 'Quality Before Quantity',
    desc: 'XP is only awarded after the Definition of Done is verified. Volume-based metrics are always secondary to quality-weighted metrics.',
    icon: Shield,
    color: 'text-green-400',
    border: 'border-green-800/40',
  },
  {
    title: 'Collaboration Over Competition',
    desc: 'Team-level XP pools and collaboration scores are weighted equally to individual rankings to prevent zero-sum competition.',
    icon: Users,
    color: 'text-blue-400',
    border: 'border-blue-800/40',
  },
  {
    title: 'Sustainable Engagement',
    desc: 'Streak mechanics include cooldown periods. XP-free sprints are scheduled regularly to rebuild intrinsic motivation.',
    icon: Flame,
    color: 'text-orange-400',
    border: 'border-orange-800/40',
  },
  {
    title: 'Fairness by Design',
    desc: 'Role-normalised scoring and difficulty multipliers ensure XP reflects contribution effort, not role type or seniority bias.',
    icon: Scale,
    color: 'text-violet-400',
    border: 'border-violet-800/40',
  },
  {
    title: 'Transparency & Consent',
    desc: 'The team co-designs XP weights in retrospectives. Leaderboards are opt-in. All scoring criteria are publicly documented.',
    icon: CheckCircle2,
    color: 'text-teal-400',
    border: 'border-teal-800/40',
  },
  {
    title: 'Monitoring & Adaptation',
    desc: 'Burnout indicators, quality metrics, and engagement trends are tracked in Analytics. Gamification rules are adjusted each quarter.',
    icon: BarChart3,
    color: 'text-pink-400',
    border: 'border-pink-800/40',
  },
]

const CATEGORIES = ['All', 'Social Dynamics', 'Team Wellbeing', 'Quality & Integrity', 'Behavioural Psychology', 'Fairness & Equity']

export default function Risks() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [expandedRisk, setExpandedRisk] = useState(null)

  const filtered = activeCategory === 'All'
    ? RISKS
    : RISKS.filter(r => r.category === activeCategory)

  const highCount   = RISKS.filter(r => r.impact === 'High').length
  const mediumCount = RISKS.filter(r => r.impact === 'Medium').length

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="Gamification Risk Framework"
        subtitle="Academic analysis of gamification risks in Scrum — causes, impacts, and mitigations"
      />

      <main className="flex-1 p-6 space-y-8">

        {/* Academic framing */}
        <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/50 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-900/40 border border-amber-700/40 flex items-center justify-center flex-shrink-0 mt-1">
              <AlertTriangle size={20} className="text-amber-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-bold text-white mb-2">Why Gamification Risks Matter in Scrum</h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-3">
                Gamification — the application of game-design elements to non-game contexts (Deterding et al., 2011) — can significantly improve
                engagement and motivation in Scrum teams. However, poorly designed gamification systems introduce predictable dysfunctions.
                Research by Hamari et al. (2014) demonstrates that gamification effects are highly context-dependent and require careful design
                to avoid undermining the intrinsic motivation and collaborative culture that effective Scrum depends upon.
              </p>
              <p className="text-sm text-slate-400 leading-relaxed">
                This framework identifies seven primary risk categories observed in gamified Agile environments, mapped to specific
                Scrum activities, with evidence-based mitigation strategies for each.
              </p>
              <div className="flex items-center gap-4 mt-4 flex-wrap">
                <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/60 px-3 py-2 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span>{highCount} High Impact Risks</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/60 px-3 py-2 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span>{mediumCount} Medium Impact Risks</span>
                </div>
                <Link to="/analytics" className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 bg-violet-950/30 px-3 py-2 rounded-lg border border-violet-800/40 transition-colors">
                  <BarChart3 size={12} />
                  View burnout indicators in Analytics
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Risk matrix overview */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <BarChart3 size={15} className="text-violet-400" />
            Risk Summary Matrix
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Risks Identified', value: RISKS.length, color: 'text-white',     bg: 'bg-slate-700/40' },
              { label: 'High Impact',            value: highCount,    color: 'text-red-400',    bg: 'bg-red-950/20 border-red-800/30' },
              { label: 'Medium Impact',          value: mediumCount,  color: 'text-yellow-400', bg: 'bg-yellow-950/20 border-yellow-800/30' },
              { label: 'Mitigation Strategies',  value: RISKS.reduce((s, r) => s + r.mitigations.length, 0), color: 'text-green-400', bg: 'bg-green-950/20 border-green-800/30' },
            ].map(s => (
              <div key={s.label} className={`rounded-2xl border p-4 ${s.bg}`}>
                <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-slate-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Category filter */}
        <div>
          <div className="flex gap-2 flex-wrap mb-6">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40'
                    : 'bg-slate-800/60 text-slate-400 border border-slate-700/50 hover:text-slate-200 hover:border-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Risk cards */}
          <div className="space-y-4">
            {filtered.map(risk => {
              const Icon = risk.icon
              const CategoryIcon = risk.categoryIcon
              const isExpanded = expandedRisk === risk.id

              return (
                <div
                  key={risk.id}
                  className={`rounded-2xl border ${risk.borderColor} ${risk.bgColor} overflow-hidden transition-all`}
                >
                  {/* Card header — always visible */}
                  <button
                    className="w-full text-left p-5"
                    onClick={() => setExpandedRisk(isExpanded ? null : risk.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center flex-shrink-0">
                        <Icon size={18} className={risk.impactColor} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap mb-1">
                          <h3 className="text-sm font-bold text-white">{risk.title}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-md border font-medium ${risk.tagColor}`}>
                            {risk.category}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-md font-semibold ${
                            risk.impact === 'High'
                              ? 'bg-red-900/40 text-red-300 border border-red-800/40'
                              : 'bg-yellow-900/40 text-yellow-300 border border-yellow-800/40'
                          }`}>
                            {risk.impact} Impact
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{risk.description}</p>
                        {/* Affected activities — always visible */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {risk.affectedActivities.map(a => (
                            <span key={a} className="text-xs px-2 py-0.5 rounded-md bg-slate-800/60 text-slate-400 border border-slate-700/40">
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className={`text-slate-400 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                        <ArrowRight size={16} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </div>
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="border-t border-slate-700/40 p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Full description */}
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Detailed Explanation</p>
                        <p className="text-xs text-slate-300 leading-relaxed">{risk.description}</p>

                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mt-4 mb-2">Warning Signs</p>
                        <ul className="space-y-1.5">
                          {risk.symptoms.map(s => (
                            <li key={s} className="flex items-start gap-2 text-xs text-slate-400">
                              <AlertTriangle size={11} className={`${risk.impactColor} flex-shrink-0 mt-0.5`} />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Mitigations */}
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Mitigation Strategies</p>
                        <ul className="space-y-2">
                          {risk.mitigations.map(m => (
                            <li key={m} className="flex items-start gap-2 text-xs">
                              <CheckCircle2 size={12} className="text-green-400 flex-shrink-0 mt-0.5" />
                              <span className="text-slate-300 leading-relaxed">{m}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Mitigation framework */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Shield size={16} className="text-green-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Ethical Gamification Design Principles</h2>
          </div>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            The following principles underpin this platform's gamification design, ensuring motivational mechanics enhance
            rather than undermine the Scrum team's performance, wellbeing, and collaboration.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MITIGATION_PRINCIPLES.map(p => {
              const Icon = p.icon
              return (
                <div key={p.title} className={`bg-slate-800/40 border ${p.border} rounded-2xl p-4`}>
                  <div className="flex items-center gap-2.5 mb-2">
                    <Icon size={16} className={p.color} />
                    <h4 className="text-sm font-semibold text-white">{p.title}</h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Academic references */}
        <div className="bg-slate-800/40 border border-slate-700/30 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Info size={15} className="text-slate-400" />
            <h3 className="text-sm font-semibold text-white">Academic References</h3>
          </div>
          <div className="space-y-2 text-xs text-slate-500">
            {[
              'Deterding, S., Dixon, D., Khaled, R., & Nacke, L. (2011). From game design elements to gamefulness: Defining "gamification." Proceedings of the 15th International Academic MindTrek Conference.',
              'Hamari, J., Koivisto, J., & Sarsa, H. (2014). Does gamification work? A literature review of empirical studies on gamification. Proceedings of the 47th Hawaii International Conference on System Sciences.',
              'Deci, E. L. (1971). Effects of externally mediated rewards on intrinsic motivation. Journal of Personality and Social Psychology, 18(1), 105–115.',
              'Deci, E. L., & Ryan, R. M. (1985). Intrinsic motivation and self-determination in human behavior. Springer.',
              'Schwaber, K., & Sutherland, J. (2020). The Scrum Guide. Scrum.org.',
              'Nicholson, S. (2012). A user-centered theoretical framework for meaningful gamification. Games+Learning+Society 8.0 Conference.',
            ].map(ref => (
              <p key={ref} className="leading-relaxed border-b border-slate-700/30 pb-2 last:border-0 last:pb-0">{ref}</p>
            ))}
          </div>
        </div>

        {/* Navigation links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { to: '/bpmn',        label: 'BPMN Process Viewer',     sub: 'See gamification integrated into each Scrum node',   icon: '⬡' },
            { to: '/analytics',   label: 'Analytics Dashboard',     sub: 'View burnout indicators and gamification impact',    icon: '📊' },
            { to: '/leaderboard', label: 'Team Leaderboard',        sub: 'See how balanced metrics mitigate toxic competition', icon: '🏆' },
          ].map(nav => (
            <Link
              key={nav.to}
              to={nav.to}
              className="flex items-center gap-3 p-4 rounded-2xl bg-slate-800/40 border border-slate-700/40 hover:border-violet-700/40 hover:bg-violet-950/20 transition-all group"
            >
              <span className="text-2xl">{nav.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">{nav.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{nav.sub}</p>
              </div>
              <ArrowRight size={14} className="text-slate-500 group-hover:text-violet-400 transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
