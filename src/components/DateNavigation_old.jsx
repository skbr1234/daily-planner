const DateNavigation = ({ currentDate, onPrevDay, onNextDay, onGoToday, taskCount, completedCount }) => {
  const formatDate = (date) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }
    return date.toLocaleDateString('en-US', options)
  }

  return (
    <nav className="mb-6 px-4" aria-label="Date navigation">
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
        
        <h2 
          onClick={onGoToday}
          className="text-2xl font-bold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors" 
          title="Click to go to today"
        >
          {formatDate(currentDate)}
        </h2>
        
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
      
      <div className="flex justify-center gap-2 text-sm">
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">{taskCount} tasks</span>
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">{completedCount} completed</span>
      </div>
    </nav>
  )
}

export default DateNavigation