// src/contexts/UserContext.tsx
import { createContext, useState } from 'react';

interface UserContextValue {
  is_logged_in: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
}

export const UserContext = createContext<UserContextValue>({
  is_logged_in: false,
  setLoggedIn: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [is_logged_in, setIsLoggedIn] = useState(false);

  const setLoggedIn = (loggedIn: boolean) => {
    setIsLoggedIn(loggedIn);
  };

  return (
    <UserContext.Provider value={{ is_logged_in, setLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
}
