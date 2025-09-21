import { useState } from 'react'

const TaskItem = ({ task, isCompleted, onToggle, onUpdate, onDelete, onDragStart, onDragEnd, onDragOver, onDrop, isDragging }) => {
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

  return (
    <li 
      className={`flex items-center justify-start p-5 mb-3 bg-white rounded-2xl shadow-md transition-all duration-300 planner-item ${isCompleted ? 'bg-green-50 text-green-600' : ''} ${isDragging ? 'opacity-50 rotate-1' : ''}`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="cursor-grab p-2 mr-2 text-gray-400 hover:text-gray-600" title="Drag to reorder">⋮⋮</div>
      
      <input
        type="checkbox"
        checked={isCompleted}
        onChange={(e) => onToggle(e.target.checked)}
        className="w-7 h-7 rounded-lg border-2 border-gray-400 accent-blue-600 cursor-pointer"
      />

      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="flex-grow p-2 ml-5 rounded-lg border-2 border-blue-500 focus:outline-none"
          autoFocus
        />
      ) : (
        <span className={`flex-grow text-xl font-semibold ml-5 text-gray-800 ${isCompleted ? 'line-through italic' : ''}`}>
          {task.text}
        </span>
      )}

      <button
        onClick={handleEdit}
        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Edit task"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232L18.766 8.766M16.924 3.076a2.5 2.5 0 113.536 3.536L14.732 18.732H11.2V15.207l9.17-9.17z"/>
        </svg>
      </button>

      <button
        onClick={onDelete}
        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Delete task"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1H9a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
      </button>
    </li>
  )
}

export default TaskItem