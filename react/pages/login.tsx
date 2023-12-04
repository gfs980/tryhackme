import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import LoginForm from '../components/LoginForm';
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch tasks when the component mounts
    if (localStorage.getItem('token')) {
      fetchUser();
    }
  }, [isLoggedIn]);

  const fetchUser = async () => {
    try {
      await axios.get(`${API_URL}/user`, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });
      router.push('/');
    } catch (error) {
      console.error('Error fetching tasks:', error);
      localStorage.removeItem('token');
    }
  };

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password
      });

      const { token } = response.data;
      localStorage.setItem('token', token);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className={styles.container}>
      <LoginForm onLogin={handleLogin} />
    </div>
  );
};

export default Home;
