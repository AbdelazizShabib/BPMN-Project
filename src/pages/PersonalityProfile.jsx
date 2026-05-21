import { useState } from 'react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import {
  ChevronLeft, ChevronRight, RotateCcw, Zap, ArrowRight, CheckCircle2,
  Brain, Lightbulb, Target, Users, Heart, Activity,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/layout/Header'

const TRAIT_ORDER = ['O', 'C', 'E', 'A', 'N']

const OCEAN = {
  O: {
    name: 'Openness',
    fullName: 'Openness to Experience',
    icon: Lightbulb,
    color: '#7c3aed',
    tw: {
      text: 'text-violet-400',
      bg: 'bg-violet-600',
      bgLight: 'bg-violet-950/40',
      borderLight: 'border-violet-800/40',
    },
    tagline: 'Creativity, curiosity, and appetite for novel ideas.',
    highLabel: 'You thrive on exploration, innovation, and creative problem-solving.',
    lowLabel: 'You prefer structured, proven approaches over experimental methods.',
    questions: [
      'I enjoy exploring unconventional solutions to technical problems.',
      'I find creative or experimental approaches to work motivating.',
      'I get excited by unfamiliar technologies or new working methods.',
    ],
    mechanics: [
      'Exploration bonuses for novel technical approaches',
      'Discovery achievements for finding process improvements',
      'Optional creative challenge tasks and innovation streaks',
      'Rewards for adopting new tools or experimental methods',
    ],
  },
  C: {
    name: 'Conscientiousness',
    fullName: 'Conscientiousness',
    icon: Target,
    color: '#3b82f6',
    tw: {
      text: 'text-blue-400',
      bg: 'bg-blue-600',
      bgLight: 'bg-blue-950/40',
      borderLight: 'border-blue-800/40',
    },
    tagline: 'Discipline, organisation, and commitment to quality.',
    highLabel: 'You excel with structured goals, checklists, quality gates, and progress tracking.',
    lowLabel: 'You work flexibly and adaptively rather than following rigid processes.',
    questions: [
      'I prefer to plan and break down tasks thoroughly before starting.',
      'Meeting deadlines and fulfilling commitments is very important to me.',
      'I pay close attention to detail, quality standards, and documentation.',
    ],
    mechanics: [
      'Milestone badges and Definition of Done streaks',
      'Estimation accuracy rewards (Estimation Master badge)',
      'Sprint goal achievement bonuses (+80 XP)',
      'Structured task decomposition rewards (Sprint Architect)',
    ],
  },
  E: {
    name: 'Extraversion',
    fullName: 'Extraversion',
    icon: Users,
    color: '#f59e0b',
    tw: {
      text: 'text-amber-400',
      bg: 'bg-amber-600',
      bgLight: 'bg-amber-950/40',
      borderLight: 'border-amber-800/40',
    },
    tagline: 'Social energy, assertiveness, and enjoyment of group work.',
    highLabel: 'Leaderboards, sprint demos, and public team recognition energise you.',
    lowLabel: 'You prefer deep individual focus over social mechanics and public visibility.',
    questions: [
      'I feel energised by team meetings, standups, and group discussions.',
      'Public recognition of my work (demos, leaderboards) motivates me.',
      'I prefer collaborative group work over working independently.',
    ],
    mechanics: [
      'Team leaderboard rankings and public achievement announcements',
      'Sprint Review presentation bonuses (+200 XP)',
      'Daily standup streak rewards (Daily Champion)',
      'Collaboration score and peer shoutout systems',
    ],
  },
  A: {
    name: 'Agreeableness',
    fullName: 'Agreeableness',
    icon: Heart,
    color: '#10b981',
    tw: {
      text: 'text-emerald-400',
      bg: 'bg-emerald-600',
      bgLight: 'bg-emerald-950/40',
      borderLight: 'border-emerald-800/40',
    },
    tagline: 'Cooperation, empathy, and motivation to support others.',
    highLabel: 'Team XP pools, peer recognition, and helping-others rewards motivate you most.',
    lowLabel: 'You are independently focused and results-driven over team-harmony oriented.',
    questions: [
      'I find it rewarding to help teammates solve problems or remove blockers.',
      'Team harmony and collective success matter more to me than individual rankings.',
      "I enjoy peer review, mentoring, and supporting others' work.",
    ],
    mechanics: [
      'Team XP pool contributions and collaborative achievement unlocks',
      'Peer code review quality bonuses (+75 XP)',
      'Impediment removal rewards (Blocker Buster +200 XP)',
      'Retrospective participation and mentoring bonuses',
    ],
  },
  N: {
    name: 'Neuroticism',
    fullName: 'Neuroticism',
    icon: Activity,
    color: '#f43f5e',
    tw: {
      text: 'text-rose-400',
      bg: 'bg-rose-600',
      bgLight: 'bg-rose-950/40',
      borderLight: 'border-rose-800/40',
    },
    tagline: 'Sensitivity to stress, pressure, and emotional variation.',
    highLabel: 'You benefit from private progress tracking, supportive feedback, and low-pressure mechanics.',
    lowLabel: 'You handle competitive pressure, public stakes, and tight deadlines well.',
    questions: [
      'I find public performance comparisons (like leaderboards) stressful.',
      'High-pressure sprint deadlines and demos cause me noticeable anxiety.',
      'I prefer private progress tracking over competitive team visibility.',
    ],
    mechanics: [
      'Private XP dashboards instead of public-only leaderboards',
      'Streak recovery mechanics with grace days for illness or leave',
      'Bugs rewarded to fix — not penalised for having (Bug Crusher +150 XP)',
      'Supportive Realist bonus for responsible scope management',
    ],
  },
}

