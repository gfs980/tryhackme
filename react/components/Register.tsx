import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await axios.post(`${API_URL}/auth/register`, {
        username,
        password
      });
      // Optionally, you can redirect to the login page after successful registration
      console.log('Registration successful!');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form>
        <label>Username: </label>
        <input
          type='text'
          name='username'
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <br />
        <label>Password: </label>
        <input
          type='password'
          name='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <br />
        <button type='button' onClick={handleRegister}>
          Register
        </button>
      </form>
      <Link href='/login'>Login</Link>
    </div>
  );
};

export default Register;
