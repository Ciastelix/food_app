// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useEffect } from 'react';
import { useMemo } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from 'src/components/navbar';
import Login from 'src/components/login';
import Diet from 'src/components/diet';
import Register from 'src/components/register';
import Cookies from 'universal-cookie';
import { useContext } from 'react';
import { UserContext } from 'src/contexts/UserContext';
import Home from 'src/components/home';
import UpdateGoals from 'src/components/updategoals';
import axios from 'axios';
import Generate from 'src/components/generate';
import Search from 'src/components/search';
import Recipe from 'src/components/recipe';
export function App() {
  const cookies = useMemo(() => new Cookies(), []);
  const { setLoggedIn } = useContext(UserContext);
  console.log(cookies.get('access_token'));
  useEffect(() => {
    if (cookies.get('access_token')) {
      axios
        .get('http://localhost:8000/users/me', {
          headers: {
            Authorization: `Bearer ${cookies.get('access_token')}`,
          },
        })
        .then(() => {
          setLoggedIn(true);
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
                setLoggedIn(true);
                window.location.reload();
              })
              .catch((err) => {
                console.log(err);
                setLoggedIn(false);
              });
          } else {
            setLoggedIn(false);
          }
        });
    } else {
      setLoggedIn(false);
    }
  });

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/diet" element={<Diet />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<h1>404</h1>} />
        <Route path="/updategoals" element={<UpdateGoals />} />
        <Route path="/generate" element={<Generate />} />
        <Route path="/search" element={<Search />} />
        <Route path="/recipe/:id" element={<Recipe />} />
      </Routes>
    </div>
  );
}

export default App;