function scoreLevel(s) {
  if (s >= 80) return 'Very High'
  if (s >= 60) return 'High'
  if (s >= 40) return 'Moderate'
  return 'Low'
}

function calcScores(answers) {
  return Object.fromEntries(
    TRAIT_ORDER.map(key => {
      const sum = [0, 1, 2].reduce((acc, i) => acc + (answers[`${key}_${i}`] || 0), 0)
      const score = sum === 0 ? 0 : Math.round((sum - 3) / 12 * 100)
      return [key, score]
    })
  )
}

// ── Intro ────────────────────────────────────────────────────────────────────

function IntroScreen({ onStart }) {
  return (
    <main className="flex-1 overflow-y-auto p-4 lg:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-900/40">
            <Brain size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Your Gamification Profile</h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-lg mx-auto">
            Based on the <span className="text-white font-medium">Big Five (OCEAN)</span> personality
            model, this 15-question assessment identifies which Scrum gamification mechanics will
            motivate you most — and which to approach with caution.
          </p>
        </div>

        {/* Trait pills */}
        <div className="grid grid-cols-5 gap-2 mb-10">
          {TRAIT_ORDER.map(key => {
            const t = OCEAN[key]
            const Icon = t.icon
            return (
              <div key={key} className={`rounded-xl p-3 text-center ${t.tw.bgLight} border ${t.tw.borderLight}`}>
                <Icon size={20} className={`mx-auto mb-1.5 ${t.tw.text}`} />
                <p className={`text-xs font-bold ${t.tw.text}`}>{key}</p>
                <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">{t.name}</p>
              </div>
            )
          })}
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-3 mb-8 text-center">
          {[
            { label: '5 Traits', sub: 'OCEAN model' },
            { label: '15 Questions', sub: '3 per trait' },
            { label: '~3 Minutes', sub: 'to complete' },
          ].map(({ label, sub }) => (
            <div key={label} className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
              <p className="text-lg font-bold text-white">{label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-base transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-900/40"
        >
          Start Assessment <ArrowRight size={18} />
        </button>
      </div>
    </main>
  )
}

// ── Quiz step ────────────────────────────────────────────────────────────────

function QuizScreen({ step, answers, onAnswer, onNext, onBack, showError }) {
  const traitKey = TRAIT_ORDER[step]
  const trait = OCEAN[traitKey]
  const Icon = trait.icon
  const progress = (step / 5) * 100

  return (
    <main className="flex-1 overflow-y-auto p-4 lg:p-8 flex flex-col items-center">
      <div className="max-w-xl w-full">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-slate-500 mb-2">
            <span>Trait {step + 1} of 5</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, backgroundColor: trait.color }}
            />
          </div>
          <div className="flex gap-2 mt-3">
            {TRAIT_ORDER.map((k, i) => (
              <div
                key={k}
                className="flex-1 h-1 rounded-full transition-all duration-300"
                style={{ backgroundColor: i <= step ? OCEAN[k].color : '#334155' }}
              />
            ))}
          </div>
        </div>

        {/* Trait header */}
        <div className={`rounded-2xl p-5 mb-6 ${trait.tw.bgLight} border ${trait.tw.borderLight}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${trait.tw.bg} flex items-center justify-center flex-shrink-0`}>
              <Icon size={20} className="text-white" />
            </div>
            <div>
              <p className={`font-bold text-lg ${trait.tw.text}`}>{trait.fullName}</p>
              <p className="text-xs text-slate-400">{trait.tagline}</p>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-5 mb-8">
          {trait.questions.map((q, qIdx) => {
            const current = answers[`${traitKey}_${qIdx}`]
            return (
              <div key={qIdx} className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
                <p className="text-sm text-slate-200 font-medium mb-4 leading-relaxed">{q}</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(val => (
                    <button
                      key={val}
                      onClick={() => onAnswer(traitKey, qIdx, val)}
                      className={`flex-1 h-10 rounded-xl border-2 font-bold text-sm transition-all ${
                        current === val
                          ? 'text-white'
                          : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-slate-400 hover:text-white'
                      }`}
                      style={current === val ? { backgroundColor: trait.color, borderColor: trait.color } : {}}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-2 px-0.5">
                  <span>Strongly disagree</span>
                  <span>Strongly agree</span>
                </div>
              </div>
            )
          })}
        </div>

        {showError && (
          <p className="text-xs text-rose-400 text-center mb-4">
            Please answer all 3 questions before continuing.
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 text-sm transition-all"
          >
            <ChevronLeft size={16} /> Back
          </button>
          <button
            onClick={onNext}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white font-semibold text-sm transition-all"
            style={{ backgroundColor: trait.color }}
          >
            {step === 4 ? 'See My Results' : `Next: ${OCEAN[TRAIT_ORDER[step + 1]]?.name}`}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </main>
  )
}

// ── Results ──────────────────────────────────────────────────────────────────

function ResultsScreen({ scores, onRetake }) {
  const navigate = useNavigate()
  const sorted = [...TRAIT_ORDER].sort((a, b) => scores[b] - scores[a])
  const dominant = sorted[0]
  const DomTrait = OCEAN[dominant]
  const DomIcon = DomTrait.icon

  const radarData = TRAIT_ORDER.map(key => ({
    trait: OCEAN[key].name,
    score: scores[key],
    fullMark: 100,
  }))

  return (
    <main className="flex-1 overflow-y-auto p-4 lg:p-6">
      <div className="max-w-5xl mx-auto space-y-6 pb-6">

        {/* Dominant trait banner */}
        <div className={`rounded-2xl p-5 ${DomTrait.tw.bgLight} border ${DomTrait.tw.borderLight} flex items-start gap-4`}>
          <div className={`w-12 h-12 rounded-xl ${DomTrait.tw.bg} flex items-center justify-center flex-shrink-0`}>
            <DomIcon size={22} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Dominant Trait</p>
            <p className={`text-xl font-bold ${DomTrait.tw.text}`}>{DomTrait.fullName}</p>
            <p className="text-sm text-slate-300 mt-1">
              {scores[dominant] >= 60 ? DomTrait.highLabel : DomTrait.lowLabel}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className={`text-3xl font-black ${DomTrait.tw.text}`}>{scores[dominant]}</p>
            <p className="text-xs text-slate-400">{scoreLevel(scores[dominant])}</p>
          </div>
        </div>

        {/* Chart + score bars */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Radar chart */}
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-5">
            <p className="text-sm font-semibold text-white mb-4">OCEAN Radar</p>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis
                  dataKey="trait"
                  tick={({ x, y, payload }) => {
                    const key = TRAIT_ORDER.find(k => OCEAN[k].name === payload.value)
                    return (
                      <text
                        x={x} y={y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={11}
                        fontWeight="600"
                        fill={key ? OCEAN[key].color : '#94a3b8'}
                      >
                        {payload.value}
                      </text>
                    )
                  }}
                />
                <Radar
                  dataKey="score"
                  stroke="#7c3aed"
                  fill="#7c3aed"
                  fillOpacity={0.2}
                  strokeWidth={2}
                  dot={{ fill: '#7c3aed', r: 3 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Score bars */}
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-5 flex flex-col justify-center gap-4">
            <p className="text-sm font-semibold text-white">Trait Scores</p>
            {sorted.map(key => {
              const t = OCEAN[key]
              const s = scores[key]
              return (
                <div key={key}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className={`${t.tw.text} font-semibold`}>{t.name}</span>
                    <span className="text-slate-400">{scoreLevel(s)} · {s}/100</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${s}%`, backgroundColor: t.color, transition: 'width 0.8s ease' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <p className="text-sm font-semibold text-white mb-3">Recommended Gamification Mechanics</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sorted.map((key, idx) => {
              const t = OCEAN[key]
              const s = scores[key]
              const Icon = t.icon
              const isTop = idx < 2
              return (
                <div
                  key={key}
                  className={`rounded-xl p-4 border ${
                    isTop ? `${t.tw.bgLight} ${t.tw.borderLight}` : 'bg-slate-800/30 border-slate-700/30'
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isTop ? t.tw.bg : 'bg-slate-700'}`}>
                      <Icon size={15} className="text-white" />
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${isTop ? t.tw.text : 'text-slate-400'}`}>{t.name}</p>
                      <p className="text-xs text-slate-500">{scoreLevel(s)} · {s}/100</p>
                    </div>
                  </div>
                  <ul className="space-y-1.5">
                    {t.mechanics.slice(0, isTop ? 4 : 2).map(m => (
                      <li key={m} className="flex items-start gap-2 text-xs text-slate-400">
                        <CheckCircle2 size={11} className={`flex-shrink-0 mt-0.5 ${isTop ? t.tw.text : 'text-slate-600'}`} />
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onRetake}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 text-sm transition-all"
          >
            <RotateCcw size={14} /> Retake Assessment
          </button>
          <button
            onClick={() => navigate('/bpmn')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all"
          >
            <Zap size={14} /> Explore in BPMN Diagram <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </main>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function PersonalityProfile() {
  const [step, setStep] = useState('intro')
  const [answers, setAnswers] = useState({})
  const [showError, setShowError] = useState(false)

  const setAnswer = (traitKey, qIdx, val) => {
    setAnswers(prev => ({ ...prev, [`${traitKey}_${qIdx}`]: val }))
    setShowError(false)
  }

  const isStepComplete = (s) => {
    const key = TRAIT_ORDER[s]
    return [0, 1, 2].every(i => answers[`${key}_${i}`])
  }

  const goNext = () => {
    if (!isStepComplete(step)) { setShowError(true); return }
    setShowError(false)
    if (step < 4) setStep(step + 1)
    else setStep('results')
  }

  const goPrev = () => {
    setShowError(false)
    if (step > 0) setStep(step - 1)
    else setStep('intro')
  }

  const reset = () => {
    setStep('intro')
    setAnswers({})
    setShowError(false)
  }

  const subtitle =
    step === 'intro' ? 'Big Five OCEAN model · 15 questions · ~3 minutes'
    : step === 'results' ? 'Personalised gamification recommendations based on your personality'
    : `Trait ${step + 1} of 5 — ${OCEAN[TRAIT_ORDER[step]]?.fullName}`

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header title="Personality Profile" subtitle={subtitle} />

      {step === 'intro' && <IntroScreen onStart={() => setStep(0)} />}

      {typeof step === 'number' && (
        <QuizScreen
          step={step}
          answers={answers}
          onAnswer={setAnswer}
          onNext={goNext}
          onBack={goPrev}
          showError={showError}
        />
      )}

      {step === 'results' && (
        <ResultsScreen scores={calcScores(answers)} onRetake={reset} />
      )}
    </div>
  )
}
