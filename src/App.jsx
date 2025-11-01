import { useState, useEffect } from 'react'
import QuoteMarquee from './components/QuoteMarquee'
import EnhancedTaskInput from './components/EnhancedTaskInput'
import TaskList from './components/TaskList'
import TaskFilter from './components/TaskFilter'
import OldTasks from './components/OldTasks'
import Modal from './components/Modal'
import InfoButton from './components/InfoButton'
import MiniCalendar from './components/MiniCalendar'
import WeekView from './components/WeekView'
import CollapsibleNavigation from './components/CollapsibleNavigation'
import { useLocalStorage } from './hooks/useLocalStorage'

function App() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [tasksByDate, setTasksByDate] = useLocalStorage('daily-planner-tasks-by-date', {})
  const [completionStatus, setCompletionStatus] = useLocalStorage('daily-planner-completion', {})
  const [modal, setModal] = useState({ show: false, message: '' })
  const [currentView, setCurrentView] = useState('day')
  const [showOptions, setShowOptions] = useState(false)
  const [taskFilters, setTaskFilters] = useState({
    search: '',
    priority: 'all',
    status: 'all'
  })

  const dateKey = currentDate.toISOString().slice(0, 10)
  
  // Get tasks for current date including multi-day tasks
  const getTasksForDate = (date) => {
    const dateStr = date.toISOString().slice(0, 10)
    const directTasks = tasksByDate[dateStr] || []
    
    // Find tasks that span to this date (have due dates >= this date)
    const spanningTasks = []
    Object.entries(tasksByDate).forEach(([taskDate, tasks]) => {
      tasks.forEach(task => {
        if (task.dueDate && taskDate !== dateStr) {
          const taskCreatedDate = new Date(taskDate)
          const taskDueDate = new Date(task.dueDate)
          const currentDateObj = new Date(dateStr)
          
          // Show task on all dates from creation to due date
          if (currentDateObj >= taskCreatedDate && currentDateObj <= taskDueDate) {
            spanningTasks.push({ ...task, originalDate: taskDate })
          }
        }
      })
    })
    
    return [...directTasks, ...spanningTasks]
  }
  
  const allTasks = getTasksForDate(currentDate)
  const currentState = completionStatus[dateKey] || {}
  
  // Apply filters to tasks
  const todaysTasks = allTasks.filter(task => {
    const matchesSearch = !taskFilters.search || 
      task.text.toLowerCase().includes(taskFilters.search.toLowerCase())
    
    const matchesPriority = taskFilters.priority === 'all' || 
      task.priority === taskFilters.priority
    
    const isCompleted = currentState[task.id] || false
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !isCompleted
    
    const matchesStatus = taskFilters.status === 'all' ||
      (taskFilters.status === 'completed' && isCompleted) ||
      (taskFilters.status === 'pending' && !isCompleted && !isOverdue) ||
      (taskFilters.status === 'overdue' && isOverdue)
    
    return matchesSearch && matchesPriority && matchesStatus
  })

  const showMessage = (message) => setModal({ show: true, message })
  const closeModal = () => setModal({ show: false, message: '' })

  const addTask = (taskData) => {
    const newTaskId = `task_${Date.now()}`
    const newTask = typeof taskData === 'string' 
      ? { id: newTaskId, text: taskData }
      : { id: newTaskId, ...taskData }
    
    // Only add to current date's direct tasks (not spanning tasks)
    const directTasks = tasksByDate[dateKey] || []
    const newDirectTasks = [...directTasks, newTask]
    
    setTasksByDate(prev => {
      const updated = { ...prev, [dateKey]: newDirectTasks }
      console.log('Adding task, updated data:', updated)
      return updated
    })
    
    // Handle recurring tasks
    if (newTask.recurring) {
      generateRecurringTasks(newTask)
    }
  }

  const updateTask = (taskId, newText) => {
    // Find which date this task originally belongs to
    const task = todaysTasks.find(t => t.id === taskId)
    const originalDate = task?.originalDate || dateKey
    
    setTasksByDate(prev => {
      const updated = { ...prev }
      const originalTasks = updated[originalDate] || []
      updated[originalDate] = originalTasks.map(task => 
        task.id === taskId ? { ...task, text: newText } : task
      )
      return updated
    })
  }

  const deleteTask = (taskId) => {
    // Find which date this task originally belongs to
    const task = todaysTasks.find(t => t.id === taskId)
    const originalDate = task?.originalDate || dateKey
    
    setTasksByDate(prev => {
      const updated = { ...prev }
      const originalTasks = updated[originalDate] || []
      updated[originalDate] = originalTasks.filter(task => task.id !== taskId)
      return updated
    })
    
    // Also remove completion status for all dates
    if (task && task.dueDate) {
      const taskCreatedDate = new Date(originalDate)
      const taskDueDate = new Date(task.dueDate)
      
      setCompletionStatus(prev => {
        const updated = { ...prev }
        const currentDateObj = new Date(taskCreatedDate)
        while (currentDateObj <= taskDueDate) {
          const dateStr = currentDateObj.toISOString().slice(0, 10)
          if (updated[dateStr]) {
            delete updated[dateStr][taskId]
          }
          currentDateObj.setDate(currentDateObj.getDate() + 1)
        }
        return updated
      })
    }
  }

  const toggleTask = (taskId, completed) => {
    // Find the task to get its due date info
    const task = todaysTasks.find(t => t.id === taskId)
    
    if (task && task.dueDate) {
      // For multi-day tasks, sync completion across all dates
      const taskCreatedDate = new Date(task.originalDate || dateKey)
      const taskDueDate = new Date(task.dueDate)
      
      setCompletionStatus(prev => {
        const updated = { ...prev }
        
        // Update completion status for all dates this task spans
        const currentDateObj = new Date(taskCreatedDate)
        while (currentDateObj <= taskDueDate) {
          const dateStr = currentDateObj.toISOString().slice(0, 10)
          updated[dateStr] = { ...updated[dateStr], [taskId]: completed }
          currentDateObj.setDate(currentDateObj.getDate() + 1)
        }
        
        return updated
      })
    } else {
      // Single day task
      setCompletionStatus(prev => ({
        ...prev,
        [dateKey]: { ...prev[dateKey], [taskId]: completed }
      }))
    }
  }

  const toggleOldTask = (taskDate, taskId, completed) => {
    setCompletionStatus(prev => ({
      ...prev,
      [taskDate]: { ...prev[taskDate], [taskId]: completed }
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
  
  const generateRecurringTasks = (task) => {
    const { recurring, dueDate } = task
    if (!recurring || recurring === 'none') return
    
    const baseDate = dueDate ? new Date(dueDate) : new Date()
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + 3) // Generate 3 months ahead
    
    let currentDate = new Date(baseDate)
    currentDate.setDate(currentDate.getDate() + (recurring === 'daily' ? 1 : recurring === 'weekly' ? 7 : 30))
    
    while (currentDate <= endDate) {
      const futureDateKey = currentDate.toISOString().slice(0, 10)
      const futureTask = {
        ...task,
        id: `task_${Date.now()}_${currentDate.getTime()}`,
        dueDate: futureDateKey
      }
      
      setTasksByDate(prev => ({
        ...prev,
        [futureDateKey]: [...(prev[futureDateKey] || []), futureTask]
      }))
      
      currentDate.setDate(currentDate.getDate() + (recurring === 'daily' ? 1 : recurring === 'weekly' ? 7 : 30))
    }
  }
  
  const handleDateSelect = (date) => {
    setCurrentDate(date)
    if (currentView !== 'day') setCurrentView('day')
  }

  const completedCount = Object.values(currentState).filter(Boolean).length

  // Debug: Log data on load
  useEffect(() => {
    console.log('Tasks by date:', tasksByDate)
    console.log('Completion status:', completionStatus)
  }, [tasksByDate, completionStatus])

  return (
    <div className="bg-gray-100 min-h-screen">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      
      {/* <QuoteMarquee /> */}
      
      <div className="flex flex-col items-center p-4 pt-8">
        <main id="main-content" className="w-full max-w-xl bg-white p-8 rounded-3xl shadow-xl">
          <header className="flex items-center justify-center mb-6">
            <span className="text-5xl mr-3" role="img" aria-label="Calendar">📅</span>
            <h1 className="text-4xl font-extrabold text-center text-gray-800">Daily Planner</h1>
          </header>

          {currentView === 'day' && (
            <CollapsibleNavigation 
              currentView={currentView}
              onViewChange={setCurrentView}
              currentDate={currentDate}
              onPrevDay={() => navigateDate(-1)}
              onNextDay={() => navigateDate(1)}
              onGoToday={goToToday}
              onDateSelect={handleDateSelect}
              taskCount={todaysTasks.length}
              completedCount={completedCount}
              showOptions={showOptions}
              onToggleOptions={setShowOptions}
            />
          )}

          {currentView !== 'day' && (
            <div className="flex justify-center mb-4">
              <button 
                onClick={() => setCurrentView('day')}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
              >
                ← Back to Day View
              </button>
            </div>
          )}

          {currentView === 'day' && (
            <>
              <EnhancedTaskInput onAddTask={addTask} tasksByDate={tasksByDate} />
              {showOptions && <TaskFilter onFilterChange={setTaskFilters} />}
              <TaskList 
                tasks={todaysTasks}
                completionStatus={currentState}
                onToggleTask={toggleTask}
                onUpdateTask={updateTask}
                onDeleteTask={deleteTask}
                onReorderTasks={reorderTasks}
              />
              <OldTasks 
                tasksByDate={tasksByDate}
                completionStatus={completionStatus}
                onDateSelect={handleDateSelect}
                onToggleTask={toggleOldTask}
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