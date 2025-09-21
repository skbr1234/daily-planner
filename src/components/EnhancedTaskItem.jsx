import { useState } from 'react'

const EnhancedTaskItem = ({ task, isCompleted, onToggle, onUpdate, onDelete, onDragStart, onDragEnd, onDragOver, onDrop, isDragging }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(task.text)

  const handleEdit = () => {
    setIsEditing(true)
    setEditText(task.text)
  }

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(editText.trim())
    } else {
      onDelete()
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') {
      setIsEditing(false)
      setEditText(task.text)
    }
  }

  const priorityColors = {
    high: 'border-l-red-500 bg-red-50',
    medium: 'border-l-yellow-500 bg-yellow-50', 
    low: 'border-l-green-500 bg-green-50'
  }

  const priorityIcons = {
    high: '🔴',
    medium: '🟡',
    low: '🟢'
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !isCompleted
  const isDueToday = task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString()
  const isMultiDay = task.originalDate && task.dueDate
  const isOriginalDate = !task.originalDate

  const handleDragStart = (e) => {
    onDragStart(e, task)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    onDragOver(e)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    onDrop(e, task)
  }

  return (
    <li 
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`
        flex items-center justify-start p-4 mb-3 bg-white rounded-xl shadow-sm transition-all duration-300 border-l-4
        ${task.priority ? priorityColors[task.priority] : 'border-l-gray-300'}
        ${isCompleted ? 'opacity-75' : ''}
        ${isOverdue ? 'border-l-red-600 bg-red-50' : ''}
        ${isDragging ? 'opacity-50 transform rotate-1' : ''}
      `
    }>
      <div className="cursor-grab p-1 mr-2 text-gray-400 text-sm">⋮⋮</div>
      
      <input
        type="checkbox"
        checked={isCompleted}
        onChange={(e) => onToggle(e.target.checked)}
        className="w-5 h-5 rounded border-2 border-gray-400 accent-blue-600 cursor-pointer mr-3"
      />

      <div className="flex-grow">
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="w-full p-2 rounded border-2 border-blue-500 focus:outline-none"
            autoFocus
          />
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-1">
              {task.priority && task.priority !== 'medium' && (
                <span className="text-sm" title={`${task.priority} priority`}>
                  {priorityIcons[task.priority]}
                </span>
              )}
              <span className={`text-base font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                {task.text}
              </span>
              {task.recurring && (
                <span className="text-xs text-indigo-600" title="Recurring task">🔄</span>
              )}
              {isMultiDay && (
                <span className="text-xs text-blue-600" title="Multi-day task">📅</span>
              )}
              {!isOriginalDate && (
                <span className="text-xs text-gray-500" title="Task from another date">↗️</span>
              )}
            </div>
            
            {(task.time || task.dueDate) && (
              <div className="flex gap-2 text-xs text-gray-600">
                {task.time && (
                  <span className="flex items-center gap-1">
                    🕒 {task.time}
                  </span>
                )}
                {task.dueDate && (
                  <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-medium' : isDueToday ? 'text-orange-600 font-medium' : ''}`}>
                    📅 {isOverdue ? 'Overdue' : isDueToday ? 'Due today' : `Due ${new Date(task.dueDate).toLocaleDateString()}`}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-1 ml-2">
        <button
          onClick={handleEdit}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Edit task"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232L18.766 8.766M16.924 3.076a2.5 2.5 0 113.536 3.536L14.732 18.732H11.2V15.207l9.17-9.17z"/>
          </svg>
        </button>

        <button
          onClick={onDelete}
          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
          aria-label="Delete task"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1H9a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </button>
      </div>
    </li>
  )
}

export default EnhancedTaskItem