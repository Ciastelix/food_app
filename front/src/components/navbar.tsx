import styles from '../styles/navbar.module.css';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { useContext, useState } from 'react';
import { UserContext } from '../contexts/UserContext';

export default function Navbar() {
  const { is_logged_in } = useContext(UserContext);
  const { setLoggedIn } = useContext(UserContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Toggle dropdown menu visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    console.log(isDropdownOpen);
  };
  const cookies = new Cookies();
  return (
    <div className={styles['navbar']}>
      <Link className={styles['navbar-item']} to="/">
        Home
      </Link>
      {is_logged_in ? (
        <>
          <div
            className={`${styles['navbar-item']} ${styles['dropdown']}`}
            onMouseEnter={toggleDropdown}
            onMouseLeave={toggleDropdown}
          >
            Diet
            <div
              className={`${styles['dropdown-menu']} ${
                isDropdownOpen ? styles['show'] : ''
              }`}
            >
              <Link className={styles['dropdown-item']} to="/diet">
                Diet Overview
              </Link>
              <Link className={styles['dropdown-item']} to="/updategoals">
                Update Goals
              </Link>
              <Link className={styles['dropdown-item']} to="/generate">
                Generate Meals
              </Link>
              <Link className={styles['dropdown-item']} to="/search">
                Seach Meals
              </Link>
            </div>
          </div>
          <Link
            className={styles['navbar-item']}
            to="/"
            onClick={() => {
              setLoggedIn(false);
              cookies.remove('access_token');
              cookies.remove('refresh_token');
              window.location.href = '/';
            }}
          >
            Logout
          </Link>
        </>
      ) : (
        <>
          <Link className={styles['navbar-item']} to="/login">
            Login
          </Link>
          <Link className={styles['navbar-item']} to="/register">
            Register
          </Link>
        </>
      )}
    </div>
  );
}
