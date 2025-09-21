import { useState } from 'react'
import ViewToggle from './ViewToggle'
import EnhancedDateNavigation from './EnhancedDateNavigation'

const CollapsibleNavigation = ({ 
  currentView, 
  onViewChange, 
  currentDate, 
  onPrevDay, 
  onNextDay, 
  onGoToday, 
  onDateSelect,
  taskCount, 
  completedCount 
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="mb-6">
      {/* Compact Header */}
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={onPrevDay}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors" 
          aria-label="Previous day"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="text-center flex-1">
          <h2 className="text-xl font-bold text-gray-800">
            {currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </h2>
          {/* <div className="flex justify-center gap-2 text-xs mt-1">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{taskCount}</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">{completedCount}</span>
          </div> */}
        </div>

        <div className="flex gap-2">
          <button 
            onClick={onNextDay}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors" 
            aria-label="Next day"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors" 
            aria-label="Toggle calendar options"
            title="Calendar options"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Expandable Section */}
      {isExpanded && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4 border">
          <ViewToggle 
            currentView={currentView}
            onViewChange={onViewChange}
          />
          
          <EnhancedDateNavigation 
            currentDate={currentDate}
            onPrevDay={onPrevDay}
            onNextDay={onNextDay}
            onGoToday={onGoToday}
            onDateSelect={onDateSelect}
            taskCount={taskCount}
            completedCount={completedCount}
          />
        </div>
      )}
    </div>
  )
}

export default CollapsibleNavigation