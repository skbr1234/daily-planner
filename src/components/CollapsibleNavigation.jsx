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
  completedCount,
  showOptions,
  onToggleOptions
}) => {

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
            onClick={() => onToggleOptions(!showOptions)}
            className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors" 
            aria-label="Toggle more options"
            title="More options"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Expandable Section */}
      {showOptions && (
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