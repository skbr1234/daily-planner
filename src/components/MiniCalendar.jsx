import { useState } from 'react'

const MiniCalendar = ({ currentDate, tasksByDate, onDateSelect }) => {
  const [viewDate, setViewDate] = useState(new Date(currentDate))

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const hasTasksOnDate = (date) => {
    if (!date) return false
    const dateKey = date.toISOString().slice(0, 10)
    return tasksByDate[dateKey] && tasksByDate[dateKey].length > 0
  }

  const isToday = (date) => {
    if (!date) return false
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date) => {
    if (!date) return false
    return date.toDateString() === currentDate.toDateString()
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(viewDate)
    newDate.setMonth(newDate.getMonth() + direction)
    setViewDate(newDate)
  }

  const days = getDaysInMonth(viewDate)
  const monthYear = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-3">
        <button onClick={() => navigateMonth(-1)} className="p-1 hover:bg-gray-100 rounded">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="font-semibold text-sm">{monthYear}</h3>
        <button onClick={() => navigateMonth(1)} className="p-1 hover:bg-gray-100 rounded">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-xs">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
          <div key={day} className="text-center text-gray-500 font-medium p-1">{day}</div>
        ))}
        
        {days.map((date, index) => (
          <button
            key={index}
            onClick={() => date && onDateSelect(date)}
            className={`
              p-1 text-xs rounded relative
              ${!date ? 'invisible' : 'hover:bg-blue-100'}
              ${isSelected(date) ? 'bg-blue-500 text-white' : ''}
              ${isToday(date) && !isSelected(date) ? 'bg-blue-100 text-blue-600' : ''}
            `}
          >
            {date && date.getDate()}
            {hasTasksOnDate(date) && (
              <div className="absolute bottom-0 right-0 w-1 h-1 bg-green-500 rounded-full"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default MiniCalendar