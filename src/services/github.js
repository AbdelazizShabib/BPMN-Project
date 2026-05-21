import { getBotConfig, addBotLog, setIssueNumber } from './botConfig'

function ghHeaders() {
  const { githubToken } = getBotConfig()
  return {
    Authorization: `Bearer ${githubToken}`,
    'Content-Type': 'application/json',
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}
function repoBase() {
  const { githubRepo } = getBotConfig()
  return `https://api.github.com/repos/${githubRepo}`
}

export async function testGitHubConnection() {
  const { githubToken, githubRepo } = getBotConfig()
  if (!githubToken || !githubRepo) return { ok: false, error: 'Missing token or repo' }
  try {
    const res = await fetch(repoBase(), { headers: ghHeaders() })
    if (res.ok) return { ok: true }
    const err = await res.json().catch(() => ({}))
    return { ok: false, error: err.message || `HTTP ${res.status}` }
  } catch (e) {
    return { ok: false, error: e.message }
  }
}

export async function ensureLabels() {
  const defs = [
    { name: 'scrum:todo',        color: '64748b' },
    { name: 'scrum:in-progress', color: '3b82f6' },
    { name: 'scrum:testing',     color: 'eab308' },
    { name: 'scrum:done',        color: '22c55e' },
    { name: 'priority:high',     color: 'ef4444' },
    { name: 'priority:medium',   color: 'f59e0b' },
    { name: 'priority:low',      color: '6ee7b7' },
    { name: 'scrumquest',        color: '7c3aed' },
  ]
  await Promise.all(defs.map(l =>
    fetch(`${repoBase()}/labels`, {
      method: 'POST',
      headers: ghHeaders(),
      body: JSON.stringify({ name: l.name, color: l.color }),
    }).catch(() => {})
  ))
}

const SCRUM_LABELS = ['scrum:todo', 'scrum:in-progress', 'scrum:testing', 'scrum:done']
const COL_LABEL = {
  todo: 'scrum:todo', inprogress: 'scrum:in-progress',
  testing: 'scrum:testing', done: 'scrum:done',
}
const COL_NAME = { todo: 'To Do', inprogress: 'In Progress', testing: 'Testing', done: 'Done' }

export async function createIssue(task, assigneeName) {
  const { githubToken, githubRepo } = getBotConfig()
  if (!githubToken || !githubRepo) return null
  try {
    const res = await fetch(`${repoBase()}/issues`, {
      method: 'POST',
      headers: ghHeaders(),
      body: JSON.stringify({
        title: `[ScrumQuest] ${task.title}`,
        body: [
          `## ${task.title}`,
          '',
          task.description,
          '',
          '---',
          '| Field | Value |',
          '|---|---|',
          `| **Story Points** | ${task.storyPoints} SP |`,
          `| **Priority** | ${task.priority} |`,
          `| **Type** | ${task.type} |`,
          `| **Assigned To** | ${assigneeName || 'Unassigned'} |`,
          `| **Sprint** | ${task.sprintId} |`,
          '',
          '> 🤖 Created automatically by ScrumQuest Bot',
        ].join('\n'),
        labels: [`priority:${task.priority}`, 'scrum:todo', 'scrumquest'],
      }),
    })
    if (!res.ok) {
      addBotLog(`Failed to create issue for "${task.title}"`, 'error')
      return null
    }
    const data = await res.json()
    setIssueNumber(task.id, data.number)
    addBotLog(`GitHub: Created Issue #${data.number} — "${task.title}"`)
    return data.number
  } catch (e) {
    addBotLog(`GitHub error: ${e.message}`, 'error')
    return null
  }
}

export async function moveIssue(issueNumber, toColumn, xpGained) {
  const { githubToken, githubRepo } = getBotConfig()
  if (!githubToken || !githubRepo || !issueNumber) return
  try {
    const issueRes = await fetch(`${repoBase()}/issues/${issueNumber}`, { headers: ghHeaders() })
    if (!issueRes.ok) return
    const issue = await issueRes.json()
    const otherLabels = issue.labels.map(l => l.name).filter(l => !SCRUM_LABELS.includes(l))

    await fetch(`${repoBase()}/issues/${issueNumber}`, {
      method: 'PATCH',
      headers: ghHeaders(),
      body: JSON.stringify({
        labels: [...otherLabels, COL_LABEL[toColumn]],
        state: toColumn === 'done' ? 'closed' : 'open',
      }),
    })

    if (toColumn === 'done') {
      await fetch(`${repoBase()}/issues/${issueNumber}/comments`, {
        method: 'POST',
        headers: ghHeaders(),
        body: JSON.stringify({
          body: `✅ **Task completed via ScrumQuest!**\n\n🎮 XP awarded: **+${xpGained} XP**\n\n> 🤖 Automatically closed by ScrumQuest Bot`,
        }),
      })
    }

    addBotLog(`GitHub: Moved Issue #${issueNumber} → ${COL_NAME[toColumn]}`)
  } catch (e) {
    addBotLog(`GitHub error: ${e.message}`, 'error')
  }
}
