import React, { useState, useEffect } from 'react';

interface TaskFormProps {
  onAddTask: (newTask: any) => void;
  onUpdateTask: (updatedTask: any) => void;
  selectedTask: any;
}

const TaskForm: React.FC<TaskFormProps> = ({
  onAddTask,
  onUpdateTask,
  selectedTask
}) => {
  const [task, setTask] = useState({
    title: '',
    description: '',
    status: '',
    priority: ''
  });

  useEffect(() => {
    if (selectedTask) {
      setTask(selectedTask);
    }
  }, [selectedTask]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTask(prevTask => ({ ...prevTask, [name]: value }));
  };

  const handleAction = () => {
    if (selectedTask) {
      onUpdateTask(task);
    } else {
      onAddTask(task);
    }
    setTask({
      title: '',
      description: '',
      status: '',
      priority: ''
    });
  };

  return (
    <div>
      <h2>{selectedTask ? 'Edit Task' : 'Add New Task'}</h2>
      <label>Title: </label>
      <input
        type='text'
        name='title'
        value={task.title}
        onChange={handleInputChange}
      />
      <br />
      <label>Description: </label>
      <input
        type='text'
        name='description'
        value={task.description}
        onChange={handleInputChange}
      />
      <br />
      <label>Status: </label>
      <input
        type='text'
        name='status'
        value={task.status}
        onChange={handleInputChange}
      />
      <br />
      <label>Priority: </label>
      <input
        type='text'
        name='priority'
        value={task.priority}
        onChange={handleInputChange}
      />
      <br />
      <button onClick={handleAction}>
        {selectedTask ? 'Update Task' : 'Add Task'}
      </button>
    </div>
  );
};

export default TaskForm;
