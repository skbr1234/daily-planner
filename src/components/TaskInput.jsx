import { useState } from 'react'

const TaskInput = ({ onAddTask }) => {
  const [taskText, setTaskText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (taskText.trim()) {
      onAddTask(taskText.trim())
      setTaskText('')
    }
  }

  return (
    <section className="flex flex-col sm:flex-row mb-6 px-4 gap-2" aria-label="Add new task">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full">
        <label htmlFor="new-task-input" className="sr-only">New task description</label>
        <input 
          id="new-task-input"
          type="text" 
          placeholder="Add a new task..." 
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          className="flex-grow p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
        />
        <button 
          type="submit"
          aria-label="Add new task"
          className="p-3 bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 text-white font-bold rounded-lg transition-colors w-full sm:w-auto"
        >
          Add new task
        </button>
      </form>
    </section>
  )
}

export default TaskInput