import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { useStore } from '../store/useStore'
import Header from '../components/layout/Header'
import { Plus, MoreHorizontal, Clock, User, Flag, ChevronRight, Package } from 'lucide-react'

const PRIORITY_CONFIG = {
  high: { label: 'High', color: 'text-red-400 bg-red-900/30 border-red-800/50' },
  medium: { label: 'Medium', color: 'text-yellow-400 bg-yellow-900/30 border-yellow-800/50' },
  low: { label: 'Low', color: 'text-green-400 bg-green-900/30 border-green-800/50' },
}

const TYPE_COLORS = {
  feature: 'bg-blue-500/20 text-blue-300',
  bug: 'bg-red-500/20 text-red-300',
  chore: 'bg-slate-500/20 text-slate-300',
  design: 'bg-pink-500/20 text-pink-300',
  test: 'bg-yellow-500/20 text-yellow-300',
  improvement: 'bg-cyan-500/20 text-cyan-300',
}

const COLUMN_COLORS = {
  todo: 'border-t-slate-500',
  inprogress: 'border-t-blue-500',
  testing: 'border-t-yellow-500',
  done: 'border-t-green-500',
}

function TaskCard({ task, index, teamMembers }) {
  const assignee = teamMembers.find(m => m.id === task.assignee)
  const priority = PRIORITY_CONFIG[task.priority]

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-slate-800 border rounded-xl p-4 cursor-grab active:cursor-grabbing transition-all select-none ${
            snapshot.isDragging
              ? 'border-violet-500/60 shadow-xl shadow-violet-900/30 rotate-1 scale-105'
              : 'border-slate-700/50 hover:border-slate-600/60 hover:shadow-lg hover:shadow-black/20'
          }`}
        >
          {/* Type & Story Points */}
          <div className="flex items-center justify-between mb-2.5">
            <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${TYPE_COLORS[task.type] || TYPE_COLORS.feature}`}>
              {task.type}
            </span>
            <span className="text-xs text-slate-500 font-mono">{task.storyPoints} SP</span>
          </div>

          <p className="text-sm font-medium text-white leading-snug mb-1.5">{task.title}</p>
          <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">{task.description}</p>

          {/* Footer */}
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
              <span className="text-xs text-slate-600 flex items-center gap-1"><User size={11} />Unassigned</span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  )
}

function Column({ column, teamMembers }) {
  return (
    <div className={`flex flex-col bg-slate-900/50 rounded-2xl border border-slate-700/40 border-t-2 ${COLUMN_COLORS[column.id]} min-w-0`}>
      {/* Column Header */}
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

      {/* Tasks */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 px-3 pb-3 space-y-2.5 min-h-24 rounded-b-2xl transition-colors ${
              snapshot.isDraggingOver ? 'bg-violet-950/20' : ''
            }`}
          >
            {column.tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} teamMembers={teamMembers} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Add Task */}
      <button className="mx-3 mb-3 p-2.5 rounded-xl border border-dashed border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-500 transition-colors text-xs flex items-center justify-center gap-2">
        <Plus size={14} />
        Add task
      </button>
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
          <span className={`text-xs px-1.5 py-0.5 rounded border ${priority.color} flex-shrink-0`}>{priority.label}</span>
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
  const { sprint, teamMembers, backlog, moveTask, reorderTasksInColumn, addTaskToSprint } = useStore()
  const [showBacklog, setShowBacklog] = useState(true)
  const columnOrder = ['todo', 'inprogress', 'testing', 'done']

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result
    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    if (source.droppableId === destination.droppableId) {
      reorderTasksInColumn(source.droppableId, source.index, destination.index)
    } else {
      moveTask(draggableId, source.droppableId, destination.droppableId)
    }
  }

  const totalSP = Object.values(sprint.columns).flatMap(c => c.tasks).reduce((s, t) => s + t.storyPoints, 0)
  const doneSP = sprint.columns.done.tasks.reduce((s, t) => s + t.storyPoints, 0)

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Scrum Board" subtitle={`${sprint.name} · ${totalSP} story points · ${doneSP} completed`} />

      <main className="flex-1 p-6 flex flex-col gap-4 overflow-hidden">
        {/* Kanban Board */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-4 gap-4 flex-1 min-h-0">
            {columnOrder.map(colId => (
              <Column key={colId} column={sprint.columns[colId]} teamMembers={teamMembers} />
            ))}
          </div>
        </DragDropContext>

        {/* Product Backlog */}
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowBacklog(!showBacklog)}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-700/20 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Package size={16} className="text-violet-400" />
              <span className="text-sm font-semibold text-white">Product Backlog</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">{backlog.length} items</span>
            </div>
            <ChevronRight size={16} className={`text-slate-400 transition-transform ${showBacklog ? 'rotate-90' : ''}`} />
          </button>
          {showBacklog && (
            <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-2 max-h-56 overflow-y-auto">
              {backlog.map(item => (
                <BacklogItem key={item.id} item={item} onAddToSprint={addTaskToSprint} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
