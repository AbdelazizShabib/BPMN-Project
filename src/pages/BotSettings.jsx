import { useState, useEffect } from 'react'
import Header from '../components/layout/Header'
import {
  GitPullRequest, MessageSquare, Bot, CheckCircle2, AlertCircle,
  Key, ExternalLink, Trash2, RefreshCw, Eye, EyeOff,
  Zap, GitBranch, Tag,
} from 'lucide-react'
import { getBotConfig, saveBotConfig, getBotLog, clearBotLog } from '../services/botConfig'
import { testGitHubConnection, ensureLabels } from '../services/github'
import { testDiscordConnection } from '../services/discord'

function StatusBadge({ ok }) {
  return ok
    ? <span className="flex items-center gap-1.5 text-xs text-green-400 font-medium"><CheckCircle2 size={13} /> Connected</span>
    : <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium"><AlertCircle size={13} /> Not configured</span>
}

function PasswordInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 pr-9"
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
      >
        {show ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  )
}

export default function BotSettings() {
  const [cfg, setCfg] = useState({ githubToken: '', githubRepo: '', discordWebhook: '' })
  const [ghStatus, setGhStatus] = useState(null)
  const [dcStatus, setDcStatus] = useState(null)
  const [saved, setSaved] = useState(false)
  const [log, setLog] = useState([])

  useEffect(() => {
    const stored = getBotConfig()
    setCfg({ githubToken: stored.githubToken || '', githubRepo: stored.githubRepo || '', discordWebhook: stored.discordWebhook || '' })
    setLog(getBotLog())
  }, [])

  const handleSave = () => {
    saveBotConfig(cfg)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const testGH = async () => {
    saveBotConfig(cfg)
    setGhStatus('testing')
    const result = await testGitHubConnection()
    if (result.ok) await ensureLabels()
    setGhStatus(result)
  }

  const testDC = async () => {
    saveBotConfig(cfg)
    setDcStatus('testing')
    const result = await testDiscordConnection()
    setDcStatus(result)
  }

  const isGHConfigured = !!(cfg.githubToken && cfg.githubRepo)
  const isDCConfigured = !!cfg.discordWebhook

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Bot Automation" subtitle="RPA integration — GitHub Issues & Discord notifications" />

      <main className="flex-1 p-4 lg:p-6 space-y-6 max-w-5xl">

        {/* Status row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="w-10 h-10 rounded-xl bg-slate-700/60 flex items-center justify-center">
              <GitPullRequest size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">GitHub Issues</p>
              <StatusBadge ok={ghStatus?.ok || isGHConfigured} />
            </div>
            {cfg.githubRepo && (
              <span className="text-xs text-slate-500 truncate max-w-28">{cfg.githubRepo}</span>
            )}
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="w-10 h-10 rounded-xl bg-indigo-900/40 flex items-center justify-center">
              <MessageSquare size={20} className="text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">Discord</p>
              <StatusBadge ok={dcStatus?.ok || isDCConfigured} />
            </div>
          </div>
        </div>

        {/* Config cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* GitHub */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <GitPullRequest size={18} className="text-white" />
              <h2 className="text-sm font-bold text-white">GitHub Integration</h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <Key size={11} />Personal Access Token
                </label>
                <PasswordInput
                  value={cfg.githubToken}
                  onChange={e => setCfg(c => ({ ...c, githubToken: e.target.value }))}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                />
                <p className="text-xs text-slate-600 mt-1.5">
                  Needs <span className="text-slate-500">Issues: Read & Write</span>.{' '}
                  <a
                    href="https://github.com/settings/tokens/new?scopes=repo&description=ScrumQuest+Bot"
                    target="_blank"
                    rel="noreferrer"
                    className="text-violet-500 hover:text-violet-400 inline-flex items-center gap-0.5"
                  >
                    Create token <ExternalLink size={10} />
                  </a>
                </p>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Repository</label>
                <input
                  type="text"
                  value={cfg.githubRepo}
                  onChange={e => setCfg(c => ({ ...c, githubRepo: e.target.value }))}
                  placeholder="owner/repository-name"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={testGH}
                disabled={!isGHConfigured || ghStatus === 'testing'}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-700/60 text-slate-300 text-xs font-medium hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw size={12} className={ghStatus === 'testing' ? 'animate-spin' : ''} />
                Test Connection
              </button>
              {ghStatus && ghStatus !== 'testing' && (
                <span className={`flex items-center gap-1.5 text-xs ${ghStatus.ok ? 'text-green-400' : 'text-red-400'}`}>
                  {ghStatus.ok ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                  {ghStatus.ok ? 'Connected! Labels created.' : ghStatus.error}
                </span>
              )}
            </div>
          </div>

          {/* Discord */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <MessageSquare size={18} className="text-indigo-400" />
              <h2 className="text-sm font-bold text-white">Discord Notifications</h2>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Key size={11} />Webhook URL
              </label>
              <PasswordInput
                value={cfg.discordWebhook}
                onChange={e => setCfg(c => ({ ...c, discordWebhook: e.target.value }))}
                placeholder="https://discord.com/api/webhooks/..."
              />
              <p className="text-xs text-slate-600 mt-1.5">
                Discord → Channel Settings → Integrations → Webhooks → New Webhook
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={testDC}
                disabled={!isDCConfigured || dcStatus === 'testing'}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-700/60 text-slate-300 text-xs font-medium hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw size={12} className={dcStatus === 'testing' ? 'animate-spin' : ''} />
                Test & Send Message
              </button>
              {dcStatus && dcStatus !== 'testing' && (
                <span className={`flex items-center gap-1.5 text-xs ${dcStatus.ok ? 'text-green-400' : 'text-red-400'}`}>
                  {dcStatus.ok ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                  {dcStatus.ok ? 'Message sent to Discord!' : dcStatus.error}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              saved ? 'bg-green-600 text-white' : 'bg-violet-600 hover:bg-violet-500 text-white'
            }`}
          >
            {saved ? '✓ Saved' : 'Save Settings'}
          </button>
        </div>

        {/* What the bot does */}
        <div>
          <h2 className="text-sm font-bold text-white mb-3">What This Bot Automates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                icon: GitBranch,
                color: 'text-violet-400',
                bg: 'bg-violet-900/20 border-violet-800/30',
                title: 'Task Added to Sprint',
                desc: 'When a backlog item is moved to the sprint, the bot opens a GitHub Issue with full details, priority label, and type label.',
              },
              {
                icon: Tag,
                color: 'text-blue-400',
                bg: 'bg-blue-900/20 border-blue-800/30',
                title: 'Task Moved',
                desc: 'Dragging a card across columns automatically updates the GitHub Issue labels to reflect the new status (To Do, In Progress, Testing).',
              },
              {
                icon: Zap,
                color: 'text-green-400',
                bg: 'bg-green-900/20 border-green-800/30',
                title: 'Task Completed',
                desc: 'Moving a task to Done closes the GitHub Issue, posts a completion comment with XP earned, and sends a Discord notification.',
              },
            ].map(({ icon: Icon, color, bg, title, desc }) => (
              <div key={title} className={`rounded-2xl border p-4 ${bg}`}>
                <Icon size={18} className={`${color} mb-2.5`} />
                <p className="text-sm font-semibold text-white mb-1">{title}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50">
            <h2 className="text-sm font-bold text-white">Bot Activity Log</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLog(getBotLog())}
                className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors rounded-lg hover:bg-slate-700/50"
              >
                <RefreshCw size={13} />
              </button>
              <button
                onClick={() => { clearBotLog(); setLog([]) }}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-900/20"
              >
                <Trash2 size={12} /> Clear
              </button>
            </div>
          </div>

          {log.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <Bot size={24} className="text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-600">No activity yet. Configure the bot and start moving tasks on the Scrum Board.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700/30 max-h-72 overflow-y-auto">
              {log.map((entry, i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-3">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${entry.status === 'error' ? 'bg-red-500' : 'bg-green-500'}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs ${entry.status === 'error' ? 'text-red-400' : 'text-slate-300'}`}>{entry.action}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{new Date(entry.time).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  )
}
