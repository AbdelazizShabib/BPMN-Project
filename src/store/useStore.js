import { create } from 'zustand'

const initialTeamMembers = [
  { id: 1, name: 'Alex Chen', role: 'Frontend Dev', avatar: 'AC', xp: 4250, level: 8, tasksCompleted: 34, bugsFixed: 12, streak: 7, badges: ['sprint_hero', 'deadline_master', 'streak_champion'] },
  { id: 2, name: 'Sara Kim', role: 'Backend Dev', avatar: 'SK', xp: 3890, level: 7, tasksCompleted: 29, bugsFixed: 18, streak: 5, badges: ['bug_hunter', 'team_player'] },
  { id: 3, name: 'Omar Hassan', role: 'Full Stack Dev', avatar: 'OH', xp: 5100, level: 9, tasksCompleted: 41, bugsFixed: 9, streak: 12, badges: ['sprint_hero', 'productivity', 'streak_champion', 'team_player'] },
  { id: 4, name: 'Lena Müller', role: 'QA Engineer', avatar: 'LM', xp: 3200, level: 6, tasksCompleted: 22, bugsFixed: 31, streak: 3, badges: ['bug_hunter', 'deadline_master'] },
  { id: 5, name: 'James Park', role: 'DevOps', avatar: 'JP', xp: 2750, level: 5, tasksCompleted: 18, bugsFixed: 7, streak: 2, badges: ['team_player'] },
]

const initialBacklog = [
  { id: 'pb-1', title: 'User authentication flow', description: 'Implement OAuth2 login with Google and GitHub', priority: 'high', storyPoints: 8, type: 'feature', assignee: null },
  { id: 'pb-2', title: 'Dashboard analytics charts', description: 'Add velocity and burndown charts to dashboard', priority: 'high', storyPoints: 5, type: 'feature', assignee: null },
  { id: 'pb-3', title: 'Email notification system', description: 'Send sprint summary emails to team members', priority: 'medium', storyPoints: 3, type: 'feature', assignee: null },
  { id: 'pb-4', title: 'Mobile responsive layout', description: 'Make all pages responsive for mobile devices', priority: 'medium', storyPoints: 5, type: 'improvement', assignee: null },
  { id: 'pb-5', title: 'API rate limiting', description: 'Implement rate limiting on all public endpoints', priority: 'low', storyPoints: 2, type: 'chore', assignee: null },
  { id: 'pb-6', title: 'Dark mode support', description: 'Add toggleable dark/light theme', priority: 'low', storyPoints: 3, type: 'improvement', assignee: null },
]

const initialSprint = {
  id: 'sprint-5',
  name: 'Sprint 5',
  goal: 'Complete authentication and core dashboard features',
  startDate: '2026-05-12',
  endDate: '2026-05-26',
  velocity: 32,
  columns: {
    todo: {
      id: 'todo', title: 'To Do',
      tasks: [
        { id: 't-1', title: 'Design login page UI', description: 'Create Figma mockups for login/register', priority: 'high', storyPoints: 3, type: 'design', assignee: 1, sprintId: 'sprint-5' },
        { id: 't-2', title: 'Setup CI/CD pipeline', description: 'Configure GitHub Actions for automated deploys', priority: 'medium', storyPoints: 5, type: 'chore', assignee: 5, sprintId: 'sprint-5' },
        { id: 't-3', title: 'Write unit tests for auth', description: 'Cover all authentication edge cases', priority: 'high', storyPoints: 4, type: 'test', assignee: 4, sprintId: 'sprint-5' },
      ]
    },
    inprogress: {
      id: 'inprogress', title: 'In Progress',
      tasks: [
        { id: 't-4', title: 'Implement JWT middleware', description: 'Token validation and refresh logic', priority: 'high', storyPoints: 5, type: 'feature', assignee: 2, sprintId: 'sprint-5' },
        { id: 't-5', title: 'Build Kanban board component', description: 'Drag and drop task management', priority: 'high', storyPoints: 8, type: 'feature', assignee: 1, sprintId: 'sprint-5' },
      ]
    },
    testing: {
      id: 'testing', title: 'Testing',
      tasks: [
        { id: 't-6', title: 'User profile API endpoints', description: 'CRUD operations for user profiles', priority: 'medium', storyPoints: 3, type: 'feature', assignee: 3, sprintId: 'sprint-5' },
      ]
    },
    done: {
      id: 'done', title: 'Done',
      tasks: [
        { id: 't-7', title: 'Project scaffolding', description: 'Setup Vite, React, Tailwind base', priority: 'high', storyPoints: 2, type: 'chore', assignee: 3, sprintId: 'sprint-5' },
        { id: 't-8', title: 'Database schema design', description: 'ERD and initial migrations', priority: 'high', storyPoints: 3, type: 'chore', assignee: 2, sprintId: 'sprint-5' },
      ]
    },
  }
}

