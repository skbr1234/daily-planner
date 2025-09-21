import { useState } from 'react'

const EnhancedDateNavigation = ({ 
  currentDate, 
  onPrevDay, 
  onNextDay, 
  onGoToday, 
  onDateSelect,
  taskCount, 
  completedCount 
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false)

  const formatDate = (date) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }
    return date.toLocaleDateString('en-US', options)
  }

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + (direction * 7))
    onDateSelect(newDate)
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + direction)
    onDateSelect(newDate)
  }

  const handleDatePickerChange = (e) => {
    const selectedDate = new Date(e.target.value)
    onDateSelect(selectedDate)
    setShowDatePicker(false)
  }

  const formatDateForInput = (date) => {
    return date.toISOString().slice(0, 10)
  }

  return (
    <nav className="mb-6 px-4" aria-label="Enhanced date navigation">
      {/* Quick Navigation Buttons */}
      <div className="flex justify-center gap-2 mb-4">
        <button 
          onClick={() => navigateMonth(-1)}
          className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          title="Previous Month"
        >
          ← Month
        </button>
        <button 
          onClick={() => navigateWeek(-1)}
          className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          title="Previous Week"
        >
          ← Week
        </button>
        <button 
          onClick={onGoToday}
          className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition-colors font-medium"
        >
          Today
        </button>
        <button 
          onClick={() => navigateWeek(1)}
          className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          title="Next Week"
        >
          Week →
        </button>
        <button 
          onClick={() => navigateMonth(1)}
          className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          title="Next Month"
        >
          Month →
        </button>
      </div>

      {/* Main Date Navigation */}
      <div className="flex justify-between items-center mb-3">
        <button 
          onClick={onPrevDay}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors" 
          aria-label="Previous day"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="text-center">
          <h2 
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="text-2xl font-bold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors" 
            title="Click to pick date"
          >
            {formatDate(currentDate)}
          </h2>
          
          {showDatePicker && (
            <div className="absolute z-10 mt-2 bg-white border rounded-lg shadow-lg p-2">
              <input
                type="date"
                value={formatDateForInput(currentDate)}
                onChange={handleDatePickerChange}
                className="border rounded px-2 py-1 text-sm"
                autoFocus
              />
            </div>
          )}
        </div>
        
        <button 
          onClick={onNextDay}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors" 
          aria-label="Next day"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* Task Statistics */}
      <div className="flex justify-center gap-2 text-sm">
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">{taskCount} tasks</span>
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">{completedCount} completed</span>
      </div>
    </nav>
  )
}

export default EnhancedDateNavigation