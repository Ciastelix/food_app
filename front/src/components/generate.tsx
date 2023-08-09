import { useState, useMemo } from 'react';
import { FormEvent } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import styles from '../styles/generate.module.css';

export default function Generate() {
  const [numerOfDays, setDays] = useState(1);
  const cookies = useMemo(() => new Cookies(), []);
  if (!cookies.get('access_token')) {
    window.location.href = 'login';
  }
  const generate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post('http://localhost:8000/user/diets', null, {
        headers: {
          Authorization: `Bearer ${cookies.get('access_token')}`,
        },
        params: {
          days: numerOfDays - 1,
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className={styles['container']}>
      <h1 className={styles['title']}>Generate Meals</h1>
      <form onSubmit={generate}>
        <label htmlFor="days">Number of days</label>
        <input
          type="number"
          name="numberOfDays"
          id="days"
          value={numerOfDays}
          min={1}
          max={7}
          onChange={(e) => setDays(parseInt(e.currentTarget.value))}
        />
        <input type="submit" value="Generate" />
      </form>
    </div>
  );
}
