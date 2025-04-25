import { createContext, useState, useEffect } from "react";
import { ChildPro, IUser, UserContextType } from "../models/staff_model";

export const userContext = createContext<UserContextType>({
  user: null,
  setUser: () => {}
});

export const UserProvider = ({ children }: ChildPro) => {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const fetchUser = localStorage.getItem('token');
    if (fetchUser) {
      setUser(JSON.parse(fetchUser));
    }
  }, []); // <- runs only once when component mount

  return (
    <userContext.Provider value={{ user, setUser }}>
      {children}
    </userContext.Provider>
  );
};
