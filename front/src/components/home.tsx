import React from 'react';
import { useMemo } from 'react';
import { useEffect } from 'react';
import { UserContext } from 'src/contexts/UserContext';
import { useContext } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { User } from 'src/types/User';
import styles from 'src/styles/Home.module.css';
export default function Home() {
  axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8';
  const { is_logged_in } = useContext(UserContext);
  const cookies = useMemo(() => new Cookies(), []);
  const [user, setUser] = React.useState<User | null>(null);

  useEffect(() => {
    try {
      if (cookies.get('access_token')) {
        axios
          .get('http://localhost:8000/users/me', {
            headers: {
              Authorization: `Bearer ${cookies.get('access_token')}`,
            },
          })
          .then((res) => {
            setUser(res.data);
          })
          .catch((error) => {
            if (error.response.status === 401) {
              axios
                .post('http://localhost:8000/token/refresh', null, {
                  params: {
                    token: cookies.get('refresh_token'),
                  },
                })
                .then((res) => {
                  cookies.set('access_token', res.data.access_token);
                  window.location.reload();
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          });
      }
    } catch (err) {
      console.log(err);
    }
  }, [cookies]);

  return (
    <div className={styles['home-container']}>
      {is_logged_in ? (
        <>
          <h1>Hello {user?.username}</h1>
          <h2>Your calories goal is {user?.calories}  </h2>
        </>
      ) : (
        <>
          <h1>Foodsy</h1>
          <h2>Meal planning but easier</h2>
        </>
      )}
    </div>
  );
}
