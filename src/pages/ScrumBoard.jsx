import { useState, useRef, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { useStore } from '../store/useStore'
import Header from '../components/layout/Header'
import { Plus, MoreHorizontal, User, Flag, ChevronRight, Package, RotateCcw, X } from 'lucide-react'

const PRIORITY_CONFIG = {
  high:   { label: 'High',   color: 'text-red-400 bg-red-900/30 border-red-800/50'       },
  medium: { label: 'Medium', color: 'text-yellow-400 bg-yellow-900/30 border-yellow-800/50' },
  low:    { label: 'Low',    color: 'text-green-400 bg-green-900/30 border-green-800/50'  },
}

const TYPE_COLORS = {
  feature:     'bg-blue-500/20 text-blue-300',
  bug:         'bg-red-500/20 text-red-300',
  chore:       'bg-slate-500/20 text-slate-300',
  design:      'bg-pink-500/20 text-pink-300',
  test:        'bg-yellow-500/20 text-yellow-300',
  improvement: 'bg-cyan-500/20 text-cyan-300',
}

const COLUMN_COLORS = {
  todo:       'border-t-slate-500',
  inprogress: 'border-t-blue-500',
  testing:    'border-t-yellow-500',
  done:       'border-t-green-500',
}

// Which column's tasks are eligible to be added into each column
const ELIGIBLE_SOURCE = {
  todo:       'backlog',
  inprogress: 'todo',
  testing:    'inprogress',
  done:       'testing',
}

function TaskCard({ task, index, teamMembers, columnId, onMoveToBacklog }) {
  const assignee = teamMembers.find(m => m.id === task.assignee)
  const priority = PRIORITY_CONFIG[task.priority]

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`group bg-slate-800 border rounded-xl p-4 cursor-grab active:cursor-grabbing transition-all select-none ${
            snapshot.isDragging
              ? 'border-violet-500/60 shadow-xl shadow-violet-900/30 rotate-1 scale-105'
              : 'border-slate-700/50 hover:border-slate-600/60 hover:shadow-lg hover:shadow-black/20'
          }`}
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${TYPE_COLORS[task.type] || TYPE_COLORS.feature}`}>
              {task.type}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-mono">{task.storyPoints} SP</span>
              <button
                onClick={e => { e.stopPropagation(); onMoveToBacklog(task.id, columnId) }}
                title="Move to Backlog"
                className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-500 hover:text-orange-400 transition-all rounded"
              >
                <RotateCcw size={11} />
              </button>
            </div>
          </div>

          <p className="text-sm font-medium text-white leading-snug mb-1.5">{task.title}</p>
          <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">{task.description}</p>

          <div className="flex items-center justify-between">
            <span className={`text-xs px-2 py-0.5 rounded-md border font-medium ${priority.color}`}>
              <Flag size={10} className="inline mr-1" />{priority.label}
            </span>
            {assignee ? (
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-violet-600/40 flex items-center justify-center text-xs font-bold text-violet-300">
                  {assignee.avatar}
                </div>
                <span className="text-xs text-slate-400">{assignee.name.split(' ')[0]}</span>
              </div>
            ) : (
              <span className="text-xs text-slate-600 flex items-center gap-1">
                <User size={11} />Unassigned
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  )
}

function AddTaskDropdown({ columnId, eligibleTasks, onAdd, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    const handler = e => {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  return (
    <div
      ref={ref}
      className="absolute bottom-full left-0 right-0 mb-1 bg-slate-800 border border-slate-600/80 rounded-xl shadow-2xl z-30 overflow-hidden"
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700">
        <span className="text-xs font-semibold text-slate-300">
          {columnId === 'todo' ? 'Add from Backlog' : `Move from ${ELIGIBLE_SOURCE[columnId]}`}
        </span>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
          <X size={12} />
        </button>
      </div>
      {eligibleTasks.length === 0 ? (
        <p className="text-xs text-slate-500 px-3 py-3 text-center">No eligible tasks</p>
      ) : (
        <div className="max-h-52 overflow-y-auto">
          {eligibleTasks.map(task => (
            <button
              key={task.id}
              onClick={() => { onAdd(task.id); onClose() }}
              className="w-full text-left px-3 py-2.5 hover:bg-slate-700/60 transition-colors border-b border-slate-700/30 last:border-0"
            >
              <p className="text-xs font-medium text-white truncate">{task.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{task.storyPoints} SP · {task.type}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function Column({ column, teamMembers, onMoveToBacklog, eligibleTasks, onAddTask }) {
  const [showAddDropdown, setShowAddDropdown] = useState(false)

  return (
    <div
      className={`flex flex-col bg-slate-900/50 rounded-2xl border border-slate-700/40 border-t-2 ${COLUMN_COLORS[column.id]} w-72 flex-shrink-0`}
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h3 className="text-sm font-semibold text-white">{column.title}</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-mono">
            {column.tasks.length}
          </span>
        </div>
        <button className="text-slate-500 hover:text-slate-300 transition-colors">
          <MoreHorizontal size={16} />
        </button>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 px-3 pb-3 space-y-2.5 min-h-24 transition-colors rounded-b-xl ${
              snapshot.isDraggingOver ? 'bg-violet-950/20' : ''
            }`}
          >
            {column.tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                teamMembers={teamMembers}
                columnId={column.id}
                onMoveToBacklog={onMoveToBacklog}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="mx-3 mb-3 relative">
        <button
          onClick={() => setShowAddDropdown(prev => !prev)}
          className="w-full p-2.5 rounded-xl border border-dashed border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-500 transition-colors text-xs flex items-center justify-center gap-2"
        >
          <Plus size={14} />
          Add task
        </button>
        {showAddDropdown && (
          <AddTaskDropdown
            columnId={column.id}
            eligibleTasks={eligibleTasks}
            onAdd={onAddTask}
            onClose={() => setShowAddDropdown(false)}
          />
        )}
      </div>
    </div>
  )
}

