import TaskItem from './TaskItem'

const TaskList = ({ tasks, completionStatus, onToggleTask, onUpdateTask, onDeleteTask, onReorderTasks }) => {
  return (
    <section aria-label="Task list">
      <ul className="list-none p-0 w-full" role="list">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            isCompleted={completionStatus[task.id] || false}
            onToggle={(completed) => onToggleTask(task.id, completed)}
            onUpdate={(newText) => onUpdateTask(task.id, newText)}
            onDelete={() => onDeleteTask(task.id)}
          />
        ))}
      </ul>
    </section>
  )
}

export default TaskList