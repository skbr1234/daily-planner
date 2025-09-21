import { useState } from 'react'
import TaskItem from './TaskItem'

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
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            isCompleted={completionStatus[task.id] || false}
            onToggle={(completed) => onToggleTask(task.id, completed)}
            onUpdate={(newText) => onUpdateTask(task.id, newText)}
            onDelete={() => onDeleteTask(task.id)}
            onDragStart={(e) => handleDragStart(e, task.id)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, task.id)}
            isDragging={draggedItem === task.id}
          />
        ))}
      </ul>
    </section>
  )
}

export default TaskList