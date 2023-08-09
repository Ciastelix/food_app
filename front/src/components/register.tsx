import { useState } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { UserContext } from 'src/contexts/UserContext';
import { FormEvent } from 'react';
import styles from 'src/styles/login.module.css';
import Error from './error';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { is_logged_in } = useContext(UserContext);
  const [gender, setGender] = useState('m');
  const [error, setError] = useState<string | null>(null);
  const isButtonDisabled =
    username === '' || password === '' || email === '' || gender === '';

  const handleRegister = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post(
        'http://localhost:8000/users',
        {
          username: username,
          password: password,
          email: email,
          gender: gender,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      .then((res) => {
        alert('Account created successfully, please login');
        window.location.href = '/login';
      })
      .catch((err) => {
        setError('Username or email already exists');
        setTimeout(() => setError(null), 3000);
      });
  };
  if (is_logged_in) {
    window.location.href = '/';
  } else {
    return (
      <div className={styles['login-container']}>
        {error && <Error message={error} />}

        <form onSubmit={handleRegister} className={styles['login-input']}>
          <h1>Register</h1>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
          <select
            defaultValue={'m'}
            onChange={(e) => setGender(e.currentTarget.value)}
          >
            <option value="m">Male</option>
            <option value="f">Female</option>
          </select>
          <input type="submit" value="Register" disabled={isButtonDisabled} />
        </form>
      </div>
    );
  }
}
