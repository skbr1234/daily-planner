import { useState, useMemo } from 'react'

const OldTasks = ({ tasksByDate, completionStatus, onDateSelect, onToggleTask }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [filter, setFilter] = useState('all') // 'all', 'completed', 'incomplete'
  const [sortBy, setSortBy] = useState('date') // 'date', 'alphabetical'

  const today = new Date().toISOString().slice(0, 10)

  const oldTasks = useMemo(() => {
    const tasks = []
    
    Object.entries(tasksByDate).forEach(([dateKey, dayTasks]) => {
      if (dateKey < today && dayTasks.length > 0) {
        dayTasks.forEach(task => {
          const isCompleted = completionStatus[dateKey]?.[task.id] || false
          tasks.push({
            ...task,
            date: dateKey,
            dateFormatted: new Date(dateKey).toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            }),
            isCompleted
          })
        })
      }
    })

    // Apply filters
    let filteredTasks = tasks
    if (filter === 'completed') {
      filteredTasks = tasks.filter(task => task.isCompleted)
    } else if (filter === 'incomplete') {
      filteredTasks = tasks.filter(task => !task.isCompleted)
    }

    // Apply sorting
    if (sortBy === 'date') {
      filteredTasks.sort((a, b) => new Date(b.date) - new Date(a.date))
    } else if (sortBy === 'alphabetical') {
      filteredTasks.sort((a, b) => a.text.localeCompare(b.text))
    }

    return filteredTasks
  }, [tasksByDate, completionStatus, today, filter, sortBy])

  const totalOldTasks = Object.entries(tasksByDate)
    .filter(([dateKey]) => dateKey < today)
    .reduce((total, [, dayTasks]) => total + dayTasks.length, 0)

  const completedOldTasks = Object.entries(tasksByDate)
    .filter(([dateKey]) => dateKey < today)
    .reduce((total, [dateKey, dayTasks]) => {
      const dayCompleted = dayTasks.filter(task => 
        completionStatus[dateKey]?.[task.id] || false
      ).length
      return total + dayCompleted
    }, 0)

  if (totalOldTasks === 0) return null

  return (
    <section className="mt-8 border-t pt-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-lg font-semibold text-gray-700 hover:text-gray-900 transition-colors"
        >
          <svg 
            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Previous Tasks
        </button>
        <div className="flex gap-2 text-sm">
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
            {totalOldTasks} total
          </span>
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
            {completedOldTasks} done
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
            <div className="flex gap-1">
              <span className="text-sm text-gray-600 mr-2">Filter:</span>
              {['all', 'completed', 'incomplete'].map(filterOption => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    filter === filterOption 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {filterOption === 'all' ? 'All' : 
                   filterOption === 'completed' ? 'Completed' : 'Incomplete'}
                </button>
              ))}
            </div>
            
            <div className="flex gap-1">
              <span className="text-sm text-gray-600 mr-2">Sort:</span>
              {['date', 'alphabetical'].map(sortOption => (
                <button
                  key={sortOption}
                  onClick={() => setSortBy(sortOption)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    sortBy === sortOption 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {sortOption === 'date' ? 'By Date' : 'A-Z'}
                </button>
              ))}
            </div>
          </div>

          {/* Tasks List */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {oldTasks.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No tasks match the current filter</p>
            ) : (
              oldTasks.map(task => (
                <div
                  key={`${task.date}-${task.id}`}
                  onClick={() => onDateSelect(new Date(task.date))}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer hover:shadow-md ${
                    task.isCompleted 
                      ? 'bg-green-50 border-green-200 hover:bg-green-100' 
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div 
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleTask(task.date, task.id, !task.isCompleted)
                    }}
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform ${
                    task.isCompleted 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    {task.isCompleted && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <span className={`block ${task.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {task.text}
                    </span>
                    <span className="text-xs text-gray-500">{task.dateFormatted}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export default OldTasks