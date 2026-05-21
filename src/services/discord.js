import { getBotConfig, addBotLog } from './botConfig'

async function send(body) {
  const { discordWebhook } = getBotConfig()
  if (!discordWebhook) return false
  try {
    const res = await fetch(discordWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return res.ok
  } catch (e) {
    addBotLog(`Discord error: ${e.message}`, 'error')
    return false
  }
}

const COL_COLOR = { todo: 0x64748b, inprogress: 0x3b82f6, testing: 0xeab308, done: 0x22c55e }
const COL_NAME  = { todo: 'To Do', inprogress: 'In Progress', testing: 'Testing', done: 'Done' }
const PRI_EMOJI = { high: '🔴', medium: '🟡', low: '🟢' }

export async function testDiscordConnection() {
  const { discordWebhook } = getBotConfig()
  if (!discordWebhook) return { ok: false, error: 'No webhook URL configured' }
  const ok = await send({
    embeds: [{
      title: '🤖 ScrumQuest Bot Connected',
      description: 'Discord integration is active. Task updates will be posted here.',
      color: 0x7c3aed,
      footer: { text: 'ScrumQuest Bot' },
      timestamp: new Date().toISOString(),
    }],
  })
  return ok ? { ok: true } : { ok: false, error: 'Webhook rejected the request' }
}

export async function notifyTaskCreated(task, assigneeName, issueNumber) {
  const { githubRepo } = getBotConfig()
  const issueField = issueNumber && githubRepo
    ? [{ name: '🔗 GitHub Issue', value: `[#${issueNumber}](https://github.com/${githubRepo}/issues/${issueNumber})`, inline: true }]
    : []

  await send({
    embeds: [{
      title: '📋 New Task Added to Sprint',
      description: `**${task.title}**\n${task.description}`,
      color: 0x7c3aed,
      fields: [
        { name: 'Priority', value: `${PRI_EMOJI[task.priority]} ${task.priority}`, inline: true },
        { name: 'Story Points', value: `${task.storyPoints} SP`, inline: true },
        { name: 'Assignee', value: assigneeName || 'Unassigned', inline: true },
        ...issueField,
      ],
      footer: { text: 'ScrumQuest Bot' },
      timestamp: new Date().toISOString(),
    }],
  })
  addBotLog(`Discord: Notified task created — "${task.title}"`)
}

export async function notifyTaskMoved(task, fromCol, toCol, assigneeName, xpGained) {
  const isDone = toCol === 'done'
  await send({
    embeds: [{
      title: isDone ? '🏆 Task Completed!' : '🔄 Task Status Updated',
      description: `**${task.title}**\n${COL_NAME[fromCol]} → **${COL_NAME[toCol]}**`,
      color: COL_COLOR[toCol],
      fields: [
        { name: 'Assignee', value: assigneeName || 'Unknown', inline: true },
        { name: 'Story Points', value: `${task.storyPoints} SP`, inline: true },
        ...(isDone && xpGained ? [{ name: 'XP Earned', value: `+${xpGained} XP 🎮`, inline: true }] : []),
      ],
      footer: { text: 'ScrumQuest Bot' },
      timestamp: new Date().toISOString(),
    }],
  })
  addBotLog(`Discord: Notified — "${task.title}" → ${COL_NAME[toCol]}`)
}