function BacklogItem({ item, onAddToSprint }) {
  const priority = PRIORITY_CONFIG[item.priority]
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/30 hover:border-slate-600/50 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-medium text-white truncate">{item.title}</p>
          <span className={`text-xs px-1.5 py-0.5 rounded border ${priority.color} flex-shrink-0`}>
            {priority.label}
          </span>
        </div>
        <p className="text-xs text-slate-500 truncate">{item.description}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-xs text-slate-400 font-mono">{item.storyPoints} SP</span>
        <button
          onClick={() => onAddToSprint(item.id)}
          className="text-xs px-2.5 py-1 rounded-lg bg-violet-600/20 text-violet-400 border border-violet-700/40 hover:bg-violet-600/30 transition-colors flex items-center gap-1"
        >
          <ChevronRight size={12} />
          Sprint
        </button>
      </div>
    </div>
  )
}

export default function ScrumBoard() {
  const {
    sprint,
    teamMembers,
    backlog,
    moveTask,
    reorderTasksInColumn,
    addTaskToSprint,
    removeTaskFromSprint,
  } = useStore()
  const [showBacklog, setShowBacklog] = useState(true)
  const columnOrder = ['todo', 'inprogress', 'testing', 'done']

  const onDragEnd = ({ source, destination, draggableId }) => {
    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    if (source.droppableId === destination.droppableId) {
      reorderTasksInColumn(source.droppableId, source.index, destination.index)
    } else {
      moveTask(draggableId, source.droppableId, destination.droppableId)
    }
  }

  const getEligibleTasks = columnId => {
    switch (columnId) {
      case 'todo':       return backlog
      case 'inprogress': return sprint.columns.todo.tasks
      case 'testing':    return sprint.columns.inprogress.tasks
      case 'done':       return sprint.columns.testing.tasks
      default:           return []
    }
  }

  const handleAddTask = (columnId, taskId) => {
    if (columnId === 'todo') {
      addTaskToSprint(taskId)
    } else {
      const sourceMap = { inprogress: 'todo', testing: 'inprogress', done: 'testing' }
      moveTask(taskId, sourceMap[columnId], columnId)
    }
  }

  const totalSP = Object.values(sprint.columns).flatMap(c => c.tasks).reduce((s, t) => s + t.storyPoints, 0)
  const doneSP  = sprint.columns.done.tasks.reduce((s, t) => s + t.storyPoints, 0)

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="Scrum Board"
        subtitle={`${sprint.name} · ${totalSP} story points · ${doneSP} completed`}
      />

      <main className="flex-1 p-4 lg:p-6 flex flex-col gap-4 overflow-hidden">
        {/* Kanban columns — horizontal scroll on small screens */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-2 flex-1 min-h-0">
            {columnOrder.map(colId => (
              <Column
                key={colId}
                column={sprint.columns[colId]}
                teamMembers={teamMembers}
                onMoveToBacklog={removeTaskFromSprint}
                eligibleTasks={getEligibleTasks(colId)}
                onAddTask={taskId => handleAddTask(colId, taskId)}
              />
            ))}
          </div>
        </DragDropContext>

        {/* Product Backlog */}
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl overflow-hidden flex-shrink-0">
          <button
            onClick={() => setShowBacklog(!showBacklog)}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-700/20 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Package size={16} className="text-violet-400" />
              <span className="text-sm font-semibold text-white">Product Backlog</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                {backlog.length} items
              </span>
            </div>
            <ChevronRight
              size={16}
              className={`text-slate-400 transition-transform ${showBacklog ? 'rotate-90' : ''}`}
            />
          </button>
          {showBacklog && (
            <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-2 max-h-56 overflow-y-auto">
              {backlog.length === 0 ? (
                <p className="text-xs text-slate-500 py-2 col-span-2 text-center">
                  All backlog items are in the sprint
                </p>
              ) : (
                backlog.map(item => (
                  <BacklogItem key={item.id} item={item} onAddToSprint={addTaskToSprint} />
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
