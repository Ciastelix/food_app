import { useState } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { useContext } from 'react';
import { UserContext } from 'src/contexts/UserContext';
import { FormEvent } from 'react';
import Error from './error';
import styles from 'src/styles/login.module.css';

export default function Login() {
  const cookies = new Cookies();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { setLoggedIn } = useContext(UserContext);
  const isButtonDisabled = username === '' || password === '';

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in all fields');
      setTimeout(() => setError(null), 3000);
      return;
    }
    axios
      .post(
        'http://localhost:8000/token',
        {
          username: username,
          password: password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      .then((res) => {
        console.log(res.data);
        cookies.set('access_token', res.data.access_token);
        cookies.set('refresh_token', res.data.refresh_token);
        setLoggedIn(true);
        window.location.href = '/';
      })
      .catch(() => {
        setError('Invalid username or password');
        setTimeout(() => setError(null), 3000);
        setPassword('');
      });
  };

  return (
    <div className={styles['login-container']}>
      {error && <Error message={error} />}

      <form onSubmit={handleLogin} className={styles['login-input']}>
        <h1>Login</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.currentTarget.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
        <br />
        <input type="submit" value="Login" disabled={isButtonDisabled} />
      </form>
    </div>
  );
}
