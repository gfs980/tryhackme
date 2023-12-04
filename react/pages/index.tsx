import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import styles from '../styles/styles.module.css';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
}

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10
  });

  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      fetchUser();
    } else {
      router.push('/login');
    }
    // Fetch tasks when the component mounts
    fetchTasks();
  }, []);

  const fetchUser = async () => {
    try {
      await axios.get(`${API_URL}/user`, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      localStorage.removeItem('token');
    }
  };

  const fetchTasks = async (queryParams: any = {}) => {
    try {
      const response = await axios.get(`${API_URL}/tasks`, {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          ...queryParams
        },
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleAddTask = async (newTask: any) => {
    try {
      await axios.post(`${API_URL}/tasks`, newTask, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleSearch = () => {
    fetchTasks({ query: searchQuery });
  };

  const handleEditTask = (task: any) => {
    setSelectedTask(task);
  };

  const handlePaginationChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleFilter = (statusOrPriority: string, value: string) => {
    fetchTasks({ [statusOrPriority]: value });
  };

  const handleUpdateTask = async (updatedTask: any) => {
    try {
      await axios.put(`${API_URL}/tasks/${updatedTask._id}`, updatedTask, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });
      fetchTasks();
      setSelectedTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await axios.delete(`${API_URL}/tasks/${taskId}`, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <h1>Task Manager</h1>

        <TaskForm
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
          selectedTask={selectedTask}
        />

        <div>
          <h2>Search Tasks</h2>
          <input
            type='text'
            placeholder='Enter search query'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <div>
          <label>Page: </label>
          <input
            type='number'
            value={pagination.page}
            onChange={e => handlePaginationChange(Number(e.target.value))}
          />
        </div>
        <div>
          <button onClick={() => handleFilter('status', 'pending')}>
            Filter by Status: Pending
          </button>
          <button onClick={() => handleFilter('status', 'completed')}>
            Filter by Status: Completed
          </button>
        </div>
        <div>
          <button onClick={() => handleFilter('priority', 'high')}>
            Filter by Priority: High
          </button>
          <button onClick={() => handleFilter('priority', 'low')}>
            Filter by Priority: Low
          </button>
        </div>

        <TaskList
          tasks={tasks}
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
        />

        <div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
