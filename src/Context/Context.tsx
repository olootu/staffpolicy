import { createContext, useState, useEffect } from "react";

export const userContext = createContext({});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState('');

  useEffect(() => {
    const fetchUser = localStorage.getItem('token');
    if (fetchUser) {
      setUser(JSON.parse(fetchUser));
    }
  }, []); // <- runs only once when component mounts

  return (
    <userContext.Provider value={{ user }}>
      {children}
    </userContext.Provider>
  );
};
