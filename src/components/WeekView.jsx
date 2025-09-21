const WeekView = ({ currentDate, tasksByDate, completionStatus, onDateSelect }) => {
  const getWeekDates = (date) => {
    const week = []
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    startOfWeek.setDate(startOfWeek.getDate() - day)
    
    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startOfWeek)
      weekDate.setDate(startOfWeek.getDate() + i)
      week.push(weekDate)
    }
    return week
  }

  const getTasksForDate = (date) => {
    const dateKey = date.toISOString().slice(0, 10)
    return tasksByDate[dateKey] || []
  }

  const getCompletedCount = (date) => {
    const dateKey = date.toISOString().slice(0, 10)
    const dayStatus = completionStatus[dateKey] || {}
    return Object.values(dayStatus).filter(Boolean).length
  }

  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date) => {
    return date.toDateString() === currentDate.toDateString()
  }

  const weekDates = getWeekDates(currentDate)

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h3 className="font-semibold text-lg mb-4 text-center">Week View</h3>
      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((date, index) => {
          const tasks = getTasksForDate(date)
          const completedTasks = getCompletedCount(date)
          
          return (
            <button
              key={index}
              onClick={() => onDateSelect(date)}
              className={`
                p-3 rounded-lg border-2 transition-colors text-left
                ${isSelected(date) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
                ${isToday(date) ? 'bg-yellow-50' : ''}
              `}
            >
              <div className="text-xs text-gray-500 mb-1">
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className={`font-semibold ${isToday(date) ? 'text-yellow-600' : ''}`}>
                {date.getDate()}
              </div>
              {tasks.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="text-xs text-gray-600">
                    {tasks.length} task{tasks.length !== 1 ? 's' : ''}
                  </div>
                  {completedTasks > 0 && (
                    <div className="text-xs text-green-600">
                      {completedTasks} done
                    </div>
                  )}
                  <div className="flex space-x-1">
                    {tasks.slice(0, 3).map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-blue-300 rounded-full"></div>
                    ))}
                    {tasks.length > 3 && (
                      <div className="text-xs text-gray-400">+{tasks.length - 3}</div>
                    )}
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default WeekView