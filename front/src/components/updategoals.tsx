import { useState } from 'react';
import { FormEvent } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useMemo } from 'react';
import Cookies from 'universal-cookie';
import { ChangeEvent } from 'react';
import styles from 'src/styles/updategoals.module.css';

export default function UpdateGoals() {
  const cookies = useMemo(() => new Cookies(), []);
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [age, setAge] = useState(0);
  const [goal, setGoal] = useState('');
  const [activity, setActivity] = useState(0.0);
  const [meals_count, setMealsCount] = useState(0);
  const handleHeightChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.currentTarget.value;
    const floatValue = parseFloat(inputValue);

    if (!isNaN(floatValue)) {
      setHeight(floatValue);
    } else {
      setHeight(0);
    }
  };

  const handleAgeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.currentTarget.value;
    const intValue = parseInt(inputValue, 10);

    if (!isNaN(intValue)) {
      setAge(intValue);
    } else {
      setAge(0);
    }
  };

  const handleWeightChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.currentTarget.value;
    const floatValue = parseFloat(inputValue);

    if (!isNaN(floatValue)) {
      setWeight(floatValue);
    } else {
      setWeight(0);
    }
  };
  useEffect(() => {
    if (cookies.get('access_token')) {
      axios
        .get('http://localhost:8000/users/me', {
          headers: {
            Authorization: `Bearer ${cookies.get('access_token')}`,
          },
        })
        .then((res) => {
          setWeight(res.data.weight);
          setHeight(res.data.height);
          setAge(res.data.age);
          setGoal(res.data.goal);
          setActivity(res.data.activity);
          setMealsCount(res.data.meals_count);
        })
        .catch((error) => {
          if (error.response.status === 401) {
            axios
              .post('http://localhost:8000/token/refresh', {
                refresh_token: cookies.get('refresh_token'),
              })
              .then((res) => {
                cookies.set('access_token', res.data.access_token);
                cookies.set('refresh_token', res.data.refresh_token);
                window.location.reload();
              })
              .catch((err) => {
                window.location.href = '/login';
              });
          }
        });
    }
  }, [cookies]);

  const handleUpdate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios

      .put(
        'http://localhost:8000/users/data',
        {
          weight: weight,
          height: height,
          age: age,
          goal: goal,
          activity: activity,
          meals_count: meals_count,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${cookies.get('access_token')}`,
          },
        }
      )
      .then((res) => {
        alert(`Your new calories goal is ${res.data.calories}`);
        window.location.href = '/';
      })
      .catch((err) => {
        alert('Error updating account');
      });
  };
  return (
    <div className={styles.container}>
      <form onSubmit={handleUpdate}>
        <h1>Update Data</h1>
        <br />
        <div className={styles.formGroup}>
          <label htmlFor="weight">Weight</label>
          <input
            type="text"
            id="weight"
            inputMode="numeric"
            placeholder="Weight"
            pattern="[0-9]+"
            value={weight}
            onChange={handleWeightChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="height">Height</label>
          <input
            type="text"
            id="height"
            inputMode="numeric"
            placeholder="Height"
            pattern="[0-9]+"
            value={height}
            onChange={handleHeightChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="age">Age</label>
          <input
            type="text"
            id="age"
            inputMode="numeric"
            placeholder="Age"
            pattern="[0-9]+"
            value={age}
            onChange={handleAgeChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="goal">Goal</label>
          <select
            id="goal"
            value={goal}
            onChange={(e) => setGoal(e.currentTarget.value)}
          >
            <option value="l">Lose Weight</option>
            <option value="m">Maintain Weight</option>
            <option value="g">Gain Weight</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="activity">Activity Level</label>
          <select
            id="activity"
            value={activity}
            onChange={(e) => setActivity(parseFloat(e.currentTarget.value))}
          >
            <option value="1.2">Sedentary</option>
            <option value="1.375">Lightly Active</option>
            <option value="1.55">Moderately Active</option>
            <option value="1.725">Very Active</option>
            <option value="1.9">Extremely Active</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="mealsCount">Meals Count</label>
          <select
            id="mealsCount"
            value={meals_count}
            onChange={(e) => setMealsCount(parseInt(e.currentTarget.value))}
          >
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <button type="submit">Update</button>
        </div>
      </form>
    </div>
  );
}