const activityFeed = [
  { id: 1, user: 'Omar Hassan', action: 'completed', target: 'Database schema design', time: '2m ago', type: 'task' },
  { id: 2, user: 'Alex Chen', action: 'moved to In Progress', target: 'Build Kanban board component', time: '15m ago', type: 'task' },
  { id: 3, user: 'Sara Kim', action: 'earned badge', target: 'Bug Hunter', time: '1h ago', type: 'badge' },
  { id: 4, user: 'Lena Müller', action: 'reported bug', target: 'Auth token expiry issue', time: '2h ago', type: 'bug' },
  { id: 5, user: 'James Park', action: 'joined sprint', target: 'Sprint 5', time: '3h ago', type: 'sprint' },
]

const sprintHistory = [
  { sprint: 'Sprint 1', planned: 28, completed: 22, bugs: 4 },
  { sprint: 'Sprint 2', planned: 30, completed: 27, bugs: 2 },
  { sprint: 'Sprint 3', planned: 32, completed: 30, bugs: 3 },
  { sprint: 'Sprint 4', planned: 35, completed: 32, bugs: 5 },
  { sprint: 'Sprint 5', planned: 32, completed: 13, bugs: 1 },
]

export const useStore = create((set, get) => ({
  teamMembers: initialTeamMembers,
  backlog: initialBacklog,
  sprint: initialSprint,
  activityFeed,
  sprintHistory,
  notifications: [
    { id: 1, message: 'Sprint 5 ends in 10 days', type: 'info', read: false },
    { id: 2, message: 'Omar Hassan earned Sprint Hero badge!', type: 'achievement', read: false },
    { id: 3, message: 'Bug reported: Auth token expiry issue', type: 'bug', read: true },
  ],
  currentUser: initialTeamMembers[0],

  moveTask: (taskId, fromColumn, toColumn) => {
    const { sprint } = get()
    const task = sprint.columns[fromColumn].tasks.find(t => t.id === taskId)
    if (!task) return
    set({
      sprint: {
        ...sprint,
        columns: {
          ...sprint.columns,
          [fromColumn]: { ...sprint.columns[fromColumn], tasks: sprint.columns[fromColumn].tasks.filter(t => t.id !== taskId) },
          [toColumn]: { ...sprint.columns[toColumn], tasks: [...sprint.columns[toColumn].tasks, task] },
        }
      }
    })
  },

  reorderTasksInColumn: (columnId, startIndex, endIndex) => {
    const { sprint } = get()
    const tasks = Array.from(sprint.columns[columnId].tasks)
    const [removed] = tasks.splice(startIndex, 1)
    tasks.splice(endIndex, 0, removed)
    set({
      sprint: {
        ...sprint,
        columns: { ...sprint.columns, [columnId]: { ...sprint.columns[columnId], tasks } }
      }
    })
  },

  addTaskToSprint: (taskId) => {
    const { backlog, sprint } = get()
    const task = backlog.find(t => t.id === taskId)
    if (!task) return
    const sprintTask = { ...task, id: `t-${Date.now()}`, sprintId: sprint.id }
    set({
      backlog: backlog.filter(t => t.id !== taskId),
      sprint: {
        ...sprint,
        columns: {
          ...sprint.columns,
          todo: { ...sprint.columns.todo, tasks: [...sprint.columns.todo.tasks, sprintTask] }
        }
      }
    })
  },

  markNotificationRead: (id) => {
    set(state => ({
      notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    }))
  },
}))
