import { useState, useEffect } from 'react'

const EnhancedTaskInput = ({ onAddTask, tasksByDate }) => {
  const [taskText, setTaskText] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [taskTime, setTaskTime] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState('medium')
  const [recurring, setRecurring] = useState('none')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const getAllPreviousTasks = () => {
    const allTasks = []
    Object.values(tasksByDate || {}).forEach(tasks => {
      tasks.forEach(task => {
        if (!allTasks.find(t => t.text === task.text)) {
          allTasks.push(task)
        }
      })
    })
    return allTasks
  }

  const getTaskSuggestions = (input) => {
    if (input.length < 2) return []
    const history = getAllPreviousTasks()
    return history
      .filter(task => task.text.toLowerCase().includes(input.toLowerCase()))
      .slice(0, 5)
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setTaskText(value)
    
    if (value.length >= 2) {
      const taskSuggestions = getTaskSuggestions(value)
      setSuggestions(taskSuggestions)
      setShowSuggestions(taskSuggestions.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }

  const selectSuggestion = (suggestion) => {
    setTaskText(suggestion.text)
    if (suggestion.priority) setPriority(suggestion.priority)
    if (suggestion.time) setTaskTime(suggestion.time)
    if (suggestion.recurring) setRecurring(suggestion.recurring)
    setShowSuggestions(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (taskText.trim()) {
      const taskData = {
        text: taskText.trim(),
        time: taskTime || null,
        dueDate: dueDate || null,
        priority,
        recurring: recurring !== 'none' ? recurring : null,
        createdAt: new Date().toISOString()
      }
      onAddTask(taskData)
      
      // Reset form
      setTaskText('')
      setTaskTime('')
      setDueDate('')
      setPriority('medium')
      setRecurring('none')
      setShowAdvanced(false)
      setShowSuggestions(false)
    }
  }

  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800', 
    low: 'bg-green-100 text-green-800'
  }

  return (
    <section className="mb-6 px-4" aria-label="Add new task">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2 relative">
          <div className="flex-grow relative">
            <input 
              type="text" 
              placeholder="Add a new task..." 
              value={taskText}
              onChange={handleInputChange}
              onFocus={() => taskText.length >= 2 && setShowSuggestions(suggestions.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
            />
            
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 mt-1">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault()
                      selectSuggestion(suggestion)
                    }}
                    className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 first:rounded-t-lg last:rounded-b-lg"
                  >
                    <div className="font-medium">{suggestion.text}</div>
                    {(suggestion.priority || suggestion.time) && (
                      <div className="text-xs text-gray-500 mt-1">
                        {suggestion.priority && (
                          <span className={`px-2 py-1 rounded-full text-xs mr-2 ${
                            suggestion.priority === 'high' ? 'bg-red-100 text-red-800' :
                            suggestion.priority === 'low' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {suggestion.priority}
                          </span>
                        )}
                        {suggestion.time && <span>🕒 {suggestion.time}</span>}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2 sm:flex-shrink-0">
            <button 
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              title="Advanced options"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </button>
            <button 
              type="submit"
              className="p-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {showAdvanced && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  value={taskTime}
                  onChange={(e) => setTaskTime(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recurring</label>
                <select
                  value={recurring}
                  onChange={(e) => setRecurring(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="none">None</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            {(priority !== 'medium' || recurring !== 'none' || taskTime || dueDate) && (
              <div className="flex flex-wrap gap-2 pt-2">
                {priority !== 'medium' && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[priority]}`}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                  </span>
                )}
                {taskTime && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    🕒 {taskTime}
                  </span>
                )}
                {dueDate && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                    📅 Due: {new Date(dueDate).toLocaleDateString()}
                  </span>
                )}
                {recurring !== 'none' && (
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                    🔄 {recurring.charAt(0).toUpperCase() + recurring.slice(1)}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </form>
    </section>
  )
}

export default EnhancedTaskInput