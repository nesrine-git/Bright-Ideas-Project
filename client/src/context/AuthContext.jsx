// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import userService from '../services/userService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch current user from cookie
    userService.getCurrentUser()
      .then(res => {
        console.log(res.data);
        setUser(res.data)
    })
      .catch(() => setUser(false)) // false means unauthenticated
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
