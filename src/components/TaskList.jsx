import { useState } from 'react'
import EnhancedTaskItem from './EnhancedTaskItem'

const TaskList = ({ tasks, completionStatus, onToggleTask, onUpdateTask, onDeleteTask, onReorderTasks }) => {
  const [draggedItem, setDraggedItem] = useState(null)

  const handleDragStart = (e, taskId) => {
    setDraggedItem(taskId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, targetTaskId) => {
    e.preventDefault()
    if (draggedItem && draggedItem !== targetTaskId) {
      const draggedIndex = tasks.findIndex(task => task.id === draggedItem)
      const targetIndex = tasks.findIndex(task => task.id === targetTaskId)
      
      const newTasks = [...tasks]
      const [removed] = newTasks.splice(draggedIndex, 1)
      newTasks.splice(targetIndex, 0, removed)
      
      onReorderTasks(newTasks)
    }
  }

  return (
    <section aria-label="Task list">
      <ul className="list-none p-0 w-full" role="list">
        {tasks
          .sort((a, b) => {
            // Sort by priority (high -> medium -> low), then by time
            const priorityOrder = { high: 3, medium: 2, low: 1 }
            const aPriority = priorityOrder[a.priority] || 2
            const bPriority = priorityOrder[b.priority] || 2
            
            if (aPriority !== bPriority) return bPriority - aPriority
            if (a.time && b.time) return a.time.localeCompare(b.time)
            if (a.time) return -1
            if (b.time) return 1
            return 0
          })
          .map((task) => (
            <EnhancedTaskItem
              key={task.id}
              task={task}
              isCompleted={completionStatus[task.id] || false}
              onToggle={(completed) => onToggleTask(task.id, completed)}
              onUpdate={(newText) => onUpdateTask(task.id, newText)}
              onDelete={() => onDeleteTask(task.id)}
            />
          ))}
      </ul>
    </section>
  )
}

export default TaskList