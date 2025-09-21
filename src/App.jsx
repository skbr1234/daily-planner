import { useState, useEffect } from 'react'
import QuoteMarquee from './components/QuoteMarquee'
import DateNavigation from './components/DateNavigation'
import EnhancedDateNavigation from './components/EnhancedDateNavigation'
import TaskInput from './components/TaskInput'
import TaskList from './components/TaskList'
import Modal from './components/Modal'
import InfoButton from './components/InfoButton'
import MiniCalendar from './components/MiniCalendar'
import WeekView from './components/WeekView'
import ViewToggle from './components/ViewToggle'
import { useLocalStorage } from './hooks/useLocalStorage'

function App() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [tasksByDate, setTasksByDate] = useLocalStorage('daily-planner-tasks-by-date', {})
  const [completionStatus, setCompletionStatus] = useLocalStorage('daily-planner-completion', {})
  const [modal, setModal] = useState({ show: false, message: '' })
  const [currentView, setCurrentView] = useState('day')

  const dateKey = currentDate.toISOString().slice(0, 10)
  const todaysTasks = tasksByDate[dateKey] || []
  const currentState = completionStatus[dateKey] || {}

  const showMessage = (message) => setModal({ show: true, message })
  const closeModal = () => setModal({ show: false, message: '' })

  const addTask = (taskText) => {
    const newTaskId = `task_${Date.now()}`
    const newTasks = [...todaysTasks, { id: newTaskId, text: taskText }]
    setTasksByDate(prev => {
      const updated = { ...prev, [dateKey]: newTasks }
      console.log('Adding task, updated data:', updated)
      return updated
    })
  }

  const updateTask = (taskId, newText) => {
    const updatedTasks = todaysTasks.map(task => 
      task.id === taskId ? { ...task, text: newText } : task
    )
    setTasksByDate(prev => ({ ...prev, [dateKey]: updatedTasks }))
  }

  const deleteTask = (taskId) => {
    const filteredTasks = todaysTasks.filter(task => task.id !== taskId)
    setTasksByDate(prev => ({ ...prev, [dateKey]: filteredTasks }))
  }

  const toggleTask = (taskId, completed) => {
    setCompletionStatus(prev => ({
      ...prev,
      [dateKey]: { ...prev[dateKey], [taskId]: completed }
    }))
  }

  const reorderTasks = (newOrder) => {
    setTasksByDate(prev => ({ ...prev, [dateKey]: newOrder }))
  }

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + direction)
    setCurrentDate(newDate)
  }

  const goToToday = () => setCurrentDate(new Date())
  
  const handleDateSelect = (date) => {
    setCurrentDate(date)
    if (currentView !== 'day') setCurrentView('day')
  }

  const completedCount = Object.values(currentState).filter(Boolean).length

  useEffect(() => {
    // Health check API call
    fetch('https://user-authentication-service-idnv.onrender.com/health')
      .catch(error => console.log('Health check failed:', error))
  }, [])

  // Debug: Log data on load
  useEffect(() => {
    console.log('Tasks by date:', tasksByDate)
    console.log('Completion status:', completionStatus)
  }, [tasksByDate, completionStatus])

  return (
    <div className="bg-gray-100 min-h-screen">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      
      <QuoteMarquee />
      
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <main id="main-content" className="w-full max-w-xl bg-white p-8 rounded-3xl shadow-xl">
          <header className="flex items-center justify-center mb-6">
            <span className="text-5xl mr-3" role="img" aria-label="Calendar">📅</span>
            <h1 className="text-4xl font-extrabold text-center text-gray-800">Daily Planner</h1>
          </header>

          <ViewToggle 
            currentView={currentView}
            onViewChange={setCurrentView}
          />

          {currentView === 'day' && (
            <EnhancedDateNavigation 
              currentDate={currentDate}
              onPrevDay={() => navigateDate(-1)}
              onNextDay={() => navigateDate(1)}
              onGoToday={goToToday}
              onDateSelect={handleDateSelect}
              taskCount={todaysTasks.length}
              completedCount={completedCount}
            />
          )}

          {currentView === 'day' && (
            <>
              <TaskInput onAddTask={addTask} />
              <TaskList 
                tasks={todaysTasks}
                completionStatus={currentState}
                onToggleTask={toggleTask}
                onUpdateTask={updateTask}
                onDeleteTask={deleteTask}
                onReorderTasks={reorderTasks}
              />
            </>
          )}

          {currentView === 'week' && (
            <WeekView 
              currentDate={currentDate}
              tasksByDate={tasksByDate}
              completionStatus={completionStatus}
              onDateSelect={handleDateSelect}
            />
          )}

          {currentView === 'calendar' && (
            <MiniCalendar 
              currentDate={currentDate}
              tasksByDate={tasksByDate}
              onDateSelect={handleDateSelect}
            />
          )}
        </main>
      </div>

      <InfoButton />
      
      <Modal 
        show={modal.show}
        message={modal.message}
        onClose={closeModal}
      />
    </div>
  )
}

export default App