const ViewToggle = ({ currentView, onViewChange }) => {
  const views = [
    { id: 'day', label: 'Day', icon: '📅' },
    { id: 'week', label: 'Week', icon: '📊' },
    { id: 'calendar', label: 'Calendar', icon: '🗓️' }
  ]

  return (
    <div className="flex justify-center mb-6">
      <div className="bg-gray-100 p-1 rounded-lg flex">
        {views.map(view => (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id)}
            className={`
              px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2
              ${currentView === view.id 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
              }
            `}
          >
            <span>{view.icon}</span>
            {view.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ViewToggle