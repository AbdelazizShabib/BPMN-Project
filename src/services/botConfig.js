const CONFIG_KEY = 'scrumquest_bot_config'
const LOG_KEY    = 'scrumquest_bot_log'
const MAP_KEY    = 'scrumquest_issue_map'

export function getBotConfig() {
  try { return JSON.parse(localStorage.getItem(CONFIG_KEY) || '{}') }
  catch { return {} }
}
export function saveBotConfig(cfg) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg))
}

export function getBotLog() {
  try { return JSON.parse(localStorage.getItem(LOG_KEY) || '[]') }
  catch { return [] }
}
export function addBotLog(action, status = 'success') {
  const log = getBotLog()
  localStorage.setItem(LOG_KEY, JSON.stringify(
    [{ action, status, time: new Date().toISOString() }, ...log].slice(0, 40)
  ))
}
export function clearBotLog() {
  localStorage.removeItem(LOG_KEY)
}

export function getIssueNumber(taskId) {
  try { return JSON.parse(localStorage.getItem(MAP_KEY) || '{}')[taskId] || null }
  catch { return null }
}
export function setIssueNumber(taskId, num) {
  try {
    const map = JSON.parse(localStorage.getItem(MAP_KEY) || '{}')
    localStorage.setItem(MAP_KEY, JSON.stringify({ ...map, [taskId]: num }))
  } catch {}
}
