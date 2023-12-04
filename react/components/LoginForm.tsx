import React, { useState } from 'react';
import Link from 'next/link';

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    onLogin(username, password);
  };

  return (
    <div>
      <h1>Login</h1>
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
        <button type='button' onClick={handleLogin}>
          Login
        </button>
      </form>
      <Link href='/register'>Register</Link>
    </div>
  );
};

export default LoginForm;
