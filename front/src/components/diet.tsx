import { useMemo, useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import Cookies from 'universal-cookie';
import { Link } from 'react-router-dom';
import styles from '../styles/search.module.css';
import { Recipe } from './recipe';
interface Day {
  day: [
    {
      id: number;
    }
  ];
}
export default function Diet() {
  const [diet, setDiet] = useState([]);
  const currentDate = new Date();
  const cookies = useMemo(() => new Cookies(), []);
  const [recipe, setRecipe] = useState<Recipe | undefined>();
  useEffect(() => {
    axios
      .get('http://localhost:8000/users/diets', {
        headers: {
          Authorization: `Bearer ${cookies.get('access_token')}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setDiet(res.data);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 401) {
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
              console.log(err);
            });
        } else if (err.response.status === 403) {
          cookies.remove('access_token');
          cookies.remove('refresh_token');
          window.location.reload();
        } else {
          console.log(err);
        }
      });
  }, []);
  const get_recipe = (id: number) => {
    axios
      .get(`http://localhost:8000/recipes/id/${id}`, {
        headers: {
          Authorization: `Bearer ${cookies.get('access_token')}`,
        },
      })
      .then((res) => {
        setRecipe(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 401) {
          axios
            .post('http://localhost:8000/token/refresh', {
              refresh_token: cookies.get('refresh_token'),
            })
            .then((res) => {
              cookies.set('access_token', res.data.access_token);
            })
            .catch((err) => {
              console.log(err);
            });
        } else if (err.response.status === 403) {
          cookies.remove('access_token');
          cookies.remove('refresh_token');
          window.location.reload();
        } else {
          console.log(err);
        }
      });
  };

  return (
    <div>
      <h1>Diet</h1>

      <h3>
        {currentDate.toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </h3>
      {diet.length !== 0 ? (
        <>
          {diet.map((day: Day) => {
            Object.keys(day).map((key: any) => {
              day[key].map((meal: any) => {
                get_recipe(meal.recipe);
                console.log(recipe);
                return (
                  <div className={styles['recipe-container']}>
                    {recipe && (
                      <div className={styles['recipe-details']}>
                        <h1 className={styles['recipe-title']}>
                          {recipe.title}
                        </h1>
                        <div className={styles['center-content']}>
                          <div className={styles['recipe-image-container']}>
                            <img
                              className={styles['recipe-image']}
                              src={recipe.image}
                              alt={recipe.title}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              });
            });
          })}
        </>
      ) : (
        <>
          <h1>No meals for today</h1>
          <Link to="/generate">Would you like do generate?</Link>
        </>
      )}
    </div>
  );
}
