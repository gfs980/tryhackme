import React from 'react';

interface TaskListProps {
  tasks: any[];
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: any) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onDeleteTask,
  onEditTask
}) => {
  const handleDelete = (taskId: string) => {
    onDeleteTask(taskId);
  };

  const handleEdit = (task: any) => {
    onEditTask(task);
  };

  return (
    <div>
      <h2>Tasks</h2>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            <strong>{task.title}</strong> - {task.description}
            <button onClick={() => handleEdit(task)}>Edit</button>
            <button onClick={() => handleDelete(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
